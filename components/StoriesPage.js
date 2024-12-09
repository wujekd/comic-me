import router from "../services/router.js";

export class StoriesPage extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open"});
        const styles = document.createElement("style");
        this.root.appendChild(styles);


        async function loadCSS() {
            const request = await fetch('../css/StoriesPage.css');
            const css = await request.text();
            styles.textContent = css;
        }
        loadCSS();
    }

    connectedCallback(){
        const temp = document.getElementById('stories-template');
        const node = temp.content.cloneNode(true);
        this.root.appendChild(node);
        this.render();
        

        window.addEventListener("storiesloaded", ()=> {
            this.render();
        });
    }

    render() {
        if (app.data.logged) {
            if (app.data.stories) {
                this.root.querySelector("#stories").innerHTML = "";
    
                for (let story of app.data.stories) {
                    const storyItem = document.createElement("div");
                    storyItem.classList.add("story-div");
                    storyItem.innerHTML = `
                        <div class="story-info">
                            <h2>${story.title.S}</h2>
                            <p>${story.description.S}</p>
                        </div>
                        <img src="${story.imageUrl.S}" class="story-pic-list" alt="pic" />
                    `;
                    
                    // Add event listener to trigger router
                    storyItem.addEventListener("click", () => {
                        router.go(`/story-detail?id=${story.id.N}`);
                    });
    
                    this.root.querySelector("#stories").appendChild(storyItem);
                }
            } else {
                this.root.querySelector("#stories").innerHTML = "<div style='font-size: large'>Loading Stories...</div>";
            }
        } else {
            this.root.querySelector("#stories").innerHTML = "<button id='login-btn'>Login</button> to see stories...";
            this.root.querySelector("#login-btn").addEventListener("click", ()=> {
                router.go("/login");
            })
        }
    }
    
}

customElements.define("stories-page", StoriesPage);