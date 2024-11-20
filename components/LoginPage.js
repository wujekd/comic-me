export class LoginPage extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){

        const temp = document.getElementById("login-template");
        const elem = temp.content.cloneNode(true);
        console.log("connected callback called. elem: ", elem );
        this.appendChild(elem);

        const form = this.querySelector('form');

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
        });

    }
}

customElements.define("login-page", LoginPage);