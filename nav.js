document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navbar = document.getElementById('navbar'); // Agora ID está correto
    const logo = document.getElementById('logo'); // Agora ID está correto

    menuToggle.addEventListener('click', function () {
        navContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    document.addEventListener('click', function (event) {
        const isClickInsideNav = navContainer.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navContainer.classList.contains('active')) {
            navContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Efeito de shrink na navbar ao rolar a página
    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            navbar.style.padding = "20px 10px";
            logo.style.width = "70px"; // Reduzindo tamanho do logo
            logo.style.height = "70px";
        } else {
            navbar.style.padding = "50px 10px";
            logo.style.width = "80px"; // Voltando ao tamanho original
            logo.style.height = "80px";
        }
    });
});
