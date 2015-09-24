function TileFactory(parent){
  var factory = this;
  factory.element = parent;
  factory.widthCalculator = new TileWidthCalculator();
  factory.height = factory.widthCalculator.element.offsetHeight;
  factory.getEdges();
}
TileFactory.prototype = {
  create: function(){
    var factory = this;
    var tile = new Tile(factory);
    factory.element.appendChild(tile.element);
    factory.latest = tile;
    factory.element.dispatchEvent(Tile.events.create);
    tile.element.focus();
    return tile;
  },
  destroy: function(tile){
    var factory = this;
    if(factory.element.children.length <= 1) return;
    var tiles = factory.sortTilesByLocation();
    tiles[tiles.indexOf(tile.element) - 1].focus();
    factory.element.removeChild(tile.element);
  },
  getEdges: function(){
    var factory = this;
    var parent = factory.element;
    factory.edge = {
      right: parent.offsetLeft + parent.offsetWidth,
      bottom: parent.offsetTop + parent.offsetHeight
    }
  },
  getTileStatuses: function(){
    var i = Tile.all.length;
    var output = {active: 0, inactive: 0};
    while(i--){
      if(Tile.all[i]) output.active++;
      else output.inactive++;
    }
    return output;
  },
  sortTilesByLocation: function(){
    var factory = this;
    var tiles = Array.prototype.slice.call(factory.element.children);
    tiles.sort(function(a, b){
      if(a.offsetTop == b.offsetTop){
        return a.offsetLeft - b.offsetLeft;
      }else{
        return a.offsetTop - b.offsetTop;
      }
    });
    return tiles;
  },
  appendNewTileTo: function(base){
    var factory = this;
    var edge = {};
    var tile = factory.create();
    edge.top = base.offsetTop;
    edge.left = base.offsetLeft + base.offsetWidth;
    edge.bottom = edge.top + tile.element.offsetHeight;
    edge.right = edge.left + tile.element.offsetWidth;
    if(edge.right > factory.edge.right){
      edge.left = 0;
      edge.top = edge.bottom;
      if(edge.bottom > factory.edge.bottom){
        edge.top = base.offsetTop - tile.element.offsetHeight;
      }
    }
    tile.element.style.top = edge.top + "px";
    tile.element.style.left = edge.left + "px";
  }
}

function TileWidthCalculator(){
  var calculator = this;
  var element = document.createElement("SPAN");
  element.className = "tile";
  element.style.width = "auto";
  element.style.position = "fixed";
  element.style.left = "-100px";
  element.style.top = "-100px";
  element.style.zIndex = "2000";
  document.body.appendChild(element);
  calculator.element = element;
}
TileWidthCalculator.prototype = {
  update: function(length){
    var calculator = this;
    var element = calculator.element;
    element.innerText = Array(length).join("a");
    return element.offsetWidth;
  }
}

function Tile(factory){
  var tile = this;
  tile.factory = factory;
  tile.widthCalculator = factory.widthCalculator;
  tile.element = document.createElement("INPUT");
  tile.element.type = "input";
  tile.element.className = "tile";
  tile.element.addEventListener("keydown", tile.onKeyDown.bind(tile));
  tile.element.addEventListener("keyup", tile.onKeyUp.bind(tile));
  tile.element.addEventListener("mouseup", tile.onMouseUp.bind(tile));
}
Tile.defineEvent = function(name){
  var evt = document.createEvent("Event");
  evt.initEvent(name, true, true);
  return evt;
}
Tile.events = {
  create: Tile.defineEvent("tileCreate")
}
Tile.prototype = {
  calculateNewWidth: function(add){
    var tile = this, length;
    length = tile.element.value.length + (add || 0);
    tile.element.style.width = tile.widthCalculator.update(length) + "px";
  },
  onKeyDown: function(evt){
    var tile = this;
    var key = evt.keyCode;
    if(key == 8){
      if(tile.element.value.length < 1){
        evt.preventDefault();
        tile.factory.destroy(tile);
      }
      tile.calculateWidthOnKeyUp = true;
    }else if(key == 13){
      evt.preventDefault();
      tile.factory.appendNewTileTo(tile.element);
    }else if(key == 32 || (key >= 48 && key <= 90 )){
      tile.calculateNewWidth(2);
    }
  },
  onKeyUp: function(evt){
    var tile = this;
    if(tile.calculateWidthOnKeyUp){
      tile.calculateNewWidth(1);
      tile.calculateWidthOnKeyUp = false;
    }
    if(tile.edge("right") > tile.factory.edge.right){
      tile.element.style.left = "0px";
      tile.element.style.top = tile.edge("bottom") + "px";
    }
  },
  onMouseUp: function(evt){
    var tile = this;
    tile.alignToLaterals();
  },
  alignToLaterals: function(){
    var tile = this;
    var element = tile.element;
    var output = Math.round(element.offsetTop / tile.factory.height) * tile.factory.height;
    tile.element.style.top = output + "px";
  },
  edge: function(d){
    var tile = this, element = tile.element;
    if(d == "bottom") return element.offsetTop + element.offsetHeight;
    if(d == "right") return element.offsetLeft + element.offsetWidth;
  }
}
