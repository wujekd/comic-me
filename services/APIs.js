const APIs = {
    url: "https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/prod/contents",

    fetchStories: async () => {
        const token = sessionStorage.getItem("jwt"); // Retrieve the JWT from sessionStorage

        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }

        const result = await fetch(APIs.url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Add the JWT in the Authorization header
                "Content-Type": "application/json", // Optional: Ensure proper content type
            },
        });

        if (!result.ok) {
            throw new Error(`API error: ${result.status} ${result.statusText}`);
        }

        return await result.json();
    },
};

export default APIs;
