import APIs from "../services/APIs.js";

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
            this.render(authors);
        } catch (error) {
            console.error("Error loading authors:", error);
            this.renderError("Failed to load authors.");
        }
    }

    render(authors) {
        const authorsContainer = this.querySelector('#authors-container');
        if (!authorsContainer) return;

        authorsContainer.innerHTML = ""; 

        Object.entries(authors).forEach(([author, posts]) => {
            const authorElement = document.createElement('div');
            authorElement.className = "author-item";

            authorElement.innerHTML = `
                <h3>${author}</h3>
                <ul>
                    ${posts.map(post => `<li>${post}</li>`).join("")}
                </ul>
            `;
            authorsContainer.appendChild(authorElement);
        });
    }

    renderError(errorMessage) {
        const authorsContainer = this.querySelector('#authors-container');
        if (!authorsContainer) return;

        authorsContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
    }
}

customElements.define("authors-list", AuthorsList);
