<?php

require("methods/htmlToJSON.php");
require("methods/report.php");

/*
remote
local
*/

if(!array_key_exists("url", $_GET)){
  report(false, "No url!");
}
$url = $_GET["url"];
if(preg_match("/^http\:\/\//", $url)){
  $isLocal = false;
}else{
  $isLocal = true;
  $url = "sites/$url";
  $extension = substr($url, strrpos($url, ".") + 1);
  if($extension != "html"){
    report(false, "The URL has to be an HTML file.");
  }
  if(!file_exists($url)){
    report(false, "That site doesn't exist.");
  }
}

$relURLRegex = "/((?<=href=[\"\'])|(?<=src=[\"\'])|(?<=url\())(?!http)[^ \"]+/";
if($isLocal){
  $urlToDirectory = "sites";
}else{
  $lastSlash = strrpos($url, "/");
  if($lastSlash <= 7){
    $urlToDirectory = "$url";
  }else{
    $urlToDirectory = substr($url, 0, strrpos($url, "/"));
  }
}
$rawHtml = file_get_contents($url);
$rawHtml = preg_replace_callback($relURLRegex, function($matches) use($urlToDirectory){
  return "$urlToDirectory/$matches[0]";
}, $rawHtml);

if(array_key_exists("html", $_GET)){
  echo $rawHtml;
}else{
  echo htmlToJSON($rawHtml);
}

?>
