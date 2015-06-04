<?php

function tag($text, $class = ""){
  if(empty($class)){
    $output = "<span>";
  }else{
    $output = "<span class=\"$class\">";
  }
  if(preg_match("/^[\/a-zA-Z0-9]*$/", $text)){
    $text = "&lt;" . htmlentities($text) . "&gt;";
  }
  $text = preg_replace("/,/", "&nbsp;", $text);
  return $output . "&nbsp;" . $text . "&nbsp;" . "</span>" . PHP_EOL;
}

/*
$tags = [
"h1 h2 h2 h3 h3 ol ul li li li 
];

$transposed = [];
for($colNum = 0; $colNum < count($tags); $colNum++){
  $row = preg_split("/\s/", $tags[$colNum]);
  for($rowNum = 0; $rowNum < count($row); $rowNum++){
    $transposed[$rowNum][$colNum] = $row[$rowNum];
  }
}

$output = "";
for($rowNum = 0; $rowNum < count($transposed); $rowNum++){
  $output .= "<div class='tags'>" . PHP_EOL;
  for($colNum = 0; $colNum < count($transposed[$rowNum]); $colNum++){
    $output .= tag($transposed[$rowNum][$colNum]) . PHP_EOL;
  }
  $output .= "</div>" . PHP_EOL;
}
 */

$tags = <<<TXT
<p>  </p>  <!DOCTYPE html>  &hellip;
<p>  </p>  <canvas>  </canvas>  &lt;
<p>  </p>  <script>  </script>  &gt;
<s>  </s>  <html>  </html>  &tradem;
<em>  </em>  <textarea>  </textarea>
<pre>  </pre>  <section>  </section>
<div>  </div>  <section>  </section>
<div>  </div>  <q>  </q>  <!--  --->
<head>  </head>  <figure>  </figure>
<body>  </body>  <header>  </header>
<main>  </main>  <footer>  </footer>
<span>  </span>  <strong>  </strong>
<form>  </form>  <button>  </button>
<small>  </small>  <br/>  &le;  &ge;
<table>  </table>  <style>  </style>
<title>  </title>  <aside>  </aside>
<img alt="  " src="#"/>  &ne;  &shy;
<blockquote>  </blockquote>  &mdash;
<a href="#">  </a>  <input/>  &copy;
<h1>  </h1>
<h2>  </h2>
<h2>  </h2>
<h3>  </h3>
<h3>  </h3>
<ol>  </ol>
<ul>  </ul>
<li>  </li>
<li>  </li>
<li>  </li>
<dl>  </dl>
<dt>  </dt>
<dt>  </dt>
<dd>  </dd>
<dd>  </dd>
<tr>  </tr>
<th>  </th>
<td>  </td>
<td>  </td>
<td>  </td>
<tr>  </tr>
<th>  </th>
<td>  </td>
<td>  </td>
<td>  </td>
TXT;

$tags = preg_split("/\n/", $tags);
foreach($tags as $row){
  $row = preg_split("/\s\s/", $row);
  $line = "";
  foreach($row as $tag){
    $line .= tag(htmlentities($tag));
  }
  $output .= "<div class=\"tags\">" . PHP_EOL . $line . "</div>" . PHP_EOL;
}

?>
<!DOCTYPE html>
<html>
<head>
<title>Foo</title>
<style>
*
{
font-family:"Andale Mono";
font-size:0;
}
span
{
display:inline-block;
font-size:14px;
line-height:24px;
white-space:pre;
outline:1px solid #ddd;
}
.c
{
color:red;
}
.l
{
color:blue;
}
span:hover
{
background-color:#fcc;
}
</style>
</head>
<body>
<?php echo $output; ?>
</body>
</html>
