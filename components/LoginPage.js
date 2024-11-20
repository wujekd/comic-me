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

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const json = JSON.stringify(data);

            console.log(json)

            try {
                const response = await fetch("https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/v1/login", {
                    method: "POST",
                    body: json,
                    headers: {
                        "Content-Type": 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
console.log(response)
                const result = await response.json();
                console.log(response)
                console.log(result)
                const xx = document.createElement("h1")
                xx.textContent= "sdf";
                document.querySelector("main").appendChild(xx)
            } catch (error) {

                        console.log(error);

                    }
                });
            }
}
    

customElements.define("login-page", LoginPage);