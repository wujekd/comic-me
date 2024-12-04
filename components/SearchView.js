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
    }

    performSearch() {
        const searchType = this.querySelector('input[name="search-type"]:checked').value;
        const searchQuery = this.querySelector('#search-input').value.trim();

        // Perform search logic based on search type and query (placeholder for now)
        let results = [];
        if (searchType === 'tags') {
            results = this.searchByTags(searchQuery);
        } else if (searchType === 'user') {
            results = this.searchByUser(searchQuery);
        } else if (searchType === 'users') {
            results = this.searchUsers(searchQuery);
        }

        // Render search results
        this.renderResults(results);
    }

    searchByTags(query) {
        // Placeholder logic for searching by tags
        return [`Result for tag: ${query}`];
    }

    searchByUser(query) {
        // Placeholder logic for searching stories by user
        return [`Result for stories by user: ${query}`];
    }

    searchUsers(query) {
        // Placeholder logic for searching users
        return [`Result for user: ${query}`];
    }

    renderResults(results) {
        const resultsContainer = this.querySelector('#search-results-container');
        resultsContainer.innerHTML = ""; // Clear existing results

        if (results.length > 0) {
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'result-item';
                resultElement.textContent = result;
                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }
}

customElements.define("search-view", SearchView);
