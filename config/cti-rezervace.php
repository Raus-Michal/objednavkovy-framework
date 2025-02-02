<?php
// Cesta k JSON souboru
$jsonFilePath = "rezervace/rezervace.json"; // soubor, kde jsou rezervace

// Ověří, zda soubor existuje
if (file_exists($jsonFilePath)) {
    $jsonData = file_get_contents($jsonFilePath);  // načtení JSON souboru
    $data = json_decode($jsonData, true); // dekódování JSON do pole
} else {
    // Pokud soubor neexistuje, vytvoří prázdný JSON soubor ve správné struktuře
    $data = ["data" => []]; // Prázdné pole v rámci klíče "data"
    file_put_contents($jsonFilePath, json_encode($data)); // soubor bude obsahovat prázdné pole s klíčem "data"
}

// Získání dnešního data
$today = new DateTime();

// Filtrování záznamů starších než dnešní den
$data["data"] = array_filter($data["data"], function($record) use ($today) {
    $recordDate = new DateTime();
    $recordDate->setDate($record["rok"], $record["mesic"] + 1, $record["den"]); // mesic + 1 -> V JavaScriptu objekt Date indexuje měsíce od 0 do 11, kde 0 je leden a 11 je prosinec.
    return $recordDate >= $today;
});


$data["data"] = array_values($data["data"]); // Resetování indexů, aby byly sekvenční (stejná struktura JSON ve kterých jsou data zapisována a očekávána Java scriptem)

// Uložení aktualizovaných dat zpět do JSON souboru
file_put_contents($jsonFilePath, json_encode($data));

// Nastavení hlavičky a odeslání JSON dat
header("Content-Type: application/json");
echo json_encode($data);
?>
