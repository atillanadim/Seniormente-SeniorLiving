<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Captura e sanitiza os dados do formulário
    $nome = htmlspecialchars($_POST["nome"]);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $telefone = htmlspecialchars($_POST["telefone"]);
    $nome_idoso = htmlspecialchars($_POST["nome-idoso"]);
    $idade = htmlspecialchars($_POST["idade"]);
    $concelho = htmlspecialchars($_POST["concelho"]);
    $freguesia = htmlspecialchars($_POST["freguesia"]);
    $necessidades = htmlspecialchars($_POST["necessidades"]);

    // E-mail para onde será enviado
    $destino = "seu-email@seudominio.com"; // 🛑 ALTERE PARA SEU E-MAIL REAL
    $assunto = "Novo Contato - Clínica de Gerontologia";

    // Corpo do e-mail
    $mensagem = "
        <html>
        <head>
            <title>Novo Contato</title>
        </head>
        <body>
            <h2>Detalhes do Contato</h2>
            <p><strong>Nome:</strong> $nome</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Telefone:</strong> $telefone</p>
            <p><strong>Nome do Idoso:</strong> $nome_idoso</p>
            <p><strong>Idade do Idoso:</strong> $idade anos</p>
            <p><strong>Concelho:</strong> $concelho</p>
            <p><strong>Freguesia:</strong> $freguesia</p>
            <p><strong>Necessidades:</strong> $necessidades</p>
        </body>
        </html>
    ";

    // Cabeçalhos do e-mail
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: $email" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    // Envio do e-mail
    if (mail($destino, $assunto, $mensagem, $headers)) {
        echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Erro ao enviar a mensagem.'); window.location.href='index.html';</script>";
    }
} else {
    echo "Acesso negado.";
}
?>
