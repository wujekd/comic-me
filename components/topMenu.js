export default {


    init: function(){
        window.addEventListener("logged", ()=>{
            this.render();
        })
        this.render();
    },


    render: function() {
        const userStats = document.querySelector(".user-stats"); // Assuming this is the container for user stats
        
        if (app.data.logged) {
            // Clear any previous content (useful for switching between states)
            userStats.innerHTML = `
                <span>Hi ${ app.data.logged }</span>, you have
                <span id="storycount" class="stat">0</span> stories from
                <span id="subcount" class="stat">0</span> authors.
            `;

            // Define event handlers
            const updateStories = () => {
                document.getElementById("storycount").textContent = app.data.stories.length || 0;
            };

            const updateSubs = () => {
                document.getElementById("subcount").textContent = app.data.subscriptions.length || 0;
            };



            // Add event listeners
            window.addEventListener("storiesloaded", updateStories);
            window.addEventListener("subs", updateSubs);

            // Save event listeners for removal later
            this._listeners = { updateStories, updateSubs };
        } else {
            // Set "User Not logged in!" message
            userStats.textContent = "User Not Logged In!";

            // Remove event listeners if previously added
            if (this._listeners) {
                const { updateStories, updateSubs } = menuBar._listeners;
                window.removeEventListener("storiesloaded", updateStories);
                window.removeEventListener("subs", updateSubs);
                this._listeners = null; // Clear saved references
            }
        }
    },
};