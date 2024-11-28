import Data from "./services/data.js";
import Router from "./services/router.js";
import { loadStories } from "./services/stories.js";


import { StoriesPage } from "./components/StoriesPage.js";
import { IndexPage } from "./components/IndexPage.js";
import { RegisterPage } from "./components/RegisterPage.js"
import { LoginPage } from "./components/LoginPage.js"


window.app = {};
app.data = Data;
app.router = Router;

window.addEventListener("DOMContentLoaded", ()=> {

    // loadStories();
    app.router.init();


    window.addEventListener("storiesloaded", ()=> {
        document.getElementById("storycount").textContent = app.data.stories.length;
    })

    window.addEventListener("subs", ()=> {
        document.getElementById("subcount").textContent = app.data.subscriptions.length;
    })
    


    
})