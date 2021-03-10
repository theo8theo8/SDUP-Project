var currentTableID = 3;
var orderLock = 0;
//var loggedUser = ["user", "user", "user_id", "username", "firstname", "lastname", "email", "account"];

showMenu();
showOrder(currentTableID);
welcomeUser();
displayBalance();

function showMenu(type) {
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
        $('#menu').append('<div class="menuItem"> <span style="font-weight:bold">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
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
        $('#order').append('<div class="menuItem"> <span style="font-weight:bold">' + item + ": " + order[key] +  ' </span>' + '<button class="removeFromOrderButton" onclick="removeFromOrder(this.parentElement.children[0].innerText)">-</button> <button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
    }
    currentTableID = table_id;
}

function addToOrder(item) {
    console.log(item);
    if (currentTableID != 0 && orderLock == 0) { /* la till orderLock */
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
    if (currentTableID != 0 && orderLock == 0) {
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

function payBar() {
    if (orderLock == 0) {
        $('#order').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('payBarOrder') + ' </span>' + '</div>');
        orderLock = 1;
    }
}

function payTable() {
    if (orderLock == 0) {
        $('#order').append('<div class="orderSubHeader"> <span style="font-weight:bold">' + get_string('payTableOrder') + ' </span>' + '</div>');
        orderLock = 1;
    }
}

function welcomeUser() {
    //$( '#userWelcome').append('<span style="font-weight:bold">' + hej + '</span>');
    //$('#userWelcome').append($('<span>').text("hej"));
    //$("#userWelcome").append($("<span>").text(" " + loggedUser[4] + " " + loggedUser[5]));
    $("#userWelcome").append($("<span>").text(" " + loggedUser[4] + " " + loggedUser[5]));
}

function displayBalance() {
    $("#balance span").empty();
    $("#balance span").append(loggedUser[7]);
    //$("#balance").append($("<span>").text(loggedUser[7]));
}

function updateLangStaff() {
    showOrder(currentTableID);
    welcomeUser();
    displayBalance();
}