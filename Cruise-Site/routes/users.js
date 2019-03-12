const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var bodyParser = require('body-parser');
// Load User model
const Db = require('../app');

var regUsersDb = Db.regUsersDb;
var cruiseDetailsDb = Db.cruiseDetailsDb;

router.get('/homepage', (req, res) => res.render('homepage'));

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());
// Login Page

router.get('/login', (req, res) => res.render('login'));
// Register Page




router.get('/custDetail', (req, res) => res.render('register'));

router.get('/register', (req, res) => res.render('register'));
router.get('/BookingDetails', (req, res) => res.render('BookingDetails'));

router.get('/about', (req, res) => res.render('AboutCruise'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/dining', (req, res) => res.render('dining'));
router.get('/customer-details', (req, res) => res.render('custumerDetail'));

router.get('/avail-cruise',function(req,res){
 res.render('bookCruise');
});


var data;
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


router.get('/index', function(req, res){
 // console.log('database connencted::'+cruiseDetailsDb);
  var schema = {
    "selector": {
            "_id": {
                "$gt": null
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
             console.log('indexdata: '+JSON.stringify(result.docs));
             res.render('index',{data: data});
      });
 });

var data;

 router.post('/index',function(req, res){
 const { cruiseName, destination, dePort, date } = req.body;
 console.log('bodyCuirse:'+req.body.cruiseName);
  console.log('cruiseName:'+JSON.stringify(cruiseName));
   var schema = {
    "selector":{
       'cruise-name': cruiseName,
       'destination': destination,
       'dep_port': dePort,
       'date': date
    }
   }

   cruiseDetailsDb.find(schema,function(err,result){
       if(err) console.log(err);else console.log('cruise-Info:'+JSON.stringify(result.docs));
      data = result.docs;
   });

   res.redirect('/users/indexData');
 });

 router.get('/indexData',function(req,res){
  res.render('dining',{data: data});
 });

router.get('/book-cruise',function(req,res){
res.render('bookCruise');
});




// Register
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
    cruiseDetailsDb.find(schema,function(err,result){
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

// Login
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
