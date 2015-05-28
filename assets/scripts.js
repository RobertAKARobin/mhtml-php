var Draggable = function(el){
  var instance = this;
  this.el = el;
  this.origin = {};
  this.el.style.left = "0px";
  this.el.style.top = "0px";

  this.callback = {
    drag: function(evt){
      if(!instance.ie8) evt.preventDefault();
      if(instance.touch) evt = evt.touches[0];
      instance.origin.left = parseInt(instance.el.style.left) - evt.clientX;
      instance.origin.top = parseInt(instance.el.style.top) - evt.clientY;
      instance.start(window, "move", instance.callback.move);
      instance.start(window, instance.touch ? "end" : "up", instance.callback.drop);
    },
    move: function(evt){
      if(!instance.ie8) evt.preventDefault();
      if(instance.touch) evt = evt.touches[0];
      instance.el.style.left = instance.origin.left + evt.clientX + "px";
      instance.el.style.top = instance.origin.top + evt.clientY + "px";
    },
    drop: function(){
      instance.stop(window, "move", instance.callback.move);
      instance.stop(window, instance.touch ? "end" : "up", instance.callback.drop);
    }
  }

  instance.start(instance.el, instance.touch ? "start" : "down", instance.callback.drag);
}

Draggable.prototype = {
  ie8: window.attachEvent ? true : false,
  touch: "ontouchstart" in window ? true : false,
  start: function(el, event, callback){
    if(this.ie8){
      if(el == window) el = document;
      el.attachEvent("onmouse" + event, callback);
    }else if(this.touch){
      el.addEventListener("touch" + event, callback);
    }else{
      el.addEventListener("mouse" + event, callback);
    }
  },
  stop: function(el, event, callback){
    if(this.ie8){
      if(el == window) el = document;
      el.detachEvent("onmouse" + event, callback);
    }else if(this.touch){
      el.removeEventListener("touch" + event, callback);
    }else{
      el.removeEventListener("mouse" + event, callback);
    }
  }
}

window.onload = function(){
  var tags = document.querySelectorAll(".tags>*");
  var listeners = [];
  for(var x = tags.length - 1; x >= 0; x--){
    listeners.push(new Draggable(tags[x]));
  }
}
