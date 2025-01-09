<?php

include "defense/token.php"; // ověření tokenu, pokud nebude token origin, funkce se zastaví
include "defense/rate-limit.php"; // maximální počet přístupů 3 za 24 hod.
include "rezervace/zapis-rezervace.php" // postará se o všechny zápisy pro rezervaci
include "rezervace/rozeslat-emaily.php" // postará se o rozeslání emailu tomu kdo rezervaci zadal a mně

?>