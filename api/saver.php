<?php

function formattedDate(){
  return date("Y.m.d.h:i:s");
}

function report($isSuccess, $message){
  $status = $isSuccess ? "success" : "fail";
  die(json_encode(array(
    $status => $message
  )));
}

$postKeys = ["sitehtml", "sitename", "password"];
foreach($postKeys as $postKey){
  if(!array_key_exists($postKey, $_POST)){
    report(false, "Missing $postKey.");
  }else{
    $$postKey = $_POST[$postKey];
  }
}
if(!preg_match("/[a-zA-Z0-9-_\.]+/", $sitename)){
  report(false, "Site name should be alphanumeric.");
}

$shouldCreateNewRow = true;
$fileIn = fopen("sites.csv", "c+");
$fileOut = fopen("sites_new.csv", "w");
if(!flock($fileIn, LOCK_EX) || !flock($fileOut, LOCK_EX)){
  report(false, "Server trouble. Retry later.");
}
while(!feof($fileIn)){
  $line = fgetcsv($fileIn);
  if(!$line){
    continue;
  }
  if($line[0] == $sitename){
    if(password_verify($password, $line[1])){
      $line[1] = password_hash($password, PASSWORD_BCRYPT);
      $line[3] = formattedDate();
      $shouldCreateNewRow = false;
    }else{
      report(false, "Bad password!");
    }
  }
  fputcsv($fileOut, $line);
}
if($shouldCreateNewRow){
  $authorized = true;
  fputcsv($fileOut, array(
    $sitename,
    password_hash($password, PASSWORD_BCRYPT),
    formattedDate(),
    formattedDate()
  ));
  $counter = trim(file_get_contents("counter.txt"));
  file_put_contents("counter.txt", $counter + 1);
}
flock($fileIn, LOCK_UN);
flock($fileOut, LOCK_UN);
fclose($fileIn);
fclose($fileOut);
unlink("sites.csv");
rename("sites_new.csv", "sites.csv");

$fileName = "sites/$sitename.html";
file_put_contents($fileName, $sitehtml);

if($shouldCreateNewRow){
  report(true, "http://dev.robertgfthomas.com/magnetichtml/$fileName");
}else{
  report(true, "updated");
}

?>
