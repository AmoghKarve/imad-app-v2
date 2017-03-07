var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
    user:"amoghkarve",
    database:"amoghkarve",
    host:"db.imad.hasura-app.io",
    password:process.env.DB_PASSWORD
}

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one': {
        title: 'Article-one | Amogh Karve',
        heading: 'Article-one',
        date: 'Feb 15, 2017',
        content: `
                <p>
                    This is my first article
                </p>`
    },
    'article-two': {
        title: 'Article-two | Amogh Karve',
        heading: 'Article-two',
        date: 'March 15, 2017',
        content: `
                <p>
                    This is my second article
                </p>`
    },
    'article-three': {
        title: 'Article-three | Amogh Karve',
        heading: 'Article-three',
        date: 'April 15, 2017',
        content: `
                <p>
                    This is my Third article
                </p>`
    }
};

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
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function(err,result){
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
