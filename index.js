const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const routes = require('./Routes/routes.js');
const db = require('./Model/database.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const PORT = process.env.PORT

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
  }));

  app.use('/', routes);

app.use('/', routes);

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: true}));

app.use(express.static('Misc'));

app.use('/', routes);

app.use(function (req, res) {
    res.render('error');
});

db.connect();

app.listen(PORT, function () {
    console.log('app listening at port ' + PORT);
});
