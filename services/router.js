import topMenu from "../components/topMenu.js";
import loadGuiElement from "../utilities/loadGuiElement.js";
import { handleLogout } from "./data.js";
import { AuthorsList } from "../components/AuthorsList.js";


const router = {
    init: ()=> {
        
        // topMenu.init();

        // dont replicate history entries when recalled (save = false)
        window.addEventListener("popstate", (e) => {
            router.go(e.state.route, false)
        })

        router.go(location.pathname);
    },


    go: (route, save = true) => {
        if (save) {
            history.pushState({ route }, "", route);
        }
    
        const baseRoute = route.split('?')[0];
        let page = null;

        switch (baseRoute) {
            case "/":
                page = document.createElement("index-page");
                break;
            case "/stories":
                page = document.createElement("stories-page");
                break;
            case "/register":
                page = document.createElement("register-page");
                break;
            case "/login":
                page = document.createElement("login-page");
                break;
            case "/add-story":
                page = document.createElement("add-page");
                break;
            case "/your-stories":
                page = document.createElement("your-stories");
                break;
            case "/logout":
                sessionStorage.removeItem("jwt");
                sessionStorage.removeItem("username");
                sessionStorage.removeItem("subbed");


                app.data.logged = false;
                topMenu.render();
                 // once logged is null render to remove event listeners to subscription and stories data change 
                app.data.subscriptions = null;
                app.data.stories = null;

                AuthorsList.authors = null
                topMenu.init()

                router.go("/")
                return;
            case "/story-detail":
                page = document.createElement("story-detail");
                break;
            case "/search":
                page = document.createElement("search-view");
        }
    
        if (page) {
            document.querySelector("main").innerHTML = "";
            loadGuiElement(page, document.querySelector("main"));
            window.scrollX = 0;
            window.scrollY = 0;
        }
    } 
}

export default router;