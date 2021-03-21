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
var currentFiltering = 'none';
var alcoPercent = 0;

// =====================================================================================================
// Adds event-listeners for the three different activities
//
container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

// =====================================================================================================
// Loads all the tables, and show the entire menu in it's container
//
loadAllTables();
showMenu();

// =====================================================================================================
// Specifies the behaviour to use when a drag is started
//
function dragStart(e) {
    items = document.querySelectorAll("#twoPtable");
    //Checks which table is the target
    items.forEach(function(item) {
        if (e.target === item) {
            dragItem = item;
        active = true;
    } 
    })

    //Gets the size of the page
    contSize = document.documentElement.clientWidth/100*35;
    itemSize = document.documentElement.clientWidth/100*5;
    xOffset = document.documentElement.clientWidth/100;
    //Gets positions from the actual html-object
    if(active) {
      var positions = dragItem.style.transform;
      positions = positions.split('(');
      positions = positions[1].split("px");
      initialX = parseInt(positions[0]);
      positions = positions[1].split(", ");
      initialY = parseInt(positions[1]);
    }
}

// =====================================================================================================
// Specifies the behaviour to use when a drag is ended
//
function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  active = false;
}

// =====================================================================================================
// Specifies the behaviour to use during a drag
//
function drag(e) {
  if (active) {
    e.preventDefault();
  
    currentX = e.clientX - 90;
    currentY = e.clientY - 250;
    
    //Multiple if-statements to check that the move is inside the borders of the container
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

// =====================================================================================================
// Sets the new coordinates of the object
//
function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

// =====================================================================================================
// Adds a new table to the tablechart
//
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
  //Adds an empty order in the DB
  addEmptyOrder(nextNum);
  //Increases the number of the next table
  nextNum++;
}

// =====================================================================================================
// Used during setup, to show all the tables from the database
//
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

// =====================================================================================================
// Loads all the tables from the DB into their specified positions
//
function loadAllTables() {
  for (i = 0; i < DB.tables.length; i++) {
    var table = DB.tables[i];
    addTableDB(parseInt(table.Xpos), parseInt(table.Ypos), table.table_id)
    if (nextNum == table.table_id) {
      nextNum++;
    }
  }
}

// =====================================================================================================
// Gets the total cost of an order
//
function getTotalCost(order) {
  var totalCost = 0;
  for (let key in order) {
    const cost = parseInt(getCostFromId(key));
    const no = order[key];
    totalCost += cost*no;
  }
  return totalCost;
}

// =====================================================================================================
// Shows the order for a table (table_id)
//
function showOrder(table_id) {
  $('#order').empty();
  $('#order').append('<div class="menuHeader"> <span style="font-weight:bold">' + get_string('orderHeader') /*"Order for table: "*/ + table_id + ' </span>' + '</div>');
  var order = getOrder(table_id);
  $('#order').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('orderSubHeader') /*"Total cost: "*/ + getTotalCost(order) + "kr" +  ' </span>' + '</div>');
  for(let key in order) {
    const item = getNameFromId(key);
    //Checks that the item hasn't been removed from the DB
    if (item === "null") {
      removeFromOrderWithId(parseInt(key));
    } else {
      $('#order').append('<div class="menuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + item + ": " + order[key] +  ' </span>' + '<button class="removeFromOrderButton" onclick="removeFromOrder(this.parentElement.children[0].innerText)">-</button> <button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    }
  }
  $('#order').append('<button class="bigSortButton" onclick=sendOrder("console")>' + get_string('finishOrder') + '</button>');
  $('#order').append('<button class="bigSortButton" onclick=sendOrder("nocon")>' + get_string('deleteOrder') + '</button>');
  currentTableID = table_id;
}

// =====================================================================================================
// Returns the current table from the DB
//
function getCurrentTable() {
  if (currentTableID != 0) {
    for (var i=0; i < DB.orders.length; i++) {
      if (DB.orders[i].table == currentTableID) {
        return DB.orders[i];
      }
    }
  }
  return "error";
}

// =====================================================================================================
// Checks whether there is enough items in stock for every item in the order
//
function outOfStock() {
  var oOS = false;
  var table = getCurrentTable();
  if (table === "error") return;
  var dic = table.item_id;
  Object.entries(dic).forEach(([key, value]) => {
    var stock = parseInt(getStockFromId(key));
    if (stock < value) {
      oOS = true;
      $('#order').prepend('<span style="color:red">' + get_string('outOfStock') + getNameFromId(key) + ' </span></br>');
      console.log("Not enough in stock for: " + getNameFromId(key));
    }
  })
  return oOS;
}

// =====================================================================================================
// Changes the stock when an order has been sent
//
function reviseStock() {
  var table = getCurrentTable();
  if (table === "error") return;
  var dic = table.item_id;
  Object.entries(dic).forEach(([key, value]) => {
    changeStock(key, -value);
  })
}

// =====================================================================================================
// Sends an order, either removing it or sending it to the bar
//
function sendOrder(con) {
  var table = getCurrentTable();
  if (table === "error") return;
  //Check if the order is removed or sent
  if(con === "console") {
    if (outOfStock() == true) {
      return;
    }
    console.log("---ORDER-START---");
    console.log("Table-id: " + currentTableID);
    console.log(table.item_id);
    console.log("---ORDER-END---");
    reviseStock();
    //Unlocks the order if it is the current one in the user mode
    if (usercurrentTableID == currentTableID) {
      orderLock = 0;
    }
  } else {
    console.log("---DEL-ORDER-START---");
    console.log("Table-id: " + currentTableID);
    console.log("---DEL-ORDER-END---");
  }
  table.item_id = {};
  //Updates the order and menu
  showOrder(currentTableID);
  showMenu(lastMenu);
  return;
}

// =====================================================================================================
// Adds or increases an item to/on the order
//
function addToOrder(item) {
  var table = getCurrentTable();
  //Checks that the order isn't full(above 10)
  if(checkFullOrder(table.item_id))
  {
    return;
  }
  var key;
  //Depending where it was added from, the variable item is different
  if (item.includes(':')) {
    key = getIdFromName(item.split(': ')[0]);
  } else {
    key = getIdFromName(item.slice(0, -1));
  }
  if (key in table.item_id) {
    table.item_id[key] = table.item_id[key] + 1;
  } else {
    table.item_id[key] = 1;
  }
  showOrder(currentTableID);
  return;
}

// =====================================================================================================
// Removes an item from an order using the id of the item
//
function removeFromOrderWithId(id) {
  var table = getCurrentTable();
  if (table === "error") return;
  delete table.item_id[id];
  return;
}

// =====================================================================================================
// Removes an item from an order using a text including the name of the item
//
function removeFromOrder(item) {
  var table = getCurrentTable();
  if (table === "error") return;
  var key = getIdFromName(item.split(':')[0]);
  var dic = table.item_id;
  if (dic[key] == 1) {
    delete table.item_id[key];
  } else {
    table.item_id[key]--;
  }
  showOrder(currentTableID);
  return;
}

// =====================================================================================================
// Adds the sorting-buttons for the menu
//
function addBasicMenu(){
  $('#menu').empty();
  switch (currentFiltering) {
    case "cat":
      $('#menu').append('<button class="sortButton" id=sortBack onclick=showMenu("back")></button>');
      $('#menu').append('<button class="sortButton" id=sortAll onclick=showMenu()></button>');
      $('#menu').append('<button class="sortButton" id=sortBeer onclick=showMenu("beer")></button>');
      $('#menu').append('<button class="sortButton" id=sortWine onclick=showMenu("wine")></button>');
      $('#menu').append('<button class="sortButton" id=sortSpirits onclick=showMenu("spirits")></button>');
      break;
    case "rest":
      $('#menu').append('<button class="sortButton" id=sortBack onclick=showMenu("back")></button>');
      $('#menu').append('<button class="sortButton" id=sortBelow onclick=showMenu("alcoBelow")></button>');
      $('#menu').append('<input class="sortInput" type="number" id="alco_percent" min=1 max=100>');
      $('#menu').append('<button class="sortButton" id=sortAbove onclick=showMenu("alcoAbove")></button>');
      $('#menu').append('<button class="sortButton" id=sortTannins onclick=showMenu("tannin")></button>');
      $('#menu').append('<button class="sortButton" id=sortGluten onclick=showMenu("gluten")></button>');
      break;
    default:
      $('#menu').append('<button class="bigSortButton" id=sortCat onclick=showMenu("cat")></button>');
      $('#menu').append('<button class="bigSortButton" id=sortRest onclick=showMenu("rest")></button>');
      break;
  }
  update_view();
}

// =====================================================================================================
// Shows the actual menu, using what is sent into the function
//
function showParticularMenu(menu) {
  if (menu.length == 0) {
    $('#menu').append('<div class="orderSubHeader"><span style="font-weight:bold">' + get_string('sorryMessage') + ' </span>' + '</div>');
  }
  for (var i = 0; i < menu.length; i++) {
    const element = menu[i];
    if (element[4] === "1") {
      $('#menu').append('<div class="hiddenMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    } else if(parseInt(element[2]) < 5) {
      if(parseInt(element[2]) == 0) {
        $('#menu').append('<div class="noStockMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
      } else {
        $('#menu').append('<div class="lowMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
      }
    } else {
      $('#menu').append('<div class="menuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    }
  }
}

// =====================================================================================================
// Shows info for a item on the menu, different depending on the type of beverage
//
function menuInfo(item) {
  var id;
  if (typeof item === "number") {
    id = item;
  } else if (item.includes(':')) {
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
    endOfMenuInfo(id);
  } else if (type.includes("vin")) {
    var wineInfo = getWineInfoFromId(id);
    $('#menuInfo').append('<span>' + get_string('spirName') + wineInfo[0] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('wineYear') + wineInfo[1] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('wineProducer') + wineInfo[2] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirType') + wineInfo[3] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('wineGrape') + "??" + wineInfo[4] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirSize') + wineInfo[5] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStock') + wineInfo[6] + "<br>" + ' </span>');
    endOfMenuInfo(id);
  } else {
    var spiritInfo = getSpiritInfoFromId(id);
    $('#menuInfo').append('<span>' + get_string('spirName') + spiritInfo[0] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirType') + spiritInfo[1] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStrength') + spiritInfo[2] + "<br>" + ' </span>');
    $('#menuInfo').append('<span>' + get_string('spirStock') + spiritInfo[3] + "<br>" + ' </span>');
    endOfMenuInfo(id);
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

// =====================================================================================================
// Inputs and buttons on the bottom of the menuinfo modal
//
function endOfMenuInfo(id) {
  $('#menuInfo').append('<button class="hideButton" onclick=hideItem(' + id + ')>' + get_string('hideItem') + '</button><br>');
  $('#menuInfo').append('<input class = infoInput placeholder= -20/20 type="number" id="stock_change">');
  $('#menuInfo').append('<button class="hideButton" onclick=editStock(' + id + ')>' + get_string('changeStock') + '</button>');
  $('#menuInfo').append('<input class = infoInput placeholder= 75 type="number" id="price_change">');
  $('#menuInfo').append('<button class="hideButton" onclick=editPrice(' + id + ')>' + get_string('changePrice') + '</button>');
}

// =====================================================================================================
// Edits the stock of a beverage in the DB
//
function editStock(id) {
  changeStock(id, document.getElementById("stock_change").value);
  menuInfo(id);
  showMenu(lastMenu);
  showOrder(currentTableID);
}

// =====================================================================================================
// Edits the price of a beverage in the DB
//
function editPrice(id) {
  changePrice(id, document.getElementById("price_change").value);
  menuInfo(id);
  showMenu(lastMenu);
  showOrder(currentTableID);
}

// =====================================================================================================
// Hides an item(not deletes) from the menu
//
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

// =====================================================================================================
// Adds an empty order to the db
//
function addEmptyOrder(id) {
  DB.orders.push({ table: id, item_id: {}});
}

// =====================================================================================================
// Decides which menu to show, depending on the current filtering
//
function showMenu(type) {
  switch (type) {
    case 'beer':
      addBasicMenu();
      lastMenu = type;
      showParticularMenu(allBeveragesOfType("Öl"));
      break;
    case 'wine':
      addBasicMenu();
      lastMenu = type;
      showParticularMenu(allBeveragesOfType("vin"));
      break;
    case 'spirits':
      addBasicMenu();
      lastMenu = type;
      showParticularMenu(allBeveragesWithStrength("above", 20));
      break;
    case 'alcoAbove':
      lastMenu = type;
      if (document.getElementById("alco_percent") != null) {
        alcoPercent = document.getElementById("alco_percent").value;
      }
      addBasicMenu();
      showParticularMenu(allBeveragesWithStrength("above", alcoPercent));
      break;
    case 'alcoBelow':
      lastMenu = type;
      if (document.getElementById("alco_percent") != null) {
        alcoPercent = document.getElementById("alco_percent").value;
      }
      addBasicMenu();
      showParticularMenu(allBeveragesWithStrength("below", alcoPercent));
      break;
    case 'tannin':
      addBasicMenu();
      lastMenu = type;
      showParticularMenu([]);
      break;
    case 'gluten':
      addBasicMenu();
      lastMenu = type;
      showParticularMenu([]);
      break;
    case 'rest':
      currentFiltering = "rest";
      showMenu(lastMenu);
      break;
    case 'cat':
      currentFiltering = "cat";
      showMenu(lastMenu);
      break;
    case 'back':
      currentFiltering = "none";
      showMenu(allMenuBeverages());
      break;
    default:
      addBasicMenu();
      lastMenu = type;
      showParticularMenu(allMenuBeverages());
  }
}

// =====================================================================================================
// The order and accountbox must be updated specifically when the language changes
//
function updateLangStaff() {
  showOrder(currentTableID);
  showAccountBox();
}

// =====================================================================================================
// Notifies security in the console
//
function notifySecurity() {
  console.log("Security notified!");
}

// =====================================================================================================
// Checks whether an order is full or not
//
function checkFullOrder(dic) {
  var total = 0;
  for(var key in dic) {
    total += dic[key];
  }
  return total == 10;
}

// =====================================================================================================
// Updates the bartenderview, after changes may have been made in other parts of the program
//
function updateBartenderView() {
  if (currentTableID != 0) {
    showOrder(currentTableID);
  }
  showMenu(lastMenu);
  showAccountBox();
}

// =====================================================================================================
// Adds all the html for the accountbox
//
function showAccountBox() {
  $('#account').empty();
  $('#account').append('<div class="orderSubHeader"><span style="font-weight:bold">' + get_string('addToVip') + ' </span>' + '</div>');
  $('#account').append('<input class = accountInput placeholder= username type="text" id="account_usr">');
  $('#account').append('<input class = accountInput placeholder= 500 type="number" id="account_amount">');
  $('#account').append('<button class="accountButton" onclick=editAccount()>' + get_string('changeCash') + '</button>');
}

// =====================================================================================================
// Updates the balance of a VIP-user's account
//
function editAccount(id) {
  var usrName = document.getElementById("account_usr").value;
  var amount = document.getElementById("account_amount").value;
  if (amount > 0) {
    if (increaseBalance(usrName, amount) === "worked") {
      console.log("Balance increased for " + usrName + " by " + amount + "kr");
    }
  }
}