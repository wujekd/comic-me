import router from "../services/router.js"

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
                document.getElementById("login").innerHTML = "Logging in...";
                const response = await fetch("https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/v1/login", {
                    method: "POST",
                    body: json,
                    headers: {
                        "Content-Type": 'application/json',
                    }
                });
                if (!response.ok) {
                    document.getElementById("login").innerHTML = `
                    <h2>Wrong credentials!</h2>
                    `;
                    setTimeout(()=> { router.go("/login")}, 3000)
                } else {
                
                    const result = await response.json();
                    console.log(response)
                    console.log(result)
                    console.log(result.token)

                    sessionStorage.setItem("jwt", result.token);


                    document.getElementById("login").innerHTML = `
                        <h2>Success! You will be redirected to the home page...</h2>
                        `;
                    setTimeout(()=> { router.go("/")}, 2200);
                }

            } catch (error) {

                    console.log("catch err: ", error);

                }
            });
        }
}
    

customElements.define("login-page", LoginPage);