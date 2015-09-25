"use strict";
window.onload = function(){
  var frame = el("frame");
  var tilesDiv = el("create");
  var tileFactory = new TileFactory(tilesDiv);
  var source = (queryString().url || "./assets/default.html");
  tileFactory.element.addEventListener("tileCreate", function(){
    tileFactory.latest.element.addEventListener("blur", function(){
    });
    var draggable = new Draggable(tileFactory.latest.element);
  });
  tileFactory.element.addEventListener("tileUpdate", refreshFrame);
  ajax("GET", source, function(data, url){
    var horribleRegEx = /(&[#a-z0-9]+;)|(<!--)|(-->)|(<[^">]+[>"])|("[^=<>"]+=")|("[ \/]*>)|([a-zA-Z0-9\_\.\,\:\;\/\-\'\$\?\=]+)/g;
    var tags = data.trim().match(horribleRegEx), tag;
    var i = -1, l = tags.length;
    while(++i < l){
      tag = tileFactory.appendNewTileTo(tag, tags[i]);
    }
    refreshFrame();
  });
  function refreshFrame(){
    var urlRegex = /(?:href=" |src=" )(?!http)([^ "]+)/g;
    var text = tileFactory.getTilesText().join(" ");
    text = text.replace(urlRegex, function(match, $p1){
      var rel = match.substring(0, match.indexOf($p1));
      var url = source.substring(0, source.lastIndexOf("/"));
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
    if(state == 4 && code >= 200 && code < 400) callback(data, url, code);
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
    params[pair.substring(0,split)] = pair.substring(split + 1);
  }
  return params;
}
