import { ddbClient } from "./ddbClient.mjs";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";



export const byTags = async (tags)=> {

    const filterConditions = tags.map((_, index) => `contains(tags, :tag${index})`).join(" OR ");
    const expressionAttributeValues = tags.reduce((acc, tag, index) => {
        acc[`:tag${index}`] = { S: tag };
        return acc;
    }, {});

    const params = {
        TableName: "comics",
        FilterExpression: filterConditions,
        ExpressionAttributeValues: expressionAttributeValues,
        ProjectionExpression: "author, id, description, tags"
    };


    try {
        const data = await ddbClient.send(new ScanCommand(params));
        return data;
    } catch (error) {
        console.log("error from byTag function", error)
        throw error;
    }


}