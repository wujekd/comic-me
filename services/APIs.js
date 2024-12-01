const APIs = {

    url: "https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/prod/contents",
    searchUrl: "https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/prod/contents/search",
    getAuthorsUrl: "https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/prod/get-authors",

    fetchStories: async () => {
        const token = sessionStorage.getItem("jwt"); 

        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }

        const result = await fetch(APIs.url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            }
            
        });

        if (!result.ok) {
            console.log(result)
            throw new Error(`API error: ${JSON.stringify(result)} ${result.statusText}`);
        }

        return await result.json();
    },

    getAuthors: async ()=> {

        const result = await fetch(APIs.getAuthorsUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}`, 
            }
        })
        console.log("getAuthors api res:", result)
        if (!result.ok) {
            throw new Error(`get Authors API error: ${JSON.stringify(result)} ${result.statusText}`);
        }

        return await result.json();


    },


    searchByUser: async (username) => {
        const token = sessionStorage.getItem("jwt");
    
        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }
    
        const searchParams = new URLSearchParams({ search: "user", name: username }).toString();
        const searchUrlWithParams = `${APIs.searchUrl}?${searchParams}`;
    
        const result = await fetch(searchUrlWithParams, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    
        if (!result.ok) {
            console.log(result);
            throw new Error(`API error: ${JSON.stringify(result)} ${result.statusText}`);
        }
    
        const response = await result.json()
        return response
    }
    
};



export default APIs;