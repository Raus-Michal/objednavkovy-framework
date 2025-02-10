<?php
// PHP soubor ověří jestli požadavek na rezervaci není již duplicitní, tedy pokud již někdo daná rok,měsíc a čas nezadal. Pokud někdo zadal již tento termín pošle zpět ERORR proS na zpracování

$filename = "rezervace/rezervace.json"; // Název souboru JSON

// Funkce pro načtení obsahu souboru
function load_json_file1($filename)
{
if (file_exists($filename)) {
// pokud soubor existuje
return json_decode(file_get_contents($filename), true); // vrátí jeho data
} else {
// pokud soubor neexistuje
return ["data" => []]; // vrátí prázdné pole pod klíčem "data"
}
}

// Příjem dat z POST požadavku
if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["data_json"]))
{
// pokud byla zaslána data: data_json 

$data1 = load_json_file1($filename); // Načtení existujících dat

$received_data1 = json_decode(urldecode($_POST["data_json"]), true); // dekódování přijatých dat type JSON

$rok = (int)substr($received_data1[0], 0, 4); // 4 znaky
$mesic = (int)substr($received_data1[1], 0, 2); // 2 znaky
$den = (int)substr($received_data1[2], 0, 2); // 2 znaky
$cas_rezervace = (int)substr($received_data1[3], 0, 2); // 2 znaky



// Zkontrolujte, zda data již existují
$duplicate = false;
foreach($data1["data"] as $entry)
{
if($entry["rok"] === $rok && $entry["mesic"] === $mesic && $entry["den"] === $den && $entry["cas_rezervace"] === $cas_rezervace)
{
$duplicate = true;
break;
}
}

if ($duplicate)
{
// Pokud duplikát existuje, vrátit chybovou hlášku, kterou odchytí Java Script
$status = "error";
$message = "Data již existují.";
}


}
else
{
// Chybný požadavek
$status = "error";
$message = "Nebyla zaslána data: data_json pomocí POST.";
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