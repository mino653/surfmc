// Text Typing Animation
// Simple typing effect for hero titles

// Typing effect function
function addTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 1000);
}

// Initialize typing animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add typing effect to hero titles that contain "Surfnetwork"
    const heroTitles = document.querySelectorAll('.hero-title, .display-4');
    heroTitles.forEach(title => {
        if (title.textContent.includes('Surfnetwork')) {
            addTypingEffect(title);
        }
    });
});

