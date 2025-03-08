document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    const revealCards = () => {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight - 50) {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }
        });
    };

    window.addEventListener("scroll", revealCards);
    revealCards();
});
