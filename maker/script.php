<!DOCTYPE html>
<html>
<head>
<title>Foo</title>
<style>
*
{
font-family:monospace;
font-size:0;
}
span
{
font-size:14px;
}
.c
{
color:red;
}
</style>
</head>
<body>
<?php

$tags = [
  [
    "<!DOCTYPE html>",
    "html",
    "head",
    "&lt;",
    "&gt;"
  ],
  [
    "title",
    "body",
    "header",
    "&ne;"
  ],
  [
    "main",
    "footer",
    "<img alt='",
    "' src='#'/>"
  ],
  [
    "section",
    "section",
    "span"
  ],
  [
    "h1",
    "   mailto:robin@magneticHTML.com   ",
    "h3"
  ],
  [
    "h2",
    "<script>alert('Welcome!');</script>",
    "h3"
  ],
  [
    "h2",
    "<style>*{ font-family:'Comic Sans';",
    "ol"
  ],
  [
    "dl",
    "position:fixed!important; }</style>",
    "ul",
  ],
  [
    "dt",
    "<? echo(T_PAAMAYIM_NEKUDOTAYIM); ?>",
    "li",
  ],
  [
    "dt",
    "&tradem;",
    "&mdash;",
    "&shy;",
    "<!--",
    "-->",
    "li"
  ],
  [
    "dd",
    "div",
    "div",
    "<br/>",
    "li"
  ],
  [
    "dd",
    "blockquote",
    "q",
    "&hellip;"
  ],
  [
    "p",
    "marquee",
    "strong",
    "&copy;"
  ],
  [
    "p",
    "blink",
    "pre",
    "&amp;",
    "s"
  ],
  [
    "p",
    "aside",
    "<a href='#'>",
    "</a>",
    "em"
  ]
];

$output = "";

function tag($text, $class = ""){
  $output = "<span>";
  if(!empty($class)){
    $output = "<span class=\"$class\">";
  }
  $text = preg_replace("/ /", "&nbsp;", $text);
  return "$output&nbsp;" . $text . "&nbsp;</span>" . PHP_EOL;
}

foreach($tags as $row){
  $output .= "<div class=\"tags\">" . PHP_EOL;
  foreach($row as $tag){
    if(preg_match("/^[a-zA-Z0-9]*$/", $tag)){
      $output .= tag("&lt;" . $tag . "&gt;");
      $output .= tag("&lt;/" . $tag . "&gt;");
    }else{
      $output .= tag(htmlentities($tag), "c");
    }
  }
  $output .= "</div>" . PHP_EOL;
}

echo $output;

?>
</body>
</html>
