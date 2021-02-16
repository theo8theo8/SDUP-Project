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
                window.location.href = "manager.html";
                break;

                case '1': //bartender
                window.location.href = "staff.html";
                break;
                
                case '2': //waiter/waitress
                window.location.href = "staff.html";
                break;

                case '3': //VIP customer
                window.location.href = "vipuser.html"; 
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
    window.location.href = "user.html";
}

function logOut() {
    window.location.href = "index.html";
}