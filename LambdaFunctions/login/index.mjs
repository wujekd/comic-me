import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const usersTableName = 'users'; 
const secretKey = 'my-super-secret-key';

export const handler = async (event) => {
    console.log("Handler invoked");

    try {
        // Parse the credentials from the request body
        console.log("Received event:", event);
        const { username, password } = JSON.parse(event.body);

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

        console.log(`Looking up user: ${username}`);

        // Query DynamoDB to get the user
        const params = {
            TableName: usersTableName,
            Key: {
                username, 
            },
        };

        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Invalid username or password' }),
            };
        }

       
        const storedPassword = result.Item.password; // Assuming the `password` field exists
        if (storedPassword !== password) {
            return {
                statusCode: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Invalid username or password' }),
            };
        }

        // Generate the JWT
        const payload = { username, role: result.Item.role || 'user' }; // Include additional user info if needed
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        console.log("User authenticated successfully");

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ logged: "true", token }),
        };

    } catch (error) {
        console.error("Error during authentication:", error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};
