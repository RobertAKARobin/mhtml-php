window.onload = function(){
  var dragContainer = new DraggableContainer(tiles, [10, 10]);
  var tilesDiv = document.getElementById("tiles");

  (function makeTiles(){
    var tiles = tilesDiv.children, tile;
    for(i = 0; i < tiles.length; i++){
      tile = new Tile(true, tiles[i]).element;
    }
  }());

  tilesDiv.addEventListener("tileSplit", function(){
    var tile = tilesDiv.children[tilesDiv.children.length - 1];
    var drag = dragContainer.newDraggable(tile);
    drag.listenForClick();
    drag.element.focus();
  });
}

/*

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

*/
