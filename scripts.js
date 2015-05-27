var Draggable = function(el){
  var instance = this;
  this.el = el;
  this.origin = {};
  this.el.style.left = "0px";
  this.el.style.top = "0px";

  this.callback = {
    ie: {
      drag: function(evt){
        instance.origin.left = parseInt(instance.el.style.left) - evt.clientX;
        instance.origin.top = parseInt(instance.el.style.top) - evt.clientY;
        document.attachEvent("onmousemove", instance.callback.ie.move);
        document.attachEvent("onmouseup", instance.callback.ie.drop);
      },
      move: function(evt){
        instance.el.style.left = instance.origin.left + evt.clientX + "px";
        instance.el.style.top = instance.origin.top + evt.clientY + "px";
      },
      drop: function(){
        document.detachEvent("onmousemove", instance.callback.ie.move);
        document.detachEvent("onmouseup", instance.callback.ie.drop);
      }
    },
    touch: {
      drag: function(evt){
        evt = evt.touches[0];
        instance.origin.left = parseInt(instance.el.style.left) - evt.clientX;
        instance.origin.top = parseInt(instance.el.style.top) - evt.clientY;
        window.addEventListener("touchmove", instance.callback.touch.move);
        window.addEventListener("touchend", instance.callback.touch.drop);
      },
      move: function(evt){
        evt.preventDefault();
        evt = evt.touches[0];
        instance.el.style.left = instance.origin.left + evt.clientX + "px";
        instance.el.style.top = instance.origin.top + evt.clientY + "px";
      },
      drop: function(){
        window.removeEventListener("touchmove", instance.callback.touch.move);
        window.removeEventListener("touchend", instance.callback.touch.drop);
      }
    },
    drag: function(evt){
      instance.origin.left = parseInt(instance.el.style.left) - evt.clientX;
      instance.origin.top = parseInt(instance.el.style.top) - evt.clientY;
      document.addEventListener("mousemove", instance.callback.move);
      document.addEventListener("mouseup", instance.callback.drop);
    },
    move: function(evt){
      evt.preventDefault();
      instance.el.style.left = instance.origin.left + evt.clientX + "px";
      instance.el.style.top = instance.origin.top + evt.clientY + "px";
    },
    drop: function(){
      document.removeEventListener("mousemove", instance.callback.move);
      document.removeEventListener("mouseup", instance.callback.drop);
    }
  }

  if(this.ie8){
    this.el.attachEvent("onmousedown", instance.callback.ie.drag);
  }else if(this.touch){
    this.el.addEventListener("touchstart", instance.callback.touch.drag);
  }else{
    this.el.addEventListener("mousedown", instance.callback.drag);
  }
}

Draggable.prototype = {
  ie8: window.attachEvent ? true : false,
  touch: "ontouchstart" in window ? true : false
}

window.onload = function(){
  var tags = document.querySelectorAll("#tags li");
  var listeners = [];
  for(var x = tags.length - 1; x >= 0; x--){
    listeners.push(new Draggable(tags[x]));
  }
}
