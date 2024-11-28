import APIs from "./APIs.js";

export async function loadStories() {
    // Show "loading..." for a specified delay
    console.log("Fetching stories, please wait...");

    // Artificial delay (e.g., 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Fetch the actual stories
    app.data.stories = await APIs.fetchStories();
    console.log("Stories have been loaded:", app.data.stories);
}


// all books related functions
// export async function 