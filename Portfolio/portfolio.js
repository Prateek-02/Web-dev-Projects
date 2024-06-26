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

// scroll to about on click
document.getElementById('about-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('about').scrollIntoView({
        behavior: 'smooth'
    });
});


// toggle menu bar
document.getElementById('mobile-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('showing');
});

