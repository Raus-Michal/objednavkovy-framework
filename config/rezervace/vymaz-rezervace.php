<?php
include "defense/sifrovaci-heslo.php"; // Načtení hesla - $password

if(!$password)
{
echo json_encode(["status" => "error", "message" => "Heslo pro šifrování tokenu nebylo načteno!"]); // Odesíláme chybovou odpověď
exit;
}

$filename = "rezervace/rezervace.json"; // soubor, kde jsou rezervace

// Funkce pro kontrolu tokenu a nalezení shody
function check_token($zaznamy, $retezec, $encryption_key)
{
foreach ($zaznamy["data"] as $index => $entry) {
// Dekódujeme inicializační vektor (IV)
$iv = base64_decode($entry["iv"]);
// Dešifrujeme token
$decrypted_token = openssl_decrypt($entry["encrypted_token"], "aes-256-cbc", $encryption_key, 0, $iv);
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
echo json_encode(["status" => "error", "message" => "Nepodařilo se uložit data!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}
}

// Zpracování POST požadavku
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["encrypted_token"])) { // Zkontrolujeme, zda byla použita metoda POST a zda je nastavena proměnná search

$encrypted_token = $_POST["encrypted_token"]; // Uložíme hodnotu search

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
echo json_encode(["status" => "error", "message" => "Žádný ze záznamů se neshoduje s požadavkem z webu!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}
}
else 
{
echo json_encode(["status" => "error", "message" => "Nedorazil encrypted_token do PHP!"]); // Odesíláme chybovou odpověď
exit; // Ukončíme skript
}

?>