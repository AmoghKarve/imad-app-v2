var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user:"amoghkarve",
    database:"amoghkarve",
    host:"db.imad.hasura-app.io",
    password:process.env.DB_PASSWORD
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 3000*60*60*24*30}
}));

function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
    var date = data.date;
    
    var htmlTemplate = `
        <html>
            <head>
                <title>
                    ${title}
                </title>
                <meta name="winport" content="width=device-width, initial-scale=1"/>    
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div class = "container">
                    <div>
                        <a href="/">Home</a>
                    </div>
                    <div>
                        <h3>
                            ${heading}
                        </h3>
                    </div>
                    <hr/>
                    <div>
                        ${date.toDateString()}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            </body>
        </html>
    `;
    return htmlTemplate;
}

var counter = 0;

app.get('/counter',function(req,res){
   counter = counter + 1;
   res.send(counter.toString());
});

var names = [];
app.get('/submit-name',function(req,res){
    //var name = req.params.name; //this is if we use it in this fashion
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');  
  return ["pbkdf2",salt,"10000",hashed.toString('hex')].join('$');
}

app.post('/create-user',function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send('User successfully created:' + username);
       }
   });
});

app.post('/login',function(req,res){
   var username = req.body.username;
   var password = req.body.password;

   pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
       console.log(username);
       console.log(password);       
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           if(result.rows.length === 0){
               res.send(403).send("username/password invalid");
           }else{
                var dbstring = result.rows[0].password;
                var salt = dbSrting.split('$')[1];
                var hashed = hash(password,salt);
                if(hashed === dbString){
                    //set a session
                    req.session.auth = {userId: result.rows[0].id};
                    res.send('Credentials are correct!');
                }else{
                    res.send(403).send("username/password invalid");
                }
           }
       }
    });    
});

app.get('/check-login',function(req,res){
   if(req.session && req.session.auth && req.sessoin.auth.userId){
       res.send("You are logged in as "+ req.session.auth.userId.toString());
   } 
   else{
       res.send("You are not logged in");
   }
});

app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send("You are now logged out");
});

app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});


var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send(JSON.stringify(result.rows));
       }
    });
});
app.get('/articles/:articleName', function(req,res){
    pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName], function(err,result){
        if(err){
            res.status(550).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(404).send("Article not found");
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/getcrops')

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
