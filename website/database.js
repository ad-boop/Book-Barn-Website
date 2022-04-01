//Import the mysql module and create a connection pool with user details
const mysql = require('mysql');
const connectionPool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "dg",
    password: "123456",
    database: "book_barn",
    debug: false
});

//Gets all users
exports.getAllUsers = (response) => {
    //Build query
    let sql = "SELECT * FROM user";

    //Execute query 
    connectionPool.query(sql, (err, result) => {
        if (err){//Check for errors
            let errMsg = "{Error: " + err + "xxx}";
            console.error(errMsg);
            response.status(400).json(errMsg);
        }
        else{//Return results in JSON format 
            //console.log(JSON.stringify(result));
            response.send(JSON.stringify(result))
        }
    });
};


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
            response.send("{result: 'User added successfully'}");
        }
    });
}

