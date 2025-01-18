<?php

include "defense/sifrovaci-heslo.php"; // Načtení hesla - $password

if(!$password)
{
echo json_encode(["status" => "error", "message" => "Heslo pro šifrování tokenu nebylo načteno!"]); // Odesíláme chybovou odpověď
exit;
}

// Funkce pro šifrování tokenu pomocí hesla
function encryptToken($token, $password) {
// Použitý šifrovací algoritmus
$method = "aes-256-ecb";
// Vytvoření šifrovacího klíče z hesla pomocí SHA-256 hash funkce
$key = substr(hash("sha256", $password, true), 0, 32);
    
// Šifrování tokenu pomocí klíče a algoritmu AES-256-ECB
$encryptedToken = openssl_encrypt($token, $method, $key, OPENSSL_RAW_DATA);
    
// Vrácení šifrovaného tokenu zakódovaného do base64
return base64_encode($encryptedToken);
}

// Funkce pro načtení obsahu souboru
function load_json_file($filename)
{
if (file_exists($filename)) {
// pokud soubor existuje
return json_decode(file_get_contents($filename), true); // vrátí jeho data
} else {
// pokud soubor neexistuje
return ["data" => []]; // vrátí prázdné pole pod klíčem "data"
}
}

// Funkce pro uložení obsahu do souboru
function save_json_file($filename, $data)
{
// Zajištění, že struktura je správná
$output = ["data" => $data]; // Data jsou obalena do objektu s klíčem "data"
file_put_contents($filename, json_encode($output, JSON_PRETTY_PRINT)); // uloží data do JSON souboru
}


$filename = "rezervace/rezervace.json"; // Název souboru JSON


$data = load_json_file($filename); // Načtení existujících dat

// Příjem dat z POST požadavku
if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["data_json"]))
{

$received_data = json_decode(urldecode($_POST["data_json"]), true); // dekódování přijatých dat type JSON

if($received_data && count($received_data) === 5)
{
// pokud budou zaslána data v požadovaném počtu, dojde k jejich ořezání na bezpečnou délku
$rok = (int)substr($received_data[0], 0, 4); // 4 znaky
$mesic = (int)substr($received_data[1], 0, 2); // 2 znaky
$den = (int)substr($received_data[2], 0, 2); // 2 znaky
$cas_rezervace = (int)substr($received_data[3], 0, 2); // 2 znaky
$token = substr($received_data[4], 0, 32); // Token omezen na 32 znaků



$encrypted_token = encryptToken($token, $password); // Šifrování tokenu

$new_entry = [
"rok" => $rok,
"mesic" => $mesic,
"den" => $den,
"cas_rezervace" => $cas_rezervace,
"encrypted_token" => $encrypted_token
];

$data["data"][] = $new_entry; // Přidání nové hodnoty do existujících dat

// Uložení dat do souboru s obalem "data"
save_json_file($filename, $data["data"]); // Předáváme pouze obsah pole "data"
}
else
{
// Chybná data
$status = "error";
$message = "Chybná data. Zápis rezervace do json se nezdařil.";
$httpCode = 400; // Kód pro špatný požadavek
}
}
else
{
// Chybný požadavek
$status = "error";
$message = "Chybná data zaslána na zpracování rezervace pro JSON.";
$httpCode = 400; // Kód pro špatný požadavek
}

// Pokud je status "error", nastavíme odpověď pro chybu
if ($status === "error")
{
http_response_code($httpCode); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => $status, "message" => $message]); // Odesíláme chybovou odpověď
exit; // Ukončí skript
}

?>
