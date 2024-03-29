//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded.
function init(){
    // CHECK IF USER IS LOGGED IN
    checkLoginUser();

    // LOAD ALL THE REVIEWS
    loadAllReviews();
}


/* logs in user*/
function loginUser() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    let emailLogin=document.getElementById("inputEmailLogin").value.trim();
    let passwordLogin=document.getElementById("inputPasswordLogin").value.trim();
    
    // User boject containing all the data
    let userObject = {
        email:emailLogin,
        password:passwordLogin
    };
    xhttp.onreadystatechange = () => {//Called when data returns from server
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            var responseData = xhttp.responseText;
            // reg successful
            if(responseData=="OK"){
            alert("Login Successful");
            sessionStorage.setItem("loggedInUser",emailLogin);
            document.getElementById("form-box").style.display="none";
            document.getElementById("successful-login").style.display="block";
            document.getElementById("logout-message").innerHTML="Do you wish to logout? "+sessionStorage.getItem("loggedInUser");
            }
            // error
            else{
                alert("Incorrect username or password");
            }
        }
    };
    // //Request data for all users
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(userObject) );    
}


/*LOGOUT USER */
function logoutUser(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            var responseData = xhttp.responseText;
            // logout successful
            if(responseData=="loggedOut"){
                alert("You are logged out")
                sessionStorage.clear();
                location.reload();
            }
            else{
                alert("Error in logging out")
            }
        }
    };
    xhttp.open("GET", "/logout", true);
    xhttp.send();
}



/* Posts a new user*/
function addUser() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let userName = document.getElementById("inputName").value.trim();
    let userEmail = document.getElementById("inputEmail").value.trim();
    let userDOB = document.getElementById("inputDate").value.trim();
    let userPassword = document.getElementById("inputPassword").value.trim();
    
    //Create object with user data
    let userObject = {
        name: userName,
        email: userEmail,
        password:userPassword,
        dob:userDOB
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = ()=> {
        // alert(xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var responseData = xhttp.responseText;
            if(responseData=="USER ADDED"){
                alert("Registration Successful");
            }
            else{
                alert("Email already exists")
            }
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/user", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(userObject) );
}



// ADD BOOK POST
function writeBook(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    let bookTitle=document.getElementById("title").value.trim();
    let bookAuthor=document.getElementById("author").value.trim();
    let bookGenre=document.getElementById("genres").value.trim();
    let bookPublishedDate=document.getElementById("published_date").value.trim();
    
    let fileArray = document.getElementById("FileInput").files;
    
    // object containing book data
    let bookReviewObject={
        title:bookTitle,
        author:bookAuthor,
        genre:bookGenre,
        published_date:bookPublishedDate,
        picture_url:fileArray.item(0).name,
        user:sessionStorage.getItem("loggedInUser")
    };
    fileUpload(fileArray);
    
    xhttp.onreadystatechange = (event)=> {
        // alert(xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
               
            var responseData = xhttp.responseText;
            if(responseData=="BOOK ADDED"){
                alert("Book Added Successfully");
                event.preventDefault();
            }
        }
    };

    xhttp.open("POST", "/reviewBook", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(bookReviewObject));
}


// SENDING REVIEW POST
function sendReview(){
    let xhttp = new XMLHttpRequest();
    let bookTitle=sessionStorage.getItem("bookToReview");
    let bookRating=document.getElementById("rating").value.trim();
    let bookReview=document.getElementById("review").value.trim();
    let reviewDate=new Date().toISOString().slice(0, 10);

    // REVIEW OBJECT CONTAINING REVIEW DATA
    let reviewObject={
        title:bookTitle,
        review_date:reviewDate,
        review_text:bookReview,
        review_rating:bookRating,
        user:sessionStorage.getItem("loggedInUser")
    };

    xhttp.onreadystatechange = (event)=> {
        // alert(xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {               
            var responseData = xhttp.responseText;
            if(responseData=="REVIEW ADDED"){
                alert("Review Added Successfully");
                sessionStorage.removeItem("bookToReview");
            }
            else{
                console.log(responseData);
                event.preventDefault();
            }            
        }
    };
    // post review data
    xhttp.open("POST", "/review", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(reviewObject));
}


// upload book image
function fileUpload(fileArray){
    let xhttp = new XMLHttpRequest();

    //Get file that we want to upload
    if(fileArray.length !== 1){
        console.log("not there");
        return;
    }

    let pictureData=new FormData();
    pictureData.append("myFile",fileArray[0]);
    xhttp.open("POST", "/fileUpload");
    xhttp.send(pictureData);
}


// check if user is still loggedin
function checkLoginUser(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            var responseData = xhttp.responseText;
            // if  still loggedin
            if(responseData=="LOGGEDIN"){
                console.log(responseData);
                console.log("User still loggedin")
                getLoggedInAccount();
                document.getElementById("form-box").style.display="none";
                document.getElementById("successful-login").style.display="block";
                document.getElementById("logout-message").innerHTML="Do you wish to logout? "+sessionStorage.getItem("loggedInUser");
            }
            else{
                console.log(responseData);
            }
        }
    };
    xhttp.open("GET", "/loggedin", true);
    xhttp.send();
}


// get loggedin account details
function getLoggedInAccount(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            var responseData = xhttp.responseText;
            console.log(responseData);
            displayUserDetails(responseData);
            
        }
    };
    xhttp.open("GET", "/loggedInUserDetails", true);
    xhttp.send();
}

