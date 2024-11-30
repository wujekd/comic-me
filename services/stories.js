import APIs from "./APIs.js";

export async function loadStories() {
    
    console.log("Fetching stories, please wait...");


    await new Promise(resolve => setTimeout(resolve, 900));

    // Fetch the actual stories
    app.data.stories = await APIs.fetchStories();
    console.log("Stories have been loaded:", app.data.stories);
}


// all books related functions
// export async function 