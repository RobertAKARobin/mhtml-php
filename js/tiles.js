function TileFactory(parent){
  var factory = this;
  factory.element = parent;
  factory.widthCalculator = new TileWidthCalculator(parent.className);
  factory.height = factory.widthCalculator.element.offsetHeight;
  factory.getEdges();
}
TileFactory.prototype = {
  create: function(content){
    var factory = this;
    var tile = new Tile(factory);
    factory.element.appendChild(tile.element);
    tile.element.focus();
    if(content) tile.update(content);
    factory.latest = tile;
    factory.element.dispatchEvent(Tile.events.create);
    return tile;
  },
  destroy: function(tile){
    var factory = this;
    if(factory.element.children.length <= 1) return;
    var tiles = factory.sortTilesByLocation();
    var focuser = tiles[tiles.indexOf(tile.element) - 1];
    (focuser || tiles[1]).focus();
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
  getTilesText: function(){
    var factory = this;
    var tiles = factory.sortTilesByLocation();
    var i = -1, l = tiles.length;
    var output = [];
    while(++i < l){
      output.push(tiles[i].value);
    }
    return output;
  },
  appendNewTileTo: function(base, content){
    var factory = this;
    var edge = {};
    var tile = factory.create(content);
    if(!base){
      return tile;
    }else{
      base = base.element;
    }
    edge.top = base.offsetTop;
    edge.left = base.offsetLeft + base.offsetWidth;
    edge.bottom = edge.top + tile.element.offsetHeight;
    edge.right = edge.left + tile.element.offsetWidth;
    if(edge.right > factory.edge.right){
      edge.left = 0;
      edge.top = edge.bottom;
      if(edge.bottom > factory.edge.bottom){
        factory.element.style.height = factory.element.offsetHeight +  tile.element.offsetHeight;
      }
    }
    tile.element.style.top = edge.top + "px";
    tile.element.style.left = edge.left + "px";
    return tile;
  }
}

function TileWidthCalculator(className){
  var calculator = this;
  var container = document.createElement("DIV");
  var element = document.createElement("SPAN");
  container.style.width = "auto";
  container.style.position = "absolute";
  container.style.left = "-500px";
  container.style.top = "-100px";
  container.style.zIndex = "2000";
  container.className = className;
  element.style.width = "auto";
  element.style.maxWidth = "none";
  container.appendChild(element);
  document.body.appendChild(container);
  calculator.element = element;
}
TileWidthCalculator.prototype = {
  update: function(text){
    var calculator = this;
    var element = calculator.element;
    element.textContent = text.replace(" ", "_");
    return element.offsetWidth;
  }
}

function Tile(factory){
  var tile = this;
  tile.factory = factory;
  tile.element = document.createElement("INPUT");
  tile.element.addEventListener("keydown", tile.onKeyDown.bind(tile));
  tile.element.addEventListener("keypress", tile.onKeyPress.bind(tile));
  tile.element.addEventListener("keyup", tile.onKeyUp.bind(tile));
  tile.element.addEventListener("mousedown", tile.onMouseDown.bind(tile));
  tile.element.addEventListener("change", tile.onChange.bind(tile));
}
Tile.defineEvent = function(name){
  var evt = document.createEvent("Event");
  evt.initEvent(name, true, true);
  return evt;
}
Tile.events = {
  create: Tile.defineEvent("tileCreate"),
  update: Tile.defineEvent("tileUpdate")
}
Tile.prototype = {
  calculateNewWidth: function(add){
    var tile = this, length;
    var factory = tile.factory;
    var text = tile.element.value;
    if(add) text = text + Array((add) + 1).join("_");
    tile.element.style.width = factory.widthCalculator.update(text) + "px";
  },
  update: function(text){
    var tile = this;
    tile.element.value = text;
    tile.calculateNewWidth();
  },
  onKeyDown: function(evt){
    var tile = this;
    var key = evt.keyCode;
    if(key == 8){
      if(tile.element.value.length < 1){
        evt.preventDefault();
        tile.factory.destroy(tile);
      }
      tile.calculateDeleteWidth = true;
    }else if(key == 13){
      evt.preventDefault();
      tile.factory.appendNewTileTo(tile);
    }
  },
  onKeyPress: function(evt){
    var tile = this;
    var element = tile.element;
    var parent = tile.factory.element;
    if(element.offsetWidth > parent.offsetWidth - 10){
      evt.preventDefault();
    }else{
      tile.calculateNewWidth(1);
    }
    if(tile.edge("right") > tile.factory.edge.right){
      element.style.left = tile.factory.edge.right - element.offsetWidth + "px";
    }
  },
  onKeyUp: function(evt){
    var tile = this;
    if(tile.calculateDeleteWidth){
      tile.calculateNewWidth();
      tile.calculateDeleteWidth = false;
    }
  },
  onChange: function(){
    var tile = this;
    tile.factory.element.dispatchEvent(Tile.events.update);
  },
  onMouseDown: function(evt){
    var tile = this;
    tile.onMouseUp = tile.onMouseUp.bind(tile);
    window.addEventListener("mouseup", tile.onMouseUp);
  },
  onMouseUp: function(){
    var tile = this;
    window.removeEventListener("mouseup", tile.onMouseUp);
    tile.factory.element.dispatchEvent(Tile.events.update);
  },
  edge: function(d){
    var tile = this, element = tile.element;
    if(d == "bottom") return element.offsetTop + element.offsetHeight;
    if(d == "right") return element.offsetLeft + element.offsetWidth;
  }
}
