import APIs from "../services/APIs.js";
import loadGuiElement from "../utilities/loadGuiElement.js";
import { loadStories } from "../services/stories.js";

export class AuthorsList extends HTMLElement {
    static authors = null;
    static isLoading = false; // Prevent simultaneous requests

    constructor() {
        super();
    }

    async connectedCallback() {
        if (this.querySelector('#authors-container')) { //dont recreate the dom structure
            return;
        }

        const temp = document.getElementById('authors-template'); 
        const node = temp.content.cloneNode(true);
        this.appendChild(node);

        if (!AuthorsList.authors && !AuthorsList.isLoading) {
            AuthorsList.isLoading = true; 
            await this.loadAuthors();
            AuthorsList.isLoading = false;
        } else if (AuthorsList.authors) {
            this.render(AuthorsList.authors); 
        }
    }

    async loadAuthors() {
        try {
            const authors = await APIs.getAuthors();
            AuthorsList.authors = authors;
            console.log(authors);
            
            this.render(authors);
        } catch (error) {
            console.error("Error loading authors:", error);
            this.renderError("Failed to load authors.");
        }
    }

    render() {
        const authorsContainer = this.querySelector('#authors-container');
        if (!authorsContainer || !AuthorsList.authors) return;
    
        authorsContainer.innerHTML = ""; // Clear existing content
    
        Object.entries(AuthorsList.authors).forEach(([author, posts]) => {
            const postCount = posts.length;
            const isSubscribed = app.data.subscriptions?.includes(author);
            const buttonText = isSubscribed ? "Unfollow" : "Follow";
    
            const authorElement = document.createElement('div');
            authorElement.className = "author-item";
    
            authorElement.innerHTML = `
                <div class="author-info">
                    <h3 class="author-name">${author}</h3>
                    <p class="post-count">Posts: ${postCount}</p>
                </div>
                <button class="follow-button">${buttonText}</button>
            `;
    
            const followButton = authorElement.querySelector('.follow-button');
            followButton.addEventListener('click', async () => {
                console.log(author)
                if (isSubscribed) {
                    const res = await APIs.unfollow(author);
                    console.log(res);
                    
                    app.data.subscriptions = app.data.subscriptions.filter(sub => sub !== author);
                    this.render();
                    loadStories();
                } else {
                    const res = await APIs.follow(author);
                    console.log(res);
                    
                    
                    app.data.subscriptions.push(author);
                    this.render();
                    window.dispatchEvent(new Event("subs")) //why ?
                    loadStories();
                }
            });
    
            authorsContainer.appendChild(authorElement);
        });
    }
    
    

}

customElements.define("authors-list", AuthorsList);
