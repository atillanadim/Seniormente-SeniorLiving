document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[name="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (!emailInput || !emailInput.value.trim()) {
                alert('Por favor, insira um email válido.');
                return;
            }
            
            // Desabilita o botão durante o envio
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            // Cria um objeto FormData
            const formData = new FormData(this);
            
            // Envia a requisição AJAX
            fetch('newsletter.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(data => {
                let responseData;
                
                // Tenta interpretar como JSON
                try {
                    responseData = JSON.parse(data);
                } catch (e) {
                    // Se não for JSON, verifica se contém alguma mensagem de sucesso
                    if (data.includes('sucesso')) {
                        responseData = { success: true, message: 'Inscrição realizada com sucesso!' };
                    } else {
                        responseData = { success: false, message: 'Ocorreu um erro ao processar sua solicitação.' };
                    }
                }
                
                // Cria um elemento para exibir a mensagem
                const messageEl = document.createElement('div');
                messageEl.className = responseData.success ? 'mensagem-sucesso' : 'mensagem-erro';
                messageEl.textContent = responseData.message;
                
                // Remove mensagens anteriores
                const oldMessages = document.querySelectorAll('.mensagem-sucesso, .mensagem-erro');
                oldMessages.forEach(msg => msg.remove());
                
                // Insere a mensagem após o formulário
                form.after(messageEl);
                
                // Limpa o formulário se for sucesso
                if (responseData.success) {
                    form.reset();
                }
                
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.textContent = 'Inscrever-se';
                
                // Remove a mensagem após 5 segundos
                setTimeout(() => {
                    messageEl.remove();
                }, 5000);
            })
            .catch(error => {
                console.error('Erro:', error);
                
                // Exibe mensagem de erro
                const messageEl = document.createElement('div');
                messageEl.className = 'mensagem-erro';
                messageEl.textContent = 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.';
                
                // Remove mensagens anteriores
                const oldMessages = document.querySelectorAll('.mensagem-sucesso, .mensagem-erro');
                oldMessages.forEach(msg => msg.remove());
                
                form.after(messageEl);
                
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.textContent = 'Inscrever-se';
            });
        });
    }
});