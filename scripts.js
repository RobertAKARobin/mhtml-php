var Draggable = function(el){
  var self = this;
  this.el = el;
  this.el.style.left = "0px";
  this.el.style.top = "0px";
  this.origin = {};
  this.listeners.drag = new Listener(this.el, ["mousedown", "touchstart"], this.drag, this);
}
Draggable.prototype = {
  listeners: {},
  drag: function(evt){
    this.origin.left = parseInt(this.el.style.left) - evt.clientX;
    this.origin.top = parseInt(this.el.style.top) - evt.clientY;
    this.listeners.move = new Listener(document, ["mousemove", "touchmove"], this.move, this);
    this.listeners.drop = new Listener(document, ["mouseup", "touchend"], this.drop, this);
  },
  move: function(evt){
    this.el.style.left = this.origin.left + evt.clientX + "px";
    this.el.style.top = this.origin.top + evt.clientY + "px";
  },
  drop: function(){
    this.listeners.move.stop();
    this.listeners.drop.stop();
  }
}

var Listener = function(el, events, cb, parent){
  var self = this;
  this.el = el;
  this.parent = parent;
  if(typeof events === "string"){
    this.events = new Array(events);
  }else{
    this.events = events;
  }
  this.callback = function(evt){
    if(!evt.clientX){
      evt = evt.touches[0];
    }
    cb.call(parent, evt);
  }
  this.start();
}
Listener.prototype = {
  events: [],
  start: function(){
    for(var x = this.events.length - 1; x >= 0; x--){
      if(this.el.attachEvent){
        this.el.attachEvent("on" + this.events[x], this.callback);
      }else{
        this.el.addEventListener(this.events[x], this.callback);
      }
    }
  },
  stop: function(){
    for(var x = this.events.length - 1; x >= 0; x--){
      if(this.el.detachEvent){
        this.el.detachEvent("on" + this.events[x], this.callback);
      }else{
        this.el.removeEventListener(this.events[x], this.callback);
      }
    }
  }
}


var Tags = function(){

  var els = document.querySelectorAll("#tags li");

  var foo = [];

  for(var x = els.length - 1; x >= 0; x--){
    foo.push(new Draggable(els[x]));
  }

}

window.onload = Tags;
