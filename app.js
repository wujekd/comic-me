import Data from "./services/data.js";
import Router from "./services/router.js";
import { loadBooks } from "./services/books.js";


import { BooksPage } from "./components/BooksPage.js";


window.app = {};
app.data = Data;
app.router = Router;

window.addEventListener("DOMContentLoaded", ()=> {

    loadBooks();
    app.router.init();
    setTimeout( () => console.log(app.data.books), 600);
    
})