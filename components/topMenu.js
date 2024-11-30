export default {


    init: function(){
        window.addEventListener("logged", ()=>{
            this.render();
        })
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
                document.getElementById("storycount").textContent = app.data.stories.length || 0;
            };

            const updateSubs = () => {
                console.log("subs len: ", app.data.subscriptions.length)
                document.getElementById("subcount").textContent = app.data.subscriptions.length || 0;
            };


            window.addEventListener("storiesloaded", updateStories);
            window.addEventListener("subs", updateSubs);

            // Save event listeners for removal later
            this._listeners = { updateStories, updateSubs };
        } else {

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