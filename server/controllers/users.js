var mysql = require("mysql");

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bbgdb',
    port     : '3306',
  });
   
  connection.connect();

module.exports = {

register: function(req, res) {
    console.log(req.body, "Reached the MAKETASK request")
    console.log(req.params.id, "Reached the MAKETASK request")
    console.log("Post Data:", req.body)
    connection.query(`INSERT INTO users(email, password, conf_password, name, dob, state, city, industry, created_at, updated_at) VALUES ('${req.body.email}', '${req.body.password}', '${req.body.conf_password}', '${req.body.name}', '${req.body.dob}', '${req.body.state}', '${req.body.city}', '${req.body.industry}', NOW(), NOW())` , function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
      });
},

login: function(req,res){
  console.log(req.body, "Reached the LOGIN request")
  console.log(req.params.id, "Reached the LOGIN request")
  console.log("Post Data:", req.body)
  connection.query(`SELECT * FROM WHERE users.email = '${req.body.email}' LIMIT 1 `), function (error, results, user) {

  }
}


}