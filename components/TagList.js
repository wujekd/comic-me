export class TagList extends HTMLElement {

    static tags = [];
    
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
              /* Style for the tags container */
.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 5px;
    border: 1px solid var(--secondaryColor);
    border-radius: 8px;
    background-color: var(--background-surface);
    min-height: 3rem;
}

.tag {
    display: inline-flex;
    align-items: center;
    background-color: var(--highlight);
    color: var(--background-surface);
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
}

.tag:hover {
    background-color: var(--highlight-faded);
}

.tag button {
    margin-left: 5px;
    background: none;
    border: none;
    color: var(--background-surface);
    font-size: 14px;
    cursor: pointer;
}

.add-tag {
    display: flex;
    margin-top: 10px;
    gap: 10px;
}

input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid var(--secondaryColor);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

input:focus {
    border-color: var(--highlight);
    outline: none;
}

button {
    padding: 10px 15px;
    font-size: 1rem;
    background-color: var(--highlight);
    color: var(--background-surface);
    border: 1px solid var(--highlight-faded);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
    background-color: var(--btnhover);
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

button:active {
    transform: scale(0.98);
}

            </style>
            <div class="tags-container" id="tagsContainer"></div>
            <div class="add-tag">
                <input type="text" id="tagInput" placeholder="Add a tag" />
                <button id="addTagBtn">+</button>
            </div>
        `;
    }

    connectedCallback() {
        const addTagBtn = this.shadowRoot.getElementById("addTagBtn");
        const tagInput = this.shadowRoot.getElementById("tagInput");
        const tagsContainer = this.shadowRoot.getElementById("tagsContainer");

        // Add tag on button click
        addTagBtn.addEventListener("click", () => {
            const newTag = tagInput.value.trim();
            if (newTag && !TagList.tags.includes(newTag)) {
                TagList.tags.push(newTag);
                this.renderTags();
            }
            tagInput.value = ""; 
        });

        this.renderTags = () => {
            tagsContainer.innerHTML = ""; 
            TagList.tags.forEach((tag) => {
                const tagElement = document.createElement("span");
                tagElement.classList.add("tag");
                tagElement.innerHTML = `
                    ${tag}
                    <button data-tag="${tag}">&times;</button>
                `;
                tagsContainer.appendChild(tagElement);

                tagElement.querySelector("button").addEventListener("click", (e) => {
                    const tagToRemove = e.target.getAttribute("data-tag");
                    TagList.tags = TagList.tags.filter((t) => t !== tagToRemove);
                    this.renderTags();
                });
            });
        };
    }
}

customElements.define("tag-list", TagList);