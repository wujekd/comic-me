import loadGuiElement from "./utilities/loadGuiElement.js"

export default {
    display: document.querySelector(".display"),

    homeView: function() {
        const temp = document.getElementById("homeTemplate");
        let element = temp.content.cloneNode(true).firstElementChild;

        loadGuiElement(element, this.display)
    },
    booksView: function() {
        const temp = document.getElementById("booksTemplate");
        let element = temp.content.cloneNode(true).firstElementChild;

        loadGuiElement(element, this.display)
    },
    registerView: function() {

    },
    loginView: function() {
    }
}