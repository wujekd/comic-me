export class AddStory extends HTMLElement {

    constructor() {
        super();
    }


    connectedCallback() {
        const temp = document.getElementById('add-template');
        const node = temp.content.cloneNode(true);
        this.appendChild(node);
        this.render();

    }

    
}


customElements.define("add-story", AddStory);


