var tileFactory = {};
window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  tileFactory = new TileFactory(tilesDiv);
  tileFactory.element.addEventListener("tileCreate", function(){
    new Draggable(tileFactory.latest.element);
  });

  ajax("GET", "./assets/tiles.txt", placeHTML);
  // document.getElementById("save").addEventListener("click", submit);

  function placeHTML(rawText){
    var tagsDiv = document.getElementById("html");
    var tags = rawText.trim().split(/  |\n/);
    var tag;
    var i = -1, l = tags.length;
    while(++i < l){
      tag = document.createElement("SPAN");
      tag.className = "tile t";
      tag.innerText = "\xa0" + tags[i] + "\xa0";
      tagsDiv.appendChild(tag);
    }
  }
  function submit(){
    var text = tileFactory.getTilesText();
    console.log(text);
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
    if(state == 4 && code >= 200 && code < 400) callback(data, code);
  }
  request.send();
}

/*

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

*/
