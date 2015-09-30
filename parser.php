<?php

if(!array_key_exists("url", $_GET)){
  die("No url!");
}
$rawHtml = file_get_contents($_GET["url"]);
// $rawHtml = htmlspecialchars($rawHtml);
$lines = preg_split("/[\n\r]/", $rawHtml);

$regexes = join("|", array(
  "closeTagLB" => "(?<=>)",
  "openTagLA" =>  "(?=<)",
  "spaceLB" =>    "(?<=\s)",
  "spaceLA" =>    "(?=\s)",
  "quoteLA" =>    "(?=[\"\']\w)",
  "quoteLB" =>    "(?<=\w[\"\'])",
  "commEndLA"=>   "(?=--+>)",
  "commOpenLB" => "(?<=--)(?=[^->])"
));
$regexes = "/$regexes/";

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
