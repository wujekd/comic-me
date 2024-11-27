import { ddbClient } from "./ddbClient.mjs";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { checkToken } from "./checkToken.mjs";

export const handler = async (event, context) => {
    let statusCode = 200;
    let body;

    try {
        // Extract and validate the token
        const token = event.headers?.Authorization?.replace("Bearer ", "");
        if (!token) {
            throw new Error("No token provided");
        }

        const decoded = checkToken(token);
        if (!decoded) {
            throw new Error("Invalid token");
        }

        // If token is valid, proceed with querying by username
        const username = event.queryStringParameters?.user;
        if (!username) {
            throw new Error("Missing username parameter");
        }

        const params = {
            TableName: "users",
            Key: { username: { S : username }},
            ProjectionExpression: "username, subbed"
        };

        const data = await ddbClient.send(new GetItemCommand(params));
        body = { result: data.Item };
    } catch (e) {
        console.log("Error from userSearch: ", e);
        statusCode = 400;
        body = { error: e.message };
    }

    return {
        statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
};
