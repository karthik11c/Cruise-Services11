'use strict'
var express = require('express');
var request = require('request');
var Cloudant = require('@cloudant/cloudant');
var path = require('path');
var bodyParser = require('body-parser');
const { issueToken ,verifyToken } = require('../../config/auth');

var fs = require('fs');
var dotenvVar = require('dotenv').config();
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
app.use(bodyParser.urlencoded({extended:true}));
module.exports = app; // for testing

function getUsersFeedback(req,res){
      var feedback = req.swagger.params.feedback.value;
      var cruiseName = req.swagger.params.cruiseName.value;

      var token = JSON.stringify(req.headers.api_key);
      console.log('Name:'+cruiseName+'\naccessToken:'+token);

      var isProtectedResource = false;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
           //currently this endpoint is not protected...
         searchDocs();
      }else if(isProtectedResource == false){
          searchDocs();
      }
      else {
        res.send({'message':'accessToken verification failed...'});
      }

  function searchDocs(){
    var schema = {
        'selector':{
          'cruiseName': cruiseName
        }
      }
      const Db = require('../../app');
      var feedbackDb = Db.feedbackDb;
       feedbackDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
                 var data = '';
            if(feedback == 'reviews'){
             result.docs.forEach(function(item){
               data +='  '+item.reviews;
             });
             console.log('data'+data);
             res.send(JSON.stringify({"reviews":"{"+ data + "}"}));
           }else if(feedback == 'ratings'){
             result.docs.forEach(function(item){
               data +='  '+item.ratings;
             });
             console.log('data'+data);
             res.send(JSON.stringify({"ratings":"{"+ data + "}"}));

           }else{
             result.docs.forEach(function(item){
               data +='  '+item.complaints;
             });
             console.log('data'+data);
             res.send(JSON.stringify({"complaints":"{"+ data + "}"}));
           }
         }
       });
  }//endsearchDocs
};


function getUsersComplaints(req,res){
      var cruiseName = req.swagger.params.cruiseName.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Name:'+cruiseName+'\naccessToken:'+token);

      var isProtectedResource = false;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
           //currently this endpoint is not protected...
         searchDocs();
      }else if(isProtectedResource == false){
          searchDocs();
      }
      else {
        res.send({'message':'accessToken verification failed...'});
      }

  function searchDocs(){
      var schema = {
        "selector":{
          "cruiseName": cruiseName
        }
      }
      const Db = require('../../app');
      var feedbackDb = Db.feedbackDb;
       feedbackDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
                var data = '';
                result.docs.forEach(function(item){
                  data +='  '+item.complaints;
                });
                console.log('data'+data);
           res.send(JSON.stringify({"complaints":"{ "+data+"}"}));
         }
       });
  }//endsearchDocs
};



function getUsersReviewsandRatings(req,res){
      var cruiseName = req.swagger.params.cruiseName.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Name:'+cruiseName+'\naccessToken:'+token);

      var isProtectedResource = false;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
           //currently this endpoint is not protected...
         searchDocs();
      }else if(isProtectedResource == false){
          searchDocs();
      }
      else {
        res.send({'message':'accessToken verification failed...'});
      }

  function searchDocs(){
      var schema = {
        "selector":{
          "cruiseName": cruiseName
        }
      }
      const Db = require('../../app');
      var feedbackDb = Db.feedbackDb;
       feedbackDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
                var data = '';
                var data2 = '';
                result.docs.forEach(function(item){
                  data +='  '+item.reviews;
                  data2 +='  '+item.ratings;
                });
                console.log('data'+JSON.stringify(result.docs));
           res.send(JSON.stringify({"Reviews":"{ "+data+"Ratings:"+data2+"}"}));
         }
       });
  }//endsearchDocs
};

function addCruiseReviewOrComplaint(req,res){
      var token = JSON.stringify(req.headers.api_key);
      console.log('\naccessToken:'+token);

      var isProtectedResource = false;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
           //currently this endpoint is not protected...
         addDocs();
      }else if(isProtectedResource == false){
          addDocs();
      }
      else {
        res.send({'message':'accessToken verification failed...'});
      }

  function addDocs(){
      const Db = require('../../app');
      var feedbackDb = Db.feedbackDb;
       feedbackDb.insert(req.body,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
                console.log('data'+JSON.stringify(req.body));
           res.send(JSON.stringify({"message":"complaint sent successfully..."}));
         }
       });
  }//endsearchDocs
};



module.exports = {
getUsersFeedback:getUsersFeedback,
getUsersComplaints:getUsersComplaints,
getUsersReviewsandRatings:getUsersReviewsandRatings,
addCruiseReviewOrComplaint:addCruiseReviewOrComplaint
};
