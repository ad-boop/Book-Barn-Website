//Import the mysql module and create a connection pool with user details
const mysql = require('mysql');
// connection pool for sql database
const connectionPool = mysql.createPool({
    connectionLimit: 100,
    host: "127.0.0.1",
    user: "dg",
    password: "123456",
    database: "book_barn",
    debug: false
});



//Adds a new user to database 
exports.addUser = (name, email, password,dob, response) => {
    //Build query
    let sql = "INSERT INTO user (name, email, password, date_of_birth) " +
    "       VALUES ('" + name + "','" + email + "','" + password +"','"+dob+"')";
    
    //Execute query
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "yyy}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Send back result
            response.send("USER ADDED");
        }
    });
}

// make logged in user logged in
exports.getLoginUser=(email,password,response,request)=>{
    connectionPool.query("SELECT * FROM user WHERE email=? AND password=?",[email,password],function (err,result,fields){
        if (err || !(result) || result == 0) {
            // handle error or empty result set here
            console.log(result);
            response.send('Something went wrong')
        }
        else{
            console.log(result);
            request.session.loggedin = true;
            request.session.email = email;
            console.log("This email is in session right now: "+request.session.email);
            response.send('OK');
        }
    });
}

// get logged in user detaiils
exports.getLoggedInUserDetails=(email,response)=>{
    connectionPool.query("SELECT * FROM user WHERE email=?",[email],function(err,result){
        if (err || !(result) || result == 0) {
            console.log(result);
            console.log("Something went wrong");
        }
        else{
            // console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }
    });
}

// user update info
exports.userUpdateInfo=(name,email,password,response)=>{
    connectionPool.query("UPDATE user SET name=? , password=? WHERE email=?",[name,password,email],function(err,result){
        if (err || !(result) || result == 0){//Check for errors
            let errMsg = "{Error: " + err + "yyy}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Send back result
            console.log("Successful updating");
            response.send("Successful updating")
        }
    });
}

// add book details
exports.addBook=(title,author,genre,picture_url,published_date,user,response,request)=>{
    let user_id="SELECT `user_id` FROM `user` WHERE email='"+user+"'";
    let sqlBook = "INSERT INTO books (title, author, genre, published_date, picture_url,book_user_id) " +
    "       VALUES ('" + title + "','" + author + "','" + genre +"','" + published_date +"','"+picture_url+"',("+user_id+"))";
    
    //Execute query
    connectionPool.query(sqlBook, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "yyy}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Send back result
            response.send("BOOK ADDED");
            console.log(result.insertId);
            request.session.loggedin = true;
            request.session.email = user;
        }
    });
}


// add review detail
exports.addReview=(book_title,useremail,reviewDate,reviewText,rating,response,request)=>{
    let book_id="SELECT `book_id` FROM `books` WHERE title='"+book_title+"'";
    let user_id="SELECT `user_id` FROM `user` WHERE email='"+useremail+"'";
    let sqlBook = "INSERT INTO reviews (book_id,user_id,review_text,rating,review_date) " +
    "VALUES (("+book_id+"),("+user_id+"),'" +reviewText+"','"+rating+"','"+reviewDate+"') ";
    
    //Execute query
    connectionPool.query(sqlBook, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "yyy}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Send back result
            response.send("REVIEW ADDED");
            // console.log(result.insertId);
            request.session.loggedin = true;
            request.session.email = useremail;
        }
    });
}


// get all the reviews
exports.getAllReviews= (response) =>{
    let sql= "SELECT * FROM reviews INNER JOIN  books ON reviews.book_id = books.book_id INNER JOIN user ON reviews.user_id=user.user_id";

    //Execute query 
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "xxx}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Return results in JSON format 
            // console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }
    });

}

// get genre specific reviews
exports.getGenreReviews=(genre,response)=>{
    let sql= "SELECT * FROM reviews INNER JOIN  books ON reviews.book_id = books.book_id INNER JOIN user ON reviews.user_id=user.user_id WHERE books.genre='"+genre+"'";
    //Execute query 
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "xxx}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Return results in JSON format 
            // console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }
    });
}
