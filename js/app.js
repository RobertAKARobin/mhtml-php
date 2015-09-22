window.onload = function(){
  var tileDrag = new DraggableContainer("tiles", [10, 10]);
  var sandbox = new TileContainer("tiles");
  sandbox.element.addEventListener('tileCreated', function(evt){
    var newTile = sandbox.element.children[sandbox.element.children.length - 1];
    var newDrag = tileDrag.newDraggable(newTile);
    newDrag.position();
    newDrag.listenForClick();
    newDrag.element.focus();
  });
}

/*
window.onload = function(){
  if(location.hash !== "#toggle"){
    document.getElementById("selfpro").style.display = "block";
  }

  (function makeDraggables(){
    var tags = document.querySelectorAll(".tags>*");
    var listeners = [];
    for(var x = tags.length - 1; x >= 0; x--){
      listeners.push(new Draggable(tags[x]));
    }
  }());

  (function loadCaptcha(){
    var script = document.createElement("SCRIPT");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "https://www.google.com/recaptcha/api.js");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();
}
*/
