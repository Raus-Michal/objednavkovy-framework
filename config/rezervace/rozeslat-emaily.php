<?php
/* ODESÍLÁNÍ EMAILU */
<?php
// Příjem dat z POST požadavku
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['data_email'])) {
    $received_data = json_decode(urldecode($_POST['data_email']), true);

if($received_data&&count($received_data)===8)
{
// Zkrácení všech stringů na 100 znaků
$jmeno = substr($received_data[0], 0, 100);
$email = substr($received_data[1], 0, 100);
$phone = substr($received_data[2], 0, 100);
$predmet = substr($received_data[3], 0, 100);
$datum_rezervace_slovne = substr($received_data[4], 0, 100);
$cas_rezervace_slovne = substr($received_data[5], 0, 100);
$cleanUrl = substr($received_data[6], 0, 100);
$token = substr($received_data[7], 0, 100);
    } else {
        http_response_code(400);
        echo "Chybné data";
        exit;
    }
} else {
    http_response_code(400);
    echo "Chybný požadavek";
    exit;
}


$adresat="raus.michal@email.cz"; // emailova adresa, kam se má obsah zaslat



$odeslano_z="Boar-cz.info"; // z které webové domény byl formulář odeslán
$odesilatel_jmeno=$_POST["jmeno"]; // jméno odesílatele
$odesilatel_email=$_POST["email"]; // email odesílatele 

$celkovy_email=<<<OBSAH_EMAIL
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
<h1>Rezervace telefonního hovoru</h1>
</div>
<div class="content">
<p>Rezervace telefonního hovoru s Michalem Rausem.</p>
<p>Na den</p>
<p><strong>{$datum_rezervace_slovne}</strong></p>
<p>V čase:{$cas_rezervace_slovne}</p>
<h2>Vámi poskytnuté údaje</h2>
<p>Jméno a příjmení: {$jmeno}</p>
<p>Email: {$email}</p>
<p>Telefon: {$phone}</p>
<p>O čem bude hovor: {$predmet}</p>
<h2>Zrušení rezervace</h2>
<p>Pro zrušení této rezervace použíte odkaz níže:</p>
<a href="{$cleanUrl}?{$token}" title="Chci zrušit tuto rezervaci">ZRUŠENÍ REZERVACE</a>


</div>
<div class="footer">
<p>&copy;2025 Boar-cz</p>
</div>
</body>
</html>
OBSAH_EMAIL; // celkové zaslaný email v HTML za pomocí here documenty= <<<OBSAH_EMAIL ... obsah ... OBSAH_EMAIL;


// Nastavení hlaviček pro HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// Další hlavičky (volitelné)
$headers .= "From: Michal Raus < raus.michal@email.cz >" . "\r\n";

$zasli_email=mail($adresat,"Rezervace telefonního hovoru",$celkovy_email,$headers); // odešle email mně
$zasli_email2=mail($email,"Rezervace telefonního hovoru",$celkovy_email,$headers); // odešle email tomu, kdo chtěl rezervaci



if($zasli_email && $zasli_email2) {
    echo json_encode(['status' => 'success', 'message' => 'Oba e-maily byly úspěšně odeslány']);
} else if (!$zasli_email && !$zasli_email2) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Žádný e-mail nebyl odeslán']);
} else if (!$zasli_email) {
    http_response_code(500);
    echo json_encode(['status' => 'partial_success', 'message' => 'První e-mail nebyl odeslán']);
} else if (!$zasli_email2) {
    http_response_code(500);
    echo json_encode(['status' => 'partial_success', 'message' => 'Druhý e-mail nebyl odeslán']);
}



/* konec ODESÍLÁNÍ EMAILU*/

?>
