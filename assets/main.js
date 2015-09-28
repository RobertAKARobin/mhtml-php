"use strict";
window.onload = function(){
  var frame = el("frame");
  var frameSource = (queryString().url || "./assets/default.html");
  var tileFactory = new TileFactory(el("create"));
  tileFactory.element.addEventListener("tileCreate", function(){
    var draggable = new Draggable(tileFactory.latest.element);
    draggable.element.addEventListener("drop", refreshFrame);
  });

  // el("viewURL").href = frameSource;
  ajax("GET", frameSource, function(data){
    var frameSourceHTML = data;
    var byLine = frameSourceHTML.split("\n");
    tileFactory.bulkCreate(byLine);
    tileFactory.element.addEventListener("tileUpdate", refreshFrame);
    refreshFrame();
  });

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

  function refreshFrame(){
    var urlRegex = /(?:href=" |src=" )(?!http)([^ "]+)/g;
    var text = tileFactory.getTilesText().join(" ");
    text = text.replace(urlRegex, function(match, $p1){
      var rel = match.substring(0, match.indexOf($p1));
      var url = frameSource.substring(0, frameSource.lastIndexOf("/"));
      return rel + url + "/" + $p1;
    });
    frame.srcdoc = text;
  }
}

function ajax(method, url, callback){
  var request = new XMLHttpRequest();
  var contentType = "application/json";
  request.open(method, url, true);
  request.setRequestHeader("Content-Type", contentType);
  request.onreadystatechange = function(){
    var state = request.readyState;
    var code = request.status;
    var data = request.responseText;
    if(state == 4 && code >= 200 && code < 400) callback(data);
  }
  request.send();
}

function el(id){
  return document.getElementById(id);
}

function queryString(){
  var params = {};
  var pairs = location.search.substring(1).split("&"), pair;
  var split;
  var i = -1, l = pairs.length;
  while(++i < l){
    pair = pairs[i];
    split = pair.indexOf("=");
    params[pair.substring(0,split)] = decodeURIComponent(pair.substring(split + 1));
  }
  return params;
}

function defineEvent(name){
  var evt = document.createEvent("Event");
  evt.initEvent(name, true, true);
  return evt;
}

function toggleClass(element, className){
  if(element.className.indexOf(clazz) < 0) addClass(element, className);
  else removeClass(element, className);
}
function removeClass(element, className){
  element.className = element.className.replace(className, "");
}
function addClass(element, className){
  element.className += " " + className;
}

function Draggable(element){
  var instance = this;
  instance.isDragging = false;
  instance.element = element;
  instance.element.style.position = "absolute";
  instance.isTouchy = "ontouchstart" in window ? true : false;
  instance.parent = instance.element.parentElement;
  // Have to do this here, instead of .bind in the addEventListener
  // Otherwise can't removeEventListener
  instance.drag = instance.drag.bind(instance);
  instance.drop = instance.drop.bind(instance);
  if(instance.isTouchy){
    instance.element.addEventListener("touchstart",
    instance.startDragging.bind(instance));
  }else{
    instance.element.addEventListener("mousedown",
    instance.startDragging.bind(instance));
  }
};
Draggable.events = {
  drop: defineEvent("drop")
}
Draggable.prototype = {
  startDragging: function(evt){
    var instance = this, startEvent, endEvent;
    if(instance.isDragging){
      return;
    }else{
      instance.isDragging = true;
    }
    var evt = instance.isTouchy ? evt.touches[0] : evt;
    instance.getStartingPositions(evt);
    startEvent = instance.isTouchy ? "touchmove" : "mousemove";
    endEvent = instance.isTouchy ? "touchend" : "mouseup";
    window.addEventListener(startEvent, instance.drag);
    window.addEventListener(endEvent, instance.drop);
  },
  drag: function(evt){
    var instance = this;
    evt.preventDefault();
    var evt = evt.type == "touchmove" ? evt.touches[0] : evt;
    var newTop = instance.getNewPosition("top", evt);
    var newLeft = instance.getNewPosition("left", evt);
    instance.element.style.top = newTop + "px";
    instance.element.style.left = newLeft + "px";
  },
  drop: function(evt){
    var instance = this;
    instance.isDragging = false;
    window.removeEventListener("touchmove", instance.drag);
    window.removeEventListener("touchend", instance.drop);
    window.removeEventListener("mousemove", instance.drag);
    window.removeEventListener("mouseup", instance.drop);
    instance.snapToGrid();
    if(instance.startingCursor.left != evt.clientX
    || instance.startingCursor.top != evt.clientY){
      instance.element.dispatchEvent(Draggable.events.drop);
    }
  },
  getStartingPositions: function(evt){
    var instance = this;
    var element = instance.element;
    var offsetParent = element.offsetParent;
    var overlapX = (element.offsetWidth / 2);
    var overlapY = (element.offsetHeight / 2);
    instance.startingPosition = {
      top: element.offsetTop,
      left: element.offsetLeft
    }
    instance.startingCursor = {
      top: evt.clientY,
      left: evt.clientX
    }
    instance.maxPosition = {
      top: offsetParent.scrollHeight - element.offsetHeight + overlapY,
      left: offsetParent.scrollWidth - element.offsetWidth + overlapX
    }
    instance.minPosition = {
      top: 0 - overlapY,
      left: 0 - overlapX
    }
  },
  getNewPosition: function(direction, evt){
    var instance = this;
    var axis = (direction == "top") ? "Y" : "X";
    var cursorChange = evt["client" + axis] - instance.startingCursor[direction];
    var elementPos = instance.startingPosition[direction] + cursorChange;
    var maxPos = instance.maxPosition[direction];
    var minPos = instance.minPosition[direction];
    if(elementPos > maxPos){
      return maxPos;
    }else if(elementPos < minPos){
      return minPos;
    }else{
      return elementPos;
    }
  },
  snapToGrid: function(){
    var instance = this;
    var element = instance.element;
    var proportion = element.offsetTop / element.offsetHeight;
    var output = Math.round(proportion) * element.offsetHeight;
    var bottomEdge = output + element.offsetHeight;
    if(bottomEdge > instance.parent.scrollHeight){
      output = bottomEdge - (2 * element.offsetHeight);
    }else if(output < 0){
      output = 0;
    }
    element.style.top = output + "px";
  },
};


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
    tester.style.minWidth = "0";
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
    var horribleRegEx = /(&[#a-z0-9]+;)|(<!--)|(-->)|(<[^">]+[>"])|("[^=<>"]+=")|("[ \/]*>)|([a-zA-Z0-9\_\.\,\:\;\/\-\'\$\?\=\%\@\!]+)/g;
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
      right: parent.scrollLeft + parent.scrollWidth,
      bottom: parent.scrollTop + parent.scrollHeight
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
Tile.events = {
  create: defineEvent("tileCreate"),
  update: defineEvent("tileUpdate")
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
    if(element.offsetWidth > tile.factory.element.scrollWidth - 10){
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
