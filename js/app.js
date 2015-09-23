window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  // var i = tilesDiv.children.length;
  var i = 1;
  var tile;

  tilesDiv.addEventListener("tileCreate", onCreate);
  while(i--){
    //element = tilesDiv.children[i];
    tile = new Tile();
    tile.element.Tile = tile;
    tile.placeInParent(tilesDiv);
  }

  function onCreate(evt){
    var element = tilesDiv.children[tilesDiv.children.length - 1];
    element.Draggable = new Draggable(element);
    element.addEventListener("tileAppend", appendTile);
    element.addEventListener("tileUpdate", updateTile);
  }
  function updateTile(evt){
    var tile = this;
    var sample = document.createElement("SPAN");
    sample.style.fontSize = tile.style.fontSize;
    sample.innerText = tile.value;
    // tile.style.width = sample.clientWidth + "px";
  }
  function appendTile(evt){
    var base = this;
    var tile = new Tile();
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
