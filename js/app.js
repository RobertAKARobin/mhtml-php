window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  var tiles = tilesDiv.children, tile;
  var draggables = [];
  var i = tiles.length;
  while(i--){
    tile = new Tile(true, tiles[i]).element;
    tile.addEventListener("tileDelete", deleteTile);
    new Draggable(true, tile);
  }
  tilesDiv.addEventListener("tileCreate", function(){
    var tile = tilesDiv.children[tilesDiv.children.length - 1];
    draggables.push(new Draggable(true, tile));
    tile.focus();
    tile.addEventListener("tileDelete", deleteTile);
  });
  function deleteTile(){
    var tile = this;
    var parent = tile.parentElement;
    var offsetParent = tile.offsetParent;
    var i = draggables.length, draggable, index, element;
    var startPosition = {};
    var startOffset = {};
    var endOffset = {};
    while(i--){
      draggable = draggables[i];
      element = draggable.element;
      if(element == tile){
        draggables[i] = undefined;
        continue;
      }
      draggable.index = i;
      startPosition[i] = {
        top: parseInt(element.style.top),
        left: parseInt(element.style.left)
      }
      startOffset[i] = {
        top: element.offsetTop,
        left: element.offsetLeft
      }
    }
    parent.removeChild(tile);
    console.dir(draggables);
    i = draggables.length;
    while(i--){
      draggable = draggables[i];
      if(!draggable) continue;
      index = draggable.index;
      endOffset[index] = {
        top: draggable.element.offsetTop,
        left: draggable.element.offsetLeft
      }
      draggable.setPosition("top", startPosition[index].top + (startOffset[index].top - endOffset[index].top));
      draggable.setPosition("left", startPosition[index].left + (startOffset[index].left - endOffset[index].left));
    }
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
