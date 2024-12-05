import APIs from "../services/APIs.js";

export class YourStories extends HTMLElement {

    constructor(){
        super();
    }

    connectedCallback(){

        const temp = document.getElementById("your-stories-template");
        const node = temp.content.cloneNode(true);
        this.appendChild(node);

        this.render();

        window.addEventListener("yourStoriesChange", ()=> {
            this.render();
        });

        if (!app.data.yourStories){
            this.loadUserStories().then(() => { this.render(); })
        }

        
    }

    async loadUserStories() {
        try {
            const result = await APIs.searchByUser(app.data.logged);
            console.log(result);
            
            app.data.yourStories = result || [];
        } catch (error) {
            console.error("Failed to load user stories:", error);
            app.data.yourStories = [];
        }
    }

    render(){
        if (app.data.yourStories) {
            
            document.querySelector("#your-story-count").textContent = `You have ${app.data.yourStories.length} stories.`
            
            this.querySelector("#story-items").innerHTML = "";
            
            for (let story of app.data.yourStories){
                const storyItem = document.createElement('div');
                storyItem.innerHTML = `
                    <h2>${story.title.S}</h2>
                    <p>${story.description.S}`

                this.querySelector("#story-items").append(storyItem);
            }

            
        } else {
            console.log("render 2", app.data.yourStories);
            this.querySelector("#story-items").innerHTML = "Loading Stories...";
        }
    }
}

customElements.define("your-stories", YourStories);