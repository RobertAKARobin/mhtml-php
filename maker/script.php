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
<h1>  </h1>  ,www.magneticHTML.com,,  <h2>  </h2>
<h2>  </h2>  ,,,,,,,,,,  ,,,,,,,,,,,  <h3>  </h3>
<p>  </p>  <!DOCTYPE,html>  &hellip;  <tr>  </tr>
<p>  </p>  <canvas>  </canvas>  &lt;  <tr>  </tr>
<p>  </p>  <script>  </script>  &gt;  <th>  </th>
<s>  </s>  <html>  </html>  &tradem;  <th>  </th>
<em>  </em>  &ldquo;  &rdquo;  <br/>  <td>  </td>
<pre>  </pre>  <section>  </section>  <td>  </td>
<div>  </div>  <section>  </section>  <td>  </td>
<div>  </div>  <q>  </q>  <!--  --->  <td>  </td>
<head>  </head>  &nbsp;  &amp;  &pm;  <ol>  </ol>
<body>  </body>  <header>  </header>  <ul>  </ul>
<main>  </main>  <footer>  </footer>  <li>  </li>
<span>  </span>  <strong>  </strong>  <li>  </li>
<form>  </form>  <button>  </button>  <li>  </li>
<table>  </table>  <style>  </style>  <dl>  </dl>
<title>  </title>  <aside>  </aside>  <dt>  </dt>
<img alt="  " src="#"/>  &ne;  &shy;  <dt>  </dt>
<textarea>  </textarea>  <h3>  </h3>  <dd>  </dd>
<blockquote>  </blockquote>  &mdash;  <dd>  </dd>
<a href="#">  </a>  <input/>  &copy;  <dd>  </dd>
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
