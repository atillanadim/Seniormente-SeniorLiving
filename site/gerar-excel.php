<?php
// filepath: /c:/Users/Lenovo/Documents/GitHub/Seniormente-SeniorLiving/site/gerar-excel.php

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=lista-emails-seniormente.csv');

// Configurações do banco de dados
$host = getenv("DB_HOST") ?: "host2.virkantzia.com";
$username = getenv("DB_USERNAME") ?: "c12seniorm";
$password = getenv("DB_PASSWORD") ?: "nxxGR4_sL3G";
$dbname = getenv("DB_NAME") ?: "c12emails";
$table = "newsletter_subscribers";

// Conectar ao banco de dados
$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Consultar os dados
$query = "SELECT email, created_at FROM $table ORDER BY created_at DESC";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $output = fopen('php://output', 'w');
    fputcsv($output, array('Email', 'Created At'));

    while ($row = $result->fetch_assoc()) {
        fputcsv($output, $row);
    }

    fclose($output);
} else {
    echo "Nenhum email encontrado no banco de dados.";
}

$conn->close();
?>