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
var menuInfoCont = document.getElementById("menuInfoCont");
var lastMenu = 'all';

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
    }
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = xVal /*e.clientX /*- xOffset;*/;
    initialY = yVal /*e.clientY /*- yOffset*/;
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
  addEmptyOrder(nextNum);
  nextNum++;
}

function addTableDB(Xpos, Ypos, table_id) {
  var div = document.createElement('div');
  div.id = 'twoPtable';
  div.draggable = true;
  setTranslate(Xpos, Ypos, div);

  var button = document.createElement('button');
  button.style = "width: 90%; height: 40%; margin-top: 5%; font-size:0.5vw";
  button.id = "orderbtn";
  button.textContent = "Order";
  button.setAttribute("onClick", "javascript: showOrder("+table_id+")");
  div.appendChild(button);

  var innerDiv = document.createElement('p');
  var text = document.createTextNode(table_id);
  innerDiv.style = "font-size: 1vw; margin-top:5%; float:left; margin-left:5%";
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

function getTotalCost(order) {
  var totalCost = 0;
  for (let key in order) {
    const cost = parseInt(getCostFromId(key));
    const no = order[key];
    totalCost += cost*no;
  }
  return totalCost;
}

function showOrder(table_id) {
  $('#order').empty();
  $('#order').append('<div class="menuHeader"> <span style="font-weight:bold">' + get_string('orderHeader') /*"Order for table: "*/ + table_id + ' </span>' + '</div>');
  var order = getOrder(table_id);
  $('#order').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('orderSubHeader') /*"Total cost: "*/ + getTotalCost(order) + "kr" +  ' </span>' + '</div>');
  for(let key in order) {
    const item = getNameFromId(key);
    $('#order').append('<div class="menuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + item + ": " + order[key] +  ' </span>' + '<button class="removeFromOrderButton" onclick="removeFromOrder(this.parentElement.children[0].innerText)">-</button> <button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
  }
  currentTableID = table_id;
}

function addToOrder(item) {
  console.log(item);
  if (currentTableID != 0) {
    for (var i=0; i < DB.orders.length; i++) {
        if (DB.orders[i].table == currentTableID) {
          var key;
          if (item.includes(':')) {
            key = getIdFromName(item.split(': ')[0]);
          } else {
            key = getIdFromName(item.slice(0, -1));
          }
          if (key in DB.orders[i].item_id) {
            DB.orders[i].item_id[key] = DB.orders[i].item_id[key] + 1;
          } else {
            DB.orders[i].item_id[key] = 1;
          }
          showOrder(currentTableID);
          return;
        }
      }
  }
}

function removeFromOrder(item) {
  if (currentTableID != 0) {
    for (var i=0; i < DB.orders.length; i++) {
        if (DB.orders[i].table == currentTableID) {
          var key = getIdFromName(item.split(':')[0]);
          var dic = DB.orders[i].item_id;
          if (dic[key] == 1) {
            delete DB.orders[i].item_id[key];
          } else {
            DB.orders[i].item_id[key]--;
          }
          showOrder(currentTableID);
          return;
        }
      }
  }
}

function addBasicMenu(){
  $('#menu').empty();
  $('#menu').append('<button class="sortButton" id=sortAll onclick=showMenu()></button>');
  $('#menu').append('<button class="sortButton" id=sortBeer onclick=showMenu("beer")></button>');
  $('#menu').append('<button class="sortButton" id=sortWine onclick=showMenu("wine")></button>');
  $('#menu').append('<button class="sortButton" id=sortSpirits onclick=showMenu("spirits")></button>');
  update_view();
}

function showParticularMenu(menu) {
  for (var i = 0; i < menu.length; i++) {
    const element = menu[i];
    console.log(element);
    if (element[4] === "0") {
      $('#menu').append('<div class="menuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    } else {
      $('#menu').append('<div class="hiddenMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');

    }
  }
}

function menuInfo(item) {
  var id;
  if (item.includes(':')) {
    id = getIdFromName(item.split(': ')[0]);
  } else {
    id = getIdFromName(item.slice(0, -1));
  }
  
  var type = getTypeFromId(id);
  console.log(type);
  $('#menuInfo').empty();
  $('#menuInfo').append('<span class="close">' + "&times;" + '</span>');
  if (type.includes("Öl")) {
    console.log("öl");
    var beerInfo = getBeerInfoFromId(id);
    $('#menuInfo').append('<span>' + get_string('spirName') + beerInfo[0] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('beerBrewery') + beerInfo[1] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('beerCountry') + beerInfo[2] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirType') + beerInfo[3] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStrength') + beerInfo[4] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirSize') + beerInfo[5] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('beerPrice') + beerInfo[6] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStock') + beerInfo[7] + "<br>" + ' </span>');
    $('#menuInfo').append('<button class="hideButton" onclick=hideItem(' + id + ')>' + get_string('hideItem') + '</button>');

  } else if (type.includes("vin")) {
    var wineInfo = getWineInfoFromId(id);
    $('#menuInfo').append('<span>' + get_string('spirName') + wineInfo[0] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('wineYear') + wineInfo[1] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('wineProducer') + wineInfo[2] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirType') + wineInfo[3] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('wineGrape') + "??" + wineInfo[4] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirSize') + wineInfo[5] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStock') + wineInfo[6] + "<br>" + ' </span>');
    $('#menuInfo').append('<button class="hideButton" onclick=hideItem(' + id + ')>' + get_string('hideItem') + '</button>');
  } else {
    var spiritInfo = getSpiritInfoFromId(id);
    $('#menuInfo').append('<span>' + get_string('spirName') + spiritInfo[0] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirType') + spiritInfo[1] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStrength') + spiritInfo[2] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStock') + spiritInfo[3] + "<br>" + ' </span>');
    $('#menuInfo').append('<button class="hideButton" onclick=hideItem(' + id + ')>' + get_string('hideItem') + '</button>');
  }

  menuInfoCont.style.display = "block";
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    menuInfoCont.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == menuInfoCont) {
      menuInfoCont.style.display = "none";
    }
  }
  
  console.log(id);
}


function hideItem(id) {
  for (i = 0; i < DB2.spirits.length; i++) {
    if (DB2.spirits[i].artikelid == id) {
      if (DB2.spirits[i].hidden === "0") {
        DB2.spirits[i].hidden = "1";
      } else {
        DB2.spirits[i].hidden = "0";
      }
      showMenu(lastMenu);
      return;
    }
  }
}


function addEmptyOrder(id) {
  DB.orders.push({ table: id, item_id: {}});
}

function showMenu(type) {
  lastMenu = type;
  addBasicMenu();
  switch (type) {
    case 'beer':
      showParticularMenu(allBeveragesOfType("Öl"));
      break;
    case 'wine':
      showParticularMenu(allBeveragesOfType("vin"));
      break;
    case 'spirits':
      showParticularMenu(allBeveragesWithStrength(20));
      break;
    default:
      showParticularMenu(allMenuBeverages());
  }
}

function updateLangStaff() {
  showOrder(currentTableID);
}

function notifySecurity() {
  console.log("Security notified!");
}