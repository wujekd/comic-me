import { API_CONFIG } from "../config.js";

const APIs = {

    fetchStories: async () => {
        const token = sessionStorage.getItem("jwt"); 

        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }

        const result = await fetch(API_CONFIG.url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            }
            
        });
        
        if (!result.ok) {
            throw new Error(`API error: ${JSON.stringify(result)} ${result.statusText}`);
        }

        return await result.json();
    },

    getAuthors: async ()=> {

        const result = await fetch(API_CONFIG.getAuthorsUrl, {
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
        const result = await fetch(API_CONFIG.followUrl, {
            method: "POST",
            body: JSON.stringify({"subTo": username}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`, 
            }
        });

        if (!result.ok) {
            throw new Error(`get Authors API error: ${JSON.stringify(result)} ${result.statusText}`);
        }
        return await result.json();
    },
    unfollow: async (username)=> {
        const result = await fetch(API_CONFIG.followUrl, {
            method: "DELETE",
            body: JSON.stringify({"unsubFrom": username}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`, 
            }
        })
        
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
        const searchUrlWithParams = `${API_CONFIG.searchUrl}?${searchParams}`;
    
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
        
        return response.response.Items
    },


    searchByTags: async (tags) =>{
        const token = sessionStorage.getItem("jwt");
    
        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }

        const searchParams = new URLSearchParams({ search: "tags", tags: tags }).toString();
        const searchUrlWithParams = `${API_CONFIG.searchUrl}?${searchParams}`;
    
        const result = await fetch(searchUrlWithParams, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    
        if (!result.ok) {
            throw new Error(`API error: ${JSON.stringify(result)} ${result.statusText}`);
        }
    
        const response = await result.json();
        return response.response.Items
    },

    findUser: async (username)=> {
        const token = sessionStorage.getItem("jwt");
    
        if (!token) {
            throw new Error("User is not authenticated. JWT is missing.");
        }

        const searchParams = new URLSearchParams({ user: username }).toString();
        const searchUrlWithParams = `${APIs.userSearchUrl}?${searchParams}`;
    
        const result = await fetch(searchUrlWithParams, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    
        if (!result.ok) {
            throw new Error(`API error: ${JSON.stringify(result)} ${result.statusText}`);
        }
    
        const response = await result.json();
        console.log(response);
        return [response.result]
    },
};


export default APIs;