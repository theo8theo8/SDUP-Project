// =====================================================================================================
// Table id for user/vip-user
//
var usercurrentTableID = 3;
var currentFiltering = 'none';
// =====================================================================================================
// Initialization for menus
//
welcomeUser()

// =====================================================================================================
// Shows correct menu depending on soriting choice
//
function usershowMenu(type) {
  switch (type) {
    case 'beer':
      useraddBasicMenu();
      lastMenu = type;
      usershowParticularMenu(allBeveragesOfType("Öl"));
      break;
    case 'wine':
      useraddBasicMenu();
      lastMenu = type;
      usershowParticularMenu(allBeveragesOfType("vin"));
      break;
    case 'spirits':
      useraddBasicMenu();
      lastMenu = type;
      usershowParticularMenu(allBeveragesWithStrength("above", 20));
      break;
    case 'alcoAbove':
      lastMenu = type;
      if (document.getElementById("alco_percent") != null) {
        alcoPercent = document.getElementById("alco_percent").value;
      }
      useraddBasicMenu();
      usershowParticularMenu(allBeveragesWithStrength("above", alcoPercent));
      break;
    case 'alcoBelow':
      lastMenu = type;
      if (document.getElementById("alco_percent") != null) {
        alcoPercent = document.getElementById("alco_percent").value;
      }
      useraddBasicMenu();
      usershowParticularMenu(allBeveragesWithStrength("below", alcoPercent));
      break;
    case 'tannin':
      useraddBasicMenu();
      lastMenu = type;
      usershowParticularMenu([]);
      break;
    case 'gluten':
      useraddBasicMenu();
      lastMenu = type;
      usershowParticularMenu([]);
      break;
    case 'rest':
      currentFiltering = "rest";
      usershowMenu(lastMenu);
      break;
    case 'cat':
      currentFiltering = "cat";
      usershowMenu(lastMenu);
      break;
    case 'back':
      currentFiltering = "none";
      usershowMenu(allMenuBeverages());
      break;
    default:
      useraddBasicMenu();
      lastMenu = type;
      usershowParticularMenu(allMenuBeverages());
  }
}
// =====================================================================================================
// Adds and updates the different sorting options for menu choices
//
function useraddBasicMenu(){  
  $('#usermenu').empty();
  switch (currentFiltering) {
    case "cat":
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("back")>' + get_string("sortBack") + '</button>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu()>' + get_string("sortAll") + '</button>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("beer")>' + get_string("sortBeer") + '</button>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("wine")>' + get_string("sortWine") + '</button>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("spirits")>' + get_string("sortSpirits") + '</button>');
      break;
    case "rest":
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("back")>' + get_string("sortBack") + '</button>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("alcoBelow")>' + get_string("sortBelow") + '</button>');
      $('#usermenu').append('<input class="sortInput" type="number" id="alco_percent" min=1 max=100>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("alcoAbove")>' + get_string("sortAbove") + '</button>'); 
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("tannin")>' + get_string("sortTannins") + '</button>');
      $('#usermenu').append('<button class="sortButton" onclick=usershowMenu("gluten")>' + get_string("sortGluten") + '</button>');
      break;
    default:
      $('#usermenu').append('<button class="bigSortButton" onclick=usershowMenu("cat")>' + get_string("sortCat") + '</button>');
      $('#usermenu').append('<button class="bigSortButton" onclick=usershowMenu("rest")>' + get_string("sortRest") + '</button>');
      break;
  }
  update_view();
}
  
