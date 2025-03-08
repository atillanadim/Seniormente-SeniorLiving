// Script para o footer
document.addEventListener('DOMContentLoaded', function() {
    // Botão de voltar ao topo
    const backToTopButton = document.getElementById('back-to-top');
    
    // Mostrar/esconder o botão de voltar ao topo
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Ação do botão de voltar ao topo
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Formulário de newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterEmail.value.trim();
            
            // Validação simples de email
            if (!isValidEmail(email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Simulação de envio (aqui você conectaria com seu backend)
            showMessage('Processando...', '');
            
            // Simulando uma requisição
            setTimeout(function() {
                showMessage('Obrigado! Você foi inscrito com sucesso.', 'success');
                newsletterEmail.value = '';
            }, 1500);
        });
    }
    
    // Função para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Função para mostrar mensagens
    function showMessage(text, type) {
        newsletterMessage.textContent = text;
        newsletterMessage.className = '';
        
        if (type) {
            newsletterMessage.classList.add(`${type}-message`);
        }
    }
    
    // Animação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});