import { ddbClient } from "./ddbClient.mjs";
import { QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";



export const byUsername = async (username)=> {

    const params = {
        TableName: "stories",
        KeyConditionExpression: "author = :u",
        ExpressionAttributeValues: {
            ":u" : { S : username }
        },
        ProjectionExpression: "author, id, title"
    }

    try {
        const data = await ddbClient.send(new QueryCommand(params));
        return data;

    } catch (e) {
        console.log("error from byUsername: ", e);
        throw e;
    }

}


// byUsername("Czlowiek")