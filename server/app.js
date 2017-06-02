var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var db = require("./modules/db");

var passport = require('./strategies/userStrategy');
var session = require('express-session');

var dotenv = require('dotenv').config();

// Route includes
var index = require('./routes/index');
var user = require('./routes/user');
var register = require('./routes/register');
var reflection = require('./routes/reflection');


//modules
var csvExport = require('./modules/csvExport');
var twilio = require('./modules/twilio.js');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration //

app.use(session({
   secret: process.env.PASSPORT_SECRET,
   key: 'user', // this is the name of the req.variable. 'user' is convention, but not required
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 600000, secure: false }
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/csvExport', csvExport);
app.use('/reflection', reflection);
app.use('/register', register);
app.use('/user', user);
app.use('/', index);

// App Set //
app.set('port', (process.env.PORT || 5000));

// Listen //
app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});
