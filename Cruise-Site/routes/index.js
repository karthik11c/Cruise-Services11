const express = require('express');
const router = express.Router();
const { ensureAuthenticated, issueToken ,verifyToken } = require('../config/auth');
const Db = require('../app');


//Databases
var regUsersDb = Db.regUsersDb;
var usersDb = Db.usersDb;
var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;
var cruiseDetailsdb = Db.cruiseDetailsdb;


//This is secrete which needs to be encripted In this case we are using this directly for demonstration only..
//Dont do this in production..
var secret = 'cruiseREST';

// Welcome Page

router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

// Other Restful Routes for APIs eg.Swagger routes..
router.post('/loginget',function(req,res){
 var client_id = req.headers.client_id;

 console.log('5.client_id'+client_id);
 var schema = {
    'selector': {
      'client_id' : client_id
    }
 }
  usersDb.find(schema,function(err,result){
    if(err)
     throw err;
    else if((JSON.stringify(result.docs))!="[]"){

         result = result.docs[0];
         //User is identified by its role as admin  or user
         var role = JSON.stringify(result.role);
         var username = JSON.stringify(result.client_id);
         console.log('6.role: '+role+'\n7.username:'+username);
         if (role == "\"user\"" || role == "\"admin\"") {
           console.log('6.okk');
           var tokenString = issueToken(username, role);
           console.log('7.response:'+tokenString);
           // res.writeHead(200, { "Content-Type": "application/json","accessToken": "thisISToekn" });
           // res.send(response);
            return res.end(tokenString);
         }
    }else {
      console.log('8.Invalid Crendentials...');
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end();
    }
  });
});

router.get('/findUserById',function(req,res){
//this endpoint is protected and can be used only by an admin others users are not allowed...
//get req from swagger nodejs server and process the request...
// var currentScopes = req.swagger.operation["x-security-scopes"];
var token = JSON.stringify(req.headers.authorization);
console.log('token:'+token);
var isProtectedResource = true;
var role = 'admin';
 if(isProtectedResource == true && verifyToken(role,token) == true){
 var schema = {
   'selector':{
     'uid': req.query.uid
   }
 }
  cruiseBookedUsersDb.find(schema,function(err,result){
    if(err){
      console.log('Something went Wrong...');
      console.log('UserUD Not Found');
    }else if((JSON.stringify(result.docs))=="[]"){
      res.send('User Not Found..');
    }else {
      res.send(result.docs[0]);
    }
  });
}else {
  res.send({'message':'accessToken verification failed...'});
}
});

  router.get('/findUserByName',function(req,res){
  //this endpoint is protected and can be used only by an admin others users are not allowed...
  //get req from swagger nodejs server and process the request...
  // var currentScopes = req.swagger.operation["x-security-scopes"];
  var token = JSON.stringify(req.headers.authorization);
  console.log('token:'+token);
  var isProtectedResource = true;
  var role = 'admin';
   if(isProtectedResource == true && verifyToken(role,token) == true){
   var schema = {
     'selector':{
       'name': req.query.name  //match name
     }
   }
    cruiseBookedUsersDb.find(schema,function(err,result){
      if(err){
        console.log('Something went Wrong...');
        console.log('UserName Not Found');
      }else if((JSON.stringify(result.docs))=="[]"){
        res.send('User Not Found.. Please Enter Valid User...');
      }else {
        res.send(result.docs[0]);
      }
    });
  }else {
    res.send({'message':'accessToken verification failed...'});
  }
  });

module.exports = router;
