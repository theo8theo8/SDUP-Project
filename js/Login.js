loggedUser = [];

// Logs a user in and enters the correct view
function user_login() {

    // Get username, password, and 
    var username = document.getElementById("username_label").value;
    var password = document.getElementById("password_label").value;
    var x = document.getElementById("wrong_creds");

    // Get all username and check if the one entered is correct
    var allUsernames = allUserNames();
    if (allUsernames.includes(username)) {
        // Check if password is correct
        var details = userDetails(username);
        if (password == details[0]) {
            console.log("Valid username and password")
            // Switch to the correct view, depending on the credentials of the user
            switch (details[1]) {
                case '0': //manager
                changeView("manager-view");
                break;

                case '1': //bartender
                changeView("bartender-view");
                break;
                
                case '2': //waiter/waitress
                changeView("bartender-view");
                break;

                case '3': //VIP customer
                loggedUser = details;
                changeView("user-view");
                break;

                default:
                console.log("Invalid access level: " + details[1]);
            }
        } else {
            x.style.display = "block";
            console.log("Valid username but invalid password")
        }
    } else {
        x.style.display = "block";
        console.log("Invalid username")
    }
}

// For guests, dont log in and show the customer view
function guest_login() { //Ordinary user
    changeView("user-view");
}

// Logging out switches back to the login view
function logOut() {
    loggedUser = [];
    $('#menu').empty();
    changeView("login-view");
}