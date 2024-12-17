import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const usersTableName = 'users';

export const handler = async (event) => {

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const username = body.username;
        const password = body.password;

        // Check if username and password are provided
        if (!username || !password) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Username and password are required' }),
            };
        }


        //add empty tag list here
        //marshall it!
        const subbed = [];
        const marshalledSubbed = marshall({ subbed }).subbed;
        
        const params = {
            TableName: usersTableName,
            Item: {
                username: { S: username },
                password: { S: password },
                subbed: marshalledSubbed,
            }
        };

        const command = new PutItemCommand(params);
        await dynamoDbClient.send(command);

        // Success response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: "User saved successfully.",
                user_id: username,
                status: "success"
            })
        };

    } catch (error) {
        console.error("Error saving user:", error);

        // Error response
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: "Error saving user.",
                error: error.message,
                status: "error"
            })
        };
    }
};



// aws lambda update-function-code --function-name contents --zip-file fileb://lambda.zip > /dev/null