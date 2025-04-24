<?php

function responder($response)
{
    $response["message"] = utf8_encode($response["message"]);
    error_log(json_encode($response));
    echo json_encode($response);
}

header("Content-Type: application/json");



// Configurações
$host = "host2.virkantzia.com"; // Servidor do banco de dados
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
    "Abril" => "https://seniormente.com/almanaques/Almanaque sénior abr25.pdf",
    "Março" => "https://seniormente.com/almanaques/almanaque-seniormente-marco.pdf",
    "Fevereiro" => "https://seniormente.com/almanaques/Almanaque sénior fev25.pdf",
    "Janeiro" => "https://seniormente.com/almanaques/Almanaque sénior jan25.pdf"

    
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
        http_response_code(412);
        $response["message"] = "Por favor, informe seu email.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(412);
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

                // Construa o link de cancelamento
                $cancel_link = "https://seniormente.com/cancelar.php?email=$email";
                // Envia email de confirmação com os links dos almanaques
                $subject = "Bem-vindo à Newsletter do $site_name";
                
                // Constrói o corpo do email com os links para os almanaques
                $message = "<html><body>";
                $message .= "<h2>Obrigado por se inscrever na nossa newsletter!</h2>";
                $message .= "<p>Agora receberá atualizações sobre os nossos novos almanaques e conteúdos.</p>";
                $message .= "<h3>Conforme prometido, aqui estão os links para nossos almanaques:</h3>";
                $message .= "<ul>";
                
                foreach ($almanaques as $titulo => $link) {
                    $message .= "<li><a href='$link'>$titulo</a></li>";
                }
                
                $message .= "</ul>";
                $message .= "<p>Se desejar cancelar a assinatura, clique no link abaixo:</p>";
                $message .= "<p><a href='$cancel_link'>Cancelar inscrição</a></p>";
                $message .= "<p>Os melhores cumprimentos,<br>Equipa $site_name</p>";
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
                   // mail($admin_email, $admin_subject, $admin_message, "From: $from_email");
                    
                    $response["success"] = true;
                    $response["message"] = "Inscrição realizada com sucesso! Verifique seu email para acessar os almanaques.";
                } else {
                    $response["message"] = "Não foi possível enviar o email de confirmação. Por favor, tente novamente mais tarde.";
                }
            }
        } catch(PDOException $e) {
            http_response_code(412);
            // Erro de banco de dados
            $response["message"] = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";
            // Log do erro (não mostrar ao usuário)
            error_log("Erro de banco de dados: " . $e->getMessage());
        } catch(Exception $e) {
            http_response_code(412);
            // Erro de banco de dados
            $response["message"] = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";
            // Log do erro (não mostrar ao usuário)
            error_log("Erro generico: " . $e->getMessage());
        }
        
        // Fecha a conexão
        $conn = null;
        
    }
    responder($response);
}



?>
