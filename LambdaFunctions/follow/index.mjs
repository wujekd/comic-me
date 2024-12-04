import { ddbClient } from "./ddbClient.mjs";
import { GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { checkToken } from "./checkToken.mjs";

export const handler = async (event, context) => {
    let status = 200;
    const headers = {
        "Content-Type": "application/json"
    };
    let body;

    const token = event.headers?.Authorization?.replace("Bearer ", "");
    let decoded = null;

    // Use try-catch for decoding token
    try {
        if (token) {
            decoded = checkToken(token);
        }
    } catch (e) {
        console.log("Error decoding token:", e);
    }

    if (decoded) {
        const getParams = {
            TableName: "users",
            Key: {
                username: { S: decoded.username }
            },
            ProjectionExpression: "subbed"
        };

        try {
            // Fetch the user's current subscriptions
            const getResponse = await ddbClient.send(new GetItemCommand(getParams));
            let subbedList = getResponse.Item ? unmarshall(getResponse.Item).subbed || [] : [];
            console.log("SUBBED LIST: ", subbedList)

            let requestJSON = JSON.parse(event.body);

            switch (event.httpMethod) {
                case "POST":
                    const newSub = requestJSON.subTo;
                    // Check if the new subscription already exists
                    if (subbedList.includes(newSub)) {
                        console.log("User is already subscribed.");
                        body = { response: "already subscribed" };
                        return {
                            statusCode: status,
                            headers,
                            body: JSON.stringify(body)
                        };
                    }

                    // Add the new subscription
                    subbedList.push(newSub);

                    // Prepare the update parameters
                    const updateParams = {
                        TableName: "users",
                        Key: {
                            username: { S: decoded.username }
                        },
                        UpdateExpression: "SET subbed = :newval",
                        ExpressionAttributeValues: {
                            ":newval": marshall({ subbed: subbedList }).subbed
                        },
                        ReturnValues: "ALL_NEW"
                    };

                    // Update the database
                    await ddbClient.send(new UpdateItemCommand(updateParams));
                    break;

                case "DELETE":
                    const unsubFrom = requestJSON.unsubFrom;
                    if (subbedList.includes(unsubFrom)) {
                        subbedList = subbedList.filter(sub => sub !== unsubFrom);
                    } else {
                        console.log("You're not subscribed to this user!");
                        body = { response: "not subscribed" };
                        return {
                            statusCode: status,
                            headers,
                            body: JSON.stringify(body)
                        };
                    }

                    // Prepare the update parameters
                    const deleteParams = {
                        TableName: "users",
                        Key: {
                            username: { S: decoded.username }
                        },
                        UpdateExpression: "SET subbed = :newval",
                        ExpressionAttributeValues: {
                            ":newval": marshall({ subbed: subbedList }).subbed
                        },
                        ReturnValues: "ALL_NEW"
                    };

                    // Update the database
                    await ddbClient.send(new UpdateItemCommand(deleteParams));
                    break;
            }

            body = { response: "success" };
        } catch (e) {
            console.log(e);
            status = 500;
            body = { response: "error", error: e.message };
        }
    } else {
        status = 400;
        body = { response: "invalid token" };
    }

    return {
        statusCode: status,
        headers,
        body: JSON.stringify(body)
    };
};
