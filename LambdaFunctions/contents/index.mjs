import { ddbClient } from "./ddbClient.mjs";
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand, BatchGetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { checkToken } from "./checkToken.mjs";

const REGION = "us-east-1";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

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
            //handle item view
          } else {
            //
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
              // Extract the list correctly
              subbedList = subbedResponse.Item.subbed.L.map(item => item.S);
              console.log(subbedList);
            } else {
              body = { response: "No subscriptions" };
              break;
            }

            const getItemsForPartitionKey = async (userName) => {
              const params = {
                TableName: "order",
                KeyConditionExpression: "userName = :u",
                ExpressionAttributeValues: {
                  ":u": { S: userName },
                },
                ProjectionExpression: "tags, id, userName"
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
        let requestJSON = JSON.parse(event.body);
        const marshalledTags = marshall({ tags: requestJSON.tags }).tags;
        const putParams = {
          TableName: "comics",
          Item: {
            author: { S: requestJSON.author },
            id: { N: Date.now().toString() },
            title: { S: requestJSON.title },
            description: { S: requestJSON.description },
            tags: marshalledTags
          }
        };
        await ddbClient.send(new PutItemCommand(putParams));
        body = `Added/Updated product ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
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
