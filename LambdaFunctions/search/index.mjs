import { ddbClient } from "./ddbClient.mjs";
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand, BatchGetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { byTags } from "./byTags.mjs";
import { checkToken } from "./checkToken.mjs";

export const handler = async (event, context) => {
    let statusCode = 200; // Corrected the name to `statusCode`
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
        const tags = ['thriller', 'anime'];

        try {
            data = await byTags(tags);
            body = { response: data }; // Use `data` here, not `body`
        } catch (e) {
            body = { status: "error" };
            statusCode = 400; // Corrected the name to `statusCode`
        }
    } else {
        statusCode = 401; // Use status code 401 for unauthorized access
        body = { status: "invalid token" };
    }

    return {
        statusCode, // Corrected key name
        headers,
        body: JSON.stringify(body) // Convert body to a JSON string
    };
};
