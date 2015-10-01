<?php

if(!array_key_exists("url", $_GET)){
  die("No url!");
}
$url = $_GET["url"];
$rawHtml = file_get_contents($url);
// $rawHtml = htmlspecialchars($rawHtml);

if(array_key_exists("absolutify", $_GET)){
  $urlRegex = "/((?<=href=[\"\'])|(?<=src=[\"\']))(?!http)[^ \"]+/";
  $rawHtml = preg_replace_callback($urlRegex, function($matches) use($url){
    $urlToDirectory = substr($url, 0, strrpos($url, "/"));
    return "$urlToDirectory/$matches[0]";
  }, $rawHtml);
}

$lines = preg_split("/[\n\r]/", $rawHtml);
$regexes = join("|", array(
  "closeTagLB" => "(?<=>)",
  "openTagLA" =>  "(?=<)",
  "spaceLB" =>    "(?<=\s)",
  "spaceLA" =>    "(?=\s)",
  "quoteLA" =>    "(?=[\"\'][^\"\'\/\s>])",
  "quoteLB" =>    "(?<=\w[\"\'])",
  "commEndLA" =>  "(?=--+>)",
  "commOpenLB" => "(?<=--)(?=[^->])",
  "speCharLA" =>  "(?<=;)(?=&)"
));
$regexes = "/$regexes/";
// echo $regexes . PHP_EOL;

$output = array();
$i = -1;
$l = count($lines);
while(++$i < $l){
  $line = preg_split($regexes, $lines[$i]);
  $output[$i] = [];
  $charNum = -1;
  foreach($line as $chunkNum => $chunk){
    if(trim($chunk) != ""){
      $output[$i][] = array(
        "left" => $charNum,
        "value" => $chunk
      );
    }
    $charNum += max(strlen($chunk), 1);
  }
}

echo(json_encode($output));

?>
