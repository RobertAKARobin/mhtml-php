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

$tags = <<<TXT
www.magneticHTML.com  <header>  </header>
<!-Made in the USA->  <footer>  </footer>
alert("Small parts")  <script>  </script>
<h1>  </h1>  &ldquo;  <canvas>  </canvas>
<h2>  </h2>  &rdquo;  <strong>  </strong>
<h2>  </h2>  &mdash;  <button>  </button>
<h3>  </h3>  </html>  <html>  <tr>  </tr>
<h3>  </h3>  </head>  <head>  <tr>  </tr>
<h4>  </h4>  </body>  <body>  <th>  </th>
<ol>  </ol>  </main>  <main>  <th>  </th>
<ul>  </ul>  </span>  <span>  <td>  </td>
<li>  </li>  </form>  <form>  <td>  </td>
<li>  </li>  </code>  <code>  <td>  </td>
<li>  </li>  <!DOCTYPE html>  <td>  </td>
<dl>  </dl>  <div>  </div>  <div>  </div>
<dt>  </dt>  <pre>  </pre>  &shy;  &nbsp;
<dt>  </dt>  <dfn>  </dfn>  &amp;  &copy;
<dd>  </dd>  <p>  </p>  <title>  </title>
<dd>  </dd>  <p>  </p>  <style>  </style>
<dd>  </dd>  <p>  </p>  <table>  </table>
<em>  </em>  <q>  </q>  <aside>  </aside>
<tr>  </tr>  <s>  </s>  <label>  </label>
</section>  <section>  &hellip;  &tradem;
</section>  <section>  <a href="#">  </a>
<img alt="  " src="#"/>  &lt;  &gt;  &pm;
<textarea>  </textarea>  <!--  --->  &ne;
TXT;

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
