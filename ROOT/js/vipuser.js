var usercurrentTableID = 3;
var orderLock = 0;
//var loggedUser = ["user", "user", "user_id", "username", "firstname", "lastname", "email", "account"];

usershowOrder(usercurrentTableID);
welcomeUser()

function usershowMenu(type) { //Kopierad från staff
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

  function useraddBasicMenu(){  //kopierat från staff
    $('#usermenu').empty();
    switch (currentFiltering) {
      case "cat":
        $('#usermenu').append('<button class="sortButton" id=sortBack onclick=usershowMenu("back")></button>');
        $('#usermenu').append('<button class="sortButton" id=sortAll onclick=usershowMenu()></button>');
        $('#usermenu').append('<button class="sortButton" id=sortBeer onclick=usershowMenu("beer")></button>');
        $('#usermenu').append('<button class="sortButton" id=sortWine onclick=usershowMenu("wine")></button>');
        $('#usermenu').append('<button class="sortButton" id=sortSpirits onclick=usershowMenu("spirits")></button>');
        break;
      case "rest":
        $('#usermenu').append('<button class="sortButton" id=sortBack onclick=usershowMenu("back")></button>');
        $('#usermenu').append('<button class="sortButton" id=sortBelow onclick=usershowMenu("alcoBelow")></button>');
        $('#usermenu').append('<input class="sortInput" type="number" id="alco_percent" min=1 max=100>');
        $('#usermenu').append('<button class="sortButton" id=sortAbove onclick=usershowMenu("alcoAbove")></button>'); //VAFAN FYLLS DOM HÄR I FÖR ???
        $('#usermenu').append('<button class="sortButton" id=sortTannins onclick=usershowMenu("tannin")></button>');
        $('#usermenu').append('<button class="sortButton" id=sortGluten onclick=usershowMenu("gluten")></button>');
        break;
      default:
        $('#usermenu').append('<button class="bigSortButton" id=sortCat onclick=usershowMenu("cat")></button>');
        $('#usermenu').append('<button class="bigSortButton" id=sortRest onclick=usershowMenu("rest")></button>');
        break;
    }
    update_view();
  }

  function usershowParticularMenu(menu) { //kopierat från staff
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


function usermenuInfo(item) { //kopierat
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
    $('#usermenuInfo').append('<span>' + get_string('spirStock') + beerInfo[7] + "<br>" + ' </span>');
  } else if (type.includes("vin")) {
    var wineInfo = getWineInfoFromId(id);
    $('#usermenuInfo').append('<span>' + get_string('spirName') + wineInfo[0] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('wineYear') + wineInfo[1] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('wineProducer') + wineInfo[2] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirType') + wineInfo[3] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('wineGrape') + "??" + wineInfo[4] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirSize') + wineInfo[5] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirStock') + wineInfo[6] + "<br>" + ' </span>');
  } else {
    var spiritInfo = getSpiritInfoFromId(id);
    $('#usermenuInfo').append('<span>' + get_string('spirName') + spiritInfo[0] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirType') + spiritInfo[1] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirStrength') + spiritInfo[2] + "<br>" + ' </span>');
    $('#usermenuInfo').append('<span>' + get_string('spirStock') + spiritInfo[3] + "<br>" + ' </span>');
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

function usergetTotalCost(order) { //Klar
    var totalCost = 0;
    for (let key in order) {
        const cost = parseInt(getCostFromId(key));
        const no = order[key];
        totalCost += cost*no;
    }
    return totalCost;
}

function usershowOrder(table_id) { //kopierat
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
  }   //Beställknappar här ist ?
  usercurrentTableID = table_id;
}

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

function useraddToOrder(item) {  //från staff
    console.log(item);
    if (usercurrentTableID != 0 && orderLock == 0) { /* la till orderLock */
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

function usercheckFullOrder(dic) {
  var total = 0;
  for(var key in dic) {
    total += dic[key];
  }
  return total == 10;
}


function userremoveFromOrder(item) { //kopierat
    if (usercurrentTableID != 0 && orderLock == 0) {
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

function payBar() {
    if (orderLock == 0) {
        $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('payBarOrder') + ' </span>' + '</div>');
        orderLock = 1;
    }
}

function payTable() {
    if (orderLock == 0) {
        $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('payTableOrder') + ' </span>' + '</div>');
        orderLock = 1;
    }
}

function payAccount() {
  if (orderLock == 0 ) {
    var paymentSuccessful = accountPayment();
    if (paymentSuccessful) {
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('accountPayment') + ' </span>' + '</div>');
      orderLock = 1;
    } else {
      $('#userorder').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('lowBalance') + ' </span>' + '</div>');
    }
  }
}

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

function welcomeUser() {
    console.log(loggedUser);
    console.log(loggedUser[7]);
    console.log(loggedUser[4]);
    //$( '#userWelcome').append('<span style="font-weight:bold">' + hej + '</span>');
    //$('#userWelcome').append($('<span>').text("hej"));
    //$("#userWelcome").append($("<span>").text(" " + loggedUser[4] + " " + loggedUser[5]));
    $("#balance span").empty();
    $("#userWelcome span").empty();
    //$("#userWelcome").append($("<span>").text(" " + loggedUser[4] + " " + loggedUser[5]));
    //$("#userWelcome").append($("<span>").text("hej"));
    $("userWelcome span").text(loggedUser[4]); //VARFÖR FUNKAR DU EJ!!!
    //$("#balance span").append(loggedUser[7]);
    $("#balance span").text(loggedUser[4] + " " + loggedUser[5] + ", " + loggedUser[6] + " sek");

    usershowMenu();
    usershowOrder(usercurrentTableID);
    update_view();
}

function updateLangStaff() {
    usershowOrder(usercurrentTableID);
    welcomeUser();
}