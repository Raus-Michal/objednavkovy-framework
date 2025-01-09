<?php
// soubor slouží k ověření tokenu, zda požadavek na přijetí statistických dat přichází opravdu z našeho webu

session_start(); // Spouští relaci (session) pro uživatele. Session umožňuje ukládat data na straně serveru, která přetrvávají mezi jednotlivými požadavky od stejného uživatele.

// Ověření, zda byl POST požadavek odeslán s tokenem

// Ověření, zda byl POST požadavek odeslán s tokenem
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$csrfToken = $_POST['csrf_token'];

// Ověření, zda token v session souhlasí s tokenem zaslaným klientem
if (isset($_SESSION['csrf_token']) && $csrfToken === $_SESSION['csrf_token'] && strlen($csrfToken) === 32){
echo json_encode(['status' => 'success', 'message' => 'Token je platný. Ověření úspěšné.']);
} else {
http_response_code(403); // 403 Forbidden
echo json_encode(['status' => 'error', 'message' => 'Token je neplatný. Přístup zamítnut.']);
exit;
}
} else {
http_response_code(405); // 405 Method Not Allowed
echo json_encode(['status' => 'error', 'message' => 'Neplatný požadavek.']);
exit;
}



?>