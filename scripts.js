function forEach(collection, callback){
  for(var x = collection.length - 1; x >= 0; x--){
    callback.call(this, collection[x]);
  }
}

var Draggable = function(el){
  this.el = el;
  this.el.style.left = "0px";
  this.el.style.top = "0px";
  this.origin = {};

  this.handle = {
    drag: this.drag.bind(this),
    move: this.move.bind(this)
  }

  this.events = {
    start: new Listener(this.el, ["mousedown", "touchstart"], this.handle.drag),
    move: {},
    end: {}
  }
}
Draggable.prototype = {
  drag: function(evt){
    this.origin.left = parseInt(this.el.style.left) - evt.clientX;
    this.origin.top = parseInt(this.el.style.top) - evt.clientY;
    this.events.move = new Listener(window, ["mousemove", "touchmove"], this.handle.move);
    this.events.end = new Listener(window, ["mouseup", "touchend"], this.drop.bind(this));
  },
  move: function(evt){
    this.el.style.left = this.origin.left + evt.clientX + "px";
    this.el.style.top = this.origin.top + evt.clientY + "px";
  },
  drop: function(){
    this.events.move.stopListening();
  }
}

var Listener = function(el, triggers, callback){
  this.el = el;
  this.triggers = [];
  this.callback = function(evt){
    evt.preventDefault();
    if(evt instanceof TouchEvent){
      evt = evt.touches[0];
    }
    callback(evt);
  }

  if(typeof triggers === "string"){
    this.triggers.push(triggers);
  }else{
    this.triggers = triggers;
  }
  forEach.call(this, this.triggers, function(trigger){
    this.listenFor(trigger, this.callback);
  });
}
Listener.prototype = {
  listenFor: function(trigger){
    if(this.el.attachEvent){
      this.el.attachEvent(trigger, this.callback); 
    }else{
      this.el.addEventListener(trigger, this.callback);
    }
  },
  stopListening: function(){
    forEach.call(this, this.triggers, function(trigger){
      if(this.el.detachEvent){
        this.el.detachEvent(trigger, this.callback);
      }else{
        this.el.removeEventListener(trigger, this.callback);
      }
    });
  }
}

var Tags = function(){

  var els = document.querySelectorAll("#tags li");

  for(var x = els.length - 1; x >= 0; x--){
    new Draggable(els[x]);
  }

}

window.onload = Tags;
