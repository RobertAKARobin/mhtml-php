<?php

function tag($text){
  $text = htmlentities($text);
  if(preg_match("/^(\&amp;|&lt;!D)/", $text)){
    $tag = "<span class='c'>";
  }else if(preg_match("/^\&lt;[\/a-zA-Z0-9]*\&gt;$/", $text)){
    $tag = "<span>";
  }else if(preg_match("/(^-|^\&lt;!|^,*w)/", $text)){
    $tag = "<span class='b'>";
  }else{
    $tag = "<span class='c'>";
    $text = preg_replace_callback("/(^&lt;[a-z]+|\/?&gt;$)/", function($match){
      return "<span class='t'>" . $match[0]. "</span>";
    }, $text);
    $text = preg_replace_callback("/\#/", function($match){
      return "<span class='b'>" . $match[0] . "</span>";
    }, $text);
  }
  $text = preg_replace("/,/", "&nbsp;", $text);
  return $tag . "&nbsp;" . $text . "&nbsp;" . "</span>" . PHP_EOL;
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
<h2>  </h2>  <img alt="  " src="#"/>  <h3>  </h3>
<h3>  </h3>  <img alt="  " src="#"/>  <tr>  </tr>
<em>  </em>  <textarea>  </textarea>  <tr>  </tr>
&ne;  &shy;  <br/>  &ldquo;  &rdquo;  <th>  </th>
<blockquote>  </blockquote>  &mdash;  <th>  </th>
<a href="#">  </a>  &tradem;  &copy;  <td>  </td>
<section>  </section>  <div>  </div>  <td>  </td>
<section>  </section>  <pre>  </pre>  <td>  </td>
<p>  </p>  &lt;  &pm;  &amp;  &nbsp;  <td>  </td>
<p>  </p>  <!--  --->  <div>  </div>  <ol>  </ol>
<p>  </p>  <!DOCTYPE,html>  &hellip;  <ul>  </ul>
<q>  </q>  &gt;  </s>  <s>  <input/>  <li>  </li>
<table>  </table>  <style>  </style>  <li>  </li>
<title>  </title>  <aside>  </aside>  <li>  </li>
<html>  </html>  <header>  </header>  <dl>  </dl>
<head>  </head>  <footer>  </footer>  <dt>  </dt>
<body>  </body>  <canvas>  </canvas>  <dt>  </dt>
<main>  </main>  <script>  </script>  <dd>  </dd>
<span>  </span>  <strong>  </strong>  <dd>  </dd>
<form>  </form>  <button>  </button>  <dd>  </dd>
TXT;

/*





















 */
$output = "";
$tags = preg_split("/\n/", $tags);
foreach($tags as $row){
  $row = preg_split("/\s\s/", $row);
  $line = "";
  foreach($row as $tag){
    $line .= tag($tag);
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
html
{
background-color:#999;
}
span
{
font-size:14px;
line-height:24px;
white-space:pre;
background-color:#fcfcfc;
}
div>span
{
display:inline-block;
outline:1px solid #ddd;
}
span,
.t
{
color:#881280;
}
.c
{
color:#994500;
}
.b
{
color:#1a1aa6;
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
