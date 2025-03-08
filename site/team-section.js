document.addEventListener('DOMContentLoaded', function() {
    // Selecionar elementos
    const membros = document.querySelectorAll('.equipe-membro');
    const navItems = document.querySelectorAll('.equipe-nav li');
    const equipeSection = document.querySelector('.equipe-section');
    const equipeNav = document.querySelector('.equipe-nav');
    
    // Posicionar o menu inicialmente
    posicionarMenu(0);
    
    // Inicializar o primeiro membro como ativo
    let activeIndex = 0;
    showMembro(activeIndex);
    
    // Adicionar eventos de clique na navegação
    navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        showMembro(index);
      });
    });
    
    // Função para posicionar o menu relativo ao membro ativo
    function posicionarMenu(index) {
      const membro = membros[index];
      if (!membro) return;
      
      const membroRect = membro.getBoundingClientRect();
      const sectionRect = equipeSection.getBoundingClientRect();
      
      // Posicionar o menu no centro vertical do membro ativo
      const menuTop = membroRect.top - sectionRect.top + membroRect.height / 2 - equipeNav.offsetHeight / 2;
      equipeNav.style.top = `${menuTop}px`;
    }
    
    // Função para mostrar um membro específico
    function showMembro(index) {
      // Atualizar índice ativo
      activeIndex = index;
      
      // Atualizar navegação
      navItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      // Esconder todos os membros
      membros.forEach(membro => {
        membro.classList.remove('active');
        membro.querySelector('.info-membro').classList.remove('active');
        membro.querySelector('.foto-wrapper').style.transform = 'rotate(0deg)';
      });
      
      // Mostrar o membro ativo
      const activeMembro = membros[index];
      activeMembro.classList.add('active');
      
      // Animar a foto girando 360 graus
      setTimeout(() => {
        const fotoWrapper = activeMembro.querySelector('.foto-wrapper');
        fotoWrapper.style.transform = 'rotate(360deg)';
        
        // Mostrar as informações quando a foto estiver no meio da animação
        setTimeout(() => {
          activeMembro.querySelector('.info-membro').classList.add('active');
        }, 750); // Metade do tempo da animação da foto
      }, 100);
      
      // Rolar para o membro ativo
      activeMembro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Posicionar o menu após a rolagem
      setTimeout(() => {
        posicionarMenu(index);
      }, 500);
    }
    
    // Adicionar navegação com as teclas de seta
    document.addEventListener('keydown', function(e) {
      // Verificar se estamos na seção da equipe
      const rect = equipeSection.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (!isInView) return; // Não processar se não estiver na seção da equipe
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        // Próximo membro
        if (activeIndex < membros.length - 1) {
          showMembro(activeIndex + 1);
          e.preventDefault(); // Prevenir scroll padrão apenas se não for o último membro
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        // Membro anterior
        if (activeIndex > 0) {
          showMembro(activeIndex - 1);
          e.preventDefault(); // Prevenir scroll padrão apenas se não for o primeiro membro
        }
      }
    });
    
    // Variáveis para controlar o scroll
    let isScrolling = false;
    let lastScrollTime = 0;
    
    // Adicionar navegação com a roda do mouse
    document.addEventListener('wheel', function(e) {
      // Verificar se estamos na seção da equipe
      const rect = equipeSection.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2;
      
      if (!isInView) return; // Não processar se não estiver na seção da equipe
      
      // Verificar se já passamos do último membro e estamos rolando para baixo
      const isLastMemberActive = activeIndex === membros.length - 1;
      const isScrollingDown = e.deltaY > 0;
      
      // Se estamos no último membro e rolando para baixo, permitir o scroll normal
      if (isLastMemberActive && isScrollingDown) {
        return;
      }
      
      // Se estamos no primeiro membro e rolando para cima, permitir o scroll normal
      const isFirstMemberActive = activeIndex === 0;
      const isScrollingUp = e.deltaY < 0;
      
      if (isFirstMemberActive && isScrollingUp) {
        return;
      }
      
      // Evitar múltiplos eventos de roda em um curto período
      const now = Date.now();
      if (now - lastScrollTime < 500 || isScrolling) return;
      
      isScrolling = true;
      lastScrollTime = now;
      
      if (isScrollingDown) {
        // Rolar para baixo - próximo membro
        if (activeIndex < membros.length - 1) {
          e.preventDefault();
          showMembro(activeIndex + 1);
        }
      } else {
        // Rolar para cima - membro anterior
        if (activeIndex > 0) {
          e.preventDefault();
          showMembro(activeIndex - 1);
        }
      }
      
      // Resetar flag após um tempo
      setTimeout(() => {
        isScrolling = false;
      }, 500);
    }, { passive: false });
    
    // Adicionar navegação com o scroll da página
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(membros).indexOf(entry.target);
          if (index !== activeIndex) {
            // Atualizar navegação sem animar novamente
            activeIndex = index;
            
            navItems.forEach((item, i) => {
              if (i === index) {
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            });
            
            // Posicionar o menu
            posicionarMenu(index);
          }
        }
      });
    }, { threshold: 0.5 });
    
    // Observar cada membro
    membros.forEach(membro => {
      observer.observe(membro);
    });
    
    // Atualizar posição do menu durante o scroll
    window.addEventListener('scroll', function() {
      // Verificar se estamos na seção da equipe
      const rect = equipeSection.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
      
      if (isInView) {
        // Encontrar qual membro está mais visível
        let maxVisibility = 0;
        let mostVisibleIndex = activeIndex;
        
        membros.forEach((membro, index) => {
          const membroRect = membro.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calcular quanto do elemento está visível (0 a 1)
          const visibleTop = Math.max(0, membroRect.top);
          const visibleBottom = Math.min(windowHeight, membroRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibility = visibleHeight / membroRect.height;
          
          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleIndex = index;
          }
        });
        
        // Atualizar posição do menu se necessário
        if (mostVisibleIndex !== activeIndex) {
          activeIndex = mostVisibleIndex;
          
          navItems.forEach((item, i) => {
            if (i === activeIndex) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
        
        // Posicionar o menu com base no scroll atual
        posicionarMenu(activeIndex);
      }
    });
    
    // Atualizar posição do menu quando a janela for redimensionada
    window.addEventListener('resize', function() {
      posicionarMenu(activeIndex);
    });
  });