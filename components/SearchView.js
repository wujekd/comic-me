import APIs from "../services/APIs.js";
import { loadStories } from "../services/stories.js";

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
                results = await APIs.searchByTags(searchQuery);
            } else if (searchType === 'usersPosts') {
                results = await APIs.searchByUser(searchQuery);
            } else if (searchType === 'user') {
                results = await APIs.findUser(searchQuery);
                this.renderUser(searchQuery)
                return
            }
        } catch (error) {
            console.error("Error during search: ", error);
        }

        this.renderResults(results);
    }

    renderResults(results) {
        console.log("results at item render: ", results);
        
        const resultsContainer = this.querySelector('#search-results-container');
        resultsContainer.innerHTML = ""; 

        if (results.length > 0) {
            results.forEach(result => {
                console.log("result: ", result);
                
                const resultElement = document.createElement('div');
                resultElement.className = 'result-item';

                const title = result.title?.S || "No title";
                const author = result.author?.S || "Unknown author";
                const description = result.description?.S || "No description available";
                const tags = result.tags?.L?.map(tag => tag.S).join(", ") || "No tags";
                const imageUrl = result.imageUrl?.S || "";

                resultElement.innerHTML = `
                    <img class="result-image" src="${imageUrl}" alt="Image for ${title}" style="max-height: 17rem; width: auto;">
                    <div class="res-info"> 
                        <h3 class="result-title">${title}</h3>
                        <p class="result-author"><strong>Author:</strong> ${author}</p>
                        <p class="result-description">${description}</p>
                        <p class="result-tags"><strong>Tags:</strong> ${tags}</p>
                    </div>
                `;
                
                resultsContainer.appendChild(resultElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results.</p>';
        }
    }


    renderUser(user) {
        const resultsContainer = this.querySelector('#search-results-container');
        resultsContainer.innerHTML = ""; // Clear existing content
    
        const isSubscribed = app.data.subscriptions?.includes(user);
        const buttonText = isSubscribed ? "Unfollow" : "Follow";
        const buttonClass = isSubscribed ? "unfollow-button" : "follow-button";
    
        const userElement = document.createElement('div');
        userElement.className = "user-item";
    
        userElement.innerHTML = `
            <div class="user-info">
                <h3 class="user-name">${user}</h3>
            </div>
            <button class="${buttonClass}">${buttonText}</button>
        `;
    
        const followButton = userElement.querySelector('button');
        followButton.addEventListener('click', async () => {
            if (isSubscribed) {
                followButton.style.backgroundColor = "var(--color5)";
                const res = await APIs.unfollow(user);
                console.log(res);
                
                app.data.subscriptions = app.data.subscriptions.filter(sub => sub !== user);

                setTimeout(() => {
                    this.renderUser(user);
                    loadStories();
                }, 300);
            } else {

                followButton.style.backgroundColor = "var(--color5)";
                const res = await APIs.follow(user);
                console.log(res);
                
                app.data.subscriptions.push(user);
                window.dispatchEvent(new Event("subs"))

                setTimeout(() => {
                    this.renderUser(user);
                    loadStories();
                }, 300);
            }
        });
    
        resultsContainer.appendChild(userElement);
    }


}

customElements.define("search-view", SearchView);
