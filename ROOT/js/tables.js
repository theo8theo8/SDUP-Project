let items = document.querySelectorAll("#twoPtable");
var dragItem;
var container = document.getElementById("bordskarta");
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var contSize = 0;
var itemSize = 0;

console.log(itemSize);

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
    items = document.querySelectorAll("#twoPtable");
    items.forEach(function(item) {
        if (e.target === item) {
            dragItem = item;
        active = true;
    } 
    })

    contSize = document.documentElement.clientWidth/100*35;
    console.log(contSize);
    itemSize = document.documentElement.clientWidth/100*5;

  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag(e) {
  if (active) {
  
    e.preventDefault();
  
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    if (currentX > contSize-itemSize)
    {
        currentX = contSize-itemSize;
    }
    if (currentX < 0)
    {
        currentX = 0;
    }
    if (currentY > contSize-itemSize)
    {
        currentY = contSize-itemSize;
    }
    if (currentY < 0)
    {
        currentY = 0;
    }

    //xOffset = currentX;
    //yOffset = currentY;

    setTranslate(currentX, currentY, dragItem);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function addTable() {
    var div = document.createElement('div');
    div.id = 'twoPtable';
    div.draggable = true;
    container.appendChild(div);
}