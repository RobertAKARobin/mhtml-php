<?php

$rawHtml = file_get_contents("./assets/default.html");
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
  $charNum = -1;
  foreach($line as $chunkNum => $chunk){
    if(trim($chunk) != ""){
      $output[] = array(
        $i,
        $charNum,
        $chunk
      );
    }
    $charNum += max(strlen($chunk), 1);
  }
}

echo(json_encode($output));

?>
