<?php
include "sifrovaci-heslo.php"; // načtení hesla
// Dešifrování tokenu
$data = json_decode(file_get_contents('tokens.json'), true);
$encrypted_token = $data['token'];
$iv = base64_decode($data['iv']);
$decryption_key = $password; // Tento klíč musí být stejný jako při šifrování
$decrypted_token = openssl_decrypt($encrypted_token, 'aes-256-cbc', $decryption_key, 0, $iv);

echo $decrypted_token;
?>