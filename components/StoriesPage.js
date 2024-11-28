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
        const temp = document.getElementById('books-template');
        const node = temp.content.cloneNode(true);
        this.root.appendChild(node);
        this.render();
        

        window.addEventListener("storiesloaded", ()=> {
            this.render();
        });
    }


    render(){
        if (app.data.stories) {
            this.root.querySelector("#books").innerHTML = "";
            
            for (let story of app.data.stories['books']){
                const storyItem = document.createElement("div");
                storyItem.innerHTML = `
                    <h2>${story.name}</h2>
                    <p>${story.description}</p>
                    
                `;
                // <img src="${book.img_url}" />
                this.root.querySelector("#books").appendChild(storyItem)
            }
        } else {
            this.root.querySelector("#books").innerHTML = "Loading Stories..."
        }
    }
}

customElements.define("stories-page", StoriesPage);