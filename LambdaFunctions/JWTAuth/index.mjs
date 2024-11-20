import jwt from 'jsonwebtoken';

const secretKey = 'my-super-secret-key';

export const handler = async (event) => {
    try {
       
        const token = event.headers?.Authorization?.replace("Bearer ", "");

        const response = {
            isValid: false,
            message: "Token verification failed",
            decodedToken: null,
        };

        if (!token) {
            response.message = "No token provided";
            return {
                statusCode: 200,
                body: JSON.stringify(response),
            };
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            response.isValid = true;
            response.message = "Token is valid";
            response.decodedToken = decoded;
        } catch (error) {
            response.message = `Token verification failed: ${error.message}`;
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error", details: error.message }),
        }
    }
}