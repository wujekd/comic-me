import Data from "./services/data.js";
import Router from "./services/router.js";
import { loadStories } from "./services/stories.js";
import topMenu from "./components/topMenu.js"
import { initState } from "./services/data.js";


import { StoriesPage } from "./components/StoriesPage.js";
import { IndexPage } from "./components/IndexPage.js";
import { RegisterPage } from "./components/RegisterPage.js"
import { LoginPage } from "./components/LoginPage.js"
import { AddStory } from "./components/AddStory.js"


window.app = {};
app.data = Data;
app.router = Router;

window.addEventListener("DOMContentLoaded", ()=> {


    topMenu.init();

    if (sessionStorage.getItem("jwt")) {
        initState();
    }

    app.router.init();

});