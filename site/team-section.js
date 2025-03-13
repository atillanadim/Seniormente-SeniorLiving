document.addEventListener("DOMContentLoaded", () => {
  // Selecionar elementos
  const membros = document.querySelectorAll(".equipe-membro")
  const navItems = document.querySelectorAll(".equipe-nav li")
  const equipeSection = document.querySelector(".equipe-section")
  const equipeNav = document.querySelector(".equipe-nav")

  // Variáveis de controle
  let animacaoIniciada = false
  let activeIndex = 0
  let isMobile = window.innerWidth <= 768
  let touchStartY = 0
  let touchEndY = 0

  // Função para verificar se é dispositivo móvel
  function checkMobile() {
    isMobile = window.innerWidth <= 768
    return isMobile
  }

  // Esconder todos os membros inicialmente
  membros.forEach((membro) => {
    membro.style.opacity = "0"
    membro.style.visibility = "hidden"
  })

  // Só esconder o menu se não for mobile
  if (!checkMobile()) {
    equipeNav.style.opacity = "0"
    equipeNav.style.visibility = "hidden"
  }

  // Função para posicionar o menu
  function posicionarMenu(index) {
    // Não posicionar o menu em dispositivos móveis
    if (checkMobile()) return

    const membro = membros[index]
    if (!membro) return

    const membroRect = membro.getBoundingClientRect()
    const sectionRect = equipeSection.getBoundingClientRect()

    const menuTop = membroRect.top - sectionRect.top + membroRect.height / 2 - equipeNav.offsetHeight / 2
    equipeNav.style.top = `${menuTop}px`
  }

  // Função para mostrar um membro específico
  function showMembro(index, skipScroll = false) {
    // Validar índice
    if (index < 0 || index >= membros.length) return

    // Atualizar índice ativo
    activeIndex = index

    // Atualizar navegação
    navItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })

    // Esconder todos os membros
    membros.forEach((membro) => {
      membro.style.opacity = "0"
      membro.style.visibility = "hidden"

      const infoMembro = membro.querySelector(".info-membro")
      if (infoMembro) {
        infoMembro.style.opacity = "0"

        // Ajustar a direção da animação com base no dispositivo
        if (checkMobile()) {
          infoMembro.style.transform = "translateY(30px)"
        } else {
          infoMembro.style.transform = "translateX(30px)"
        }
      }

      const fotoWrapper = membro.querySelector(".foto-wrapper")
      if (fotoWrapper) {
        // Simplificar animação em dispositivos móveis
        if (checkMobile()) {
          fotoWrapper.style.transform = "scale(0.9)"
        } else {
          fotoWrapper.style.transform = "rotate(0deg)"
        }
      }
    })

    // Mostrar o membro ativo
    const activeMembro = membros[index]
    activeMembro.style.visibility = "visible"
    activeMembro.style.opacity = "1"

    // Animar a foto com atraso reduzido em dispositivos móveis
    setTimeout(
      () => {
        const fotoWrapper = activeMembro.querySelector(".foto-wrapper")
        if (fotoWrapper) {
          if (checkMobile()) {
            fotoWrapper.style.transform = "scale(1)"
          } else {
            fotoWrapper.style.transform = "rotate(360deg)"
          }
        }

        // Mostrar as informações com atraso reduzido em dispositivos móveis
        setTimeout(
          () => {
            const infoMembro = activeMembro.querySelector(".info-membro")
            if (infoMembro) {
              infoMembro.style.opacity = "1"
              infoMembro.style.transform = "translateX(0) translateY(0)"
            }
          },
          checkMobile() ? 300 : 750,
        )
      },
      checkMobile() ? 50 : 100,
    )

    // Rolar para o membro ativo (se não for para pular)
    if (!skipScroll) {
      // Comportamento de rolagem mais suave em dispositivos móveis
      const scrollOptions = {
        behavior: "smooth",
        block: checkMobile() ? "start" : "center",
      }

      activeMembro.scrollIntoView(scrollOptions)
    }

    // Posicionar o menu (apenas em desktop)
    if (!checkMobile()) {
      posicionarMenu(index)

      // Mostrar o menu se estiver escondido
      equipeNav.style.opacity = "1"
      equipeNav.style.visibility = "visible"
    }
  }

  // Função para iniciar a animação
  function iniciarAnimacao() {
    if (animacaoIniciada) return

    animacaoIniciada = true

    // Forçar o primeiro membro
    showMembro(0, true)

    console.log("Animação iniciada com o membro 0")
  }

  // Adicionar eventos de clique na navegação
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (!animacaoIniciada) {
        iniciarAnimacao()
      } else {
        showMembro(index)
      }
    })
  })

  // Observar quando a seção da equipe entra na viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animacaoIniciada) {
          iniciarAnimacao()
        }
      })
    },
    { threshold: 0.2 },
  ) // Reduzido para iniciar mais cedo

  observer.observe(equipeSection)

  // Controle de scroll
  let isScrolling = false
  let lastScrollTime = 0

  // Função para lidar com o scroll
  function handleScroll(e) {
    // Verificar se estamos na seção da equipe
    const rect = equipeSection.getBoundingClientRect()
    const isInView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2

    if (!isInView) return

    // Iniciar animação se ainda não foi iniciada
    if (!animacaoIniciada) {
      iniciarAnimacao()
      return
    }

    // Verificar limites
    const isLastMember = activeIndex === membros.length - 1
    const isFirstMember = activeIndex === 0
    const isScrollingDown = e.deltaY > 0
    const isScrollingUp = e.deltaY < 0

    // Permitir scroll normal nos limites
    if ((isLastMember && isScrollingDown) || (isFirstMember && isScrollingUp)) {
      return
    }

    // Evitar múltiplos eventos - tempo reduzido em dispositivos móveis
    const now = Date.now()
    const scrollDelay = checkMobile() ? 300 : 500
    if (now - lastScrollTime < scrollDelay || isScrolling) return

    isScrolling = true
    lastScrollTime = now

    if (isScrollingDown) {
      if (activeIndex < membros.length - 1) {
        e.preventDefault()
        showMembro(activeIndex + 1)
      }
    } else {
      if (activeIndex > 0) {
        e.preventDefault()
        showMembro(activeIndex - 1)
      }
    }

    setTimeout(() => {
      isScrolling = false
    }, scrollDelay)
  }

  document.addEventListener("wheel", handleScroll, { passive: false })

  // Adicionar suporte a toque para dispositivos móveis
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY
  }

  function handleTouchMove(e) {
    // Não interferir com o scroll normal
    e.stopPropagation()
  }

  function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].clientY

    // Verificar se estamos na seção da equipe
    const rect = equipeSection.getBoundingClientRect()
    const isInView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2

    if (!isInView) return

    // Calcular a distância do swipe
    const touchDiff = touchStartY - touchEndY

    // Se o swipe foi significativo (mais de 50px)
    if (Math.abs(touchDiff) > 50) {
      // Iniciar animação se ainda não foi iniciada
      if (!animacaoIniciada) {
        iniciarAnimacao()
        return
      }

      // Evitar múltiplos eventos
      const now = Date.now()
      if (now - lastScrollTime < 300 || isScrolling) return

      isScrolling = true
      lastScrollTime = now

      if (touchDiff > 0) {
        // Swipe para cima, ir para o próximo membro
        if (activeIndex < membros.length - 1) {
          showMembro(activeIndex + 1)
        }
      } else {
        // Swipe para baixo, ir para o membro anterior
        if (activeIndex > 0) {
          showMembro(activeIndex - 1)
        }
      }

      setTimeout(() => {
        isScrolling = false
      }, 300)
    }
  }

  // Adicionar eventos de toque
  equipeSection.addEventListener("touchstart", handleTouchStart, { passive: true })
  equipeSection.addEventListener("touchmove", handleTouchMove, { passive: true })
  equipeSection.addEventListener("touchend", handleTouchEnd, { passive: true })

  // Navegação com teclado
  document.addEventListener("keydown", (e) => {
    if (!animacaoIniciada) return

    const rect = equipeSection.getBoundingClientRect()
    const isInView = rect.top <= window.innerHeight && rect.bottom >= 0

    if (!isInView) return

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      if (activeIndex < membros.length - 1) {
        e.preventDefault()
        showMembro(activeIndex + 1)
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      if (activeIndex > 0) {
        e.preventDefault()
        showMembro(activeIndex - 1)
      }
    }
  })

  // Atualizar posição do menu e verificar tamanho da tela no redimensionamento
  let resizeTimer
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      checkMobile()
      if (animacaoIniciada) {
        posicionarMenu(activeIndex)
      }
    }, 250)
  })
})

