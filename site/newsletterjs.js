document.addEventListener("DOMContentLoaded", () => {
    // Procura pelo botão de assinar em qualquer formulário de newsletter
    const subscribeButtons = document.querySelectorAll('button, input[type="submit"]')
    let subscribeButton = null
  
    // Encontra o botão com o texto "Assinar"
    for (let i = 0; i < subscribeButtons.length; i++) {
      const btn = subscribeButtons[i]
      if (btn.textContent.trim() === "Assinar" || btn.value === "Assinar") {
        subscribeButton = btn
        break
      }
    }
  
    if (subscribeButton) {
      // Encontra o formulário pai do botão
      const form = subscribeButton.closest("form")
  
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault()
  
          // Encontra o campo de email no formulário
          const emailInput = form.querySelector('input[type="email"], input[name="email"]')
  
          if (!emailInput || !emailInput.value.trim()) {
            // Cria uma mensagem de erro estilizada em vez de um alert
            showMessage("Por favor, insira um email válido.", false)
            return
          }
  
          // Valida o formato do email
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailPattern.test(emailInput.value.trim())) {
            showMessage("Por favor, insira um email válido.", false)
            return
          }
  
          // Desabilita o botão durante o envio
          subscribeButton.disabled = true
          const originalText = subscribeButton.textContent || subscribeButton.value
          subscribeButton.textContent = subscribeButton.value = "Enviando..."
  
          // Cria um objeto FormData
          const formData = new FormData(form)
  
          // Envia a requisição AJAX
          fetch("newsletter.php", {
            method: "POST",
            body: formData,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          })
            .then((response) => response.text())
            .then((data) => {
              let responseData
  
              // Tenta interpretar como JSON
              try {
                responseData = JSON.parse(data)
              } catch (e) {
                // Se não for JSON, verifica se contém alguma mensagem de sucesso
                if (data.includes("sucesso")) {
                  responseData = {
                    success: true,
                    message: "Inscrição realizada com sucesso! Verifique seu email para confirmar.",
                  }
                } else {
                  responseData = { success: false, message: "Ocorreu um erro ao processar sua solicitação." }
                }
              }
  
              // Exibe a mensagem
              showMessage(responseData.message, responseData.success)
  
              // Limpa o formulário se for sucesso
              if (responseData.success) {
                form.reset()
              }
  
              // Restaura o botão
              subscribeButton.disabled = false
              subscribeButton.textContent = subscribeButton.value = originalText
            })
            .catch((error) => {
              console.error("Erro:", error)
  
              // Exibe mensagem de erro
              showMessage("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.", false)
  
              // Restaura o botão
              subscribeButton.disabled = false
              subscribeButton.textContent = subscribeButton.value = originalText
            })
        })
      }
    }
  
    // Função para exibir mensagens estilizadas
    function showMessage(message, isSuccess) {
      // Remove mensagens anteriores
      const oldMessages = document.querySelectorAll(".mensagem-sucesso, .mensagem-erro")
      oldMessages.forEach((msg) => msg.remove())
  
      // Cria o elemento de mensagem
      const messageEl = document.createElement("div")
      messageEl.className = isSuccess ? "mensagem-sucesso" : "mensagem-erro"
  
      // Estiliza a mensagem
      messageEl.style.padding = "10px 15px"
      messageEl.style.marginTop = "10px"
      messageEl.style.borderRadius = "5px"
      messageEl.style.fontSize = "14px"
      messageEl.style.fontWeight = "500"
      messageEl.style.textAlign = "center"
      messageEl.style.width = "100%"
      messageEl.style.maxWidth = "100%"
  
      if (isSuccess) {
        messageEl.style.backgroundColor = "#e8f5e9"
        messageEl.style.color = "#125f6b" // Cor do site
        messageEl.style.border = "1px solid #a5d6a7"
      } else {
        messageEl.style.backgroundColor = "#ffebee"
        messageEl.style.color = "#c62828"
        messageEl.style.border = "1px solid #ef9a9a"
      }
  
      messageEl.textContent = message
  
      // Encontra onde inserir a mensagem
      const subscribeButtons = document.querySelectorAll('button, input[type="submit"]')
      let form = null
  
      for (let i = 0; i < subscribeButtons.length; i++) {
        const btn = subscribeButtons[i]
        if (btn.textContent.trim() === "Assinar" || btn.value === "Assinar") {
          form = btn.closest("form")
          break
        }
      }
  
      if (form) {
        form.after(messageEl)
      }
  
      // Remove a mensagem após 5 segundos com fade out
      setTimeout(() => {
        messageEl.style.opacity = "1"
        messageEl.style.transition = "opacity 0.5s ease"
  
        setTimeout(() => {
          messageEl.style.opacity = "0"
          setTimeout(() => messageEl.remove(), 500)
        }, 4500)
      }, 100)
    }
  })
  
  