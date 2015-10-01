<?php

require("../methods/htmlToJSON.php");

$dir = new DirectoryIterator(dirname(__FILE__) . "/../../defaults");
$files = array();
foreach($dir as $file){
  $extension = $file->getExtension();
  $baseName = $file->getBasename(".html");
  $fullName = $file->getFilename();
  if($file->isDot() || $file->isDir()) continue;
  if($extension == "json") continue;
  if(substr($baseName, 0, 1) == ".") continue;

  $files[] = $fullName;

  if($extension != "html") continue;
  file_put_contents("../../defaults/$baseName.json",
    htmlToJSON(file_get_contents("../../defaults/$fullName"))
  );
}

$filesJSON = json_encode($files);
file_put_contents("../../defaults/files.json", $filesJSON);
file_put_contents("../defaults.json", $filesJSON);

?>
