// ==========================================================================
// The updating of the view is done by going through the lists of
// keywords for strings and pictures, and replacing the contents
// through the use of a simple jQuery statement.
//
// Note especially that strings and pictures are treated in
// different ways, due to the way they are handled in the container.
//
function update_view() {
    keys = dict['keys'];
    for (idx in keys) {
        key = keys[idx];
        $("#" + key).text(get_string(key));
    };
    placeholders = dict['placeholders'];
    for (idx in placeholders) {
        placeholder = placeholders[idx];
        $("#" + placeholder).attr('placeholder', get_string(placeholder));
    };
    pics = dict['pics'];
    for (idx in pics) {
        pic = pics[idx];
        $("#" + pic).attr('src', get_string(pic));
    };
}

// We don't update the view the first time until the document is ready
// loading.
//
$(document).ready(function() {
    loadMgrEditStock();
    loadCategoryDropdown();

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
    
    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);
    
    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);
    
    
    loadAllTables();
    showMenu();

    update_view();
    $("#login-view").css("display","block");
})
// ==========================================================================
// END OF FILE
// ==========================================================================





