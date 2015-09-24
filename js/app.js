var tileFactory = {};
window.onload = function(){
  var frame = el("frame");
  var tilesDiv = el("tiles");
  new TileFactory(tilesDiv, function(factory){
    tileFactory = factory;
    factory.element.addEventListener("tileCreate", makeTileDraggable);
    factory.element.addEventListener("tileUpdate", submitTiles);
    function makeTileDraggable(){
      var draggable = new Draggable(tileFactory.latest.element);
      draggable.element.className += " tile draggable";
    }
    function submitTiles(){
      var text = factory.getTilesText();
      frame.src = "data:text/html;charset=utf-8," + escape(text.join(""));
    }
  });

  htmlFactory = new HTMLFactory(el("html"), el("htmlButton"));
  ajax("GET", "./assets/tiles.txt", function(data){
    htmlFactory.bulkCreate(data, formatNewTag);
    function formatNewTag(tag){
      tag.addEventListener("click", function(){
        var tile = tileFactory.create();
        tile.element.className += " t";
        tile.update(tag.innerText);
        tile.element.style.top = tag.offsetTop + "px";
        tile.element.style.left = tag.offsetLeft + "px";
      });
    }
  });
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
    if(state == 4 && code >= 200 && code < 400) callback(data, code);
  }
  request.send();
}

function el(id){
  return document.getElementById(id);
}

function HTMLFactory(element, trigger){
  var factory = this;
  factory.element = element;
  factory.trigger = trigger;
  factory.trigger.addEventListener("click", factory.toggle.bind(factory));
}
HTMLFactory.prototype = {
  create: function(input, callback){
    var factory = this;
    var tag = document.createElement("SPAN");
    tag.className = "tile t";
    tag.innerText = input;
    factory.element.appendChild(tag);
    return tag;
  },
  bulkCreate: function(input, callback){
    var factory = this;
    var tags = input.trim().split(/  |\n/);
    var tag;
    var i = -1, l = tags.length;
    while(++i < l){
      tag = factory.create(tags[i], parent);
      callback(tag);
    }
  },
  toggle: function(){
    var factory = this;
    var element = factory.element;
    var hideClass = "off";
    if(element.className == hideClass) element.className = "";
    else element.className = hideClass;
  }
}
