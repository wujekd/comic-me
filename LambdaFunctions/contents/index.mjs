import { ddbClient } from "./ddbClient.mjs";
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { checkToken } from "./checkToken.mjs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = "stories-pics";
const REGION = "us-east-1";
const s3Client = new S3Client({ region: REGION });

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

  const token = event.headers?.Authorization?.replace("Bearer ", "");
  let decoded = null;
  if (token) {
    decoded = checkToken(token);
  }

  try {

    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters != null) {
          if (decoded) {
            // Handle item view
          } else {
            // Handle unauthorized request
          }
        } else {
          if (decoded) {
            const params = {
              TableName: "users",
              Key: {
                username: { S: decoded.username }
              },
              ProjectionExpression: "subbed",
            };

            const subbedResponse = await ddbClient.send(new GetItemCommand(params));
            let subbedList = [];
            if (subbedResponse.Item && subbedResponse.Item.subbed) {
              subbedList = subbedResponse.Item.subbed.L.map(item => item.S);
            } else {
              body = { response: "No subscriptions" };
              break;
            }

            const getItemsForPartitionKey = async (userName) => {
              const params = {
                TableName: "stories",
                KeyConditionExpression: "author = :u",
                ExpressionAttributeValues: {
                  ":u": { S: userName },
                },
                ProjectionExpression: "tags, id, author, title, description, imageUrl"
              };
              return ddbClient.send(new QueryCommand(params));
            };

            const promises = subbedList.map(userName => getItemsForPartitionKey(userName));
            const results = await Promise.all(promises);

            body = results.flatMap(result => result.Items);
          } else {
            statusCode = 500;
            body = { response: "login to see stories" };
          }
        }
        break;

        case "POST":
          if (decoded) {
              const requestJSON = JSON.parse(event.body);
      
              // Generate a file name for the image
              const fileName = `${decoded.username}/${Date.now()}`;
              const imageUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
              
              const putParams = {
                  TableName: "stories",
                  Item: marshall(
                      {
                          author: decoded.username,
                          id: Date.now(),
                          title: requestJSON.name || "Untitled",
                          description: requestJSON.desc || "",
                          tags: requestJSON.tags || [],
                          imageUrl: imageUrl,
                      },
                      { removeUndefinedValues: true }
                  ),
              };
      
              await ddbClient.send(new PutItemCommand(putParams));
      
              // Generate a pre-signed URL for the image upload
              const command = new PutObjectCommand({
                  Bucket: BUCKET_NAME,
                  Key: fileName,
                  ContentType: "image/jpeg",
              });
      
              const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      
              body = {
                  message: "Story added successfully.",
                  upload_url: uploadUrl,
                  image_url: imageUrl,
              };
          } else {
              statusCode = 401;
              body = { message: "Unauthorized. Please log in." };
          }
          break;
      

      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    console.error("Error:", err);
    statusCode = 400;
    body = { error: err.message };
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};


// aws lambda update-function-code --function-name contents --zip-file fileb://lambda.zip > /dev/null