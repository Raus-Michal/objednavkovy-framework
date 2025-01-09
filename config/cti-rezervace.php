<?php
// Cesta k JSON souboru
$jsonFilePath = "rezervace/rezervace.json";

// Ověří, zda soubor existuje
if (file_exists($jsonFilePath)) {
    $jsonData = file_get_contents($jsonFilePath);  // načtení JSON souboru
} else {
    // Pokud soubor neexistuje, vytvoří prázdný JSON soubor
    $jsonData = json_encode(array()); // prázdé pole []
    file_put_contents($jsonFilePath, $jsonData);  // soubor bude obsahovat prázdné pole[]
}

// Nastavení hlavičky a odeslání JSON dat
header('Content-Type: application/json');
echo $jsonData;
?>
