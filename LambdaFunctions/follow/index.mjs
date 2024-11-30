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
    if (token) {
        decoded = checkToken(token);
    }

    if (decoded){

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

            let requestJSON = JSON.parse(event.body);

            switch (event.httpMethod) {
            case "POST":
                const newSub = requestJSON.subTo;
                // Check if the new subscription already exists
                if (subbedList.includes(newSub)) {
                    console.log("User is already subscribed.");
                    return 
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
                const dataPost = await ddbClient.send(new UpdateItemCommand(updateParams));
                break;

            case "DELETE":
                const unsubFrom = requestJSON.unsubFrom;
                if (subbedList.includes(unsubFrom)) {
                    subbedList = subbedList.filter(sub => sub !== unsubFrom);
                } else {
                    console.log("youre not bubbed to this user!")
                    break;
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
                const dataDel = await ddbClient.send(new UpdateItemCommand(deleteParams));
                break;
        }
        
            // console.log("Updated user subscriptions:", unmarshall(data.Attributes));
            body = { response: "success"}
        } catch (e) {
            console.log(e);
        }
    } else {
        status = 400;
        body =  { response: "invalid token" }
    }
    return {
        statusCode: status,
        headers,
        body: JSON.stringify(body)
    };
};