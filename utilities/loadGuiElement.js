export default function(child, parent) {
    const existingDiv = parent.querySelector('div');
    
    if (existingDiv) {
        existingDiv.style.transition = "opacity 0.4s";
        existingDiv.style.opacity = "0";
    
        // Listen for the transitionend event 
        existingDiv.addEventListener("transitionend", function handleFadeOut() {
            existingDiv.remove();
            existingDiv.removeEventListener("transitionend", handleFadeOut); // Clean up the listener
    
    
            requestAnimationFrame(() => {
                fadeInNewChild();
            });
            
        });
    } else {
        fadeInNewChild();
    }
 
    function fadeInNewChild() {
        child.style.opacity = "0";
        parent.appendChild(child);
    

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                child.style.transition = "opacity 0.4s"; // Add transition
                child.style.opacity = "1"; // Set opacity to 100%
            });
        });
    }
    
    // function fadeInNewChild() {
    //     child.style.transition = "opacity 0.4s"; // Add transition
    //     child.style.opacity = "0"; // Start with opacity 0
    //     parent.appendChild(child); // Append the new child
    
    //     // Ensure the opacity transition starts after the element is appended
    //     requestAnimationFrame(() => {
    //         child.style.opacity = "100%"; // Set opacity to 100%
    //     });
    // }
}