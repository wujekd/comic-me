import { API_CONFIG } from "../config.js";
import router from "../services/router.js";

export class RegisterPage extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.render();
    }


    render(){

        const temp = document.getElementById("register-template");
        const elem = temp.content.cloneNode(true);
        this.appendChild(elem);

        const form = this.querySelector('form');

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
        
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());



            try {
                const response = await fetch(API_CONFIG.registerUrl, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                const xx = document.createElement("h1")
                xx.textContent= "sdf";
                document.querySelector("main").appendChild(xx)

            } catch (error) {
                alert(`An error occurred: ${error.message}`);
            }
        });
    }
}

customElements.define("register-page", RegisterPage)