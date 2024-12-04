import APIs from "../services/APIs.js";

export class SearchView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const temp = document.getElementById('search-view-template');
        const node = temp.content.cloneNode(true);
        this.appendChild(node);

        // Set up the search form
        this.querySelector('#search-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.performSearch();
        });
        this.renderResults([]);
    }

    async performSearch() {
        const searchType = this.querySelector('input[name="search-type"]:checked').value;
        const searchQuery = this.querySelector('#search-input').value.trim();

        let results = [];
        try {
            if (searchType === 'tags') {
                // results = await APIs.searchByTags(searchQuery);
            } else if (searchType === 'usersPosts') {
                results = await APIs.searchByUser(searchQuery);
            } else if (searchType === 'user') {
                // results = await APIs.searchUsers(searchQuery);
            }
        } catch (error) {
            console.error("Error during search: ", error);
        }

        this.renderResults(results);
    }

    renderResults(results) {
        const resultsContainer = this.querySelector('#search-results-container');
        resultsContainer.innerHTML = ""; 

        if (results.length > 0) {
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'result-item';
                resultElement.textContent = result;
                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results.</p>';
        }
    }
}

customElements.define("search-view", SearchView);
