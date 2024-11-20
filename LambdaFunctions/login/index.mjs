import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    try {
        // Parse the credentials
        const { username, password } = JSON.parse(event.body);

        // Validate credentials (replace this with database lookup in production)
        if (username !== 'testuser' || password !== 'password123') {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid username or password' }),
            };
        }
 
        const payload = { username, role: 'user' };

        const secretKey = 'my-super-secret-key';

        // Generate the JWT
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });


        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

newdata = {whatevEr:  "resdfssfd"}
data = null;