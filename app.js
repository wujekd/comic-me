import Data from "./services/data.js";
import Router from "./services/router.js";
import { loadStories } from "./services/stories.js";
import topMenu from "./components/topMenu.js"


import { StoriesPage } from "./components/StoriesPage.js";
import { IndexPage } from "./components/IndexPage.js";
import { RegisterPage } from "./components/RegisterPage.js"
import { LoginPage } from "./components/LoginPage.js"
import { AddStory } from "./components/AddStory.js"


window.app = {};
app.data = Data;
app.router = Router;

window.addEventListener("DOMContentLoaded", ()=> {



    if (sessionStorage.getItem("jwt")) {
        const token = sessionStorage.getItem("jwt");

        // Decode the JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Get the username
        app.data.logged = payload.username; // Replace 'username' with the actual field in your JWT payload
    }

    

    app.router.init();
    topMenu.init();

    
})