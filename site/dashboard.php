<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$stmt = $pdo->query('SELECT * FROM emails');
$emails = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="stylesheet" href="estilodash.css">
</head>
<body>
    <div class="container">
        <h1>Lista de E-mails</h1>
        <table>
            <thead>
                <tr>
                    <th>E-mail</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($emails as $email): ?>
                    <tr>
                        <td><?= htmlspecialchars($email['email']) ?></td>
                        <td><button onclick="copyToClipboard('<?= htmlspecialchars($email['email']) ?>')">Copiar</button></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <a href="logout.php">Sair</a>
    </div>
    <script src="copymail.js"></script>
</body>
</html>