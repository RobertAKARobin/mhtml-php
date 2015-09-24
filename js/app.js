window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  var tile;
  tilesDiv.addEventListener("tileCreate", onCreate);
  tile = new Tile().setInDOM(tilesDiv);

  function onCreate(evt){
    var element = tilesDiv.children[tilesDiv.children.length - 1];
    new Draggable(element);
  }
}

/*

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

*/
