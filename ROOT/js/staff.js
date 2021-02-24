let items = document.querySelectorAll("#twoPtable");
var dragItem;
var container = document.getElementById("bordskarta");
var order = document.getElementById("order");
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var contSize = 0;
var itemSize = 0;
var nextNum = 1;
var currentTableID = 0;

console.log(itemSize);

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);
loadAllTables();
showMenu();

function dragStart(e) {
    items = document.querySelectorAll("#twoPtable");
    items.forEach(function(item) {
        if (e.target === item) {
            dragItem = item;
        active = true;
    } 
    })

    contSize = document.documentElement.clientWidth/100*35;
    itemSize = document.documentElement.clientWidth/100*5;
    xOffset = document.documentElement.clientWidth/100;
    if(active) {
      var positions = dragItem.style.transform;
      positions = positions.split('(');
      positions = positions[1].split("px");
      var xVal = parseInt(positions[0]);
      positions = positions[1].split(", ");
      var yVal = parseInt(positions[1]);
      console.log(positions);
    }
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = xVal /*e.clientX /*- xOffset;*/;
    initialY = yVal /*e.clientY /*- yOffset*/;
  }
  console.log("x: " + initialX + "   y: " + initialY);
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
      currentX = e.clientX - 90;// - initialX;
      currentY = e.clientY - 250;//- initialY;
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

    setTranslate(currentX, currentY, dragItem);
    console.log("HEJ");
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function addTable() {
  var div = document.createElement('div');
  div.id = 'twoPtable';
  div.draggable = true;

  var button = document.createElement('button');
  button.style = "width: 90%; height: 40%; margin-top: 5%; font-size:10px";
  button.id = "orderbtn";
  button.textContent = "Order";
  button.setAttribute("onClick", "javascript: showOrder("+nextNum+")");
  div.appendChild(button);
  
  var innerDiv = document.createElement('p');
  var text = document.createTextNode(nextNum);
  innerDiv.style = "font-size: 20px; margin-top:5%; float:left; margin-left:5%";
  innerDiv.appendChild(text);
  div.appendChild(innerDiv);

  container.appendChild(div);
  nextNum++;
}

function addTableDB(Xpos, Ypos, table_id) {
  var div = document.createElement('div');
  div.id = 'twoPtable';
  div.draggable = true;
  setTranslate(Xpos, Ypos, div);

  var button = document.createElement('button');
  button.style = "width: 90%; height: 40%; margin-top: 5%; font-size:10px";
  button.id = "orderbtn";
  button.textContent = "Order";
  button.setAttribute("onClick", "javascript: showOrder("+table_id+")");
  div.appendChild(button);

  var innerDiv = document.createElement('p');
  var text = document.createTextNode(table_id);
  innerDiv.style = "font-size: 20px; margin-top:5%; float:left; margin-left:5%";
  innerDiv.appendChild(text);
  div.appendChild(innerDiv);

  container.appendChild(div);
}

function loadAllTables() {
  for (i = 0; i < DB.tables.length; i++) {
    var table = DB.tables[i];
    addTableDB(parseInt(table.Xpos), parseInt(table.Ypos), table.table_id)
    if (nextNum == table.table_id) {
      nextNum++;
    }
  }
}

function showOrder(table_id) {
  $('#order').empty();
  $('#order').append('<div class="menuHeader"> <span style="font-weight:bold">' + "Order for table " + table_id + ' </span>' + '</div>');
  var order = getOrder(table_id);
  order = order.split(", ");
  for (var i = 0; i < order.length; i++) {
    const item = getNameFromId(order[i]);
    $('#order').append('<div class="menuItem"> <span style="font-weight:bold">' + item + ' </span>' + '<button class="removeFromOrderButton" onclick="removeFromOrder(this)">-</button> </div>');
  }
  currentTableID = table_id;
}

function addToOrder(item) {
  if (currentTableID != 0) {
    for (i=0; i < DB.orders.length; i++) {
        if (DB.orders[i].table == currentTableID) {  //parseINT?????
          DB.orders[i].item_id += ", " + getIdFromName(item.slice(0, -1));
          showOrder(currentTableID);
          return;
        }
      }
  }
}

function removeFromOrder() {
  ;
}

function showMenu(){
  var menu = allMenuBeverages();
  for (i = 0; i < menu.length; i++) {
    const element = menu[i];
    $('#menu').append('<div class="menuItem"> <span style="font-weight:bold">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
  }
}