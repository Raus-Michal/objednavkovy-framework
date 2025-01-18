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
$method = "aes-256-ecb";
    
// Vytvoření šifrovacího klíče z hesla pomocí SHA-256 hash funkce
$key = substr(hash("sha256", $code, true), 0, 32);

// Dekódování šifrovaného tokenu z base64
$encryptedToken = base64_decode($encryptedToken);

// Dešifrování tokenu pomocí klíče a algoritmu AES-256-ECB
return openssl_decrypt($encryptedToken, $method, $key, OPENSSL_RAW_DATA);
}




function check_token($json, $hledany_token, $code)
{

foreach ($json["data"] as $entry){
// smyška projde všechny záznamy rezervací

$decrypted_token=decryptToken($entry["encrypted_token"],$code); // Zavolání funkce pro dešifrování tokenu

if(!$decrypted_token)
{
// pokud se nepodařilo dešifrovat token
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Není dešifrovaný token!" . $decrypted_token]); // Odesíláme chybovou odpověď
exit;
}

if ($decrypted_token === $hledany_token){
// pokud došlo u některého ze záznamů ke shodě tokenů
return [(int)$entry["rok"],(int)$entry["mesic"],(int)$entry["den"],(int)$entry["cas_rezervace"],$entry["encrypted_token"]]; // pole s rokem, mesíce 0-11, dne, číslo času 1-14 a zakódovaný token rezervace
}
}
return false; // Pokud nedojde ke shodě, vrátíme false
}


// Funkce pro načtení obsahu souboru
function load_json_file($filename) {
if (file_exists($filename)) {
// pokud soubor existuje
return json_decode(file_get_contents($filename), true); // vrátí jeho data
} else {
// pokud soubor neexistuje
echo json_encode(["status" => "error", "message" => "Soubor s rezervacemi neexistuje!"]); // Odesíláme chybovou odpověď
exit;
}
}


// Příjem dat z POST požadavku
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["search"]))
{
// pokud byla použita metoda POST a byl zaslán search
$search=$_POST["search"]; // search zaslaný z webu
// Načtení existujících dat
$data = load_json_file($filename); // načtení dat z JSON souboru
$shoda = check_token($data,$search,$password); // projde všechny záznamy a bude hledat shodu search se záznamem, shoda = shoda tokenu, který byl zapsán při rezervaci

if($shoda)
{
// pokud byl nalezen záznam, který se shoduje
echo json_encode(["status" => "success", "message" => $shoda]); // OK - Odesíláme odpověď: pole s rokem, mesíce 0-11, dne, číslo času 1-14 a zakódovaný token rezervace= [(int)$entry["rok"],(int)$entry["mesic"],(int)$entry["den"],(int)$entry["cas_rezervace"],$entry["encrypted_token"]];
exit;
}
else
{
// pokud nebyl nalezen záznam, který se shoduje
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Žádný z rezervovaných záznamů se neshoduje s požadavkem z webu!"]); // Odesíláme chybovou odpověď
exit;
}

}
else
{
// pokud nedošly data od PHP
http_response_code(400); // Nastaví odpovídající HTTP kód
echo json_encode(["status" => "error", "message" => "Nedorazil search do PHP!"]); // Odesíláme chybovou odpověď
exit;
}
?>
