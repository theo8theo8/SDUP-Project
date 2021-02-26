var currentTableID = 1;

showMenu();

function showMenu(){
    var menu = allMenuBeverages();
    for (i = 0; i < menu.length; i++) {
        const element = menu[i];
        $('#menu').append('<div class="menuItem"> <span style="font-weight:bold">' + element[0] + ' </span>' + element[3] + '<button class="addToOrderButton" onclick="addToOrder(this.parentElement.children[0].innerText)">+</button> </div>');
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