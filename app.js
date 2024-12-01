import Data from "./services/data.js";
import Router from "./services/router.js";
import topMenu from "./components/topMenu.js"
import { initState } from "./services/data.js";

import { IndexPage } from "./components/IndexPage.js";
import { StoriesPage } from "./components/StoriesPage.js";
import { YourStories } from "./components/YourStoriesPage.js"
import { RegisterPage } from "./components/RegisterPage.js"
import { LoginPage } from "./components/LoginPage.js"
import { AddStory } from "./components/AddStory.js"
import { TagList } from "./components/TagList.js"
import { AuthorsList } from "./components/AuthorsList.js";



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