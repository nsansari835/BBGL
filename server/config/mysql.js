var mysql = require('mysql');

var fs = require('fs');
 
// require path for getting the models path
var path = require('path');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'my_db',
  port     : '8889'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();

 // HOW WOULD I WRITE THIS WITHOUT using PATH ? :-\
 var models_path = path.join(__dirname, './../models');
 
 // read all of the files in the models_path and require (run) each of the javascript files
 fs.readdirSync(models_path).forEach(function(file) {
   if(file.indexOf('.js') >= 0) {
     // require the file (this runs the model file which registers the schema)
     require(models_path + '/' + file);
   }
 });