// =====================================================================================================
// SOme sample API functions for the Flying Dutchman data base.
// =====================================================================================================
// Author: Lars Oestreicher, 2018
//
// Adapted from a mySQL data base.
//
// We use (global) variables to store the data. This is not generally advisable, but has the
// advantage that the data is easy to access through simple APIs. Also, when storing as local storage,
// all data is stored as strings, which might be adding some complexity.
//
function allUserNames() {
    var nameCollect = [];
    for (i = 0; i < DB.users.length; i++) {
        nameCollect.push(DB.users[i].username);
    }
    return nameCollect;
}

// =====================================================================================================
// This is an example of a file that will return an array with some specific details about a
// selected user name (not the first name/alst name). It will also add details from another "database"
// which contains the current account status for the person.
//
function userDetails(userName) {
    var userCollect = [];
    var userID;
    var userIndex;
    var account;

    // First we find the user ID of the selected user. We also save the index number for the record in the JSON
    // structure.
    //
    for (i = 0; i < DB.users.length; i++) {
        if (DB.users[i].username == userName) {
            userID = DB.users[i].user_id;
            userIndex = i;
        };
    };

    // We get the current account status from another table in the database, account. We store this in
    // a variable here for convenience.
    //
    for (i = 0; i < DB.account.length; i++) {
        if (DB.account[i].user_id == userID) {
            account = DB.account[i].creditSEK;
        }
    };

    // This is the way to add the details you want from the db into your own data structure.
    // If you want to change the details, then just add or remove items accordingly below.
    userCollect.push(
        DB.users[userIndex].password,
        DB.users[userIndex].credentials,
        DB.users[userIndex].user_id,
        DB.users[userIndex].username,

        DB.users[userIndex].first_name,
        DB.users[userIndex].last_name,
        //DB.users[userIndex].email,
        

        account
    );

    return userCollect;
}

// =====================================================================================================
// This function will change the credit amount in the user's account. Note that the amount given as argument is the new
// balance and not the changed amount (± balance).
//
function changeBalance(userName, newAmount) {

    // We use this variable to store the userID, since that is the link between the two data bases.
    var userID;

    // First we find the userID in the user data base.
    //
    for (i = 0; i < DB.users.length; i++) {
        if (DB.users[i].username == userName) {
            userID = DB.users[i].user_id;
        };
    };

    // Then we match the userID with the account list.
    // and change the account balance.
    //
    for (i = 0; i < DB.account.length; i++) {
        if (DB.account[i].user_id == userID) {
            DB.account[i].creditSEK = newAmount;   // This changes the value in the JSON object.
        };
    };
}

// =====================================================================================================
// Returns a list of all the names of the beverages in the database. This function can be used as a
// recipe for similar functions.
//
function allBeverages() {

    // Using a local variable to collect the items.
    var collector = [];

    // The DB is stored in the variable DB2, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (i = 0; i < DB2.spirits.length; i++) {
        collector.push([DB2.spirits[i].namn, DB2.spirits[i].varugrupp]);
    };
    //
    return collector;
}

// =====================================================================================================
// Returns a list of all the names of the beverages in the database along with their ID.
//
function allBeveragesWithID() {

    // Using a local variable to collect the items.
    var collector = [];

    // The DB is stored in the variable DB2, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (i = 0; i < DB2.spirits.length; i++) {
        collector.push([DB2.spirits[i].artikelid, DB2.spirits[i].namn, DB2.spirits[i].prisinklmoms, DB2.spirits[i].varugrupp, DB2.spirits[i].stock]);
    };
    //
    return collector;
}

// =====================================================================================================
// Returns a list of all the names of the beverages in the database of a certain category along with their ID.
//
function allBeveragesOfTypeWithID(type) {
    var collector = [];

    for (i = 0; i < DB2.spirits.length; i++) {
        if (type == "" || DB2.spirits[i].varugrupp == type) {
            collector.push([DB2.spirits[i].artikelid, DB2.spirits[i].namn]);
        }
    };
    
    return collector;
}

// =====================================================================================================
// This function returns the names of all strong beverages (i.e. all that contain a percentage of alcohol
// higher than the strength given in percent.
//
function allStrongBeverages(strength) {

    // Using a local variable to collect the items.
    //
    var collector = [];

    // The DB is stored in the variable DB2, with "spirits" as key element. If you need to select only certain
    // items, you may introduce filter functions in the loop... see the template within comments.
    //
    for (i = 0; i < DB2.spirits.length; i++) {

        // We check if the percentage alcohol strength stored in the data base is lower than the
        // given limit strength. If the limit is set to 14, also liqueuers are listed.
        //
        if (percentToNumber(DB2.spirits[i].alkoholhalt) > strength) {

            // The key for the beverage name is "namn", and beverage type is "varugrupp".
            //
            collector.push([DB2.spirits[i].namn, DB2.spirits[i].varugrupp]);
        };
    };

    // Don't forget to return the result.
    //
    return collector;
}

// =====================================================================================================
// Lists all beverage types in the database. As you will see, there are quite a few, and you might want
// select only a few of them for your data.
//
function beverageTypes() {
    var types = [];
    for (i = 0; i < DB2.spirits.length; i++) {
        addToSet(types, DB2.spirits[i].varugrupp);
    }
    return types;
}

// =====================================================================================================
// Gets all info from a beverage
//
function beverageInfo(id) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == id) {
            return DB2.spirits[i];
        }
    }
}

