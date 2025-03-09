document.addEventListener('DOMContentLoaded', function() {
  // Selecionar elementos
  const membros = document.querySelectorAll('.equipe-membro');
  const navItems = document.querySelectorAll('.equipe-nav li');
  const equipeSection = document.querySelector('.equipe-section');
  const equipeNav = document.querySelector('.equipe-nav');
  
  // Variáveis de controle
  let animacaoIniciada = false;
  let activeIndex = 0;
  
  // Esconder todos os membros e o menu inicialmente
  membros.forEach(membro => {
    membro.style.opacity = '0';
    membro.style.visibility = 'hidden';
  });
  
  equipeNav.style.opacity = '0';
  equipeNav.style.visibility = 'hidden';
  
  // Função para posicionar o menu
  function posicionarMenu(index) {
    const membro = membros[index];
    if (!membro) return;
    
    const membroRect = membro.getBoundingClientRect();
    const sectionRect = equipeSection.getBoundingClientRect();
    
    const menuTop = membroRect.top - sectionRect.top + membroRect.height / 2 - equipeNav.offsetHeight / 2;
    equipeNav.style.top = `${menuTop}px`;
  }
  
  // Função para mostrar um membro específico
  function showMembro(index, skipScroll = false) {
    // Validar índice
    if (index < 0 || index >= membros.length) return;
    
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
      membro.style.opacity = '0';
      membro.style.visibility = 'hidden';
      
      const infoMembro = membro.querySelector('.info-membro');
      if (infoMembro) {
        infoMembro.style.opacity = '0';
        infoMembro.style.transform = 'translateX(30px)';
      }
      
      const fotoWrapper = membro.querySelector('.foto-wrapper');
      if (fotoWrapper) {
        fotoWrapper.style.transform = 'rotate(0deg)';
      }
    });
    
    // Mostrar o membro ativo
    const activeMembro = membros[index];
    activeMembro.style.visibility = 'visible';
    activeMembro.style.opacity = '1';
    
    // Animar a foto
    setTimeout(() => {
      const fotoWrapper = activeMembro.querySelector('.foto-wrapper');
      if (fotoWrapper) {
        fotoWrapper.style.transform = 'rotate(360deg)';
      }
      
      // Mostrar as informações
      setTimeout(() => {
        const infoMembro = activeMembro.querySelector('.info-membro');
        if (infoMembro) {
          infoMembro.style.opacity = '1';
          infoMembro.style.transform = 'translateX(0)';
        }
      }, 750);
    }, 100);
    
    // Rolar para o membro ativo (se não for para pular)
    if (!skipScroll) {
      activeMembro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Posicionar o menu
    posicionarMenu(index);
    
    // Mostrar o menu se estiver escondido
    equipeNav.style.opacity = '1';
    equipeNav.style.visibility = 'visible';
  }
  
  // Função para iniciar a animação
  function iniciarAnimacao() {
    if (animacaoIniciada) return;
    
    animacaoIniciada = true;
    
    // Forçar o primeiro membro
    showMembro(0, true);
    
    console.log('Animação iniciada com o membro 0');
  }
  
  // Adicionar eventos de clique na navegação
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!animacaoIniciada) {
        iniciarAnimacao();
      } else {
        showMembro(index);
      }
    });
  });
  
  // Observar quando a seção da equipe entra na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animacaoIniciada) {
        iniciarAnimacao();
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(equipeSection);
  
  // Controle de scroll
  let isScrolling = false;
  let lastScrollTime = 0;
  
  document.addEventListener('wheel', function(e) {
    // Verificar se estamos na seção da equipe
    const rect = equipeSection.getBoundingClientRect();
    const isInView = rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2;
    
    if (!isInView) return;
    
    // Iniciar animação se ainda não foi iniciada
    if (!animacaoIniciada) {
      iniciarAnimacao();
      return;
    }
    
    // Verificar limites
    const isLastMember = activeIndex === membros.length - 1;
    const isFirstMember = activeIndex === 0;
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;
    
    // Permitir scroll normal nos limites
    if ((isLastMember && isScrollingDown) || (isFirstMember && isScrollingUp)) {
      return;
    }
    
    // Evitar múltiplos eventos
    const now = Date.now();
    if (now - lastScrollTime < 500 || isScrolling) return;
    
    isScrolling = true;
    lastScrollTime = now;
    
    if (isScrollingDown) {
      if (activeIndex < membros.length - 1) {
        e.preventDefault();
        showMembro(activeIndex + 1);
      }
    } else {
      if (activeIndex > 0) {
        e.preventDefault();
        showMembro(activeIndex - 1);
      }
    }
    
    setTimeout(() => {
      isScrolling = false;
    }, 500);
  }, { passive: false });
  
  // Navegação com teclado
  document.addEventListener('keydown', function(e) {
    if (!animacaoIniciada) return;
    
    const rect = equipeSection.getBoundingClientRect();
    const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
    
    if (!isInView) return;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      if (activeIndex < membros.length - 1) {
        e.preventDefault();
        showMembro(activeIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      if (activeIndex > 0) {
        e.preventDefault();
        showMembro(activeIndex - 1);
      }
    }
  });
  
  // Atualizar posição do menu no redimensionamento
  window.addEventListener('resize', function() {
    if (animacaoIniciada) {
      posicionarMenu(activeIndex);
    }
  });
});