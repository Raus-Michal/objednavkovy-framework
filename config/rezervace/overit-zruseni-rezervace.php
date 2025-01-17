<?php

include "defense/sifrovaci-heslo.php"; // Načtení hesla

$filename = "rezervace/rezervace.json"; // soubor, kde jsou rezervace


function check_token($zaznamy, $retezec, $encryption_key){
    // Procházíme data v poli "data"
    foreach ($zaznamy['data'] as $entry){
        // Dekódujeme inicializační vektor (IV)
        $iv = base64_decode($entry['iv']);
        
        // Dešifrujeme token
        $decrypted_token = openssl_decrypt($entry['encrypted_token'], 'aes-256-cbc', $encryption_key, 0, $iv); // dešifrování uloženého tokenu v záznamu
        
        // Porovnáme dešifrovaný token s textovým řetězcem
        if ($decrypted_token === $retezec){
            return $entry['encrypted_token']; // Vrátíme encrypted_token záznamu
        }
    }
    
    return false; // search se neshoduje se žádným záznamem
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
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['search'])) {
// pokud byla použita metoda POST a byl zaslán search

$search=$_POST['search']; // search zaslaný z webu

// Načtení existujících dat
$data = load_json_file($filename);


if(!$password)
{
echo json_encode(["status" => "error", "message" => "Heslo pro šifrování tokenu nebylo načteno!"]); // Odesíláme chybovou odpověď
exit;
}

$shoda = check_token($data,$search,$password); // projde všechny záznamy a bude hledat shodu search se záznamem

if($shoda)
{
// pokud byl nalezen záznam, který se shoduje
echo json_encode(["status" => "success", "message" => $shoda]); // Odesíláme odpověď - ok
exit;
}
else
{
// pokud nebyl nalezen záznam, který se shoduje
echo json_encode(["status" => "error", "message" => "Žádný ze záznamů se neshoduje s požadavkem z webu!"]); // Odesíláme chybovou odpověď
exit;
}


}
else
{
 // pokud nedošly data od PHP
echo json_encode(["status" => "error", "message" => "Nedorazil search do PHP!"]); // Odesíláme chybovou odpověď
exit;
}

?>