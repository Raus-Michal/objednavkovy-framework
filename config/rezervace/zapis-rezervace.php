<?php
include "sifrovaci-heslo.php"; // Načtení hesla

$encryption_key = hash('sha256', $password, true); // Vytvoření 256-bitového klíče

// Funkce pro načtení obsahu souboru
function load_json_file($filename) {
    if (file_exists($filename)){
        // pokud soubor existuje
        return json_decode(file_get_contents($filename), true); // vrátí jeho data
    } else {
    // pokud soubor neexistuje
        return []; // vrátí prázdné pole
    }
}

// Funkce pro uložení obsahu do souboru
function save_json_file($filename, $data) {
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT)); // uloží data do JSON souboru
}

// Název souboru
$filename = 'rezervace.json';

// Načtení existujících dat
$data = load_json_file($filename);

// Příjem dat z POST požadavku
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['data_json'])) {
    $received_data = json_decode(urldecode($_POST['data_json']), true);

    if ($received_data && count($received_data) === 5) {
        // pokud budou zaslána data v požadovaném počtu, dojde k jejich ořezání na bezpečnou délku
        $rok = substr($received_data[0], 0, 4); // 4 znaky
        $mesic = substr($received_data[1], 0, 2); // 2 znaky
        $den = substr($received_data[2], 0, 2); // 2 znaky
        $cas_rezervace = substr($received_data[3], 0, 2); // 2 znaky
        $token = substr($received_data[4], 0, 32); // Token omezen na 32 znaků


        // Generování inicializačního vektoru (IV)
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));

        // Šifrování tokenu
        $encrypted_token = openssl_encrypt($token, 'aes-256-cbc', $encryption_key, 0, $iv);

        $new_entry = [
            'rok' => $rok,
            'mesic' => $mesic,
            'den' => $den,
            'cas_rezervace' => $cas_rezervace,
            'encrypted_token' => $encrypted_token,
            'iv' => base64_encode($iv) // Uložíme IV jako base64 kódovaný řetězec
        ];

        // Přidání nové hodnoty do existujících dat
        $data[] = $new_entry;

        // Uložení dat do souboru
        save_json_file($filename, $data);

        // Odpověď zpět na klientskou stranu
        echo json_encode(['status' => 'success', 'message' => 'Data uložena úspěšně']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Chybná data']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Chybný požadavek']);
}
?>
