export class IndexPage extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback() {
        const temp = document.getElementById("index-template");
        const elem = temp.content.cloneNode(true);
        this.appendChild(elem);
    }

}


customElements.define("index-page", IndexPage);