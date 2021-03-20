// Queues with undo/redo functions
redoQueue = [];
undoQueue = [];

// Adds function to the undo queue
function addUndo(func) {
    undoQueue.push(func);
    return;
}

// Adds function to the redo queue
function addRedo(func) {
    redoQueue.push(func);
    return;
}

// Clears the redo queue
function clearRedo() {
    redoQueue = [];
}

// Undoes the last action and adds it to the redo queue
function undo() {
    let func = undoQueue.pop();
    if (func != undefined) {
        addRedo(func);
        func.undo();
    }
    return;
}

// Redoes the last undone action and adds it to the undo queue
function redo() {
    let func = redoQueue.pop();
    if (func != undefined) {
        addUndo(func);
        func.redo();
    } 
    return;
}

// Adds beverage before refreshing page elements.
function addStockRefresh(beverage) {
    addBeverage(beverage);
    loadMgrEditStock();
    loadCategoryDropdown();
}

// Adds a new beverage to the database
function addStock() {
    // Get info from all fields, id is randomly generated between 1 - 1,000,000
    let id = Math.floor(Math.random() * 1000000) + 1;
    let name = $('#stockName').val();
    let price = $('#stockPrice').val();
    let category = $('#stockCategory').val();
    let supplier = $('#stockSupplier').val();
    let alcContent = $('#stockAlcContent').val();
    let stock = 0;

    // Make sure that id does not already exist
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

    
    // Clear redo queue and add function to undo queue
    clearRedo();
    let undoRedo = {
        undo : function() {deleteStockRefresh(id)},
        redo : function() {addStockRefresh(beverage)}
    };
    addUndo(undoRedo);
    
    // Close modal, add beverage and refresh elements
    closeItemModal();
    addStockRefresh(beverage);
}

