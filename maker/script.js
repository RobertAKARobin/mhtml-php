var tags = [
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

function li(text){
  var li = document.createElement("span");
  if(/^\&/.test(text)){
    li.className = "c";
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/#/g, "&num;");
  }
  text = " " + text + " ";
  text = text.replace(/ /g, ' ');
  li.innerText = text;
  return li;
}

window.onload = function(){
  for(var x = 0; x < tags.length; x++){
    var ul = document.createElement("div");
    for(var y = 0; y < tags[x].length; y++){
      var tag = tags[x][y];
      if(/^[a-zA-Z0-9]*$/.test(tag)){
        ul.appendChild(li("<" + tag + ">"));
        ul.appendChild(li("</" + tag + ">"));
      }else{
        ul.appendChild(li(tag));
      }
    }
    document.body.appendChild(ul);
  }
}
