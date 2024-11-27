import { ddbClient } from "./ddbClient.mjs";
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand, BatchGetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { byTags } from "./byTags.mjs";
import { checkToken } from "./checkToken.mjs";

export const handler = async (event, context) => {
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };
    let body;
    let data;

    const token = event.headers?.Authorization?.replace("Bearer ", "");
    let decoded = null;
    if (token) {
        decoded = checkToken(token);
    }

    if (decoded) {

        // const tags = ['thriller', 'anime'];
        const tags =    event.queryStringParameters?.tags
                        ? event.queryStringParameters.tags.split(",")
                        : [];


        try {
            data = await byTags(tags);
            body = { response: data };
        } catch (e) {
            body = { status: "error" };
            statusCode = 400;
        }
    } else {
        statusCode = 401; 
        body = { status: "invalid token" };
    }

    return {
        statusCode, 
        headers,
        body: JSON.stringify(body)
    };
};
