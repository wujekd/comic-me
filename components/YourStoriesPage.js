import APIs from "../services/APIs.js";
import router from "../services/router.js";

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

        this.querySelector("#add-story-button").addEventListener("click", ()=>{
            router.go("/add-story");
        })

        if (!app.data.yourStories){
            this.loadUserStories().then(() => { this.render(); })
        }

        
    }

    async loadUserStories() {
        try {
            const result = await APIs.searchByUser(app.data.logged);
            
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
                    <div class="info">
                        <h2>${story.title.S}</h2>
                        <p>${story.description.S}
                    </div>
                    <img src="${story.imageUrl.S}" class="ur-pic-list" />
                    `

                this.querySelector("#story-items").append(storyItem);
            }

            
        } else {
            this.querySelector("#story-items").innerHTML = "<div style='color: black; font-size: large;'>Loading Stories...</div>";
        }
    }
}

customElements.define("your-stories", YourStories);