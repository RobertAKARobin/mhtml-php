function Tile(element){
  var tile = this;
  Tile.all.push(tile);
  if(!Tile.widthCalculator) Tile.createWidthCalculator();
  tile.getElement(element);
  tile.element.addEventListener("keydown", tile.onKeyDown.bind(tile));
  tile.element.addEventListener("keyup", tile.onKeyUp.bind(tile));
  tile.element.addEventListener("mouseup", tile.onMouseUp.bind(tile));
}
Tile.all = [];
Tile.getAmount = function(){
  var i = Tile.all.length;
  var output = {active: 0, inactive: 0};
  while(i--){
    if(Tile.all[i]) output.active++;
    else output.inactive++;
  }
  return output;
}
Tile.sortByLocation = function(){
  Tile.all.sort(function(a, b){
    if(!a && !b) return 0;
    if(!a) return 1;
    if(!b) return -1;
    if(a.top == b.top) return a.left - b.left;
    return a.top - b.top;
  });
}
Tile.createWidthCalculator = function(){
  Tile.widthCalculator = document.createElement("SPAN");
  Tile.widthCalculator.className = "tile";
  Tile.widthCalculator.style.width = "auto";
  Tile.widthCalculator.style.position = "fixed";
  Tile.widthCalculator.style.left = "-100px";
  Tile.widthCalculator.style.top = "-100px";
  Tile.widthCalculator.style.zIndex = "2000";
  document.body.appendChild(Tile.widthCalculator);
  Tile.height = Tile.widthCalculator.offsetHeight;
}
Tile.defineEvent = function(name){
  var evt = document.createEvent("Event");
  evt.initEvent(name, true, true);
  return evt;
}
Tile.events = {
  create: Tile.defineEvent("tileCreate"),
  update: Tile.defineEvent("tileUpdate"),
  append: Tile.defineEvent("tileAppend"),
  delete: Tile.defineEvent("tileDelete")
}
Tile.prototype = {
  getElement: function(element){
    var tile = this;
    if(!element){
      element = document.createElement("INPUT");
      element.type = "input";
      element.className = "tile";
    }
    tile.element = element;
  },
  setInDOM: function(parent){
    var tile = this;
    if(parent){
      tile.parent = parent;
      tile.parent.appendChild(tile.element);
    }else{
      tile.parent = tile.element.parentElement;
      tile.parent.dispatchEvent(Tile.events.create);
    }
    tile.parent.dispatchEvent(Tile.events.create);
    tile.element.focus();
    return tile;
  },
  calculateNewWidth: function(add){
    var tile = this,
        text;
    add = add || 1;
    text = Array(tile.element.value.length + add).join("a");
    Tile.widthCalculator.innerText = text;
    tile.element.style.width = Tile.widthCalculator.offsetWidth + "px";
    if(tile.edge("right") > tile.edge("right", tile.parent)){
      tile.element.style.left = "0px";
      tile.element.style.top = tile.edge("bottom") + "px";
    }
  },
  onKeyDown: function(evt){
    var tile = this;
    var key = evt.keyCode;
    if(key == 8){
      tile.delete();
      tile.isDeleting = true;
    }else if(key == 13){
      evt.preventDefault();
      new Tile().placeAfter(tile.element).setInDOM(tile.parent);
    }else if(key == 32 || (key >= 48 && key <= 90 )){
      tile.calculateNewWidth(2);
    }
  },
  onKeyUp: function(){
    var tile = this;
    tile.logValue();
    if(tile.isDeleting) tile.calculateNewWidth();
    tile.isDeleting = false;
  },
  onMouseUp: function(){
    var tile = this;
    tile.logOrigin("top");
    tile.logOrigin("left");
  },
  logValue: function(){
    var tile = this;
    tile.value = tile.element.value;
  },
  logOrigin: function(direction){
    var tile = this;
    var origin = parseInt(tile.element.style[direction]) || 0;
    if(origin < 0) origin = 0;
    if(direction == "top"){
      origin = Math.ceil(origin / Tile.height) * Tile.height;
    }
    tile[direction] = origin;
  },
  delete: function(){
    var tile = this,
        element = tile.element,
        parent = tile.parent,
        index, newFocus;
    if(element.value.length == 0 && Tile.getAmount().active > 1){
      Tile.sortByLocation();
      index = Tile.all.indexOf(tile);
      Tile.all[(index - 1 == 0) ? 1 : index - 1].element.focus();
      Tile.all[index] = undefined;
      tile = undefined;
      parent.removeChild(element);
    }
  },
  placeAfter: function(base){
    var tile = this,
        parent = base.parent;
    var tileOrigin = {
      top: base.offsetTop,
      left: base.offsetLeft + base.offsetWidth
    }
    var tileEdge = {
      right: tileOrigin.left + tile.element.offsetWidth,
      bottom: tileOrigin.top + tile.element.offsetHeight
    }
    var parentEdge = {
      right: parent.offsetLeft + parent.offsetWidth,
      bottom: parent.offsetTop + parent.offsetHeight
    }
    if(tileEdge.right > parentEdge.right){
      tileOrigin.left = 0;
      tileOrigin.top = tileEdge.bottom;
      if(tileEdge.bottom > parentEdge.bottom){
        tileOrigin.top = base.offsetTop - tile.element.offsetHeight;
      }
    }
    tile.element.style.top = tileOrigin.top + "px";
    tile.element.style.left = tileOrigin.left + "px";
  },
  edge: function(d, element){
    var tile = this,
        element = element || tile.element;
    if(d == "bottom") return element.offsetTop + element.offsetHeight;
    if(d == "right") return element.offsetLeft + element.offsetWidth;
  }
}
