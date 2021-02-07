function user_login() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var allUsernames = allUserNames();
    if (allUsernames.includes(username)) {
        var details = userDetails(username);
        if (password == details[0]) {
            console.log("Valid username and password")
            if(details[1] == 0) {
                window.location.href = "staff.html"; 
            } else {
                window.location.href = "vipuser.html";  
            }
        } else {
            console.log("Valid username but invalid password")
        }
    } else {
        console.log("Invalid username")
    }
}

function guest_login() {
    window.location.href = "user.html";
}

//Check username and password, return with wrong password or redirect to staff.html