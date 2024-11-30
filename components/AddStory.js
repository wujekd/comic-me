export class AddStory extends HTMLElement {

    constructor() {
        super();
    }


    connectedCallback() {
        const temp = document.getElementById('add-template');
        const node = temp.content.cloneNode(true);
        this.appendChild(node);

        const fileInput = document.getElementById("fileInput");
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0]; // Get the selected file
            if (file) {
                // Display it
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

    
}


customElements.define("add-page", AddStory);


