const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');


router.use(cookieParser());
router.use(session({secret: "Your secret key"}));

const Db = require('../app');
var regUsersDb = Db.regUsersDb;
var cruiseDetailsDb = Db.cruiseDetailsDb;
var  rooms_info = Db.rooms_info;
var  dining_details = Db.dining_details;
var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;

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

    // Login check username && password match using passport
   router.post('/login', (req, res, next) => {
      passport.authenticate('local', {
        successRedirect: 'index',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
   });
//endlogin

//2. Registration
router.get('/register', (req, res) => res.render('register'));

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
//endRegistration
// 3. About Us
router.get('/about', (req, res) => res.render('AboutCruise'));

//4. Contact Us
router.get('/contact', (req, res) => res.render('contact'));

//5. Dining Services
router.get('/dining', (req, res) => res.render('dining'));


router.post('/customer-details', function(req, res) {
  // console.log('cd:\n'+JSON.stringify(JSON.parse(req.body.roomsData)));
  res.render('custumerDetail',{roomsData: JSON.parse(req.body.roomsData)});
});

//6. Find Route
// Find Route Search Button Click

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
//endFindRoute

//3. afterLogin
 //index get request after login... setCookie for available cruises from server to user machine
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
 console.log('cruiseNamell:'+cruiseName);
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
        res.render('AvailableCruise',{mapData: req.session.mapData,filteredData:result.docs,destination:destination,cruiseName:cruiseName,cruiseDur:cruiseDur});
   });
 });  //end of index post...



router.get('/book-cruise',function(req,res){
res.render('bookCruise');
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


router.post('/cruiseViews',function(req,res){
  console.log('cruiseViews-data: '+JSON.stringify(req.body));
  res.render('cruiseViews');
});

router.post('/Guest-Detail',function(req,res){
console.log('Main Person Details :\n  '+JSON.stringify(req.body));
res.render('GuestDetail',{ mperson : req.body } );
});

router.post('/final-report',function(req,res){
  //insert all user data into db if payment successfull...
//
// schema = {
//
//  "Main Person Details":{
//    "Name": req.body.firstname,
//    "Email": req.body.email,
//    "Mob" : "",
//    "DOB": "",
//    "Country": "",
//    "State" : req.body.state,
//    "City": req.body.city
//  },
//  "Guest Person Details": {
//   "Name" : "",
//   "mob" : "",
//   "Age" : ,
//   "Gender"; "",
//   "Id" : ""
// },
// "cruiseName": "",
// "Departure Date": "",
// "cruise Dur": "",
// "roomTypes": "",
// "total Amount": ""
// }
cruiseBookedUsersDb.insert(req.body,function(err,result){
if(err){
  throw err;
}else{
  console.log('successfully inserted...'+JSON.stringify(result.docs));

}
});
  console.log('all user data: \n'+JSON.stringify(req.body));
 // console.log("pdt:"+req.body.(JSON.parse(pdetails.mPerson).state));
 res.render('FInal_report',{ data: req.body});

 });

//payment gateway
router.post('/payment',function(req,res){
 console.log("guest-details:"+JSON.stringify(req.body));
 res.render('checkout',{pdetails : req.body});
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
