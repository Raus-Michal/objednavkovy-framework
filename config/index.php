<?php
if (headers_sent())
{
echo 'Je nám líto, někde nastala chyba. Zkuste to prosím později.';
exit;
}
else
{
header("Location:../");
exit;
}
?>
