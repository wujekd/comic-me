import router from "../services/router.js";
import { loadStories } from "../services/stories.js";



export class IndexPage extends HTMLElement {
    constructor(){

        super();
        
    }

    connectedCallback() {
        const temp = document.getElementById("index-template");
        const elem = temp.content.cloneNode(true);
        this.appendChild(elem);
    
        const lowerDiv = this.querySelector("#lower-div");
        let lowerElem;
    
        if (app.data.logged) {
            lowerElem = document.createElement("your-account");
        } else {
            lowerElem = document.createElement("div");
            lowerElem.className = "action-banner";
            lowerElem.innerHTML = `
                <div class="banner-content">
                    <h1>Join Comic Me today!</h1>
                    <p>Create and share your own comic stories. Sign up now to get started!</p>
                    <button id="signup-button">Sign Up</button>
                </div>
            `;
    
            // Add event listener for the sign-up button
            lowerElem.querySelector("#signup-button").addEventListener("click", () => {
                router.go("/register");
            });
        }
    
        lowerDiv.appendChild(lowerElem);
    };
    

}




customElements.define("index-page", IndexPage);