// =====================================================================================================
// Shows the chosen menu, using what is sent into the function
//
function usershowParticularMenu(menu) { 
  if (menu.length == 0) {
    $('#usermenu').append('<div class="orderSubHeader"><span style="font-weight:bold">' + get_string('sorryMessage') + ' </span>' + '</div>');
  }
  for (var i = 0; i < menu.length; i++) {
    const element = menu[i];
    if (element[4] === "1") {
      $('#usermenu').append('<div class="hiddenMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="usermenuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="useraddToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    } else if(parseInt(element[2]) < 5) {
      if(parseInt(element[2]) == 0) {
        $('#usermenu').append('<div class="noStockMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="usermenuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="useraddToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
      } else {
        $('#usermenu').append('<div class="lowMenuItem"> <span style="font-weight:bold; cursor:pointer" onclick="usermenuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="useraddToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
      }
    } else {
      $('#usermenu').append('<div class="menuItem"> <span style="font-weight:bold; cursor:pointer" onclick="usermenuInfo(this.parentElement.children[0].innerText)">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="useraddToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    }
  }
}

// =====================================================================================================
// Shows info for a menu item, differs depending on item type
//
function usermenuInfo(item) { 
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
  $('#usermenuInfo').empty();
  $('#usermenuInfo').append('<span class="close">' + "&times;" + '</span>');
  if (type.includes("Öl")) {
    console.log("öl");
    var beerInfo = getBeerInfoFromId(id);
    $('#usermenuInfo').append('<span>' + get_string('spirName') + beerInfo[0] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('beerBrewery') + beerInfo[1] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('beerCountry') + beerInfo[2] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirType') + beerInfo[3] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirStrength') + beerInfo[4] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirSize') + beerInfo[5] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('beerPrice') + beerInfo[6] + "<br>" + ' </span>');
  } else if (type.includes("vin")) {
    var wineInfo = getWineInfoFromId(id);
    $('#usermenuInfo').append('<span>' + get_string('spirName') + wineInfo[0] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('wineYear') + wineInfo[1] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('wineProducer') + wineInfo[2] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirType') + wineInfo[3] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('wineGrape') + "??" + wineInfo[4] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirSize') + wineInfo[5] + "<br>" + ' </span>');
  } else {
    var spiritInfo = getSpiritInfoFromId(id);
    $('#usermenuInfo').append('<span>' + get_string('spirName') + spiritInfo[0] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirType') + spiritInfo[1] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirStrength') + spiritInfo[2] + "<br>" + ' </span>');
  }
  usermenuInfoCont.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    usermenuInfoCont.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == usermenuInfoCont) {
      usermenuInfoCont.style.display = "none";
    }
  }
    
  console.log(id);
}

// =====================================================================================================
// Calculates the cost for a table order (order)
//
function usergetTotalCost(order) { //Klar
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
function usershowOrder(table_id) {
  $('#userorder').empty();
  var order = getOrder(table_id);
  if (loggedUser.length == 0) {
    $('#userorder').append('<div class="menuHeader"> <span style="font-weight:bold">' + get_string('orderHeader') /*"Order for table: "*/ + table_id + ' </span>' + '</div>');
    $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('orderSubHeader') /*"Total cost: "*/ + usergetTotalCost(order) + "kr" +  ' </span>' + '</div>');
  } else {
    $('#userorder').append('<div class="menuHeader"> <span style="font-weight:bold">' + get_string('orderHeader') /*"Order for table: "*/ + table_id + ' </span>' + '</div>');
    $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('orderSubHeader') /*"Total cost: "*/ + usergetTotalCost(order) + "kr, " + get_string('accountBalance') + loggedUser[6] + "kr" + ' </span>' + '</div>');
  }
  for(let key in order) {
    const item = getNameFromId(key);
    if (item === "null") {
      userremoveFromOrderWithId(parseInt(key));
    } else {
      $('#userorder').append('<div class="menuItem"> <span style="font-weight:bold; cursor:pointer" onclick="menuInfo(this.parentElement.children[0].innerText)">' + item + ": " + order[key] +  ' </span>' + '<button class="removeFromOrderButton" onclick="userremoveFromOrder(this.parentElement.children[0].innerText)">-</button> <button class="addToOrderButton" onclick="useraddToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    }
  } 
  usercurrentTableID = table_id;
  switch (getOrderLock(usercurrentTableID)) {
    case 1:
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('payBarOrder') + ' </span>' + '</div>');
      break;
    case 2:
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('payTableOrder') + ' </span>' + '</div>');
      break;
    case 3:
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('accountPayment') + ' </span>' + '</div>');
      break;
    default:
      break;
  }
}

// =====================================================================================================
// Removes an item from order with item id (id)
//
function userremoveFromOrderWithId(id) {
  if (usercurrentTableID != 0) {
    for (var i=0; i < DB.orders.length; i++) {
        if (DB.orders[i].table == currentTableID) {
          delete DB.orders[i].item_id[id];
          return;
        }
      }
  }
}

// =====================================================================================================
// Adds the selected item to the order
//
function useraddToOrder(item) {
    console.log(item);
    if (usercurrentTableID != 0 && getOrderLock(usercurrentTableID) == 0) {
        for (var i=0; i < DB.orders.length; i++) {
            if (DB.orders[i].table == usercurrentTableID) {
              if(usercheckFullOrder(DB.orders[i].item_id))
              {
                return;
              }
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
              usershowOrder(usercurrentTableID);
              return;
            }
        }
    }
}

// =====================================================================================================
// Checks if the maximum number items in order has been reached
//
function usercheckFullOrder(dic) {
  var total = 0;
  for(var key in dic) {
    total += dic[key];
  }
  return total == 10;
}

// =====================================================================================================
// Removes an item from an order using a text with the name of the item (item)
//
function userremoveFromOrder(item) {
    if (usercurrentTableID != 0 && getOrderLock(usercurrentTableID) == 0) {
        for (var i=0; i < DB.orders.length; i++) {
            if (DB.orders[i].table == usercurrentTableID) {
                var key = getIdFromName(item.split(':')[0]);
                var dic = DB.orders[i].item_id;
                if (dic[key] == 1) {
                    delete DB.orders[i].item_id[key];
                } else {
                    DB.orders[i].item_id[key]--;
                }
                usershowOrder(usercurrentTableID);
                return;
            }
        }
    }
}

