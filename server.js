 // Require the Express Module
 var express = require('express');
 var bodyParser = require('body-parser');
 var path = require('path');
 var app = express();

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false}));


// #################################################################
// Espress-Session

 var session = require('express-session');
 var sessionStore = new session.MemoryStore;
 app.use(session({
     cookie: { maxAge: 60000 },
     store: sessionStore,
     saveUninitialized: true,
     resave: 'true',
     secret: 'secret'
 }));

// #############################################################################
// Express-Flash

var flash = require('express-flash');
app.use(flash()); 

//  #######################################
// mysql database connection

 var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'root',
   database : 'bbgdb7',
   port     : '3306',
 });
  
 connection.connect();
  
 connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
   if (error) throw error;
   console.log('The solution is: ', results[0].solution);
 });
  
 connection.end();
 
 
 
 app.use(bodyParser.json());
 
 // Angular app 
 app.use(express.static(__dirname + '/client/dist/client' ));
 app.use(express.static(__dirname + '/BBG' )); // <-- MAKE SURE YOU name YOUR Angular as "public", 
 // or UPDATE this path appropriate to what you named your Angular directory.
 
 // Mongoose config require
 require('./server/config/mysql.js');
 
 // Require route for server.js
 var routes_setter = require('./server/config/routes.js');
 // Invoke route

 routes_setter(app);
 app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
 app.all("*", (req,res,next) => {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
     res.sendFile(path.resolve("./client/dist/client/index.html"))
 });

 
 app.listen(8000, function() {
     console.log('Listening to port 8000 ..');
 })
