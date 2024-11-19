import APIs from "./APIs.js";

export async function loadBooks() {
    app.data.books = await APIs.fetchBooks();
    console.log("Books have been loaded:", app.data.books);
}

// all books related functions
// export async function 