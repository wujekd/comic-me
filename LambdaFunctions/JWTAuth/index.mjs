import { isTokenValid } from "./tokenValidator";

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

        const decoded = isTokenValid(token)
        if (decoded) {

            response.isValid = true;
            response.message = "Token is valid";
            response.decodedToken = decoded;

        } else {

            response.message = "Token verification failed";

        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error", details: error.message }),
        };
    }
};
