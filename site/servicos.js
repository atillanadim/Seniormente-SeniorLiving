document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", function () {
        const item = this.parentElement;
        const isActive = item.classList.contains("active");

        // Fecha todos os itens antes de abrir um novo
        document.querySelectorAll(".accordion-item").forEach((i) => i.classList.remove("active"));

        if (!isActive) {
            item.classList.add("active");
        }
    });
});

