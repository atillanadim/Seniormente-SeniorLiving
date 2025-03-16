document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle")
    const navContainer = document.querySelector(".nav-container")
    const navbar = document.getElementById("navbar")
    const logo = document.getElementById("logo")
    const dropdowns = document.querySelectorAll(".dropdown")
    const quemSomosDropdown = document.querySelector(".dropdown.quem-somos")
    const quemSomosLink = quemSomosDropdown ? quemSomosDropdown.querySelector("a") : null
  
    // Função para verificar se é um dispositivo móvel
    function isMobile() {
      return window.innerWidth <= 768
    }
  
    // Toggle do menu móvel
    menuToggle.addEventListener("click", () => {
      navContainer.classList.toggle("active")
      menuToggle.classList.toggle("active")
    })
  
    // Fechar menu ao clicar em links
    const navLinks = document.querySelectorAll(".nav-links a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navContainer.classList.remove("active")
        menuToggle.classList.remove("active")
      })
    })
  
    // Fechar menu ao clicar fora dele
    document.addEventListener("click", (event) => {
      const isClickInsideNav = navContainer.contains(event.target)
      const isClickOnToggle = menuToggle.contains(event.target)
  
      if (!isClickInsideNav && !isClickOnToggle && navContainer.classList.contains("active")) {
        navContainer.classList.remove("active")
        menuToggle.classList.remove("active")
      }
    })
  
    // Efeito de shrink na navbar ao rolar a página
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        navbar.style.padding = "20px 10px"
        logo.style.width = "70px"
        logo.style.height = "70px"
      } else {
        navbar.style.padding = "50px 10px"
        logo.style.width = "80px"
        logo.style.height = "80px"
      }
    })
  
    // Funcionalidade do dropdown para dispositivos móveis
    dropdowns.forEach((dropdown) => {
      // Pular o dropdown "Quem Somos" pois ele terá tratamento especial
      if (dropdown === quemSomosDropdown) return
  
      dropdown.addEventListener("click", function (e) {
        if (isMobile()) {
          e.preventDefault()
          this.classList.toggle("active")
        }
      })
    })
  
    // Tratamento especial para o dropdown "Quem Somos"
    if (quemSomosLink && quemSomosDropdown) {
      quemSomosDropdown.addEventListener("click", (e) => {
        if (isMobile()) {
          // Se o clique foi no link principal e não em um dos subitens
          if (e.target === quemSomosLink) {
            // Navegar diretamente para a página Quem Somos
            window.location.href = quemSomosLink.getAttribute("href")
          } else {
            // Se clicou em outra parte do dropdown, não faz nada
            e.stopPropagation()
          }
        }
      })
  
      // Garantir que o dropdown "Quem Somos" não apareça em dispositivos móveis
      function updateQuemSomosDisplay() {
        if (isMobile()) {
          const dropdownContent = quemSomosDropdown.querySelector(".dropdown-content")
          if (dropdownContent) {
            dropdownContent.style.display = "none"
          }
        }
      }
  
      // Atualizar ao carregar e ao redimensionar
      updateQuemSomosDisplay()
      window.addEventListener("resize", updateQuemSomosDisplay)
    }
  })
  
  