window.onload = function(){
  var frame = el("frame");
  var tilesDiv = el("tiles");
  var tileFactory = new TileFactory(tilesDiv);
  (function(){
    tileFactory.element.addEventListener("tileCreate", makeTileDraggable);
    tileFactory.element.addEventListener("tileUpdate", submitTiles);
    function makeTileDraggable(){
      var draggable = new Draggable(tileFactory.latest.element);
      draggable.element.className += " draggable";
    }
    function submitTiles(){
      var text = tileFactory.getTilesText();
      frame.src = "data:text/html;charset=utf-8," + escape(text.join(""));
    }
    tileFactory.create("I like bananas.");
  }())

  var htmlFactory = new HTMLFactory(el("html"));
  el("htmlButton").addEventListener("click", htmlFactory.toggle.bind(htmlFactory));
  ajax("GET", "./assets/tiles.txt", function(data){
    // htmlFactory.bulkCreate(data, function(tag){
    //   tag.addEventListener("click", function(){
    //     var tile = tileFactory.create("", " t");
    //     tile.update(tag.innerText);
    //     tile.element.style.top = tag.offsetTop + "px";
    //     tile.element.style.left = tag.offsetLeft + "px";
    //   });
    // });
  });

  var defaultFactory = new HTMLFactory(el("tiles"));
  ajax("GET", "./assets/default.html", function(data){
    // defaultFactory.bulkCreate(data, function(tag){
    //
    // });
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

function HTMLFactory(element){
  var factory = this;
  factory.element = element;
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
    var horribleRegEx = /(&[#a-z0-9]+;)|(<!-)|(->)|(<[^">]+[>"])|("[^=<>"]+=")|("[ \/]*>)|([a-zA-Z:\/\.\,\&\;]+)/g;
    var tags = input.trim().match(horribleRegEx);
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
