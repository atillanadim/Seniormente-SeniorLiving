document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = carousel.querySelectorAll('.card');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function showNextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }

    function showPrevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    prevButton.addEventListener('click', showPrevCard);
    nextButton.addEventListener('click', showNextCard);

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('expanded');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('expanded');
        });
    });

    // Inicializa o carrossel
    updateCarousel();
});