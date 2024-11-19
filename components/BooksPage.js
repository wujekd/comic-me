export class BooksPage extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open"});
        const styles = document.createElement("style");
        this.root.appendChild(styles);

        async function loadCSS() {
            const request = await fetch('../css/BooksPage.css');
            const css = await request.text();
            styles.textContent = css;
        }
        loadCSS();
    }


    connectedCallback(){
        const temp = document.getElementById('books-template');
        const node = temp.content.cloneNode(true);
        this.root.appendChild(node);
        this.render();

        

        window.addEventListener("booksloaded", ()=> {
            this.render();
        });
    }


    render(){
        if (app.data.books) {
            this.root.querySelector("#books").innerHTML = "";
            console.log(app.data.books)
            for (let book of app.data.books['books']){
                const bookItem = document.createElement("div");
                bookItem.innerHTML = `
                    <h2>${book.name}</h2>
                    <p>${book.description}</p>
                    
                `;
                // <img src="${book.img_url}" />
                this.root.querySelector("#books").appendChild(bookItem)
            }
        } else {
            this.root.querySelector("#books").innerHTML = "Loading Books..."
        }
    }
}

customElements.define("books-page", BooksPage);