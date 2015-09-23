function Draggable(canOverlap, element){
  var instance = this;
  instance.isDragging = false;
  instance.isAbleToBeDragged = true;
  instance.canOverlap = canOverlap;
  instance.element = element;
  instance.element.style.position = "absolute";
  instance.parent = instance.element.parentElement;
  instance.getInitialPositions();
  // Have to do this here, instead of .bind in the addEventListener
  // Otherwise can't removeEventListener
  instance.drag = instance.drag.bind(instance);
  instance.drop = instance.drop.bind(instance);
  instance.element.addEventListener("mousedown",
    instance.startDragging.bind(instance));
  instance.element.addEventListener("touchstart",
    instance.startDragging.bind(instance));
};
Draggable.prototype = {
  startDragging: function(evt){
    var instance = this, startEvent, endEvent;
    var isTouchy = evt.type == "touchstart";
    if(instance.isDragging || !instance.isAbleToBeDragged){
      return;
    }else{
      instance.isDragging = true;
    }
    instance.getStartingPositions(evt);
    startEvent = isTouchy ? "touchmove" : "mousemove";
    endEvent = isTouchy ? "touchend" : "mouseup";
    window.addEventListener(startEvent, instance.drag);
    window.addEventListener(endEvent, instance.drop);
  },
  drag: function(evt){
    var instance = this;
    var element = instance.element;
    var evt = evt.type == "touchmove" ? evt.touches[0] : evt;
    var newTop = instance.getNewPosition("top", evt);
    var newLeft = instance.getNewPosition("left", evt);
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  },
  drop: function(evt){
    var instance = this;
    instance.isDragging = false;
    window.removeEventListener("touchmove", instance.drag);
    window.removeEventListener("touchend", instance.drop);
    window.removeEventListener("mousemove", instance.drag);
    window.removeEventListener("mouseup", instance.drop);
  },
  getInitialPositions: function(){
    var instance = this;
    var element = instance.element;
    var offsetParent = element.offsetParent;
    var overlapX = (element.offsetWidth / 2);
    var overlapY = (element.offsetHeight / 2);
    instance.originPosition = {
      top: element.offsetTop,
      left: element.offsetLeft
    }
    instance.maxPosition = {
      top: offsetParent.offsetHeight - (element.offsetHeight + element.offsetTop) + overlapY,
      left: offsetParent.offsetWidth - (element.offsetWidth + element.offsetLeft) + overlapX
    }
    instance.minPosition = {
      top: 0 - (element.offsetTop + overlapY),
      left: 0 - (element.offsetLeft + overlapX)
    }
  },
  getStartingPositions: function(evt){
    var instance = this;
    instance.startingPosition = {
      top: instance.element.offsetTop,
      left: instance.element.offsetLeft
    }
    instance.startingCursor = {
      top: evt.clientY,
      left: evt.clientX
    }
  },
  getNewPosition: function(direction, evt){
    var instance = this;
    var axis = (direction == "top") ? "Y" : "X";
    var cursorChange = evt["client" + axis] - instance.startingCursor[direction];
    var elementPos = instance.startingPosition[direction] + cursorChange;
    var maxPos = instance.maxPosition[direction];
    var minPos = instance.minPosition[direction];
    if(elementPos > maxPos){
      return maxPos;
    }else if(elementPos < minPos){
      return minPos;
    }else{
      return elementPos;
    }
  },
  setPosition: function(direction, value){
    var instance = this;
    instance.element.style[direction] = value + "px";
  },
  placeRelativeTo: function(base){
    var instance = this;
    var maxPos = instance.maxPosition;
    var startingPosition = {
      top: base.offsetTop,
      left: base.offsetLeft + base.offsetWidth
    }
    if(startingPosition.left > maxPos.left){
      startingPosition.left = 0;
      startingPosition.top = base.offsetTop + base.offsetHeight;
      if(startingPosition.top > maxPos.top){
        startingPosition.top = base.offsetTop - instance.element.offsetHeight;
      }
    }
    instance.element.style.top = startingPosition.top + "px";
    instance.element.style.left = startingPosition.left + "px";
  }
};
