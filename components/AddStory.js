import { TagList } from "./TagList.js";

export class AddStory extends HTMLElement {

    constructor() {
        super();
    }


    connectedCallback() {
        const temp = document.getElementById('add-template');
        const node = temp.content.cloneNode(true);
        this.appendChild(node);

        this.form1 = document.getElementById("postForm");
        this.form1.addEventListener("submit", (e)=> {
            e.preventDefault()
            this.submitStory()
        })

        const fileInput = document.getElementById("fileInput");
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePlaceholder.textContent = ""; // Clear placeholder text
                    const img = document.createElement("img");
                    img.src = event.target.result;
                    img.alt = "Selected Picture";
                    img.style.maxWidth = "100%";
                    img.style.maxHeight = "100%";
                    imagePlaceholder.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                imagePlaceholder.textContent = "Select a file"; 
            }
        });
    }

    submitStory(){
        // rewrite with reactive data?
        
        const formData = {
            name : this.form1.querySelector("#postName").value,
            desc : this.form1.querySelector("#desc").value,
            tags : TagList.tags
        }

        console.log(formData);
    }



    
}


customElements.define("add-page", AddStory);