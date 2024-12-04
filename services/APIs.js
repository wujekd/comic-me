

const APIs = {

    url: "https://lx4u7ljrr0.execute-api.us-east-1.amazonaws.com/M00879927/contents",
    searchUrl: "",
    getAuthorsUrl: "https://lx4u7ljrr0.execute-api.us-east-1.amazonaws.com/M00879927/contents/get-authors",
    followUrl: "https://lx4u7ljrr0.execute-api.us-east-1.amazonaws.com/M00879927/follow",

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
        console.log(result);
        
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

    follow: async (username)=> {
        const result = await fetch(APIs.followUrl, {
            method: "POST",
            body: JSON.stringify({"subTo": username}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`, 
            }
        });
        console.log("follow api: ", result)
        if (!result.ok) {
            throw new Error(`get Authors API error: ${JSON.stringify(result)} ${result.statusText}`);
        }
        return await result.json();
    },
    unfollow: async (username)=> {
        const result = await fetch(APIs.followUrl, {
            method: "DELETE",
            body: JSON.stringify({"unsubFrom": username}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`, 
            }
        })
        console.log("follow api: ", result)
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