"use strict";
window.onload = function(){
  var frame = el("frame");
  var frameSource = (queryString().url || "http://localhost/magnetic/assets/default.html");
  var apiUrl = "http://localhost/magnetic/parser.php";
  var frameSourceDir = frameSource.substring(0, frameSource.lastIndexOf("/"));
  var tileFactory = new TileFactory(el("create"));
  tileFactory.element.addEventListener("tileCreate", function(){
    var draggable = new Draggable(tileFactory.latest.element);
    draggable.element.addEventListener("drop", refreshFrame);
  });

  // el("viewURL").href = frameSource;
  ajax("GET", apiUrl + "?url=" + frameSource, {}, function(html){
    var apiTilesByLine = JSON.parse(html);
    each(apiTilesByLine, function(line, lineNum){
      if(line.length == 0) return;
      var tile = tileFactory.create(line[0].value);
      tile.element.style.left = (line[0].left * tileFactory.letter.width) + "px";
      each(line, function(apiTile, tileNum){
        if(tileNum == 0) return;
        tile = tileFactory.create(apiTile.value).appendTo(tile);
      });
    });
  });

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

  el("saveButton").addEventListener("click", function(){
    var postData = {
      sitehtml: tileFactory.getTilesText(),
      sitename: el("sitename").value,
      password: el("password").value
    }
    // console.dir(postData.sitehtml);
    // ajax("POST", "http://localhost/magnetic_crud/index.php", postData, function(response){
    //   console.log(response);
    // });
  });

  function refreshFrame(){
    var urlRegex = /(?:href="\s|src="\s)(?!http)([^ "]+)/g;
    var text = tileFactory.getTilesText();
    text = text.replace(urlRegex, function(match, filename){
      var rel = match.substring(0, match.indexOf(filename));
      var output = rel.trim() + frameSourceDir + "/" + filename.trim();
      return output;
    });
    frame.srcdoc = text;
  }
}

function ajax(method, url, input, callback){
  var request = new XMLHttpRequest();
  request.open(method, url, true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function(){
    var state = request.readyState;
    var code = request.status;
    var data = request.responseText;
    if(state == 4 && code >= 200 && code < 400) callback(data);
  }
  if(input){
    input = objectToQuery(input);
  }
  request.send(input);
}
function objectToQuery(input){
  var output = [];
  var key;
  for(key in input){
    output.push([key, encodeURIComponent(input[key])].join("="));
  }
  return output.join("&");
}
function el(id){
  return document.getElementById(id);
}
function each(object, callback){
  var i = -1, l = object.length;
  while(++i < l){
    callback(object[i], i);
  }
}
function queryString(){
  var params = {};
  var pairs = location.search.substring(1).split("&"), pair;
  each(pairs, function(pair){
    var split = pair.indexOf("=");
    params[pair.substring(0, split)] = decodeURIComponent(pair.substring(split + 1));
  });
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
  factory.tiles = [];
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
    var tiles = factory.getTilesSortedByLocation();
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
  getTilesSortedByLocation: function(){
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
    var tiles = factory.getTilesSortedByLocation();
    var lines = {};
    var output = [];
    var i = -1, l = tiles.length, tile, line;
    while(++i < l){
      tile = tiles[i];
      if(!lines[tile.offsetTop]){
        lines[tile.offsetTop] = [];
      }
      lines[tile.offsetTop].push(tile.value);
    }
    for(line in lines){
      output.push(lines[line].join(" "));
    }
    output = output.join("\n");
    // output.replace(//)
    // console.log(output);
    return output;
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
  destroy: function(){
    var tile = this;
    var factory = tile.factory;
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
      tile.factory.create().appendTo(tile);
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
    if((element.offsetLeft + element.offsetWidth) > tile.factory.edge.right){
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
    var element = tile.element;
    var text = element.value;
    var rx = new RegExp([
      "(<[^>\n]+>)",
      "(<[^>\n]+[\"\'])",
      "(\"[^>\n]+[\"\'])",
      "(\"[^\/>]*\/*\s*>)",
      "(&[^;\s]+;)"
    ].join("|"));
    if(rx.test(text)) addClass(element, "htmlTag");
    else removeClass(element, "htmlTag");
  },
  appendTo: function(base){
    var tile = this;
    var factory = tile.factory;
    var edge = {};
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
