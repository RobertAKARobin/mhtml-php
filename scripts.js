var Draggable = function(el){
  var self = this;
  this.el = el;
  this.el.style.left = "0px";
  this.el.style.top = "0px";
  this.origin = {};
  this.events = {};

  function listener(el, events, callback, start){
    if(typeof events === "string") events = new Array(events);
    for(var x = events.length - 1; x >= 0; x--){
      if(start){
        if(el.attachEvent){
          el.attachEvent("on" + events[x], callback);
        }else{
          el.addEventListener(events[x], callback);
        }
      }else{
        if(el.detachEvent){
          el.detachEvent("on" + events[x], callback);
        }else{
          el.removeEventListener(events[x], callback);
        }
      }
    }
  }

  function drag(evt){
    evt.preventDefault();
    if(!evt.clientX){
      evt = evt.touches[0];
    }
    self.origin.left = parseInt(self.el.style.left) - evt.clientX;
    self.origin.top = parseInt(self.el.style.top) - evt.clientY;
    listener(document, ["mousemove", "touchmove"], move, true);
    listener(document, ["mouseup", "touchend"], drop, true);
  }

  function move(evt){
    evt.preventDefault();
    if(!evt.clientX){
      evt = evt.touches[0];
    }
    self.el.style.left = self.origin.left + evt.clientX + "px";
    self.el.style.top = self.origin.top + evt.clientY + "px";
  }

  function drop(){
    listener(document, ["mousemove", "touchmove"], move, false);
    listener(document, ["mouseup", "touchend"], drop, false);
  }

  listener(this.el, ["mousedown", "touchstart"], drag, true);

}

var Tags = function(){

  var els = document.querySelectorAll("#tags li");

  for(var x = els.length - 1; x >= 0; x--){
    new Draggable(els[x]);
  }

}

window.onload = Tags;
