<?php
/* ODESÍLÁNÍ EMAILU */

// Příjem dat z POST požadavku
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["email"]) && isset($_POST["duvod"]) && isset($_POST["den_a_cas_rezervace"]))
{

$email = $_POST["email"]; // email, kam bude zasláno potvrzení o zrušení rezervace
$email = substr($email, 0, 100); // zkrácení řetězce emailu na 100 znaků, pokud bude mít více
$duvod = $_POST["duvod"]; // důvod zrušení rezervace
$duvod = substr($duvod, 0, 500); // zkrácení řetězce emailu na 500 znaků, pokud bude mít více
$den_a_cas_rezervace = $_POST["den_a_cas_rezervace"]; // celkový text dne a času zrušené rezervace např.: Čtvrtek, 20. února 2025, 13:30-14:00 hod.
$den_a_cas_rezervace = substr($den_a_cas_rezervace, 0, 500); // zkrácení řetězce na 500 znaků, pokud bude mít více

} else {
// pokud nebyla použita metoda POST a pokud nebyla zaslána všechna potřebná data
$status = "error";
$message = "Nebyly zaslány všechny data pro odesílání emailů.";
http_response_code($httpCode);
echo json_encode(["status" => $status, "message" => $message]);
exit;
}

$adresat = "raus.michal@email.cz"; // emailová adresa, kam se má obsah zaslat

// Odesílatelské údaje z přijatých dat


// Obsah e-mailu ve formátu HTML
$celkovy_email = <<<OBSAH_EMAIL
<html>
<head>
<title>Zrušení rezervace telefonního hovoru</title>
<style>
body { font-family: Arial, sans-serif; }
.header { background-color: #f2f2f2; padding: 20px; text-align: center; }
.content { padding: 20px; }
.footer { background-color: #f2f2f2; padding: 10px; text-align: center; }
</style>
</head>
<body>
<div class="header">
<h1>Potvrzení o zrušení rezervace telefonního hovoru</h1>
</div>
<div class="content">
<p>Máte zrušenou rezervaci telefonního hovoru s Michalem Rausem.</p>
<p>Na: <strong>{$den_a_cas_rezervace}</strong></p>
<p>Z důvodu: {$duvod}</p>
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
$zasli_email = mail($adresat, "Zrušení rezervace telefonního hovoru", $celkovy_email, $headers); // Odeslání e-mailu mně
$zasli_email2 = mail($email, "Zrušení rezervace telefonního hovoru", $celkovy_email, $headers); // Odeslání e-mailu uživateli

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