// Replenishes the stock of a beverage 
function replenishStock(id) {
    let count = $('#mgrRestockCount').val();

    // Clear redo queue and add function to undo queue
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

// Deletes beverage and refreshes the view
function deleteStockRefresh(id) {
    removeBeverage(id);
    loadMgrEditStock();
    loadCategoryDropdown();
}

function deleteStock(id) {
    let beverage = beverageInfo(id);
    
    // Clear redo queue and add function to undo queue
    clearRedo();
    let undoRedo = {
        undo : function() {addStockRefresh(beverage)},
        redo : function() {deleteStockRefresh(id)}
    };
    addUndo(undoRedo);
    
    // Close modal, delete beverage and refresh elements
    closeItemModal();
    deleteStockRefresh(id);
}

// Closes the item model
function closeItemModal() {
    $('#item-modal').fadeOut(80);
    $('#item-modal-inside').fadeOut(80);
    
    $('#confirm-modal').fadeOut(80);
    $('#confirm-modal-content-inside').fadeOut(80);
}

// Opens the item model
function openItemModal() {
    $('#item-modal-content-inside').empty();
    $('#confirm-modal-content-inside').empty();

    $('#item-modal').fadeIn(120);
    $('#item-modal-inside').fadeIn(120);
}

// Opens the confirmation modal
function openConfirmModal(type) {
    $('#confirm-modal-content-inside').empty();
    $('#confirm-modal').fadeIn(120);
    $('#confirm-modal-content-inside').fadeIn(120);
}

// Closes the confirmation modal
function closeConfirmModal() {
    $('#confirm-modal').fadeOut(80);
    $('#confirm-modal-content-inside').fadeOut(80);
}

// Opens modal with confirmation to delete item
function confirmDelete() {
    openConfirmModal(); 

    let id = $('#modal-header-id').text();
    let name = $('#modal-header-name').text();

    // Name and confirmation message
    $('#confirm-modal-content-inside').append('<h2><span id="mgrConfirmDelete"></span></h2>');
    $('#confirm-modal-content-inside').append('<h2>' + name + '?</h2>');

    // Cancel and remove buttons
    $('#confirm-modal-content-inside').append('<button id="mgrCancel" class="modal-button" onclick="closeConfirmModal()"></button>');
    $('#confirm-modal-content-inside').append('<button id="mgrRemoveItem" class="modal-button modal-button-red" onclick="deleteStock(' + id + ')"></button>');
    update_view();
}

// Opens modal to restock item
function confirmStock() {
    openConfirmModal();

    let id = $('#modal-header-id').text();
    let name = $('#modal-header-name').text();
    
    // Name, restock message and number input
    $('#confirm-modal-content-inside').append('<h2><span id="mgrConfirmRestock"></span></h2>');
    $('#confirm-modal-content-inside').append('<h2>' + name + '</h2>');
    $('#confirm-modal-content-inside').append('<input id="mgrRestockCount" class="mgrInput" type="number"></input>');
    
    // Cancel and restock buttons
    $('#confirm-modal-content-inside').append('<button id="mgrCancel" class="modal-button" onclick="closeConfirmModal()"></button>');
    $('#confirm-modal-content-inside').append('<button id="mgrRestockItem" class="modal-button modal-button-brown" onclick="replenishStock(' + id + ')"></button>');
    update_view();
}

// Displays information about the clicked beverage
function mgrListClick(item) {
    openItemModal();
    
    let id = $(item).children(0).text();
    let info = beverageInfo(id);

    // Name and id
    $('#item-modal-content-inside').append('<h2 id="modal-header-id">' + info.artikelid + '</h2>');
    $('#item-modal-content-inside').append('<h2 id="modal-header-name">' + info.namn + '</h2>');

    // Beverage information
    $('#item-modal-content-inside').append('<h3> <span id="mgrItemStock"></span>: ' + info.stock + '</h3>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemPrice"></span>: ' + info.prisinklmoms + '</p>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemCategory"></span>: ' + info.varugrupp + '</p>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemAlcContent"></span>: ' + info.alkoholhalt + '</p>');
    $('#item-modal-content-inside').append('<p> <span id="mgrItemSupplier"></span>: ' + info.leverantor + '</p>');

    // Restock and remove
    $('#item-modal-content-inside').append('<button class="modal-button modal-button-brown" id="mgrRestockItem" onclick="confirmStock(this)"></button>');
    $('#item-modal-content-inside').append('<button class="modal-button modal-button-red" id="mgrRemoveItem" onclick="confirmDelete(this)"></button>');
    update_view();
}

// Sorts stock by id values
function sortStock(a, b) {
    if (parseInt(a[0]) > parseInt(b[0])) return 1;
    else return -1;
}

// Displays all beverages 
function loadMgrEditStock() {
    $('#mgrContent').empty();

    // For each beverage, add entry to the beverage list with id and name
    let a = allBeveragesWithID().sort(sortStock);
    for (let i = 0; i < a.length && i < 100; i++) {
        const element = a[i];
        $('#mgrContent').append('<div class="mgrMenuListItem" onclick="mgrListClick(this)"><span class="idSpan" style="font-weight:bold">' + element[0] + '</span> ' + element[1] + '</div');
    }
}

// Opens modal to add a new beverage
function loadMgrAddItem() {
    openItemModal();

    // Name and id
    $('#item-modal-content-inside').append('<h1 id="mgrAddItem"></h1>');
    $('#item-modal-content-inside').append('<form id="item-modal-content-inside-form"></form>');

    // Form for adding new beverage
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

    // Add beverage button
    $('#item-modal-content-inside').append('<button class="modal-button modal-button-brown" id="mgrAdd" onclick="addStock(this)">abc</button>');
    update_view();
}

// Loads beverage categories
function loadCategoryDropdown() {
    $('#categoryContainer').empty();

    // Button to toggle display
    $('#categoryContainer').append('<button id="mgrCategorySelect" onclick="categoryDropdown()"></button>');
    
    // Div for categories
    $('#categoryContainer').append('<div id="categorySelectDropdown"></div>');

    // "All" category
    $('#categorySelectDropdown').append('<button class="mgrCategory" id="mgrCategoryAll" onclick="selectCategory(\'\')"></button>');

    // For each category, add it to the dropdown
    beverageTypes().sort().forEach(type => {
        $('#categorySelectDropdown').append('<button class="mgrCategory" onclick="selectCategory(\'' + type + '\')">' + type + '</button>');
    });

    update_view();
}

// Opens or closes the category dropdown
function categoryDropdown() {
    $('#categorySelectDropdown').slideToggle(300);
}

// Filters beverages for a specific category
function selectCategory(category) {
    $('#mgrContent').empty();

    // For each beverage with the correct category, add entry to the beverage list with id and name
    let a = allBeveragesOfTypeWithID(category).sort(sortStock);
    for (let i = 0; i < a.length && i < 100; i++) {
        const element = a[i];
        $('#mgrContent').append('<div class="mgrMenuListItem" onclick="mgrListClick(this)"><span class="idSpan" style="font-weight:bold">' + element[0] + '</span> ' + element[1] + '</div');
    }

    // Close dropdown
    $('#categorySelectDropdown').slideToggle(300);
}