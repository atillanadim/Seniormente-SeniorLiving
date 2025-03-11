
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Aqui você pode adicionar o código para enviar o formulário
            // Por exemplo, usando fetch para enviar para seu backend
            
            // Simulação de envio
            const submitButton = form.querySelector('.submit-button');
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                form.reset();
                submitButton.textContent = 'Enviar Mensagem';
                submitButton.disabled = false;
            }, 1500);
        });
        
        // Validação do número de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 9) value = value.slice(0, 9);
                e.target.value = value;
            });
        }
        
        // Validação da idade
        const idadeInput = document.getElementById('idade');
        if (idadeInput) {
            idadeInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value < 0) value = 0;
                if (value > 120) value = 120;
                e.target.value = value;
            });
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", function () {
            window.location.href = "servicos.html"; // Coloque o link da página correta
        });
    });
});
