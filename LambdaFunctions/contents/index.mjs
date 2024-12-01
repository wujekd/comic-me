import { ddbClient } from "./ddbClient.mjs";
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { checkToken } from "./checkToken.mjs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = "cat-picz";
const REGION = "us-east-1";
const s3Client = new S3Client({ region: REGION });

export const handler = async (event, context) => {
  console.log("Event:", JSON.stringify(event)); // Log the incoming event
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

  const token = event.headers?.Authorization?.replace("Bearer ", "");
  console.log("Token:", token); // Log the extracted token
  let decoded = null;
  if (token) {
    decoded = checkToken(token);
    console.log("Decoded Token:", decoded); // Log the decoded token
  }

  try {
    console.log("HTTP Method:", event.httpMethod); // Log the HTTP method

    switch (event.httpMethod) {
      case "GET":
        console.log("Processing GET request");
        if (event.pathParameters != null) {
          if (decoded) {
            console.log("GET with path parameters and valid token");
            // Handle item view
          } else {
            console.log("GET with path parameters but no valid token");
            // Handle unauthorized request
          }
        } else {
          if (decoded) {
            console.log("GET request with no path parameters");
            const params = {
              TableName: "users",
              Key: {
                username: { S: decoded.username }
              },
              ProjectionExpression: "subbed",
            };

            const subbedResponse = await ddbClient.send(new GetItemCommand(params));
            console.log("Subbed Response:", JSON.stringify(subbedResponse));
            let subbedList = [];
            if (subbedResponse.Item && subbedResponse.Item.subbed) {
              subbedList = subbedResponse.Item.subbed.L.map(item => item.S);
              console.log("Subbed List:", subbedList);
            } else {
              body = { response: "No subscriptions" };
              break;
            }

            const getItemsForPartitionKey = async (userName) => {
              const params = {
                TableName: "comics",
                KeyConditionExpression: "author = :u",
                ExpressionAttributeValues: {
                  ":u": { S: userName },
                },
                ProjectionExpression: "tags, id, author"
              };
              return ddbClient.send(new QueryCommand(params));
            };

            const promises = subbedList.map(userName => getItemsForPartitionKey(userName));
            const results = await Promise.all(promises);
            console.log("Query Results:", JSON.stringify(results));

            body = results.flatMap(result => result.Items);
          } else {
            statusCode = 500;
            body = { response: "login to see stories" };
          }
        }
        break;

        case "POST":
          console.log("Processing POST request");
          if (decoded) {
              const requestJSON = JSON.parse(event.body);
              console.log("Request JSON:", requestJSON);
      
              // Generate a file name for the image
              const fileName = `${decoded.username}/${Date.now()}`;
              const imageUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
              console.log("Image URL:", imageUrl);
      
              const putParams = {
                  TableName: "comics",
                  Item: marshall(
                      {
                          author: decoded.username,
                          id: Date.now(),
                          title: requestJSON.name || "Untitled",
                          description: requestJSON.desc || "",
                          tags: requestJSON.tags || [],
                          imageUrl: imageUrl, // Add the image URL to the item
                      },
                      { removeUndefinedValues: true }
                  ),
              };
              console.log("Put Params:", putParams);
      
              await ddbClient.send(new PutItemCommand(putParams));
              console.log("Item successfully added to DynamoDB");
      
              // Generate a pre-signed URL for the image upload
              const command = new PutObjectCommand({
                  Bucket: BUCKET_NAME,
                  Key: fileName,
                  ContentType: "image/jpeg",
              });
              console.log("S3 Command:", command);
      
              const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
              console.log("Pre-Signed URL:", uploadUrl);
      
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
        console.log("Unsupported route");
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    console.error("Error:", err);
    statusCode = 400;
    body = { error: err.message };
  } finally {
    console.log("Final Response:", body);
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};


// aws lambda update-function-code --function-name contents --zip-file fileb://lambda.zip > /dev/null