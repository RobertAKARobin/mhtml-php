<?php

if($_SERVER["SERVER_NAME"] == "localhost"){
  $defaultDir = "http://localhost/magnetic/defaults";
}else{
  $defaultDir = "http://magnetichtml.com/defaults";
}

$defaultFiles = file_get_contents("defaults.json");
$defaultFiles = json_decode($defaultFiles, true);
foreach($defaultFiles as $file){
  file_put_contents("sites/$file", file_get_contents("$defaultDir/$file"));
}

?>
