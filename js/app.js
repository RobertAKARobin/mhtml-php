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
    element.addEventListener("tileAppend", appendTile);
    element.addEventListener("tileUpdate", updateTile);
  }
  function updateTile(evt){
    var tile = this;
    var sample = document.createElement("SPAN");
    sample.style.fontSize = tile.style.fontSize;
    sample.innerText = tile.value;
    console.dir(sample);
    // tile.style.width = sample.clientWidth + "px";
  }
  function appendTile(evt){
    var base = this;
    var tile = new Tile(true);
    tile.element.Tile = tile;
    tile.placeInParent(tilesDiv);
    tile.element.Draggable.placeRelativeTo(base);
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
