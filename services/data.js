import topMenu from "../components/topMenu.js";
import router from "./router.js";
import { loadStories } from "./stories.js";
import { AuthorsList } from "../components/AuthorsList.js";

const Data = {
    stories: null,
    logged: null,
    subscriptions: null,
    yourStories: null,

}

const proxiedData = new Proxy(Data, {
    set(target, property, value ) {
        target[property] = value;

        switch (property){
            case "stories":
                window.dispatchEvent(new Event('storiesloaded'));
                break;

            case "subscriptions":
                const subscriptions = app.data.subscriptions ? app.data.subscriptions : [];
                sessionStorage.setItem("subbed", subscriptions.join("."));
                window.dispatchEvent(new Event('subs'));
                break;
                
            case "logged":
                window.dispatchEvent(new Event("logged"))
                break;

            case "yourStories":
                window.dispatchEvent(new Event("yourStoriesChange"));
                break;
        }
        return true;
    }
})
export default proxiedData;  //export through fefault so it can be named data when imported


export const initState = () => {

    const token = sessionStorage.getItem("jwt");
    const payload = JSON.parse(atob(token.split('.')[1]));

    if ( payload.exp > Math.floor(Date.now() / 1000) ){

        app.data.logged = payload.username; 
        loadStories();
        app.data.subscriptions = sessionStorage.getItem("subbed").split(',');

    } else {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("subbed");
        sessionStorage.removeItem("username");
    }
}


export const handleLogout = ()=> {

    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("subbed");

    app.data.logged = false;
    // topMenu.render() // once logged is null render to remove event listeners to subscription and stories data change 
    app.data.subscriptions = null;
    app.data.stories = null;

    AuthorsList.authors = null




    router.go("/")
}