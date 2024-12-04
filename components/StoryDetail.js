import APIs from "../services/APIs.js";

export class StoryDetail extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const temp = document.getElementById('story-detail-template');
        const node = temp.content.cloneNode(true);
        this.appendChild(node);

        const urlParams = new URLSearchParams(window.location.search);
        const storyId = urlParams.get('id');

        if (storyId) {
            let story = null;
            for (const story1 of app.data.stories) {
                if (story1.id.N.toString() == storyId) {
                    story = story1;
                }
            }
            if (story) {
                this.render(story);
            } else {
                this.renderError("Story not found.");
            }
        } else {
            this.renderError("Invalid story details provided.");
        }
    }

    render(story) {
        this.querySelector('.story-title').textContent = story.title.S;
        this.querySelector('.story-description').textContent = story.description.S;
        this.querySelector('.story-image').src = story.imageUrl.S;
        this.querySelector('.story-image').alt = "Story Image";
    }

    renderError(message) {
        this.querySelector('#story-detail-container').innerHTML = `<p class="error-message">${message}</p>`;
    }
}

customElements.define("story-detail", StoryDetail);