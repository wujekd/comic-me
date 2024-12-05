import { API_CONFIG } from "../config.js";
import router from "../services/router.js";
import { loadStories } from "../services/stories.js";
import topMenu from "./topMenu.js"

export class LoginPage extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){

        const temp = document.getElementById("login-template");
        const elem = temp.content.cloneNode(true);
        
        this.appendChild(elem);

        const form = this.querySelector('form');

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const json = JSON.stringify(data);

            console.log(json)

            try {
                document.getElementById("login").innerHTML = "<h2 style='color: white'>Logging in...</h2>";
                const response = await fetch(API_CONFIG.loginUrl, {
                    method: "POST",
                    body: json,
                    headers: {
                        "Content-Type": 'application/json',
                    }
                });
                console.log(response)
                if (!response.ok) {
                    document.getElementById("login").innerHTML = `
                    <h2>Wrong credentials!</h2>
                    `;
                    setTimeout(()=> { router.go("/login")}, 3000)
                } else {
                
                    const result = await response.json();

                    sessionStorage.setItem("jwt", result.token);
                    sessionStorage.setItem("subbed", result.subbed);
                    app.data.logged = result.username;
                    app.data.subscriptions = result.subbed;

                    loadStories();

                    document.getElementById("login").innerHTML = `
                        <h1 style='color: white'>Hello ${ result.username }!</h1>
                        `;
                    setTimeout(()=> { router.go("/stories")}, 1200);
                }

            } catch (error) {

                    console.log("catch err: ", error);

                }
            });
        }
}
    

customElements.define("login-page", LoginPage);