// display user details in a form
function displayUserDetails(jsonUser){
    let userArray=JSON.parse(jsonUser);
    console.log(jsonUser);
    for (let i = 0; i < userArray.length; i++) {
        document.getElementById("user_id_account").value=userArray[i].user_id;
        document.getElementById("nameEdit").value=userArray[i].name;
        document.getElementById("emailEdit").value=userArray[i].email;
        document.getElementById("passwordEdit").value=userArray[i].password;
        document.getElementById("dobEdit").value=userArray[i].date_of_birth;     
        console.log(dateFormat(userArray[i].date_of_birth, 'yyyy-MM-dd'));   
    }
}


// UPDATE user account
function updateAccount(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let userNameEdit = document.getElementById("nameEdit").value.trim();
    let userEmailEdit = document.getElementById("emailEdit").value.trim();
    let userPasswordEdit = document.getElementById("passwordEdit").value.trim();
    let userDObEdit = document.getElementById("dobEdit").value.trim();
    //Create object with user data
    let userObject = {
        name: userNameEdit,
        email: userEmailEdit,
        password:userPasswordEdit,
        dob:userDObEdit
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = (event)=> {
        // alert(xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var responseData = xhttp.responseText;

            if(responseData=="Successful updating"){
            alert("User Updated Successfully");
            }
            else{
                alert("Alert updating")
            }
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/userUpdate", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(userObject) );
}


// ========================================================================
/* THIS SECTION IS FOR GETTING ALL THE REVIEWS FROM THE DB */
function loadAllReviews(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            var responseData = xhttp.responseText;
            console.log(responseData);
            displayAllReviews(responseData);
            
        }
    };
    xhttp.open("GET", "/getreviewDetails", true);
    xhttp.send();
}

// display the reviews on the wbeiste
function displayAllReviews(jsonReviews){
    // get json data from response data
    let reviewArray = JSON.parse(jsonReviews);

    let htmlStr = "";
    for(let i = 0; i < reviewArray.length; ++i) {
        htmlStr += '<div class="card" id="'+reviewArray[i].review_id+'">';
        htmlStr+= ' <input type="hidden" id="userId" value="'+reviewArray[i].user_id+'">';
        htmlStr+= ' <input type="hidden" id="reviewId" value="'+reviewArray[i].review_id+'">';
        htmlStr+='<div class="user-name">'+reviewArray[i].name+'</div>';
        htmlStr += '<div class="title">'+reviewArray[i].title+'</div>';
        htmlStr += '<div class="row book-card">';
        htmlStr += '<div class="column card-right book-image">';
        htmlStr += '<div class="image">';
        htmlStr += '<img src="'+reviewArray[i].picture_url+'" alt="">';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '<div class="column card-left book-details">';

        htmlStr += '<div class="details">';
        htmlStr += '<ul class="details-list">';
        htmlStr += '<li><span class="detail-text">Author:</span> '+reviewArray[i].author+'</li>';
        htmlStr += '<li><span class="detail-text">Genre:</span> '+reviewArray[i].genre+'</li>';
        htmlStr += '<li><span class="detail-text">Published Date:</span> '+reviewArray[i].published_date+'</li>';
        htmlStr += '<li><span class="detail-text">Rating:</span> '+reviewArray[i].rating+'/10</li>';
        htmlStr += '<li><span class="detail-text">Review Date:</span> '+reviewArray[i].review_date+'</li>';
        htmlStr += '</ul>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '<div class="text">';
        htmlStr += '<p>'+reviewArray[i].review_text+'</p>';
        htmlStr += '</div>';
        htmlStr += '</div>';
    }

    //   ADDING THE review cards CONTAINER DIV
    document.querySelector("#all-boxes").innerHTML = htmlStr;
}


/** GET GENRE SELECTED REVIEWS */
function getGenreSelectedReviews(genre){

    let xhttp = new XMLHttpRequest();
    let genreObject={
        genreChosen:genre
    };
    xhttp.onreadystatechange = (event)=> {
        // alert(xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("Worked"); 
            var responseData = xhttp.responseText;
            displayGenreReviews(responseData);           
        }
    };
    xhttp.open("POST", "/genreSelected", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(genreObject));
}

// display genre selected reviews
function displayGenreReviews(jsonGenreReviews){
    // get json data from php
    let reviewArray = JSON.parse(jsonGenreReviews);

    let htmlStr = "";
    for(let i = 0; i < reviewArray.length; ++i) {
        htmlStr += '<div class="card">';
        htmlStr+='<div class="user-name">'+reviewArray[i].name+'</div>';
        htmlStr += '<div class="title">'+reviewArray[i].title+'</div>';
        htmlStr += '<div class="row book-card">';
        htmlStr += '<div class="column card-right book-image">';
        htmlStr += '<div class="image">';
        htmlStr += '<img src="'+reviewArray[i].picture_url+'" alt="">';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '<div class="column card-left book-details">';
        htmlStr += '<div class="details">';
        htmlStr += '<ul class="details-list">';
        htmlStr += '<li><span class="detail-text">Author:</span> '+reviewArray[i].author+'</li>';
        htmlStr += '<li><span class="detail-text">Genre:</span> '+reviewArray[i].genre+'</li>';
        htmlStr += '<li><span class="detail-text">Published Date:</span> '+reviewArray[i].published_date+'</li>';
        htmlStr += '<li><span class="detail-text">Rating:</span> '+reviewArray[i].rating+'/10</li>';
        htmlStr += '<li><span class="detail-text">Review Date:</span> '+reviewArray[i].review_date+'</li>';
        htmlStr += '</ul>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        htmlStr += '<div class="text">';
        htmlStr += '<p>'+reviewArray[i].review_text+'</p>';
        htmlStr += '</div>';
        htmlStr += '</div>';
    }

    //   ADDING THE PRODUCTS TO BOX CONTAINER DIV
    document.querySelector("#genre-boxes").innerHTML = htmlStr;
}