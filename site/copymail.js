function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('E-mail copiado: ' + text);
    }, function(err) {
        console.error('Erro ao copiar: ', err);
    });
}