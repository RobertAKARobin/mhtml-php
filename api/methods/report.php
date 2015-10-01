<?php

function report($isSuccess, $message){
  $status = $isSuccess ? "success" : "fail";
  die(json_encode(array(
    $status => $message
  )));
}

?>
