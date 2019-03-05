const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const keys = require('./keys');

var Cloudant = require('@cloudant/cloudant');
var dotenv = require('dotenv').config({ path: './config/.env' });
var path = require('path');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
var dbName = process.env.cruiseInfoDb|| 'cruise-details';
var usersDb = process.env.usersDb;
var cruiseBookedUsersDb = process.env.cruiseBookedUsersDb;
    var cloudantUrl = 'http://'+keys.dbHost+':'+keys.dbPort;
    console.log('cloudant-URL :'+cloudantUrl);

    var nano = Cloudant({ url: cloudantUrl, plugins: 'promises' },function(err , cloudant , reply){
    if(err) {console.log('Db Connection Failed....');}
    else{ console.log('Db Connected : ',reply);}
 });
console.log('usersDb:'+usersDb);
console.log('cruiseBookedUsersDb'+cruiseBookedUsersDb);
usersDb = nano.use(usersDb);
const db = nano.use(dbName);
cruiseBookedUsersDb = nano.use(cruiseBookedUsersDb);
//console.log('dbName:'+dbName);
//
// var db2 = process.env.dbListCruise||'cruise-finder';
// const db = nano.use(dbName);
// const dbListCruise = nano.use(db2);
// console.log('db identified:'+db2);

// EJS


app.use('/assets', express.static(process.cwd() + '/assets'));
app.set('view engine', 'ejs');

module.exports = {
   db:db,
   usersDb: usersDb,
   cruiseBookedUsersDb:cruiseBookedUsersDb
   // dbListCruise:dbListCruise
};

app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 10010;

app.listen(PORT, console.log(`Server started on port ${PORT} inside the uinodejs container...`));
