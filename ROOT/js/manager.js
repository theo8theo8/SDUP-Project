// Todo: add comments and function descriptors

function closeModal() {
    $('#itemModal').css("display", "none");
}

function openModal() {
    $('#modal-content').empty();
    $('#itemModal').css("display", "block");
}

function mgrListClick(item) {
    openModal();
    $('#modal-content').append('<h1>' + $(item).text() + '</h1>');
    $('#modal-content').append('<h3 id="mgrItemPrice"></h3>');
    $('#modal-content').append('<p id="mgrItemStock"></p>');
    $('#modal-content').append('<button class="modal-button" id="mgrRestockItem"></button>');
    $('#modal-content').append('<button class="modal-button modal-button-red" id="mgrRemoveItem"></button>');
    update_view();
}

function loadMgrEditStock() {
    let a = allBeveragesWithID();
    for (let i = 0; i < a.length && i < 100; i++) {
        const element = a[i];
        $('#mgrContent').append('<div class="mgrMenuListItem" onclick="mgrListClick(this)"><span style="font-weight:bold">' + element[0] + ' </span>' + element[1] + '</div');
    }
}

function loadMgrAddItem() {
    openModal();
    $('#modal-content').append('<h1>Add new item</h1>');
    $('#modal-content').append('');
    $('#modal-content').append('');
}