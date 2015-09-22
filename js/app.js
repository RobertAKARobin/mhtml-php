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
    drag.position();
    drag.listenForClick();
    drag.element.focus();
  });
}

/*
window.onload = function(){
  if(location.hash !== "#toggle"){
    document.getElementById("selfpro").style.display = "block";
  }

  (function makeDraggables(){
    var tags = document.querySelectorAll(".tags>*");
    var listeners = [];
    for(var x = tags.length - 1; x >= 0; x--){
      listeners.push(new Draggable(tags[x]));
    }
  }());

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();
}
*/