// =====================================================================================================
// Changes the stock of beverage of id with amount
//
function changeStock(id, amount) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == id) {
            DB2.spirits[i].stock = Number(DB2.spirits[i].stock) + Number(amount);
            if (DB2.spirits[i].stock < 0) {
                DB2.spirits[i].stock = 0;
            }
        }
    }
    return false;
}

// =====================================================================================================
// Changes the price of beverage of id to the amount
//
function changePrice(id, newPrice) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == id) {
            DB2.spirits[i].prisinklmoms = Number(newPrice);
        }
    }
    return false;
}

// =====================================================================================================
// Removes a beverage
//
function addBeverage(beverage) {
    DB2.spirits.push(beverage);
}

// =====================================================================================================
// Removes a beverage
//
function removeBeverage(id) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == id) {
            DB2.spirits.splice(i, 1);
            return true;
        }
    }
    return false;
}

// =====================================================================================================
// Checks if ID exists
//
function IDExists(id) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == id) {
            return true;
        }
    }
    return false;
}

// =====================================================================================================
// Adds an item to a set, only if the item is not already there.
// The set is modelled using an array.
//
function addToSet(set, item) {
    if (!set.includes(item)) {
        set.push(item);
    }
    return set;
}

// =====================================================================================================
// Convenience function to change "xx%" into the percentage in whole numbers (non-strings).
//
function percentToNumber(percentStr) {
    return Number(percentStr.slice(0,-1));
}

function allMenuBeverages() {
    // Using a local variable to collect the items.
    var collector = [];

    for (i = 0; i < DB2.spirits.length; i++) {
        collector.push([DB2.spirits[i].namn, DB2.spirits[i].artikelid, DB2.spirits[i].stock, DB2.spirits[i].prisinklmoms, DB2.spirits[i].hidden]);
    };

    return collector;
}

function getOrder(table_id) {
    for (i=0; i < DB.orders.length; i++) {
        if (parseInt(DB.orders[i].table) == parseInt(table_id)) {
            return DB.orders[i].item_id;
        }
    }
}

function getBeerInfoFromId(id) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == parseInt(id)) {
            return [DB2.spirits[i].namn, DB2.spirits[i].producent, DB2.spirits[i].ursprunglandnamn, DB2.spirits[i].varugrupp, DB2.spirits[i].alkoholhalt, DB2.spirits[i].forpackning, DB2.spirits[i].prisinklmoms, DB2.spirits[i].stock]
        }
    };
}

function getWineInfoFromId(id) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == parseInt(id)) {
            return [DB2.spirits[i].namn, DB2.spirits[i].argang, DB2.spirits[i].producent, DB2.spirits[i].varugrupp, DB2.spirits[i].ursprung, DB2.spirits[i].forpackning, DB2.spirits[i].stock]
        }
    };
}

function getSpiritInfoFromId(id) {
    for (i = 0; i < DB2.spirits.length; i++) {
        if (DB2.spirits[i].artikelid == parseInt(id)) {
            return [DB2.spirits[i].namn, DB2.spirits[i].varugrupp, DB2.spirits[i].alkoholhalt, DB2.spirits[i].stock]
        }
    };
}

function getTypeFromId(id) {
    var all = allBeveragesWithID();
    for (i=0; i < all.length; i++) {
        if (parseInt(all[i][0]) == parseInt(id)) {
            return all[i][3];
        }
    }
}

function getNameFromId(id) {
    var all = allBeveragesWithID();
    for (i=0; i < all.length; i++) {
        if (parseInt(all[i][0]) == parseInt(id)) {
            return all[i][1];
        }
    }
    return "null";
}

function getCostFromId(id) {
    var all = allBeveragesWithID();
    for (i=0; i < all.length; i++) {
        if (parseInt(all[i][0]) == parseInt(id)) {
            return all[i][2];
        }
    }
    return 0;
}

function getIdFromName(name) {
    var all = allBeveragesWithID();
    for (i=0; i < all.length; i++) {
        if (all[i][1] === name) {
            return all[i][0];
        }
    }
}

function getStockFromId(id) {
    var all = allBeveragesWithID();
    for (i=0; i < all.length; i++) {
        if (parseInt(all[i][0]) == parseInt(id)) {
            return all[i][4];
        }
    }
}

function allBeveragesOfType(type) {
    var collector = [];

    for (i = 0; i < DB2.spirits.length; i++) {
        if(DB2.spirits[i].varugrupp.includes(type)) {
            collector.push([DB2.spirits[i].namn, DB2.spirits[i].artikelid, DB2.spirits[i].stock, DB2.spirits[i].prisinklmoms, DB2.spirits[i].hidden]);
        }
    };
    return collector;
}

function allBeveragesWithStrength(way, strength) {
    var collector = [];
    if(way === "above") {
        for (i = 0; i < DB2.spirits.length; i++) {
                if (percentToNumber(DB2.spirits[i].alkoholhalt) > strength) {
                    collector.push([DB2.spirits[i].namn, DB2.spirits[i].artikelid, DB2.spirits[i].stock, DB2.spirits[i].prisinklmoms, DB2.spirits[i].hidden]);
                };
            };
    }
    if(way === "below") {
        for (i = 0; i < DB2.spirits.length; i++) {
            if (percentToNumber(DB2.spirits[i].alkoholhalt) < strength) {
                collector.push([DB2.spirits[i].namn, DB2.spirits[i].artikelid, DB2.spirits[i].stock, DB2.spirits[i].prisinklmoms, DB2.spirits[i].hidden]);
            };
        };
    }
    return collector;
}

// =====================================================================================================
// =====================================================================================================
// END OF FILE
// =====================================================================================================
// =====================================================================================================


