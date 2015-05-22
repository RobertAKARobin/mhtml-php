var Draggable = function(el){
  this.el = el;
  this.el.style.left = "0px";
  this.el.style.top = "0px";
  this.origin = {};

  this.handle = {
    drag: this.drag.bind(this),
    move: this.move.bind(this)
  }

  this.el.addEventListener("mousedown", this.handle.drag);
}

Draggable.prototype = {
  drag: function(evt){
    evt.preventDefault();
    this.origin.left = parseInt(this.el.style.left) - evt.clientX;
    this.origin.top = parseInt(this.el.style.top) - evt.clientY;
    window.addEventListener("mousemove", this.handle.move);
    window.addEventListener("mouseup", this.drop.bind(this));
  },
  move: function(evt){
    this.el.style.left = this.origin.left + evt.clientX + "px";
    this.el.style.top = this.origin.top + evt.clientY + "px";
  },
  drop: function(){
    window.removeEventListener("mousemove", this.handle.move);
  }
}

var Tags = function(){

  var els = document.querySelectorAll("#tags li");

  for(var x = els.length - 1; x >= 0; x--){
    new Draggable(els[x]);
  }

}

window.onload = Tags;
