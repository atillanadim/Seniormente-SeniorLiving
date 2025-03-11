document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const cards = document.querySelectorAll(".card");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");
    const indicatorsContainer = document.querySelector(".carousel-indicators");

    let currentIndex = 0;
    const slides = [
        [0, 1, 2], // Primeiro slide: 3 cards
        [3, 4, 5], // Segundo slide: 3 cards
        [6, 7]     // Terceiro slide: 2 cards
    ];
    const totalSlides = slides.length;

    // Ajustar o tamanho do carrossel para acomodar todos os cards corretamente
    const cardWidth = cards[0].offsetWidth + 30; // Pegamos a largura de um card + margem
    const carouselWidth = cardWidth * 3; // Define a largura para 3 cards
    carousel.style.width = `${carouselWidth}px`;

    // Criar indicadores
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement("div");
        indicator.classList.add("indicator");
        if (i === 0) indicator.classList.add("active");
        indicator.addEventListener("click", () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }

    function updateCarousel() {
        const translateValue = -currentIndex * carouselWidth; // Movemos por grupos
        carousel.style.transform = `translateX(${translateValue}px)`;

        // Atualizar indicadores
        document.querySelectorAll(".indicator").forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentIndex);
        });

        // Atualizar visibilidade dos botões
        prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible";
        nextButton.style.visibility = currentIndex === totalSlides - 1 ? "hidden" : "visible";
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentIndex = index;
            updateCarousel();
        }
    }

    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Event listeners
    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);

    // Inicializar carrossel corretamente
    updateCarousel();
});
