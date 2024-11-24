export class AddPage extends HTMLElement {

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