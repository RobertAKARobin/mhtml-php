<?php

function htmlToJSON($rawHtml){

  $lines = preg_split("/[\n\r]/", $rawHtml);
  $regexes = join("|", array(
    "tagLA" =>      "(?=<)",
    "tagLB" =>      "(?<=>)",
    "spaceLA" =>    "(?=\s)",
    "spaceLB" =>    "(?<=\s)",
    "quoteLA" =>    "(?=[\"][^\"\/\s>])",
    "quoteLB" =>    "(?<=\w[\"])",
    "commEndLA" =>  "(?=--+>)",
    "commOpenLB" => "(?<=--)(?=[^->])",
    "speCharLA" =>  "(?=&#?[a-zA-Z0-9-]+;)",
    "speCharLB" =>  "(?<=[a-zA-Z0-9-];)"
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

  return json_encode($output);

}

?>
