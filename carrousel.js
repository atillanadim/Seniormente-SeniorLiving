document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = carousel.querySelectorAll('.card');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;
    const totalCards = cards.length;
    const visibleCards = 3;

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 20; // 20 é o margin
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function showCards(index) {
        // Implementa o loop infinito
        if (index < 0) {
            currentIndex = totalCards - visibleCards;
        } else if (index > totalCards - visibleCards) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateCarousel();
    }

    prevButton.addEventListener('click', () => {
        showCards(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        showCards(currentIndex + 1);
    });

    // Atualiza o carrossel quando a janela é redimensionada
    window.addEventListener('resize', () => {
        showCards(currentIndex);
    });

    // Inicializa o carrossel
    updateCarousel();
});