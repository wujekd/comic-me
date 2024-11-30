import loadGuiElement from "../utilities/loadGuiElement.js";
import { handleLogout } from "./data.js";


const router = {
    init: ()=> {
        
        document.querySelectorAll("a.navlink").forEach(nav => {
            nav.addEventListener("click", e => {
                e.preventDefault();
                const url = e.target.getAttribute("href");
                router.go(url);

            });
        })

        // dont replicate history entries when recalled (save = false)
        window.addEventListener("popstate", (e) => {
            router.go(e.state.route, false)
        })

        router.go(location.pathname);
    },



    go: (route, save = true) => {
        
        if(save){
            history.pushState({ route }, "", route)
        }


        let page = null;
        switch (route) {
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
            case "/logout":
                handleLogout();
                return;
            

        }

        if(page){
            document.querySelector("main").innerHTML = "";
            // document.querySelector("main").appendChild(page);
            loadGuiElement(page, document.querySelector("main"));

            window.scrollX = 0;
            window.scrollY = 0;
        }
    }
}

export default router;