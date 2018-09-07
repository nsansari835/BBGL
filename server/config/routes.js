var controller = require('../controllers/users.js');
var path = require('path');
var mysql = require("mysql");
var session = require('express-session');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bbgdb7',
    port: '3306',
});

connection.connect();

module.exports = function (app) {


    app.post('/adduser', function (request, response) {
        console.log("reached the route for makerest")
        connection.query(`INSERT INTO users(email, password, first_name, last_name, dob, state, city, industry, created_at, updated_at) VALUES ('${request.body.email}', '${request.body.password}', '${request.body.first_name}', '${request.body.last_name}', '${request.body.dob}', '${request.body.state}', '${request.body.city}', '${request.body.industry}', NOW(), NOW())`, function (error, results, fields) {
            if (error) {
                throw error;
                console.log('The solution is: ', results, error);
            }
            else if (results) {
                console.log(results, "UPDATED TABLE FOR EDIT    ")
                response.json({ message: "Successfully updated" })
                return response.redirect('/')
            }
            // else if(request.body.password.length < 6){
            //     throw error;
            // }
            // else if(request.body.password != request.body.conf_password){
            //     throw error;
            // }
        });
    })

    app.post("/sessions", (request, response, next) => {
        console.log("Server > POST '/sessions' | req.body: ", request.body);
        connection.query(`SELECT * FROM users WHERE users.email = '${request.body.email}' LIMIT 1 `, function (error, results, user) {



            if (error) {
                console.log("SELECT user ERROR: ", error)
            }
            else if (results /*&& results.length > 0*/) {
                console.log("SELECT user SUCCESS - results:", results);
                console.log("PRESESSION SESSION", request.session.user_id, "THIS IS SESSSION")
                request.session.user_id = results[0].id;
                console.log(results[0].id, "REQUEST ID")
                console.log(request.session.user_id, "THIS IS SESSSION")
                response.json({ status: true, msg: 'Success' })
                // return response.redirect('/')
            } else {
                console.log("Something is weird");
            }
        })

    })

    // app.use(function(request, response, next){
    //     if(request.session.user_id){
    //         return next();
    //     } 
    //     else {
    //         return response.redirect('/')
    //     }
    // })

    // map = {
    //     '192.168.1.1' : {

    //     },
    //     '192.168.1.2' : {

    //     },
    //     '192.168.3.5' : {
    //         user_id: 7
    //     }

    // }

    // function auth(req, res){
    //     if(request.session.user_id){
    //         return response.render('dashboard.ejs');
    //     } else if (request.session.user_type === 'admin'){

    //     }
    //     else{
    //         return response.redirect('/')
    //     }
    // }

    app.get("/dashboard", (request, response) => {
        // auth(request, response);
        if (request.session.user_id) {
            connection.query(`SELECT * FROM users WHERE users.id = '${request.session.user_id}' LIMIT 1 `)
            console.log(request.session.user_id)
            return response.render('/dashboard')
        } else if (request.session.user_type === 'admin') {

        }
        else {
            return response.redirect('/')
            console.log("Nothing here")
            // return response.redirect('/')
        }
    })

    app.get('/profile', function (request, response) {
        console.log("reached the route for PROFILE")
        console.log(request.session.user_id, "WHATS SESSION")
        connection.query(`SELECT * FROM users WHERE users.id = '${request.session.user_id}' LIMIT 1 `, function (error, results) {
            if (error) {
                console.log("SELECT PROFILE ERROR:", error)
            }
            else if (results) {
                console.log(results, "PROFILE TABLE")
                response.json({ results })
            }
        });
    })

    app.get('/profile/:id', function (request, response) {
        console.log("reached the route for PULL EDIT PROFILE")
        if (request.session.user_id) {
            connection.query(`SELECT * FROM users WHERE users.id = '${request.params.id}' LIMIT 1`, function (error, data) {
                if (error) {
                    console.log("SELECT PROFILE ERROR:", error)
                }
                else if (data) {
                    console.log(data, "PROFILE TABLE FOR EDIT")
                    response.json({ data: data })
                }
            });
        }
        else {
            return response.redirect('/')
        }
    })

    app.post('/update/:id', function (request, response) {
        console.log("reached the route for UPDATING THE PROFILE", request.body)

        connection.query(`UPDATE bbgdb2.users SET name='${request.body.name}', state = '${request.body.state}', city = '${request.body.city}', industry = '${request.body.industry}' WHERE users.id = '${request.params.id}' LIMIT 1`, function (error, results) {
            if (error) {
                console.log("SELECT PROFILE ERROR:", error)
            }
            else if (results) {
                console.log(results, "UPDATED TABLE FOR EDIT    ")
                response.json({ message: "Successfully updated" })
            }

        });
    })

    app.post('/post', function (request, response) {
        console.log("THIS IS THE SESSION", request.session.user_id)
        console.log("THIS IS THE SESSION", request.session.user_id, "reached the route for MAKING A POST", request.body, "THIS IS THE SESSION", request.session.user_id)
        console.log("THIS IS THE SESSION", request.session.user_id)

        connection.query(`INSERT INTO posts(post, users_id, created_at, updated_at, industries_id) VALUES ('${request.body.post}', '${request.session.user_id}', NOW(), NOW(), '${request.body.industry}')`, function (error, results, fields) {
            if (error) {
                throw error;
                console.log("THERE WAS A PROBLEM WITH THE POST", error)
            }
            else if (results) {
                console.log(results, "POST WAS SUCCESSFULLY MADE")
                response.json({ data: results, message: "Successful" })
            }

        });
    })

    app.post('/addcomment', function (request, response) {
        console.log("THIS IS THE SESSION", request.session.user_id)
        console.log("THIS IS THE SESSION", request.session.user_id, "reached the route for MAKING A comment", request.body, "THIS IS THE SESSION", request.session.user_id)
        console.log("THIS IS THE SESSION", request.session.user_id)

        connection.query(`INSERT INTO comments(comment, users_id, created_at, udpated_at, posts_id) VALUES ('${request.body.comment}', '${request.session.user_id}', NOW(), NOW(), '${request.body.post_id}')`, function (error, results, fields) {
            if (error) {
                throw error;
                console.log("THERE WAS A PROBLEM WITH THE comment", error)
            }
            else if (results) {
                console.log(results, "comment WAS SUCCESSFULLY MADE")
                response.json({ data: results, message: "Successful" })
            }

        });
    })

    app.get('/subscribed', function (request, response) {
        console.log("reached the route for PULL SUBSCRIPTIONS")
        if (request.session.user_id) {
            connection.query(`SELECT industries.ind_name as ind_name, industries.id as ind_id FROM industries JOIN subscriptions ON industries.id = subscriptions.industries_id AND subscriptions.users_id = '${request.session.user_id}'
            JOIN users ON subscriptions.users_id = users.id;`, function (error, data) {
                    if (error) {
                        console.log("SUBSCRIPTION ERROR:", error)
                    }
                    else if (data) {
                        console.log(data, "SUBSCRIBED INDUSTRY INFO")
                        response.json({ data: data })
                    }
                });
        }
        else {
            return response.redirect('/')
        }
    })


    app.get('/subscribedposts', function (request, response) {
        console.log("reached the route for PULL SUBSCRIPTIONS")
        if (request.session.user_id) {
            connection.query(`SELECT industries.ind_name as ind_name, posts.post as posts, users.id as u_id, industries.id as ind_id, posts.id as post_id, users.first_name as first_name, users.last_name as last_name
            FROM industries 
            JOIN subscriptions 
            ON industries.id = subscriptions.industries_id 
            AND subscriptions.users_id = '${request.session.user_id}'
            JOIN users
             ON subscriptions.users_id = users.id
             JOIN posts
             ON industries.id = posts.industries_id;`, function (error, data) {
                    if (error) {
                        console.log("SUBSCRIPTION ERROR:", error)
                    }
                    else if (data) {
                        console.log(data, "SUBSCRIBED INDUSTRY INFO")
                        response.json({ data: data })
                    }
                });
        }
        else {
            return response.redirect('/')
        }
    })

    app.get('/industryposts/:id', function (request, response) {
        console.log("reached the route for PULLING INDUSTRY POSTS $$$$$$$$$$$$$$$$$$$$")
        if (request.session.user_id) {
            connection.query(`SELECT 
            posts.id as post_id, posts.post as post, posts.created_at as post_created_at, posts.updated_at as post_updated_at, posts.industries_id as posts_industries_id, posts.users_id as posts_users_id, users.id as user_id, users.first_name as first_name, users.last_name as last_name, industries.id as industry_id, industries.ind_name as industry_name
            FROM posts 
            JOIN users
            ON users.id = posts.users_id
			JOIN industries 
            ON industries.id = posts.industries_id 
            WHERE posts.industries_id = '${request.params.id}'`, function (error, data) {
                    if (error) {
                        console.log("INDUSTRY LOAD ERROR:", error)
                    }
                    else if (data) {
                        console.log(data, "ALL THE POSTS FROM AN INDUSTRY")
                        response.json({ data: data })
                    }
                });
        }
        else {
            return response.redirect('/')
        }
    })
    app.get('/getcomments', function (request, response) {
        console.log("reached the route for PULLING INDUSTRY POSTS $$$$$$$$$$$$$$$$$$$$")
        if (request.session.user_id) {
            connection.query(`SELECT users.first_name, comments.comment, comments.posts_id, comments.created_at
            FROM users
            JOIN comments
            ON users.id = comments.users_id;`, function (error, data) {
                    if (error) {
                        console.log("GET COMMENTS LOAD ERROR:", error)
                    }
                    else if (data) {
                        console.log(data, "ALL THE COMMENTS")
                        response.json({ data: data })
                    }
                });
        }
        else {
            return response.redirect('/')
        }
    })

    app.get('*', (req, response) => {
        response.sendFile(path.resolve('./client/dist/client/index.html'));
    })
}