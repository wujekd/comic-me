const APIs = {

    url: "https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/prod/contents",

    fetchStories: async () => {
        const token = sessionStorage.getItem("jwt"); 

        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }

        const result = await fetch(APIs.url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!result.ok) {
            throw new Error(`API error: ${JSON.stringify(result)} ${result.statusText}`);
        }

        return await result.json();
    },
};



export default APIs;