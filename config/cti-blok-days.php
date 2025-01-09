<?php
// Načtení obsah JSON souboru
$jsonFilePath ="block-day/block-days.json";
$jsonData=file_get_contents($jsonFilePath);
// Nastavení hlavičky a odeslání JSON data
header('Content-Type: application/json');
echo $jsonData;
?>