import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    console.log("handler")
    try {
        // Parse the credentials
        console.log("Received event:", event);


        const { username, password } = JSON.parse(event.body);
        if (username !== 'testuser' || password !== 'password123') {
            console.log("log3")
            return {
                statusCode: 401,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Invalid username or password' }),
            };
        }

        console.log("log3")
        const payload = { username, role: 'user' };
        console.log(payload)
        const secretKey = 'my-super-secret-key';
        console.log(secretKey)
        // Generate the JWT
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        console.log("log4")

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({'logged': "true", 'token': token}),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};