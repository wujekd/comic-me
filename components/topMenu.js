import router from "../services/router.js";

export default {


    init: function() {
        const nav = document.querySelector('nav');
    
        // Remove dynamically added elements
        nav.querySelectorAll('.dynamic-navlink').forEach(element => element.remove());

    
        if (app.data.logged) {
            
            // User is logged in
            const addStoryLink = `<a class="navlink dynamic-navlink material-symbols-outlined" id="" href="/add-story">Add <span class="nav-text">Story</span></a>`;
            const yourStoriesLink = `<a class="navlink dynamic-navlink nav-text material-symbols-outlined" href="/your-stories">Your Stories</a>`;
            const logoutLink = `<a class="navlink dynamic-navlink material-symbols-outlined" href="/logout">logout</a>`;
            const searchLick = `<a class="navlink dynamic-navlink material-symbols-outlined" id="" href="/search">search</a>`;
            nav.insertAdjacentHTML('beforeend', yourStoriesLink);
            nav.insertAdjacentHTML('beforeend', searchLick);
            nav.insertAdjacentHTML('beforeend', logoutLink);
            nav.insertAdjacentHTML('beforeend', addStoryLink);
        } else {
            console.log("NOT logged from menu");
            
            // User is not logged in
            const registerLink = `<a class="navlink dynamic-navlink material-symbols-outlined" href="/register">how_to_reg</a>`;
            const loginLink = `<a class="navlink dynamic-navlink material-symbols-outlined" href="/login">login</a>`;
            nav.insertAdjacentHTML('beforeend', registerLink);
            nav.insertAdjacentHTML('beforeend', loginLink);
        }

        document.querySelectorAll("a.navlink").forEach(nav => {
            nav.addEventListener("click", e => {
                e.preventDefault();
                const url = e.target.getAttribute("href");
                router.go(url);

            });
        })
    
        window.addEventListener("logged", () => {
            this.init();
        });
        
        this.render();
    },
    
    

    render: function() {
        const userStats = document.querySelector(".user-stats"); 
        
        if (app.data.logged) {
            
           
            userStats.innerHTML = `
                <span>Hi ${ app.data.logged }</span>, you have
                <span id="storycount" class="stat">0</span> stories from
                <span id="subcount" class="stat">0</span> authors.
            `;


            const updateStories = () => {
                document.getElementById("storycount").textContent = app.data.stories?.length || 0;
            };

            const updateSubs = () => {
                document.getElementById("subcount").textContent = app.data.subscriptions?.length || 0;
            };


            window.addEventListener("storiesloaded", updateStories);
            window.addEventListener("subs", updateSubs);

            // Save event listeners for removal later
            this._listeners = { updateStories, updateSubs };
        } else {


            console.log("top menu render NOT logged:" , app.data.logged);

            userStats.textContent = "User Not Logged In!";

            if (this._listeners) {
                const { updateStories, updateSubs } = this._listeners;
                window.removeEventListener("storiesloaded", updateStories);
                window.removeEventListener("subs", updateSubs);
                this._listeners = null; // Clear saved references
            }
        }
    },
};