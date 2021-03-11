// Todo: add comments and function descriptors

redoQueue = [];
undoQueue = [];

function addUndo(func) {
    undoQueue.push(func);
    return;
}

function addRedo(func) {
    redoQueue.push(func);
    return;
}

function clearRedo() {
    redoQueue = [];
}

function undo() {
    let func = undoQueue.pop();
    if (func != undefined) {
        addRedo(func);
        func.undo();
    }
    return;
}

function redo() {
    let func = redoQueue.pop();
    if (func != undefined) {
        addUndo(func);
        func.redo();
    } 
    return;
}

function addStockRefresh(beverage) {
    addBeverage(beverage);
    loadMgrEditStock();
    loadCategoryDropdown();
}

function addStock() {
    let id = Math.floor(Math.random() * 1000000) + 1;
    let name = $('#stockName').val();
    let price = $('#stockPrice').val();
    let category = $('#stockCategory').val();
    let supplier = $('#stockSupplier').val();
    let alcContent = $('#stockAlcContent').val();
    let stock = 0;

    while (IDExists(id)) {
        id = Math.floor(Math.random() * 1000000) + 1;
    }

    beverage = {
        "artikelid": id,
        "namn": name,
        "prisinklmoms": price,
        "varugrupp": category,
        "leverantor": supplier,
        "alkoholhalt":alcContent,
        "stock":stock
    };
    // console.log(beverage);
    closeItemModal();
    
    clearRedo();
    let undoRedo = {
        undo : function() {deleteStockRefresh(id)},
        redo : function() {addStockRefresh(beverage)}
    };
    addUndo(undoRedo);
    addStockRefresh(beverage);
}

function replenishStock(id) {
    let count = $('#mgrRestockCount').val();
    clearRedo();
    let undoRedo = {
        undo : function() {changeStock(id, -count)},
        redo : function() {changeStock(id, count)}
    };
    addUndo(undoRedo);
    changeStock(id, count);
    closeItemModal();
    update_view();
}

function deleteStockRefresh(id) {
    removeBeverage(id);
    loadMgrEditStock();
    loadCategoryDropdown();
}

function deleteStock(id) {
    closeItemModal();
    let beverage = beverageInfo(id);
    clearRedo();
    let undoRedo = {
        undo : function() {addStockRefresh(beverage)},
        redo : function() {deleteStockRefresh(id)}
    };
    addUndo(undoRedo);
    deleteStockRefresh(id);
}

function closeItemModal() {
    $('#item-modal').fadeOut(80);
    $('#item-modal-inside').fadeOut(80);

    $('#confirm-modal').fadeOut(80);
    $('#confirm-modal-content-inside').fadeOut(80);
}

function openItemModal() {
    $('#item-modal-content-inside').empty();
    $('#confirm-modal-content-inside').empty();

    $('#item-modal').fadeIn(120);
    $('#item-modal-inside').fadeIn(120);
}

function openConfirmModal(type) {
    $('#confirm-modal-content-inside').empty();
    $('#confirm-modal').fadeIn(120);
    $('#confirm-modal-content-inside').fadeIn(120);
}

function closeConfirmModal() {
    $('#confirm-modal').fadeOut(80);
    $('#confirm-modal-content-inside').fadeOut(80);
}

function confirmDelete() {
    openConfirmModal(); 
    let id = $('#modal-header-id').text();
    let name = $('#modal-header-name').text();

    $('#confirm-modal-content-inside').append('<h2><span id="mgrConfirmDelete"></span></h2>');
    $('#confirm-modal-content-inside').append('<h2>' + name + '?</h2>');

    $('#confirm-modal-content-inside').append('<button id="mgrCancel" class="modal-button" onclick="closeConfirmModal()"></button>');
    $('#confirm-modal-content-inside').append('<button id="mgrRemoveItem" class="modal-button modal-button-red" onclick="deleteStock(' + id + ')"></button>');
    update_view();
}

function confirmStock() {
    openConfirmModal();
    let id = $('#modal-header-id').text();
    let name = $('#modal-header-name').text();

    $('#confirm-modal-content-inside').append('<h2><span id="mgrConfirmRestock"></span></h2>');
    $('#confirm-modal-content-inside').append('<h2>' + name + '</h2>');
    $('#confirm-modal-content-inside').append('<input id="mgrRestockCount" class="mgrInput" type="number"></input>');

    $('#confirm-modal-content-inside').append('<button id="mgrCancel" class="modal-button" onclick="closeConfirmModal()"></button>');
    $('#confirm-modal-content-inside').append('<button id="mgrRestockItem" class="modal-button modal-button-brown" onclick="replenishStock(' + id + ')"></button>');
    update_view();
}

