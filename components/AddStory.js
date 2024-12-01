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
                    imagePlaceholder.textContent = "";
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

    async submitStory() {
        const postData = {
            name: this.form1.querySelector("#postName").value,
            desc: this.form1.querySelector("#desc").value,
            tags: TagList.tags,
        };
    
        try {
            
            const response = await fetch("https://eq4pguzwid.execute-api.us-east-1.amazonaws.com/prod/contents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`, 
                },
                body: JSON.stringify(postData),
            });
    
            if (!response.ok) {
                throw new Error(response.statusText);
            }
    
            const result = await response.json();
            console.log("Story added:", result);
    
            
            if (result.upload_url) {
                const fileInput = document.getElementById("fileInput");
                const imageFile = fileInput.files[0];
    
                if (imageFile) {
                    await this.uploadImage(result.upload_url, imageFile);
                    alert("Image uploaded successfully!");
                } else {
                    alert("No image selected to upload.");
                }
            } else {
                console.error("No pre-signed URL returned.");
            }
        } catch (e) {
            console.error("Failed to submit story:", e);
        }
    }
    
    async uploadImage(preSignedUrl, imageFile) {
        try {
            const response = await fetch(preSignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": imageFile.type,
                },
                body: imageFile,
            });
    
            if (!response.ok) {
                throw new Error("Failed to upload the image.");
            }
    
            console.log("Image uploaded successfully.");
        } catch (error) {
            console.error("Error during image upload:", error);
            alert("An error occurred while uploading the image.");
        }
    }
    


    
}


customElements.define("add-page", AddStory);