//Import the express, body-parser and express-session modules
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Configure express to use express-session
app.use(
    expressSession({
        secret: 'cst2120 secret',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: true
    })
);

//Array that will store data about the users. 
//This is only an example - a database would be used for this in real code
let userArray = [];

//Set up application to handle GET requests 
app.get('/users', getUsers);//Returns all users
app.get('/checklogin', checklogin);//Checks to see if user is logged in.
app.get('/logout', logout);//Logs user out

//Set up application to handle POST requests
app.post('/login', login);//Logs the user in
app.post('/register', register);//Register a new user

//Start the app listening on port 8080
app.listen(8080);
console.log("Listening on port 8080");


// GET /users. Returns all the users.
function getUsers(request, response){
    response.send(userArray);
}

// GET /checklogin. Checks to see if the user has logged in
function checklogin(request, response){
    if(!("username" in request.session))
        response.send('{"login": false}');
    else{
        response.send('{"login":true, "username": "' +
            request.session.username + '" }');
    }
}

// GET /logout. Logs the user out.
function logout(request, response){
    //Destroy session.
    request.session.destroy( err => {
        if(err)
            response.send('{"error": '+ JSON.stringify(err) + '}');
        else
            response.send('{"login":false}');
    });
}

/* POST /login. Checks the user's name and password. Logs them in if they match
    Expects a JavaScript object in the body:
    {name: "user name", password: "user password"} */
function login(request, response){
    let usrlogin = request.body;
    console.log("Name: " + usrlogin.name + " password: " + usrlogin.password);

    //Look to see if we have a matching user
    let userfound = false;
    for(let user of userArray){
        if(user.name === usrlogin.name && user.password === usrlogin.password){//Found matching user
            //Store details of logged in user
            request.session.username = user.name;
            userfound = true;

            //End search
            break;
        }
    }

    //Send back appropriate response
    if(userfound)
        response.send('{"login":true}');
    else
        response.send('{"login": false, "message":"Username or password incorrect."}');
}

/* POST /register. Registers a new user.
    Expects a JavaScript object in the body:
        {name: "user name", password: "user password"} */
function register(request, response){
    //Output the data sent to the server
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser));

    //Should do some checking here!!

    //Add user to our data structure
    userArray.push(newUser);
    
    //Finish off the interaction.
    response.send('{"registration":true, "username": "' +
        newUser.name + '" }');
}


