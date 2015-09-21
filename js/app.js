(function(){
  angular.module('magnetic', [

  ])
  .directive('t', [
    tagDirective
  ])
  .controller('tagController', [
    '$http',
    tagController
  ])
}());

function tagDirective(){
  return {
    template: "<input class='tag' />",
    replace: true,
    link: link
  }
  function link(scope, element){
    new Draggable(element[0]);
    element.bind("click", function(){
      this.focus();
    });
  }
}

function tagController($http){
  var ctrl = this;
  $http.get("./assets/tiles.txt").then(function(response){
    ctrl.tags = response.data.trim().replace(/(\s\s|\n)/g, "*").split("*");
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
