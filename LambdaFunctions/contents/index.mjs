import { ddbClient } from "./ddbClient.mjs";import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const REGION = "us-east-1";


export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.httpMethod) {

      case "GET":
        const tempSubList = ['admin', 'testuser'];
        if (event.pathParameters != null) {
        //   const getParams = {
        //     TableName: "comics",
        //     Key: {
        //       id: { S: event.pathParameters.id }
        //     }
        //   };
        //   body = await ddbClient.send(new GetItemCommand(getParams));
        console.log("item view");
        } else {

        //   const scanParams = {
        //     TableName: "comics"
        //   };
        //   body = await ddbClient.send(new ScanCommand(scanParams));

        // filter posts from subbed users
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