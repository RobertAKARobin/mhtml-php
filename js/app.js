"use strict";
window.onload = function(){
  var frame = el("frame");
  var frameSource = (queryString().url || "./assets/default.html");
  var tileFactory = new TileFactory(el("create"));
  tileFactory.element.addEventListener("tileCreate", function(){
    var draggable = new Draggable(tileFactory.latest.element);
    draggable.element.addEventListener("drop", refreshFrame);
  });

  ajax("GET", frameSource, function(data){
    var frameSourceHTML = data;
    var byLine = frameSourceHTML.split("\n");
    tileFactory.bulkCreate(byLine);
    tileFactory.element.addEventListener("tileUpdate", refreshFrame);
    refreshFrame();
  });

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
