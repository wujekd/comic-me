import APIs from "./APIs.js";

export async function loadStories() {

    await new Promise(resolve => setTimeout(resolve, 900));

    // Fetch the actual stories
    app.data.stories = await APIs.fetchStories();
}

