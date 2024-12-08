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
            lowerElem =  document.createElement("div");
            lowerElem.className = "action-banner";
            lowerElem.innerHTML = `
                <div class="banner-content">
                    <h1>Your Account:</h1>
                    <p>What would you like to do?</p>
                    <button id="your-stories-btn" class="cta-button">Your Stories</button>
                    <button id="add-story-btn" class="cta-button">add-story-btn</button>
                </div>
            `;
    
            // Add event listener for the sign-up button
            lowerElem.querySelector("#your-stories-btn").addEventListener("click", () => {
                router.go("/your-stories");
            });
            lowerElem.querySelector("#add-story-btn").addEventListener("click", () => {
                router.go("/add-story");
            });
        } else {
            lowerElem = document.createElement("div");
            lowerElem.className = "action-banner";
            lowerElem.innerHTML = `
                <div class="banner-content">
                    <h1>Join Comic Me today!</h1>
                    <p>Create and share your own comic stories. Sign up now to get started!</p>
                    <button id="signup-button" class="cta-button">Sign Up</button>
                    <button id="login-button" class="cta-button">Log In</button>
                </div>
            `;
    
            // Add event listener for the sign-up button
            lowerElem.querySelector("#signup-button").addEventListener("click", () => {
                router.go("/register");
            });
            lowerElem.querySelector("#login-button").addEventListener("click", () => {
                router.go("/login");
            });
        }
    
        lowerDiv.appendChild(lowerElem);
    };
    

}




customElements.define("index-page", IndexPage);