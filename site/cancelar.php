<?php
// Database configuration
$host = "host2.virkantzia.com";
$username = "c12seniorm";
$password = "nxxGR4_sL3G";
$dbname = "c12emails";
$table = "newsletter_subscribers";

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to display message with consistent styling
function displayMessage($message, $isError = false) {
    $color = $isError ? "#dc3545" : "#125f6b"; // Changed success color to match site theme
    $icon = $isError ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    
    echo "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Seniormente - Cancelamento de Newsletter</title>
        <link rel='preconnect' href='https://fonts.googleapis.com'>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
        <link href='https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;700&display=swap' rel='stylesheet'>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f0e8;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .container {
                width: 100%;
                max-width: 1200px;
                padding: 0 20px;
                margin: 0 auto;
            }
            
            .message-box {
                max-width: 600px;
                margin: 40px auto;
                padding: 40px 30px;
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .logo {
                margin-bottom: 30px;
            }
            
            .logo img {
                max-width: 200px;
                height: auto;
            }
            
            .icon {
                color: $color;
                margin-bottom: 20px;
            }
            
            h1 {
                color: #125f6b;
                font-size: 2rem;
                margin-bottom: 20px;
                font-weight: 700;
            }
            
            .message {
                color: #333;
                font-size: 1.1rem;
                margin-bottom: 30px;
                line-height: 1.5;
            }
            
            .highlight {
                color: $color;
                font-weight: 500;
            }
            
            .home-link {
                display: inline-block;
                margin-top: 10px;
                padding: 12px 25px;
                background: #125f6b;
                color: white;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 500;
                transition: background-color 0.3s ease;
                border: none;
                cursor: pointer;
                font-size: 1rem;
            }
            
            .home-link:hover {
                background: #e67e22;
            }
            
            /* Responsiveness */
            @media (max-width: 768px) {
                .message-box {
                    margin: 30px auto;
                    padding: 30px 20px;
                }
                
                h1 {
                    font-size: 1.8rem;
                }
                
                .message {
                    font-size: 1rem;
                }
            }
            
            @media (max-width: 480px) {
                .message-box {
                    margin: 20px auto;
                    padding: 25px 15px;
                }
                
                h1 {
                    font-size: 1.6rem;
                    margin-bottom: 15px;
                }
                
                .icon svg {
                    width: 50px;
                    height: 50px;
                }
                
                .message {
                    font-size: 0.95rem;
                    margin-bottom: 25px;
                }
                
                .home-link {
                    padding: 10px 20px;
                    font-size: 0.95rem;
                }
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='message-box'>
                <div class='logo'>
                    <!-- If you have a logo image, uncomment and update the path -->
                    <!-- <img src='https://seniormente.com/path-to-logo.png' alt='Seniormente Logo'> -->
                    <h1>Seniormente</h1>
                </div>
                <div class='icon'>$icon</div>
                <div class='message'>" . 
                    ($isError ? 
                    "<span class='highlight'>Ops!</span> $message" : 
                    "<span class='highlight'>Pronto!</span> $message") . 
                "</div>
                <a href='https://seniormente.com' class='home-link'>Voltar para o site</a>
            </div>
        </div>
    </body>
    </html>";
    exit;
}

try {
    // Check if email is provided
    if (!isset($_GET['email']) || empty($_GET['email'])) {
        displayMessage("email não fornecido. Não é possível processar o cancelamento.", true);
    }
    
    $email = $_GET['email'];
    
    // Connect to database
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get email by email first (for logging purposes)
    $stmt = $conn->prepare("SELECT email FROM $table WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $email = $row['email'];
        
        // Delete the subscription
        $deleteStmt = $conn->prepare("DELETE FROM $table WHERE email = :email");
        $deleteStmt->bindParam(':email', $email);
        $deleteStmt->execute();
        
        // Log cancellation (optional)
        $logFile = "cancellation_log.txt";
        $logMessage = date('Y-m-d H:i:s') . " - Cancelamento: $email (email: $email)\n";
        @file_put_contents($logFile, $logMessage, FILE_APPEND);
        
        displayMessage("Sua assinatura foi cancelada com sucesso. Não enviaremos mais emails para <strong>$email</strong>.");
    } else {
        displayMessage("email inválido ou assinatura já cancelada anteriormente.", true);
    }
} catch(PDOException $e) {
    // Log the error but don't display database details to users
    error_log("Database Error in cancelar.php: " . $e->getMessage());
    displayMessage("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde ou entre em contato com nosso suporte.", true);
}
?>

