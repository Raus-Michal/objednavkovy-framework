<?php
// Cesta k JSON souboru
$jsonFilePath = "rezervace/rezervace.json"; // soubor, kde jsou rezervace

// Ověří, zda soubor existuje
if (file_exists($jsonFilePath)) {
$jsonData = file_get_contents($jsonFilePath);  // načtení JSON souboru
} else {
// Pokud soubor neexistuje, vytvoří prázdný JSON soubor ve správné struktuře
$jsonData = json_encode(["data" => []]); // Prázdné pole v rámci klíče 'data'
}

// Nastavení hlavičky a odeslání JSON dat
header("Content-Type: application/json");
echo $jsonData;
?>
