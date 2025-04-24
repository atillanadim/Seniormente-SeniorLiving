document.addEventListener("DOMContentLoaded", () => {
    // Criar o modal no DOM
    const modalHTML = `
      <div class="modal-gallery" id="imageModal">
        <div class="modal-content">
          <button class="modal-close" id="modalClose">×</button>
          <img src="/placeholder.svg" alt="Imagem ampliada" class="modal-image" id="modalImage">
          <div class="modal-nav">
            <button class="modal-btn" id="modalPrev">&lt;</button>
            <button class="modal-btn" id="modalNext">&gt;</button>
          </div>
        </div>
      </div>
    `
  
    document.body.insertAdjacentHTML("beforeend", modalHTML)
  
    // Elementos do modal
    const modal = document.getElementById("imageModal")
    const modalImage = document.getElementById("modalImage")
    const modalClose = document.getElementById("modalClose")
    const modalPrev = document.getElementById("modalPrev")
    const modalNext = document.getElementById("modalNext")
  
    // Variáveis para controlar a galeria atual
    let currentGalleryImages = []
    let currentImageIndex = 0
  
    // Adicionar evento de clique em todas as imagens das galerias
    const galeriaImages = document.querySelectorAll(".galeria-slide img")
    galeriaImages.forEach((img) => {
      img.style.cursor = "pointer"
      img.addEventListener("click", function () {
        // Encontrar a galeria pai
        const galeriaContainer = this.closest(".galeria-container")
        if (!galeriaContainer) return
  
        // Obter todas as imagens desta galeria
        currentGalleryImages = Array.from(galeriaContainer.querySelectorAll("img"))
  
        // Encontrar o índice da imagem clicada
        currentImageIndex = currentGalleryImages.indexOf(this)
  
        // Abrir o modal com a imagem clicada
        openModal(this.src, this.alt)
      })
    })
  
    // Função para abrir o modal
    function openModal(src, alt) {
      modalImage.src = src
      modalImage.alt = alt
      modal.classList.add("active")
      document.body.style.overflow = "hidden" // Impedir rolagem da página
    }
  
    // Função para fechar o modal
    function closeModal() {
      modal.classList.remove("active")
      document.body.style.overflow = "" // Restaurar rolagem da página
    }
  
    // Função para navegar para a imagem anterior
    function prevImage() {
      if (currentGalleryImages.length <= 1) return
  
      currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length
      const prevImg = currentGalleryImages[currentImageIndex]
      modalImage.src = prevImg.src
      modalImage.alt = prevImg.alt
      modalImage.style.animation = "none"
      setTimeout(() => {
        modalImage.style.animation = "fadeIn 0.3s ease"
      }, 10)
    }
  
    // Função para navegar para a próxima imagem
    function nextImage() {
      if (currentGalleryImages.length <= 1) return
  
      currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length
      const nextImg = currentGalleryImages[currentImageIndex]
      modalImage.src = nextImg.src
      modalImage.alt = nextImg.alt
      modalImage.style.animation = "none"
      setTimeout(() => {
        modalImage.style.animation = "fadeIn 0.3s ease"
      }, 10)
    }
  
    // Adicionar eventos aos botões do modal
    modalClose.addEventListener("click", closeModal)
    modalPrev.addEventListener("click", prevImage)
    modalNext.addEventListener("click", nextImage)
  
    // Fechar o modal ao clicar fora da imagem
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })
  
    // Adicionar suporte para navegação com teclado
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("active")) return
  
      if (e.key === "Escape") {
        closeModal()
      } else if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    })
  })
  