window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  var i = tilesDiv.children.length;
  var element;

  tilesDiv.addEventListener("tileCreate", onCreate);
  while(i--){
    element = tilesDiv.children[i];
    element.Tile = new Tile(true, element);
  }

  function onCreate(evt){
    var element = tilesDiv.children[tilesDiv.children.length - 1];
    element.Draggable = new Draggable(true, element);
    activateTile(element);
  }
  function activateTile(element){
    element.focus();
    element.addEventListener("tileAppend", appendTile);
    element.addEventListener("tileDelete", deleteTile);
  }
  function appendTile(evt){
    var base = this;
    var tile = new Tile(true);
    var draggable;
    tile.element.Tile = tile;
    tile.placeInParent(tilesDiv);
    tile.element.Draggable.placeRelativeTo(base);
  }
  function deleteTile(evt){
    var element = this;
    var parent = element.parentElement;
    parent.removeChild(element);
    parent.children[parent.children.length - 1].focus();
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
