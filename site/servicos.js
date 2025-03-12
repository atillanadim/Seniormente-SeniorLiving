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
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os botões "Ver mais"
    const verMaisBtns = document.querySelectorAll(".ver-mais-btn")
  
    // Adiciona evento de clique para cada botão
    verMaisBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Encontra o container de conteúdo pai
        const servicoContent = this.closest(".servico-content")
  
        // Alterna a classe 'expanded' para mostrar/esconder o conteúdo
        servicoContent.classList.toggle("expanded")
  
        // Alterna a classe 'active' no botão para girar a seta
        this.classList.toggle("active")
  
        // Altera o texto do botão
        if (this.classList.contains("active")) {
          this.childNodes[0].nodeValue = "Ver menos "
        } else {
          this.childNodes[0].nodeValue = "Ver mais "
        }
      })
    })
  })
  
  