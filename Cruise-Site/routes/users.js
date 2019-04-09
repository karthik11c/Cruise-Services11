//dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(session({secret: "Your secret key"}));

// Get DataBase module from app.js
const Db = require('../app');

//get all refrence to all databases from app.js
var regUsersDb = Db.regUsersDb;
var cruiseDetailsDb = Db.cruiseDetailsDb;
var  rooms_info = Db.rooms_info;
var  dining_details = Db.dining_details;


//BodyParser load in the router...
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
// HomePage...
// router.get('/homepage', (req, res) => res.render('homepage'));

//Global variables
var data;
let mapData={};
let filteredData={};
console.log('mapData:'+JSON.stringify(mapData));
// 1. Login Page (login GET)
router.get('/login', (req, res) => res.render('login'));

// router.get('/custDetail', (req, res) => res.render('register'));

router.get('/register', (req, res) => res.render('register'));
router.get('/BookingDetails', (req, res) => res.render('BookingDetails'));

router.get('/about', (req, res) => res.render('AboutCruise'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/dining', (req, res) => res.render('dining'));
router.get('/customer-details', (req, res) => res.render('custumerDetail'));

router.get('/avail-cruise',function(req,res){
 res.render('bookCruise');
});


router.post('/avail-cruise', function(req, res){
   console.log('data from index: '+(JSON.stringify(req.body)));
   //find matching data from ui fields into db
   //find data into db
   var schema = {
     "selector": {
             "_id": {
                 "$gt": null          //data.cruiseName || data.destination || ... query
             }
     }
   }
   cruiseDetailsDb.find(schema,function(err,result){
            if(err)
              throw err;
            else if((JSON.stringify(result.docs))!="[]"){
             }
              data = result.docs;
              // console.log('data:'+JSON.stringify(data));
              console.log('indexdata: '+JSON.stringify(data));
              res.render('AvailableCruise',{data:data});
       });
});

router.get('/cruise1',function(req,res){
  res.render('cruise1');
});

//index get request after login...
router.get('/index', function(req, res){
//we need to find all cruiseNames,destinations,departure ports etc. and need to be load into dropdown of find root...
//finding cruise-details
var cruises = [];
var dePort = [];
var cruiselengths = [];
if(!req.session.mapData){

console.log('set cookie for available cruises...');
cruiseDetailsDb.view('sort', 'cruiseNames',{'reduce':'true','group_level':'1'}, function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      cruises.push(JSON.stringify(doc.key[0]).substr(1).slice(0, -1));
    });
      cruiseDetailsDb.view('sort', 'dePort',{'reduce':'true','group_level':'1'}, function(err, body) {
        if (!err) {
          body.rows.forEach(function(doc) {
            dePort.push(JSON.stringify(doc.key[0]).substr(1).slice(0, -1));
          });
            cruiseDetailsDb.view('sort', 'cruiseDur',{'reduce':'true','group_level':'1'}, function(err, body) {
             if (!err) {
               body.rows.forEach(function(doc) {
                 cruiselengths.push(JSON.stringify(doc.key[0]).substr(1).slice(0, -1));
              });//body
                   req.session.mapData = {'cruises': cruises,'dePort':dePort,'cruiseDur':cruiselengths};
                   res.render('index',{cruises: cruises,dePort:dePort,cruiseDur:cruiselengths});
              }//if
               else{
                console.log(err);
             }
             });
           }//if
           else{
              console.log(err);
           }
            });
          }//if
          else{
             console.log(err);
          }
          });
        }else {
          console.log('session-map-data:'+JSON.stringify(req.session.mapData));
          console.log('fetch cookie for available cruises...');
          res.render('index',req.session.mapData);
        }
}); //end of get request of index
//user selected data needs to be send to server for filtering user results from database...
 router.post('/index',function(req, res){
 console.log('This is req :'+JSON.stringify(req.body));
 const { destination, cruiseName, cruiseDur } = req.body;
   var schema = {
               "selector": {
                    "$or": [
                                   {
                                        "destination": destination
                                   },
                                   {
                                        "cruiseName": cruiseName
                                   },
                                   {
                                        "cruiseDur": cruiseDur
                                   }
                                ]
        }
      }
   cruiseDetailsDb.find(schema,function(err,result){
       if(err) console.log(err);
          console.log('session-data: '+JSON.stringify(req.session.mapData));
        console.log(JSON.stringify({mapData: req.session.mapData,filteredData:result.docs}));
        res.render('AvailableCruise',{mapData: req.session.mapData,filteredData:result.docs});
   });
 });  //end of index post...



router.get('/book-cruise',function(req,res){
res.render('bookCruise');
});

router.get('/avalon-waterways',function(req,res){

res.render('AvailableRooms');
});


//all cruises filtering..
var roomsData;
router.post('/all-cruises',function(req,res){
  console.log('reqwithdata: '+JSON.stringify(req.body.cruiseName));
  console.log('reqwithdata: '+JSON.stringify(req.body.cruiseTitle));

 schema = {
  "selector": {
      "cruiseName": req.body.cruiseName,
      "cruiseTitle": req.body.cruiseTitle
  }
}
console.log('schema: '+JSON.stringify(schema));
//rooms-info.db
// cruiseName & cruiseTitle roomTypes Views Price Capacity Available Seates booked ones
 rooms_info.find(schema,function(err,result){
  if(err){
    console.log('rooms-info db connection failed...');
    res.send('Error-Cannot fetch Rooms Details...');
  }
  else {
          roomsData = result.docs[0];
           if(roomsData=='[]')
            {
              console.log('data empty');
            }else {
              console.log('rooms-data length: '+result.docs[0].roomTypes.length);
            }
          res.render('AvailableRooms',{roomsData:roomsData});
          //AvailableRoomse.ejs displays dynamic data from rooms-info.db from selected cruise rooms.
  }
});
});

router.get('/cruiseViews',function(req,res){




res.render('cruiseViews');
});

// Register Page post i.e user send his information to this post request...
router.post('/register', (req, res) => {

  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else {
    var schema   = {
                 "selector": {
                     "email": email
                  }
    }
    regUsersDb.find(schema,function(err,result){
         if(err)
           throw err;
         else if((JSON.stringify(result.docs))!="[]"){
           console.log(result.docs);
         errors.push({ msg: 'Email already exists' });
         res.render('register', {
           errors,
           name,
           email,
           password,
           password2
         });
               console.log('no...');
       }
       else if((JSON.stringify(result.docs))=="[]"){
        //console.log(newUser.password);
        console.log(result.docs);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
             var enc_pass = hash;
             var newUser = {
               "name": name,
               "password": enc_pass,
               "email": email
             };


             regUsersDb.insert(newUser,function(err,result){
             if(err){
              throw err;
             }else{
                   console.log('successfully inserted...');
                   req.flash(
                     'success_msg',
                     'You are now registered and can log in'
                   );
                   res.redirect('/users/login');
                 }
             });
           });
          });
        // });
      }
    });
  }
});

// Login check username && password match using passport
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: 'index',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
