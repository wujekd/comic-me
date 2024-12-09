import jwt from 'jsonwebtoken';

const secretKey = 'my-super-secret-key';

export const handler = async (event) => {
    console.log("JWT validation handler invoked");

    try {
        // Extract the token from the Authorization header
        const authHeader = event.headers?.Authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Missing or invalid Authorization header' }),
            };
        }

        const token = authHeader.replace("Bearer ", "");

        // Verify the JWT
        const decoded = jwt.verify(token, secretKey);

        console.log("Decoded JWT payload:", decoded);

        if (!decoded.username) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Invalid token: username not found' }),
            };
        }

        // Return the username if valid
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ username: decoded.username }),
        };

    } catch (error) {
        console.error("Error during JWT validation:", error);

        return {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Invalid or expired token' }),
        };
    }
};



// aws lambda update-function-code --function-name checkUser --zip-file fileb://lambda.zip > /dev/null