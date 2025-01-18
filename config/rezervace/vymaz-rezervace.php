<?php
include "defense/sifrovaci-heslo.php"; // Načtení hesla - $password

if(!$password)
{
echo json_encode(["status" => "error", "message" => "Heslo pro šifrování tokenu nebylo načteno!"]); // Odesíláme chybovou odpověď
exit;
}

$filename = "rezervace/rezervace.json"; // soubor, kde jsou rezervace

// Funkce pro dešifrování tokenu pomocí hesla
function decryptToken($encryptedToken, $code) {
// Použitý šifrovací algoritmus
$method = 'aes-256-ecb';
    
// Vytvoření šifrovacího klíče z hesla pomocí SHA-256 hash funkce
$key = substr(hash('sha256', $code, true), 0, 32);

// Dekódování šifrovaného tokenu z base64
$encryptedToken = base64_decode($encryptedToken);
    
// Dešifrování tokenu pomocí klíče a algoritmu AES-256-ECB
return openssl_decrypt($encryptedToken, $method, $key, OPENSSL_RAW_DATA);
}


// Funkce pro kontrolu tokenu a nalezení shody
function check_token($zaznamy, $retezec, $code)
{
foreach ($zaznamy["data"] as $index => $entry) {
// smyška projde všechny záznamy rezervací

$decrypted_token=decryptToken($entry["encrypted_token"],$code); // Zavolání funkce pro dešifrování tokenu

if(!$decrypted_token)
{
// pokud se nepodařilo dešifrovat token
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Není dešifrovaný token!" . $decrypted_token]); // Odesíláme chybovou odpověď
exit;
}

// Porovnáme dešifrovaný token s textovým řetězcem
if ($decrypted_token === $retezec) {
// Vrátíme index záznamu a jeho data
return [
"index" => $index,
"data" => [(int)$entry["rok"], (int)$entry["mesic"], (int)$entry["den"], (int)$entry["cas_rezervace"], $entry["encrypted_token"]]
];
}
}
return false; // Pokud nedojde ke shodě, vrátíme false
}

// Funkce pro načtení obsahu souboru
function load_json_file($filename)
{
if (file_exists($filename)) { // Zkontrolujeme, zda soubor existuje
return json_decode(file_get_contents($filename), true); // Načteme a vrátíme data ze souboru
} else {
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Soubor s rezervacemi neexistuje!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}
}

// Funkce pro uložení dat do souboru
function save_json_file($filename, $data)
{
if (file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT))) { // Pokusíme se uložit data
return true; // Pokud se podaří, vrátíme true
} else {
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Nepodařilo se uložit data!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}
}

// Zpracování POST požadavku
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["encrypted_token"])) { // Zkontrolujeme, zda byla použita metoda POST a zda je nastavena proměnná search

$encrypted_token = $_POST["encrypted_token"]; // Uložíme hodnotu šifrovaného tokenu

$data = load_json_file($filename); // Načteme existující data

$shoda = check_token($data, $encrypted_token, $password); // Projdeme všechny záznamy a hledáme shodu
if($shoda)
{
// Pokud najdeme shodu

array_splice($data["data"], $shoda["index"], 1); // Odstraníme záznam z pole

save_json_file($filename, $data); // Uložíme aktualizovaná data zpět do souboru

echo json_encode(["status" => "success", "message" => "rezervace byla smazána"]); // Odesíláme úspěšnou odpověď

exit; // Ukončíme skript
}
else
{
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Žádný ze záznamů se neshoduje s požadavkem z webu!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}
}
else 
{
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Nedorazil encrypted_token do PHP!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}

?>