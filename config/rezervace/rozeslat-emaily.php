<?php
/* ODESÍLÁNÍ EMAILU */

// Příjem dat z POST požadavku
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["data_email"]))
{

$received_data = json_decode(urldecode($_POST["data_email"]), true); // dekóduje data, která byla zaslána jako JSON

if ($received_data && count($received_data) === 9)
{
// Zkrácení všech stringů na 100 znaků
$jmeno = substr($received_data[0], 0, 100);
$email = substr($received_data[1], 0, 100);
$predvolba = substr($received_data[2], 0, 5);
$phone = substr($received_data[3], 0, 100);
$predmet = substr($received_data[4], 0, 100);
$datum_rezervace_slovne = substr($received_data[5], 0, 100);
$cas_rezervace_slovne = substr($received_data[6], 0, 100);
$cleanUrl = substr($received_data[7], 0, 100);
$token = substr($received_data[8], 0, 100);
} else {
$status = "error";
$message = "Chybné data pro edesílání emailu. Nejsou všechna! ";
http_response_code($httpCode);
echo json_encode(["status" => $status, "message" => $message]);
exit;
}
} else {
$status = "error";
$message = "Nebyly zaslány data pro odesílání emailů.";
http_response_code($httpCode);
echo json_encode(["status" => $status, "message" => $message]);
exit;
}

$adresat = "raus.michal@email.cz"; // emailová adresa, kam se má obsah zaslat

// Odesílatelské údaje z přijatých dat
$odesilatel_jmeno = $jmeno; // Získání jména odesílatele
$search="rezervace"; // přídavné slovo, které slouží k inicializaci požadavku - s tímto se pracuje také v JS, když se search čte z adresy

// Obsah e-mailu ve formátu HTML
$celkovy_email = <<<OBSAH_EMAIL
<html>
<head>
<title>Rezervace telefonního hovoru</title>
<style>
body{font-family: Arial,sans-serif;}
.header{background-color:#f2f2f2;padding:20px;text-align:center;}
.content{padding: 20px;}
.footer{background-color: #f2f2f2; padding: 10px; text-align: center; }
</style>
</head>
<body>
<div class="header">
<h1>Potvrzení rezervace telefonního hovoru</h1>
</div>
<div class="content">
<p>Máte rezervaci telefonního hovoru s Michalem Rausem.</p>
<p>Na den: <strong>{$datum_rezervace_slovne}</strong></p>
<p>V čase: <strong>{$cas_rezervace_slovne}</strong></p>
<h2>Vámi poskytnuté údaje</h2>
<p>Jméno a příjmení: {$jmeno}</p>
<p>Email: {$email}</p>
<p>Telefon: {$predvolba}{$phone}</p>
<p>O čem bude hovor: {$predmet}</p>
<h2>Zrušení rezervace</h2>
<p>Pro zrušení této rezervace použijte tento odkaz: <a href="{$cleanUrl}?{$search}{$token}" title="Chci zrušit tuto rezervaci"><strong>ZRUŠENÍ REZERVACE</strong></a></p>
<h2>Odkud je rezervace?</h2>
<p>Rezervace byla provedena z: <a href="{$cleanUrl}" title="Chci vidět rezervační systém">Rezervační systém.</a></p>
</div>
<div class="footer">
<p>&copy;2025 Boar-cz</p>
</div>
</body>
</html>
OBSAH_EMAIL;

// Nastavení hlaviček pro HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// Další volitelné hlavičky
$headers .= "From: Michal Raus <raus.michal@email.cz>" . "\r\n";

// Odeslání e-mailu
$zasli_email = mail($adresat, "Rezervace telefonního hovoru", $celkovy_email, $headers); // Odeslání e-mailu mně
$zasli_email2 = mail($email, "Rezervace telefonního hovoru", $celkovy_email, $headers); // Odeslání e-mailu uživateli

if ($zasli_email && $zasli_email2) {
$status = "success";
$message = "Oba e-maily byly úspěšně odeslány.";
} else {
$status = "error";
$message = "E-mail se nepodařilo odeslat.";
}

if ($status === "error") {
// Pokud došlo k chybě při odesílání emailů, ukončíme požadavek a pošleme odpověď
http_response_code($httpCode);
echo json_encode(["status" => $status, "message" => $message]);
exit;
}

?>