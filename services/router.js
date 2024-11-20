import loadGuiElement from "../utilities/loadGuiElement.js";

const router = {
    init: ()=> {
        
        document.querySelectorAll("a.navlink").forEach(nav => {
            nav.addEventListener("click", e => {
                e.preventDefault();
                const url = e.target.getAttribute("href");
                router.go(url);

            });
        })

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
                console.log(route, ":::", page)
                break;
            case "/books":
                page = document.createElement("books-page");
                break;
            case "/register":
                page = document.createElement("register-page");
                break;
            case "/login":
                page = document.createElement("login-page");
                break;
            // case "/add-book":
            //     page = document.createElement("login-page");
            //     break;
            // case "/your-books":
            //     page = document.createElement("login-page");
            //     break;
        }

        if(page){
            console.log("testy: " , page)
            document.querySelector("main").innerHTML = "";
            // document.querySelector("main").appendChild(page);
            loadGuiElement(page, document.querySelector("main"));

            window.scrollX = 0;
            window.scrollY = 0;
        }
    }
}

export default router;