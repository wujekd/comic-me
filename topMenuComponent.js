
import displayComponent from "./displayComponent.js"

export default {
    render: ()=> {
        document.getElementById("homeButton").addEventListener("click", ()=> displayComponent.homeView());
        document.getElementById("booksButton").addEventListener("click", ()=> displayComponent.booksView())
        document.getElementById("registerButton").addEventListener("click", ()=> displayComponent.registerView());
        document.getElementById("loginButton").addEventListener("click", ()=> displayComponent.loginView());
    }
}