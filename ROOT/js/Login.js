function user_login() {

    var username = document.getElementById("username_label").value;
    var password = document.getElementById("password_label").value;
    var x = document.getElementById("wrong_creds");
    var allUsernames = allUserNames();
    if (allUsernames.includes(username)) {
        var details = userDetails(username);
        if (password == details[0]) {
            console.log("Valid username and password")
            switch (details[1]) {
                case '0': //manager
                changeView("manager-view");
                break;

                case '1': //bartender
                changeView("staff-view");
                break;
                
                case '2': //waiter/waitress
                changeView("staff-view");
                break;

                case '3': //VIP customer
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

function guest_login() { //Ordinary user
    changeView("user-view");
}

function logOut() {
    changeView("login-view");
}