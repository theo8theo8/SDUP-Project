// ==========================================================================
// We need to have a variable that controls which language to use.
// In this file we only show the simplest version of language change.
// How to do this with more than two languages, is left as an
// exercise.
//
var language = 'en'

// ==========================================================================
// The dictionary consists of a simple JSON structure. It also keeps
// track of the different keys that are available  for IDs.
//
dict = {
    'keys' : ['heading2','info', 'customers', 'inlog', 'guest_order', 'submit', 'wrong_creds', 'twoPtableBut', 'logOut', 'mgrHeaderRefill', 'mgrHeaderEdit', 'mgrHeaderLang', 'mgrCategorySelect', 'mgrCategoryAll', 'mgrItemName', 'mgrItemPrice', 'mgrItemStock', 'mgrItemCategory', 'mgrItemAlcContent', 'mgrItemSupplier', 'mgrAdd', 'mgrAddItem', 'mgrRestockItem', 'mgrRemoveItem', 'mgrConfirmRestock', 'mgrConfirmDelete', 'mgrCancel', 'sortAll', 'sortBeer', 'sortWine', 'sortSpirits', 'orderHeader', 'orderSubHeader', 'bspirName', 'beerBrewery', 'beerCountry', 'spirType', 'spirStrength', 'spirSize', 'beerPrice', 'wineYear', 'wineProducer', 'wineGrape', 'spirStock', 'hideItem', 'sortBack', 'sortCat', 'sortRest', 'sortBelow', 'sortAbove', 'sortTannins', 'sortGluten', 'sorryMessage', 'changeStock', 'finishOrder', 'deleteOrder', 'outOfStock', 'changePrice'],       // keys for strings
    'placeholders' : ['username_label', 'password_label', 'mgrRestockCount'],

    'pics' : ['pic1'],              // keys for pictures
                                    // pictures have to be
                                    // handled in a special way.

    // We use one JSON substructure for each language. If we have
    // many different languages and a large set of strings we might
    // need to store a JSON file for each language to be loaded on
    // request.
    //
    'en': {
        'heading2': "Small local bar with a maritime theme",
        'info': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla massa ipsum, varius in dapibus id, iaculis nec libero. Integer non velit ipsum. Pellentesque aliquet, tortor eu aliquam pharetra, dolor ante porttitor diam, in eleifend nisl sem eget massa. Integer eu iaculis tortor. Donec efficitur cursus turpis sit amet efficitur. Cras convallis libero ipsum. Cras at iaculis justo. Morbi suscipit viverra rutrum. Sed id consectetur nulla, ac interdum diam. Nullam efficitur sit amet odio ac consequat. Ut eget ex sed erat facilisis maximus non ultrices neque.",
        'customers': "Login",
        'inlog' : "Staff & Patrons",  
        'pic1' : "img/uk.png",
        'username_label' : "Username:",
        'password_label' : "Password:", 
        'username_label2' : "Username:",
        'password_label2' : "Password:", 
        'guest_order' : "Order at your table",
        'submit' : "Log in",
        'mgrHeaderEdit' : "Add item",
        'mgrHeaderLang' : "Change language",
        'mgrCategorySelect' : "Category",
        'mgrCategoryAll' : "All",
        'mgrItemName' : "Name",
        'mgrItemPrice' : "Price",
        'mgrItemStock' : "Stock",
        'mgrItemCategory' : "Category",
        'mgrItemAlcContent' : "Alcohol content",
        'mgrItemSupplier' : "Supplier",
        'mgrAdd' : "Add",
        'mgrAddItem' : "Add item",
        'mgrRestockItem' : "Restock item",
        'mgrRemoveItem' : "Remove item",
        'mgrRestockCount' : "Amount", 
        'mgrConfirmRestock' : "Restocking: ",
        'mgrConfirmDelete' : "Are you sure you want to remove: ",
        'mgrCancel' : "Cancel",
        'wrong_creds': "Wrong password or username",
        'twoPtableBut' : "Create a table", 
        'logOut' : "Log out",
        'sortAll': "All",
        'sortBeer': "Beer",
        'sortWine': "Wine",
        'sortBack': "Back",
        'sortCat': "Categories",
        'sortRest': "Other filters",
        'sortBelow': "Below % ->",
        'sortAbove': "<- Above %",
        'sortTannins': "No tannins",
        'sortGluten': "No gluten",
        'sortSpirits': "Spirits", 
        'orderHeader': "Order for table ",
        'orderSubHeader': "Total cost: ", 
        'spirName': "Name: ",
        'beerBrewery': "Brewery: ",
        'beerCountry': "Country: ",
        'spirType': "Type: ",
        'spirStrength': "Strength: ",
        'spirSize': "Size: ",
        'beerPrice': "Price: ",
        'wineYear': "Year: ",
        'wineProducer': "Producer: ",
        'wineGrape': "Grape: ",
        'spirStock': "In stock: ",
        'hideItem': "Hide/show on menu",
        'sorryMessage': "Sorry, we do not have any of the desired items on the menu.",
        'changeStock': "Change stock", 
        'changePrice': "New price", 
        'finishOrder': "Send order", 
        'deleteOrder': "Remove order", 
        'outOfStock': "WARNING: We don't have enough of: "

    },
    'sv' : {
        'heading2' : "Liten lokal bar med båttema",
        'info': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla massa ipsum, varius in dapibus id, iaculis nec libero. Integer non velit ipsum. Pellentesque aliquet, tortor eu aliquam pharetra, dolor ante porttitor diam, in eleifend nisl sem eget massa. Integer eu iaculis tortor. Donec efficitur cursus turpis sit amet efficitur. Cras convallis libero ipsum. Cras at iaculis justo. Morbi suscipit viverra rutrum. Sed id consectetur nulla, ac interdum diam. Nullam efficitur sit amet odio ac consequat. Ut eget ex sed erat facilisis maximus non ultrices neque.",
        'customers': "Inloggning",
        'inlog' : "Personal & Stamgäster",  
        'pic1' : "img/sv.png",
        'username_label' : "Användarnamn",
        'password_label' : "Lösenord",
        'guest_order' : "Beställ vid bordet", 
        'submit' : "Logga in", 
        'submit2' : "Logga in",
        'mgrHeaderEdit' : "Lägg till vara",
        'mgrHeaderLang' : "Ändra språk",
        'mgrCategorySelect' : "Kategori",
        'mgrCategoryAll' : "Alla",
        'mgrItemName' : "Namn",
        'mgrItemPrice' : "Pris",
        'mgrItemStock' : "I lager",
        'mgrItemCategory' : "Kategori",
        'mgrItemAlcContent' : "Alkoholhalt",
        'mgrItemSupplier' : "Leverantör",
        'mgrAdd' : "Lägg till",
        'mgrAddItem' : "Lägg till vara",
        'mgrRestockItem' : "Beställ påfyllning",
        'mgrRemoveItem' : "Ta bort vara",
        'mgrRestockCount' : "Antal",
        'mgrConfirmRestock' : "Fyller på: ",
        'mgrConfirmDelete' : "Är du säker att du vill ta bort: ",
        'mgrCancel' : "Avbryt",
        'wrong_creds': "Felaktigt lösenord eller användarnamn",
        'twoPtableBut': "Skapa ett bord", 
        'logOut' : "Logga ut",
        'sortAll': "Alla",
        'sortBeer': "Öl",
        'sortWine': "Vin",
        'sortBack': "Tillbaka",
        'sortCat': "Kategorier",
        'sortRest': "Andra filter",
        'sortBelow': "Under % ->",
        'sortAbove': "<- Över %",
        'sortTannins': "Ej tannin",
        'sortGluten': "Ej gluten",
        'sortSpirits': "Sprit", 
        'orderHeader': "Order för bord ",
        'orderSubHeader': "Total kostnad: ", 
        'spirName': "Namn: ",
        'beerBrewery': "Bryggeri: ",
        'beerCountry': "Land: ",
        'spirType': "Typ: ",
        'spirStrength': "Alkoholhalt: ",
        'spirSize': "Storlek: ",
        'beerPrice': "Pris: ",
        'wineYear': "Årgång: ",
        'wineProducer': "Producent: ",
        'wineGrape': "Druva: ",
        'spirStock': "I lager: ", 
        'hideItem': "Göm/ta fram på menyn",
        'sorryMessage': "Vi ber om ursäkt, vi har inga drycker av denna typ på menyn.",
        'changeStock': "Ändra lagersaldo", 
        'changeStock': "Nytt pris", 
        'finishOrder': "Skicka order", 
        'deleteOrder': "Ta bort order", 
        'outOfStock': "VARNING: Vi har inte tillräckligt av: "

    }
}

// This function will return the appropriate string for each
// key. The language handling is made "automatic".
//
function get_string(key) {
    return dict[language][key];
}

// This function is the simplest possible. However, in order
// to handle many different languages it will not be sufficient.
// The necessary change should not be difficult to implement.
//
// After each language change, we will need to update the view, to propagate
// the change to the whole view.
//
function change_lang() {
    if (language=='en') {
        language = 'sv';
    } else {language = 'en'};
    update_view();
    updateLangStaff();
}

// ==========================================================================
// END OF FILE
// ==========================================================================
