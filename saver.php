<?php

$sitehtml = $_POST["sitehtml"];
$sitename = $_POST["sitename"];
$password = $_POST["password"];

$fileName = "sites/$sitename.html";
file_put_contents($fileName, $sitehtml);
echo $fileName;

?>
