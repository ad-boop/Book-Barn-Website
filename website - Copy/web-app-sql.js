//Import the express and body-parser modules
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const fileUpload = require('express-fileupload');

//Create express app and configure it with body-parser

//Import database functions
const db = require('./database');
const res = require('express/lib/response');


//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Configure Express to use the file upload module
app.use(fileUpload());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Set up express to serve static files from the directory called 'public'
app.use(express.static('public'));

app.use(
    expressSession({
        secret: 'bookbarn login',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: true
    })
);




//Set up application to handle POST requests sent to the customers path
app.post('/user', addUser);//Adds a new customer

app.post('/userUpdate',updateUserAccount);

// app.get('/checklogin', checklogin);//Checks to see if user is logged in.
app.get('/logout', logout);//Logs user out

//Set up application to handle POST requests
app.post('/login', login);//Logs the user in

//Start the app listening on port 8080
app.listen(8080);




//Handles POST requests for adding user to the db
function addUser(request, response){
    //Extract customer data
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser));

    //Call function to add new customer
    db.addUser(newUser.name, newUser.email, newUser.password,newUser.dob, response);
    //Add user to our data structure
}


// handles post request for login
function login(request,response){
    let email = request.body.email;
	let password = request.body.password;
    // console.log(response);
    console.log("Data received: " + JSON.stringify(request.body))
    console.log(email,password);
    if (email !=="" && password !=="") {
        console.log("cjecl");
        db.getLoginUser(email,password,response,request);      
    }
    else{
        response.send('Please enter Email and Password!');
		response.end();
    }
}

// get requestion for logged in user
app.get('/loggedInUserDetails',function(request,response){
    let loggedInEmail=request.session.email;
    if(loggedInEmail !== null){
        db.getLoggedInUserDetails(loggedInEmail,response);
    }
    else{
        console.log("error");
    }
});


// get request Checks to see if the user has logged in
app.get('/loggedin', function(request, response) {
	// If the user is loggedin
    console.log(request.session.loggedin);
	if (request.session.loggedin) {
		// Output username
        response.send("LOGGEDIN");
        request.session.loggedin==true;
    }
	else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});


// GET request Logs the user out.
function logout(request, response){
    //Destroy session.
    request.session.destroy( err => {
        if(err)
            response.send('{"error": '+ JSON.stringify(err) + '}');
        else
            response.send('loggedOut');
            console.log(request.session);
    });
}


// post request for updating user 
function updateUserAccount(request,response){
    let updateUser = request.body;
    console.log("Data received: " + JSON.stringify(updateUser));
    db.userUpdateInfo(updateUser.name,updateUser.email,updateUser.password,response);
}

// post request for uploading pics in the upload file
app.post('/fileUpload', function(request, response) {
    //Check to see if a file has been submitted on this path
    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('{"upload": false, "error": "Files missing"}');
    }

    // The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
    let myFile = request.files.myFile;

    /* Use the mv() method to place the file in the folder called 'uploads' on the server.
        This is in the current directory */
    myFile.mv('public/uploads/' + myFile.name, function(err) {
        if (err)
            return response.status(500).send('{"filename": "' +
                myFile.name + '", "upload": false, "error": "' +
                JSON.stringify(err) + '"}');

        //Send back confirmation of the upload to the client.
        response.send('{"filename": "' + myFile.name +
            '", "upload": true}');
  });
});


//Handle POST requests for adding book data
app.post('/reviewBook', function(request, response) {
    let bookReview = request.body;
    // console.log("Data received: " + JSON.stringify(bookReview));
  db.addBook(bookReview.title,bookReview.author,bookReview.genre,"/uploads/"+bookReview.picture_url,bookReview.published_date,bookReview.user,response,request);
  
});


// handle post  request for adding review data
app.post('/review',function(request,response){
    let review = request.body;
    // console.log("Data received: " + JSON.stringify(review));
    db.addReview(review.title,review.user,review.review_date,review.review_text,review.review_rating,response,request);
}); 


// handle get request for getting all the reviews  
app.get('/getreviewDetails',function(request,response){
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'customers' we return all customers
    if(pathEnd === 'getreviewDetails'){
        //Call function to return all customers
        db.getAllReviews(response);
    }
    else{//The path is not recognized. Return an error message
        response.send("{error: 'Path not recognized'}")
    }
});


// post request for selected genre reviews
app.post('/genreSelected',function(request,response){
    let genre=request.body
    db.getGenreReviews(genre.genreChosen,response);
});

//Export server for testing
module.exports = app;