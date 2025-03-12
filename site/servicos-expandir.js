document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os itens de serviço
    const servicoItems = document.querySelectorAll(".servico-item")
  
    // Para cada item de serviço
    servicoItems.forEach((item) => {
      const servicoContent = item.querySelector(".servico-content")
      const primeiroParagrafo = servicoContent.querySelector("p")
  
      // Cria o botão "Ver mais"
      const expandirBtn = document.createElement("button")
      expandirBtn.className = "expandir-btn"
      expandirBtn.innerHTML =
        'Ver mais <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
  
      // Insere o botão após o primeiro parágrafo
      if (primeiroParagrafo) {
        primeiroParagrafo.insertAdjacentElement("afterend", expandirBtn)
      }
  
      // Adiciona evento de clique ao botão 
      expandirBtn.addEventListener("click", function () {
        // Alterna a classe 'expanded' para mostrar/esconder o conteúdo
        servicoContent.classList.toggle("expanded")
  
        // Alterna a classe 'active' no botão para girar a seta
        this.classList.toggle("active")
  
        // Altera o texto do botão
        if (this.classList.contains("active")) {
          this.innerHTML =
            'Ver menos <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        } else {
          this.innerHTML =
            'Ver mais <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        }
      })
    })
  })
  
  