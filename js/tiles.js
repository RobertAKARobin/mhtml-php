function Tile(isEditable, element){
  var tile = this;

  if(element) tile.element = element;
  else {
    tile.element = document.createElement("INPUT");
    tile.element.type = "text";
  }
  tile.isEditable = isEditable;
  tile.element.addEventListener("keydown", tile.keyDown.bind(tile));
  if(tile.element.parentElement){
    tile.element.parentElement.dispatchEvent(Tile.events.create);
  }
}
Tile.events = {
  create: (function(){
    var evt = document.createEvent("Event");
    evt.initEvent("tileCreate", true, true);
    return evt;
  }()),
  split: (function(){
    var evt = document.createEvent("Event");
    evt.initEvent("tileSplit", true, true);
    return evt;
  }())
}
Tile.spaceKeys = {
  32: "space",
  13: "return"
  // 9: "tab"
}
Tile.prototype = {
  keyDown: function(evt){
    var tile = this;
    if(!tile.isEditable) evt.preventDefault();
    if(evt.keyCode == "8"){
      tile.delete();
    }else if(evt.keyCode in Tile.spaceKeys){
      evt.preventDefault();
      new Tile(true).appendTo(tile.element.parentElement);
      tile.element.parentElement.dispatchEvent(Tile.events.split);
    }
  },
  appendTo: function(parent){
    var tile = this;
    parent.appendChild(tile.element);
    parent.dispatchEvent(Tile.events.create);
  },
  delete: function(){
    var tile = this;
    if(tile.element.value.length == 0
    && tile.element.parentElement.children.length > 1){
      tile.element.parentElement.removeChild(tile.element);
    }
  }
}
