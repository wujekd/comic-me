

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = "us-east-1";
const tableName = 'stories';

const ddbClient = new DynamoDBClient({ region: REGION });

export const handler = async () => {
    try {
        const params = {
            TableName: tableName,
            ProjectionExpression: 'author, id, title, description', // Only fetch required attributes
        };

        // Scan the table
        const result = await ddbClient.send(new ScanCommand(params));

        // Check if items exist
        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ message: "No items found in the table." }),
            };
        }

        // Convert DynamoDB raw items to plain JavaScript objects
        const items = result.Items.map(item => unmarshall(item));

        // Group items by author
        const authors = items.reduce((acc, item) => {
            const { author, id, title, description } = item;

            if (!author) {
                console.warn("Skipping item without author:", item);
                return acc;
            }

            if (!acc[author]) {
                acc[author] = [];
            }

            acc[author].push({ id, title, description });
            return acc;
        }, {});

        // Return the grouped authors
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