// REGISTER USER TO DATABASE
//Points to a div element where user combo will be inserted.
// let userDiv;
// let addUserResultDiv;

// //Set up page when window has loaded
// window.onload = init;

// //Get pointers to parts of the DOM after the page has loaded.
// function init(){
//     userDiv = document.getElementById("userDiv");
//     addUserResultDiv = document.getElementById("AddUserResult");
//     loadUsers();
// }

// /* Loads current users and adds them to the page. */
// function loadUsers() {
//     //Set up XMLHttpRequest
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {//Called when data returns from server
//         if (xhttp.readyState == 4 && xhttp.status == 200) {
//             //Convert JSON to a JavaScript object
//             let usrArr = JSON.parse(xhttp.responseText);

//             //Return if no users
//             if(usrArr.length === 0)
//                 return;

//             //Build string with user data
//             let htmlStr = "<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Age</th></tr>";
//             for(let key in usrArr){
//                 htmlStr += ("<tr><td>" + key + "</td><td>" + usrArr[key].name + "</td>");
//                 htmlStr += ("<td>" + usrArr[key].email + "</td><td>" + usrArr[key].age + "</td></tr>");
//             }
//             //Add users to page.
//             htmlStr += "</table>";
//             userDiv.innerHTML = htmlStr;
//         }
//     };

//     //Request data for all users
//     xhttp.open("GET", "/user", true);
//     xhttp.send();
// }


/* Posts a new user to the server. */
function addUser() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let userName = document.getElementById("inputName").value;
    let userEmail = document.getElementById("inputEmail").value;
    let userDOB = document.getElementById("inputDate").value;
    let userPassword = document.getElementById("inputPassword").value;

    //Create object with user data
    let custObj = {
        name: userName,
        email: userEmail,
        password:userPassword,
        dob:userDOB
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("User added Successfully");
        }
        else{
            alert("Error adding User")
        }
    };

    //Send new user data to server
    xhttp.open("POST", "/user", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(custObj) );
}