const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const keys = require('./keys');
var bodyParser = require('body-parser');
var Cloudant = require('@cloudant/cloudant');
require('dotenv').config({path:'/appDir/src/config/.env'});
var path = require('path');
const app = express();
// Passport Config
require('./config/passport')(passport);
// DB Config
var usersDb1 = process.env.usersDb;
var regUsersDb1 = process.env.regUsersDb;
var cruiseBookedUsersDb1 = process.env.cruiseBookedUsersDb;
var cruiseDetailsDb1 = process.env.cruiseDetailsDb;
var rooms_info1 = process.env.rooms_info;
var dining_details1 = process.env.dining_details;


//environment variaables...
//cloudant URL
var cloudantUrl = 'http://'+keys.dbHost+':'+keys.dbPort;
console.log('cloudant-URL :'+cloudantUrl);
//Database Connection
 var nano = Cloudant({ url: cloudantUrl, plugins: 'promises' },function(err , cloudant , reply){
    if(err) {console.log('Db Connection Failed....');}
    else{ console.log('Db Connected : ',reply);}
 });

console.log('usersDb:'+usersDb1);
console.log('regUsersDb:'+regUsersDb1);
console.log('cruiseBookedUsersDb:'+cruiseBookedUsersDb1);
console.log('cruiseDetailsDb:'+cruiseDetailsDb1);
console.log('rooms_info:'+rooms_info1);
console.log('dining_details1:'+dining_details1);

const usersDb = nano.use(usersDb1);
const regUsersDb = nano.use(regUsersDb1);
const cruiseBookedUsersDb = nano.use(cruiseBookedUsersDb1);
const cruiseDetailsDb = nano.use(cruiseDetailsDb1);
const rooms_info = nano.use(rooms_info1);
const dining_details = nano.use(dining_details1);


console.log('usersDbconst:'+process.env.regUsersDb);
// EJS
app.use('/assets', express.static(__dirname + '/assets'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = {
   usersDb: usersDb,
   cruiseBookedUsersDb:cruiseBookedUsersDb,
   regUsersDb:regUsersDb,
   cruiseDetailsDb: cruiseDetailsDb,
   rooms_info: rooms_info,
   dining_details: dining_details
};

// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());
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
