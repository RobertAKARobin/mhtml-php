function TileContainer(containerID){
  var container = this;
  container.element = document.getElementById(containerID);
  container.children = [];

  (function prepareChildren(){
    var tiles = container.element.children,
        l = tiles.length,
        i;
    for(i = 0; i < l; i++){
      container.children.push(new Tile(true, tiles[i]));
    }
  }());
}

function Tile(isEditable, element){
  var tile = this;

  if(element) tile.element = element;
  else {
    tile.element = document.createElement("INPUT");
    tile.element.type = "text";
  }
  tile.isEditable = isEditable;
  tile.element.addEventListener("keydown", tile.keyDown.bind(tile));

}
Tile.createEvent = (function(){
  var evt = document.createEvent("Event");
  evt.initEvent('tileCreated', true, true);
  return evt;
}());
Tile.spaceKeys = {
  32: "space",
  13: "return"
  // 9: "tab"
}
Tile.prototype = {
  keyDown: function(evt){
    var tile = this;
    if(!(tile.isEditable && evt.keyCode in Tile.spaceKeys)) return;
    evt.preventDefault();
    new Tile(true).appendTo(tile.element.parentElement);
    tile.element.parentElement.dispatchEvent(Tile.createEvent);
  },
  appendTo: function(parent){
    var tile = this;
    parent.appendChild(tile.element);
  }
}
