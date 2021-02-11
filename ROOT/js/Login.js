function user_login() {

    var username = document.getElementById("username_label").value;
    var password = document.getElementById("password_label").value;
    var x = document.getElementById("wrong_creds");
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
            x.style.display = "block";
            console.log("Valid username but invalid password")
        }
    } else {
        x.style.display = "block";
        console.log("Invalid username")
    }
}

function guest_login() {
    window.location.href = "user.html";
}

//Check username and password, return with wrong password or redirect to staff.html