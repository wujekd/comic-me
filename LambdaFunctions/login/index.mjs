import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const usersTableName = 'users'; 
const secretKey = 'my-super-secret-key';

export const handler = async (event) => {

    try {
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
                body: JSON.stringify({ error: 'Invalid username' }),
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
                body: JSON.stringify({ error: 'Invalid password' }),
            };
        }


        // Generate the JWT
        const payload = { username, role: result.Item.role || 'user' }; // Include additional user info if needed
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ logged: "true",
            token,
            username: username,
            subbed: result.Item.subbed
        
        }),
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