// =====================================================================================================
// Option for payment at bar, locks ordering until bartender has sent order
//
function payBar() {
    if (getOrderLock(usercurrentTableID) == 0 && usergetTotalCost(getOrder(usercurrentTableID)) != 0) {
        setOrderLock(usercurrentTableID, 1);
        usershowOrder(usercurrentTableID);
    }
}

// =====================================================================================================
// Option for payment at table, locks ordering until bartender has sent order
//
function payTable() {
    if (getOrderLock(usercurrentTableID) == 0 && usergetTotalCost(getOrder(usercurrentTableID)) != 0) {
        setOrderLock(usercurrentTableID, 2);
        usershowOrder(usercurrentTableID);
    }
}

// =====================================================================================================
// Option for payment from vip-account, locks ordering until bartender has sent order
//
function payAccount() {
  if (getOrderLock(usercurrentTableID) == 0 && usergetTotalCost(getOrder(usercurrentTableID)) != 0) {
    var paymentSuccessful = accountPayment();
    if (paymentSuccessful) {
      setOrderLock(usercurrentTableID, 3)
      usershowOrder(usercurrentTableID);
    } else {
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('lowBalance') + ' </span>' + '</div>');
    }
  }
}

// =====================================================================================================
// Removes total cost of order from vip-account
//
function accountPayment() {
  var account = loggedUser[6] - usergetTotalCost(getOrder(usercurrentTableID));
  console.log(account);
  if (account > -1) {
    changeBalance(loggedUser[3], account);
    loggedUser[6] = account;
    return true;
  } else {
    return false;
  }
}

// =====================================================================================================
// Option for getting items from vip-locker, locks ordering until confirmation of getting items
//
function payVipLocker() {
  if (usergetTotalCost(getOrder(usercurrentTableID)) != 0) {
    if (getOrderLock(usercurrentTableID) == 0) {
      var paymentSuccessful = accountPayment();
    }
    if (paymentSuccessful || getOrderLock(usercurrentTableID) == 4) { 
      setOrderLock(usercurrentTableID, 4);
      $('#userVipCodeInfo').empty();
      $('#userVipCodeInfo').append('<span class="close">' + "&times;" + '</span>');
      $('#userVipCodeInfo').append('<span>' + get_string('lockerCode') + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + "<br>" + ' </span>');
      $('#userVipCodeInfo').append('<span>' + get_string('pressWhenDone') + "<br>" + ' </span>');
      $('#userVipCodeInfo').append('<button class="sortButton" onClick=usersendOrder("console") >'+ get_string("done") + ' </button>');
      
      userVipCode.style.display = "block";
      var span = document.getElementsByClassName("close")[0];
    
      span.onclick = function() {
        userVipCode.style.display = "none";
      }
      window.onclick = function(event) {
        if (event.target == userVipCode) {
          userVipCode.style.display = "none";
        }
      }
    } else if (getOrderLock(usercurrentTableID) == 0) {
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('lowBalance') + ' </span>' + '</div>');
    }
  }
}

// =====================================================================================================
// Removes the current order, unlocks the table and subtracts items from stock
//
function usersendOrder(con) { 
  if (usercurrentTableID != 0) {
    for (var i=0; i < DB.orders.length; i++) {
        if (DB.orders[i].table == usercurrentTableID) {
          if(con === "console") {
            if (outOfStock() == true) {
              return;
            }
            console.log("---ORDER-START---");
            console.log("Table-id: " + usercurrentTableID);
            console.log(DB.orders[i].item_id);
            console.log("---ORDER-END---");
            reviseStock();
          } else {
            console.log("---DEL-ORDER-START---");
            console.log("Table-id: " + usercurrentTableID);
            console.log("---DEL-ORDER-END---");
          }
          DB.orders[i].item_id = {};
          usershowOrder(usercurrentTableID);
          usershowMenu("all");
          userVipCode.style.display = "none";
          setOrderLock(usercurrentTableID, 0);
          return;
        }
    }
  }
}

// =====================================================================================================
// Update function for user/vip-user view
//
function welcomeUser() {
  $("#userHeader").empty();
  $("#userHeader").append(get_string("userWelcome"))
  if (loggedUser.length != 0) {
    $("#userHeader").append(loggedUser[4] + " " + loggedUser[5])
  } 
  $("#userHeader").append('<img id="pic3" style="float:right; width: 8vw; height: 4vw; margin: 1%;" src="" onclick="change_lang()">');
  $("#userHeader").append('<button class="logoutButton" id=userlogOut onclick=logOut()></button>');
  usershowMenu();
  usershowOrder(usercurrentTableID);
  update_view();
}