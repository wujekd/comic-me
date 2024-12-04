import { ddbClient } from "./ddbClient.mjs";
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand, BatchGetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { byTags } from "./byTags.mjs";
import { byUsername } from "./byUsername.mjs";
import { checkToken } from "./checkToken.mjs";

export const handler = async (event, context) => {
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
    };
    let body;
    let data;

    const token = event.headers?.Authorization?.replace("Bearer ", "");
    let decoded = null;
    if (token) {
        decoded = checkToken(token);
    }

    if (decoded) {

        const searchType = event.queryStringParameters?.search;

        try {
            switch (searchType){
                case "tags":
                    const tags =    event.queryStringParameters?.tags
                                    ? event.queryStringParameters.tags.split(",")
                                        : [];
                    data = await byTags(tags);
                    body = { response: data };
                    break;
                
                case "user":
                    const username = event.queryStringParameters?.name
                    data = await byUsername(username);
                    body = { response: data };
                    break;

            }


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


// aws lambda update-function-code --function-name contents --zip-file fileb://lambda.zip > /dev/null