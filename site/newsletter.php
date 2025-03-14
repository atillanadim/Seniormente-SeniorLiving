<?php
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Seniormente <$from_email>" . "\r\n";
$headers .= "Reply-To: $admin_email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Configurações
$host = "ispconfig.virkantzia.com"; // Servidor do banco de dados
$username = "c12seniorm"; // Usuário do banco de dados
$password = "nxxGR4_sL3G"; // Senha do banco de dados
$dbname = "c12emails"; // Nome do banco de dados
$table = "newsletter_subscribers"; // Nome da tabela

// Configurações de email
$admin_email = "geral@seniormente.com"; // Email para receber notificações
$from_email = "ana@seniormente.com"; // Email de envio
$site_name = "Seniormente"; // Nome do seu site

// Caminhos para os almanaques (URLs completas)
$almanaques = [
    "Março" => "https://seniormente.com/almanaques/almanaque-seniormente-marco.pdf",
    "Fevereiro" => "https://seniormente.com/almanaques/Almanaque sénior fev25.pdf"
  
];

// Inicializa a resposta
$response = [
    "success" => false,
    "message" => ""
];

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Obtém o email do formulário e remove espaços extras
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    
    // Valida o email
    if (empty($email)) {
        $response["message"] = "Por favor, informe seu email.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["message"] = "Por favor, informe um email válido.";
    } else {
        // Conecta ao banco de dados
        try {
            $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Verifica se o email já existe
            $stmt = $conn->prepare("SELECT id FROM $table WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                // Email já cadastrado
                $response["message"] = "Este email já está cadastrado em nossa newsletter.";
                $response["success"] = true; // Consideramos sucesso para não revelar informações
            } else {
                // Gera um token único para confirmação
                $token = md5(uniqid(rand(), true));
                $date = date('Y-m-d H:i:s');
                
                // Insere o novo assinante
                $stmt = $conn->prepare("INSERT INTO $table (email, token, created_at) VALUES (:email, :token, :created_at)");
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':token', $token);
                $stmt->bindParam(':created_at', $date);
                $stmt->execute();
                
                // Envia email de confirmação com os links dos almanaques
                $subject = "Bem-vindo à Newsletter do $site_name";
                
                // Constrói o corpo do email com os links para os almanaques
                $message = "<html><body>";
                $message .= "<h2>Obrigado por se inscrever em nossa newsletter!</h2>";
                $message .= "<p>Agora você receberá atualizações sobre nossos novos almanaques e conteúdos.</p>";
                $message .= "<h3>Conforme prometido, aqui estão os links para nossos almanaques:</h3>";
                $message .= "<ul>";
                
                foreach ($almanaques as $titulo => $link) {
                    $message .= "<li><a href='$link'>$titulo</a></li>";
                }
                
                $message .= "</ul>";
                $message .= "<p>Se você não solicitou esta inscrição, por favor ignore este email.</p>";
                $message .= "<p>Atenciosamente,<br>Equipe $site_name</p>";
                $message .= "</body></html>";
                
                // Cabeçalhos para envio de email HTML
                $headers = "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                $headers .= "From: $site_name <$from_email>" . "\r\n";
                
                // Envia o email
                if (mail($email, $subject, $message, $headers)) {
                    // Notifica o administrador
                    $admin_subject = "Nova inscrição na newsletter";
                    $admin_message = "Um novo usuário se inscreveu na newsletter: $email";
                    mail($admin_email, $admin_subject, $admin_message, "From: $from_email");
                    
                    $response["success"] = true;
                    $response["message"] = "Inscrição realizada com sucesso! Verifique seu email para acessar os almanaques.";
                } else {
                    $response["message"] = "Não foi possível enviar o email de confirmação. Por favor, tente novamente mais tarde.";
                }
            }
        } catch(PDOException $e) {
            // Erro de banco de dados
            $response["message"] = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";
            // Log do erro (não mostrar ao usuário)
            error_log("Erro de banco de dados: " . $e->getMessage());
        }
        
        // Fecha a conexão
        $conn = null;
    }
}

// Retorna a resposta como JSON se for uma requisição AJAX
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscrição na Newsletter</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .message {
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .btn {
            display: inline-block;
            background-color: #125f6b;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Inscrição na Newsletter</h1>
    
    <?php if ($_SERVER["REQUEST_METHOD"] == "POST"): ?>
        <div class="message <?php echo $response['success'] ? 'success' : 'error'; ?>">
            <?php echo $response['message']; ?>
        </div>
        
        <a href="viver-melhor.html" class="btn">Voltar para a página Viver Melhor</a>
    <?php else: ?>
        <p>Por favor, use o formulário na página Viver Melhor para se inscrever na nossa newsletter.</p>
        <a href="viver-melhor.html" class="btn">Ir para a página Viver Melhor</a>
    <?php endif; ?>
</body>
</html>

