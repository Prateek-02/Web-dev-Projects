document.getElementById('contact-link').addEventListener('click',function(event){
    event.preventDefault();
    var email = document.getElementById('email');
    if(email.style.display === 'none'){
        email.style.display = 'block';
    }
    else{
        email.style.display = 'none';
    }
});


// portfolio.js

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
});

