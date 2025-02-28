document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');

    menuToggle.addEventListener('click', function() {
        navContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Fechar o menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navContainer.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navContainer.classList.contains('active')) {
            navContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});