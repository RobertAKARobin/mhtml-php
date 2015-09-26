function TileFactory(parent){
  var factory = this;
  factory.element = parent;
  factory.getLetterDimensions();
  factory.isTouchy = "ontouchstart" in window ? true : false;
  factory.getEdges();
}
TileFactory.prototype = {
  getLetterDimensions: function(){
    var factory = this;
    var tester = document.createElement("SPAN");
    var styles;
    tester.style.minWidth = "initial";
    tester.style.width = "auto";
    tester.style.padding = "0";
    tester.textContent = "A";
    factory.element.appendChild(tester);
    styles = window.getComputedStyle(tester);
    factory.letter = {
      width: parseFloat(styles.width),
      height: parseFloat(styles.height)
    }
    factory.element.removeChild(tester);
  },
  bulkCreate: function(inputHTML){
    var factory = this;
    var i = -1, l = inputHTML.length;
    var tile, numInLine, indent;
    var horribleRegEx = /(&[#a-z0-9]+;)|(<!--)|(-->)|(<[^">]+[>"])|("[^=<>"]+=")|("[ \/]*>)|([a-zA-Z0-9\_\.\,\:\;\/\-\'\$\?\=\%]+)/g;
    while(++i < l){
      numInLine = 0;
      indent = inputHTML[i].match(/^\s*/)[0].length;
      inputHTML[i].trim().replace(horribleRegEx, function(match){
        var element;
        tile = factory.appendNewTileTo(tile, match);
        element = tile.element;
        if(numInLine === 0){
          if(element.offsetLeft > 0){
            tile.element.style.top = element.offsetTop + element.offsetHeight + "px";
          }
          tile.element.style.left = (indent * factory.letter.width) + "px";
        }
        numInLine++;
      });
    }
  },
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

function Tile(factory){
  var tile = this;
  tile.factory = factory;
  tile.element = document.createElement("INPUT");
  tile.element.addEventListener("mousedown", tile.toggleFocus.bind(tile));
  tile.element.addEventListener("touchstart", tile.toggleFocus.bind(tile));
  tile.element.addEventListener("keydown", tile.onKeyDown.bind(tile));
  tile.element.addEventListener("keypress", tile.onKeyPress.bind(tile));
  tile.element.addEventListener("keyup", tile.onKeyUp.bind(tile));
  tile.element.addEventListener("change", function(){
    tile.checkIfHTML();
    tile.factory.element.dispatchEvent(Tile.events.update);
  });
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
    tile.element.style.paddingLeft = factory.letter.width + "px";
    tile.element.style.paddingRight = factory.letter.width + "px";
    tile.element.style.width = (factory.letter.width * text.length) + "px";
  },
  update: function(text){
    var tile = this;
    tile.element.value = text;
    tile.checkIfHTML();
    tile.calculateNewWidth();
  },
  toggleFocus: function(evt){
    var tile = this;
    evt.preventDefault();
    if(!tile.tapped){
      tile.tapped = setTimeout(function(){
        tile.tapped = null;
      }, 300);
    }else{
      tile.element.focus();
      clearTimeout(tile.tapped);
      tile.tapped = null;
    }
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
  checkIfHTML: function(){
    var tile = this;
    var text = tile.element.value;
    var rx = /(<[^>\n]+>)|(<[^>\n]+")|("[^>\n]+")|("[^\/>]*\/*\s*>)|(&[^;\s]+;)/;
    if(rx.test(text)){
      tile.element.className += " htmlTag";
    }else{
      tile.element.className = tile.element.className.replace("htmlTag", "");
    }
  },
  edge: function(d){
    var tile = this, element = tile.element;
    if(d == "bottom") return element.offsetTop + element.offsetHeight;
    if(d == "right") return element.offsetLeft + element.offsetWidth;
  }
}
