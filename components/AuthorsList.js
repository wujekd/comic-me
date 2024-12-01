

export class AuthorsList extends HTMLElement {

    static authors = null;

    constructor(){
        super();
    }


    connectedCallback(){
        const temp = document.getElementById('books-template');
        const node = temp.content.cloneNode(true);
        this.appendChild(node);


        if (!AuthorsList.authors){
            //get authors
        }
    }
}

customElements.define("authors-list", AuthorsList);