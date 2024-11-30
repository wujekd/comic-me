export class TagList extends HTMLElement {

    static tags = [];
    
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                .tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .tag {
                    display: inline-flex;
                    align-items: center;
                    background-color: #007bff;
                    color: white;
                    border-radius: 3px;
                    padding: 3px 5px;
                    font-size: 14px;
                }
                .tag button {
                    margin-left: 5px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                }
                .add-tag {
                    display: flex;
                    margin-top: 5px;
                    gap: 5px;
                }
                input {
                    flex-grow: 1;
                    padding: 5px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    font-size: 14px;
                }
                button {
                    padding: 5px 10px;
                    font-size: 14px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
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