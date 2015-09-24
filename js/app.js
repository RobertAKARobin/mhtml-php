var tileFactory = {};
window.onload = function(){
  var tilesDiv = document.getElementById("tiles");
  tileFactory = new TileFactory(tilesDiv);
  tileFactory.element.addEventListener("tileCreate", function(){
    new Draggable(tileFactory.latest.element);
  });
  tileFactory.create();
}

/*

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

*/
