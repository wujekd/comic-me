import router from "../services/router.js";

export default {

    _evListeners: [],
    _navListeners: [],

    init: function() {
        const nav = document.querySelector('nav');

        // Remove dynamically added elements
        nav.querySelectorAll('.dynamic-navlink').forEach(element => element.remove());

        // Remove old event listeners if they exist
        if (this._evListeners.length > 0) {
            this._evListeners.forEach(({ event, listener }) => {
                window.removeEventListener(event, listener);
            });
            this._evListeners = []; // Clear stored listeners
        }

        if (this._navListeners.length > 0) {
            this._navListeners.forEach(({ element, listener }) => {
                element.removeEventListener('click', listener);
            });
            this._navListeners = []; // Clear stored listeners
        }

        if (app.data.logged) {
            // User is logged in
            const addStoryLink = `<a class="navlink dynamic-navlink material-symbols-outlined" id="" href="/add-story">Add <span href="/add-story" class="nav-text">Story</span></a>`;
            const yourStoriesLink = `<a class="navlink dynamic-navlink nav-text material-symbols-outlined" href="/your-stories">Your Stories</a>`;
            const logoutLink = `<a class="navlink dynamic-navlink material-symbols-outlined" href="/logout">logout</a>`;
            const searchLink = `<a class="navlink dynamic-navlink material-symbols-outlined" id="" href="/search">search</a>`;
            nav.insertAdjacentHTML('beforeend', yourStoriesLink);
            nav.insertAdjacentHTML('beforeend', addStoryLink);
            nav.insertAdjacentHTML('beforeend', searchLink);
            nav.insertAdjacentHTML('beforeend', logoutLink);
            
        } else {
            // User is not logged in
            const registerLink = `<a class="navlink dynamic-navlink material-symbols-outlined" href="/register">how_to_reg</a>`;
            const loginLink = `<a class="navlink dynamic-navlink material-symbols-outlined" href="/login">login</a>`;
            nav.insertAdjacentHTML('beforeend', registerLink);
            nav.insertAdjacentHTML('beforeend', loginLink);
        }

        // Add new event listeners to nav links and store references
        document.querySelectorAll("a.navlink").forEach(navElement => {
            const listener = (e) => {
                e.preventDefault();
                const url = e.target.getAttribute("href");
                router.go(url);
            };

            navElement.addEventListener("click", listener);

            // Store the element and listener reference for removal later
            this._navListeners.push({ element: navElement, listener });
        });

        window.addEventListener("logged", () => {
            this.init();
        });

        this.render();
    },

    render: function() {
        const userStats = document.querySelector(".user-stats");

        if (app.data.logged) {
            userStats.innerHTML = `
                <span>Hi ${app.data.logged}</span>, you have
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

            document.getElementById("storycount").textContent = app.data.stories?.length || 0;
            document.getElementById("subcount").textContent = app.data.subscriptions?.length || 0

            // Save event listeners for removal later
            this._evListeners.push({ event: "storiesloaded", listener: updateStories });
            this._evListeners.push({ event: "subs", listener: updateSubs });
        } else {

            userStats.textContent = "User Not Logged In!";

            if (this._evListeners.length > 0) {
                this._evListeners.forEach(({ event, listener }) => {
                    window.removeEventListener(event, listener);
                });
                this._evListeners = []; // Clear saved references
            }
        }
    },
};