function mgrListClick(item) {
    openItemModal();
    let id = $(item).children(0).text();
    let info = beverageInfo(id);
    $('#item-modal-content-inside').append('<h2 id="modal-header-id">' + info.artikelid + '</h2>');
    $('#item-modal-content-inside').append('<h2 id="modal-header-name">' + info.namn + '</h2>');

    $('#item-modal-content-inside').append('<h3> <span id="mgrItemStock"></span>: ' + info.stock + '</h3>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemPrice"></span>: ' + info.prisinklmoms + '</p>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemCategory"></span>: ' + info.varugrupp + '</p>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemAlcContent"></span>: ' + info.alkoholhalt + '</p>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemSupplier"></span>: ' + info.leverantor + '</p>');

    $('#item-modal-content-inside').append('<button class="modal-button modal-button-brown" id="mgrRestockItem" onclick="confirmStock(this)"></button>');
    $('#item-modal-content-inside').append('<button class="modal-button modal-button-red" id="mgrRemoveItem" onclick="confirmDelete(this)"></button>');
    update_view();
}

function sortStock(a, b) {
    if (parseInt(a[0]) > parseInt(b[0])) return 1;
    else return -1;
}

function loadMgrEditStock() {
    $('#mgrContent').empty();
    let a = allBeveragesWithID().sort(sortStock);
    for (let i = 0; i < a.length && i < 100; i++) {
        const element = a[i];
        $('#mgrContent').append('<div class="mgrMenuListItem" onclick="mgrListClick(this)"><span class="idSpan" style="font-weight:bold">' + element[0] + '</span> ' + element[1] + '</div');
    }
}

function loadMgrAddItem() {
    openItemModal();
    $('#item-modal-content-inside').append('<h1 id="mgrAddItem"></h1>');
    $('#item-modal-content-inside').append('<form id="item-modal-content-inside-form"></form>');

    // Form for adding new item
    $('#item-modal-content-inside-form').append('<label for="stockName" id="mgrItemName" class="mgrInputLabel" ></label>');
    $('#item-modal-content-inside-form').append('<input type="text" id="stockName" class="mgrInput" name="name">');

    $('#item-modal-content-inside-form').append('<label for="stockPrice" id="mgrItemPrice" class="mgrInputLabel" ></label>');
    $('#item-modal-content-inside-form').append('<input type="number" id="stockPrice" class="mgrInput" name="price">');

    $('#item-modal-content-inside-form').append('<label for="stockCategory" id="mgrItemCategory" class="mgrInputLabel"></label>');
    $('#item-modal-content-inside-form').append('<input type="text" id="stockCategory" class="mgrInput" name="category">');

    $('#item-modal-content-inside-form').append('<label for="stockSupplier" id="mgrItemSupplier" class="mgrInputLabel" ></label>');
    $('#item-modal-content-inside-form').append('<input type="text" id="stockSupplier" class="mgrInput" name="supplier">');

    $('#item-modal-content-inside-form').append('<label for="stockAlcContent" id="mgrItemAlcContent" class="mgrInputLabel" ></label>');
    $('#item-modal-content-inside-form').append('<input type="text" id="stockAlcContent" class="mgrInput" name="alcContent">');
    //

    // $('#item-modal-content-inside').append('<button class="modal-button modal-button-red" id="mgrCancel" onclick="closeItemModal()"></button>');
    $('#item-modal-content-inside').append('<button class="modal-button modal-button-brown" id="mgrAdd" onclick="addStock(this)">abc</button>');
    update_view();
}

function loadCategoryDropdown() {
    $('#categoryContainer').empty();
    $('#categoryContainer').append('<button id="mgrCategorySelect" onclick="categoryDropdown()"></button>');
    $('#categoryContainer').append('<div id="categorySelectDropdown"></div>');

    $('#categorySelectDropdown').append('<button class="mgrCategory" id="mgrCategoryAll" onclick="selectCategory(\'\')"></button>');
    beverageTypes().sort().forEach(type => {
        $('#categorySelectDropdown').append('<button class="mgrCategory" onclick="selectCategory(\'' + type + '\')">' + type + '</button>');
    });
    update_view();
}

function categoryDropdown() {
    $('#categorySelectDropdown').slideToggle(300);
}

function selectCategory(category) {
    $('#mgrContent').empty();
    let a = allBeveragesOfTypeWithID(category);
    for (let i = 0; i < a.length && i < 100; i++) {
        const element = a[i];
        $('#mgrContent').append('<div class="mgrMenuListItem" onclick="mgrListClick(this)"><span class="idSpan" style="font-weight:bold">' + element[0] + '</span> ' + element[1] + '</div');
    }
    $('#categorySelectDropdown').slideToggle(300);
}