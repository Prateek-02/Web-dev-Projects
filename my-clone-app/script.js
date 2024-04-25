document.addEventListener("DOMContentLoaded", function() {
    const profileMenu = document.querySelector(".profile-menu");
    const profileButton = document.querySelector(".profile");

    profileButton.addEventListener("click", function() {
        profileMenu.classList.toggle("active");
    });

    // Close the profile menu when clicking outside of it
    document.addEventListener("click", function(event) {
        if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.remove("active");
        }
    });
});




