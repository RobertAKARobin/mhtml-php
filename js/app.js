window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  var tiles = tilesDiv.children, tile;
  var i = tiles.length;
  while(i--){
    tile = new Tile(true, tiles[i]).element;
    new Draggable(true, tile);
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
