import { loadStories } from "../services/stories.js";



export class IndexPage extends HTMLElement {
    constructor(){

        super();
        
    }

    connectedCallback() {
        // if(app.data.logged){
            
        // };

        const temp = document.getElementById("index-template");
        const elem = temp.content.cloneNode(true);
        this.appendChild(elem);

    };

}




customElements.define("index-page", IndexPage);