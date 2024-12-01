import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

const REGION = "us-east-1"
const param = {region: REGION};
const ddbClient = new DynamoDBClient(param);
// export {ddbClient};
// const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'comics'; // Replace with your table name

export const handler = async () => {
    try {
        
        const params = {
            TableName: tableName,
            ProjectionExpression: 'PK, SK', // Fetch only user (PK) and title (SK)
        };

        const result = await ddbClient.scan(params)

        // Group items by user (PK)
        const authors = result.Items.reduce((acc, item) => {
            const user = item.PK;
            const title = item.SK;

            if (!acc[user]) {
                acc[user] = [];
            }

            acc[user].push(title);
            return acc;
        }, {});

        // Return the formatted JSON
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(authors),
        };

    } catch (error) {
        console.error("Error fetching authors:", error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: "Internal server error", details: error.message }),
        };
    }
};