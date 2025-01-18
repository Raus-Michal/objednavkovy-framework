<?php
// Inicializace proměnných pro odpověď
$status = 'success'; // Výchozí hodnota
$message = 'nebyla dodána zpráva'; // Zpráva, která bude odeslána
$httpCode = 200; // Výchozí HTTP kód odpovědi

include "defense/token.php"; // ověření tokenu, pokud nebude token origin, funkce se zastaví
include "defense/rate-limit-2.php"; // maximální počet přístupů 3 za 24 hod.
include "rezervace/vymaz-rezervace.php"; // zajistí vymazání rezervace z JSON souboru
include "rezervace/rozeslat-emaily-2.php"; // postará se o rozeslání emailu tomu kdo rezervaci zrušil a mně

// Pokud všechny operace byly úspěšné, vrátíme odpověď o úspěchu
$message = 'Vše ok'; // Zpráva, která bude odeslána
http_response_code($httpCode);
echo json_encode(['status' => $status, 'message' => $message]);

?>