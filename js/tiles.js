function Tile(element){
  var tile = this;
  tile.setElement(element);
  tile.element.addEventListener("keydown", tile.onKeyDown.bind(tile));
}
Tile.events = (function(){
  return {
    create: defineEvent("tileCreate"),
    update: defineEvent("tileUpdate"),
    append: defineEvent("tileAppend"),
    delete: defineEvent("tileDelete")
  }
  function defineEvent(name){
    var evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
    return evt;
  }
}());
Tile.prototype = {
  setElement: function(element){
    var tile = this;
    if(!element){
      element = document.createElement("INPUT");
      element.type = "input";
    }else{
      tile.parent = element.parentElement;
      tile.parent.dispatchEvent(Tile.events.create);
    }
    tile.element = element;
  },
  placeInParent: function(parent){
    var tile = this;
    if(parent) tile.parent = parent;
    tile.parent.appendChild(tile.element);
    tile.parent.dispatchEvent(Tile.events.create);
    tile.element.focus();
  },
  onKeyDown: function(evt){
    var tile = this,
        newTile;
    if(evt.keyCode == 8){
      tile.delete();
    }else if(evt.keyCode == 13){
      evt.preventDefault();
      tile.element.dispatchEvent(Tile.events.append);
    }else{
      tile.element.dispatchEvent(Tile.events.update);
    }
  },
  delete: function(){
    var tile = this,
        element = tile.element,
        parent = tile.parent;
    if(element.value.length == 0 && parent.children.length > 1){
      parent.removeChild(element);
      parent.children[parent.children.length - 1].focus();
    }
  }
}
