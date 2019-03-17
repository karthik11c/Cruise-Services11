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


//Databases

//This is secrete which needs to be encripted In this case we are using this directly for demonstration only..
//Dont do this in production..
var secret = 'cruiseREST';


function login(req,res){
 var client_id = req.swagger.params.client_id.value;
 var data = client_id;
 console.log('1.client_id:'+client_id);
 var schema = {
    'selector': {
      'client_id' : client_id
    }
 }
 console.log(JSON.stringify(usersDb));
 const Db = require('../../app');
 var usersDb = Db.usersDb;
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
            res.writeHead(200, { "Content-Type": "application/json"});
            return res.end(JSON.stringify({
                                            'accessToken':tokenString
                                          }));
         }//endif
    }else {
      console.log('8.Invalid Crendentials...');
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end();
    }
  });
}

//2.findUserById

function findUserById(req,res){
      var uid = req.swagger.params.uid.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('UID:'+uid+'\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
       var schema = {
         'selector':{
           'uid': uid
         }
       }
       const Db = require('../../app');
       var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;

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
};

function findUserByName(req,res){
      var name = req.swagger.params.Name.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Name:'+name+'\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
       var schema = {
         'selector':{
           'name': name
         }
       }
       const Db = require('../../app');
       var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;

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
};

function DeleteUserInfoById(req,res){
      var uid = req.swagger.params.Id.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Id:'+uid+'\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
       var schema = {
         'selector':{
           'uid': uid
         }
       }
       const Db = require('../../app');
       var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;

        cruiseBookedUsersDb.find(schema,function(err,result){
          if(err){
            console.log('Something went Wrong...');
            console.log('UserUD Not Found');
          }else if((JSON.stringify(result.docs))=="[]"){
            res.send('User Not Found..');
          }else {
            var docId = result.docs[0]._id;
            var docRev = result.docs[0]._rev
            cruiseBookedUsersDb.destroy(docId, docRev,  function(err) {
              if (!err) {
               console.log("Successfully deleted doc with Id: "+ docId);
               res.send(JSON.stringify({ 'message' : 'Successfully deleted the item from the database.'}));
              } else {
                  res.send(JSON.stringify({ 'message' : 'Successfully deleted the item from the database.'}));
                }
           });
          }
        });
      }else {
        res.send({'message':'accessToken verification failed...'});
      }
};

function DeleteUserInfoByName(req,res){
      var name = req.swagger.params.name.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Id:'+name+'\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
       var schema = {
         'selector':{
           'cruiseName': name
         }
       }
       const Db = require('../../app');
       var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;

        cruiseBookedUsersDb.find(schema,function(err,result){
          if(err){
            console.log('Something went Wrong...');
            console.log('UserUD Not Found');
          }else if((JSON.stringify(result.docs))=="[]"){
            res.send('User Not Found..');
          }else {
            var docId = result.docs[0]._id;
            var docRev = result.docs[0]._rev
            cruiseBookedUsersDb.destroy(docId, docRev,  function(err) {
              if (!err) {
               console.log("Successfully deleted doc with Id: "+ docId);
               res.send(JSON.stringify({ 'message' : 'Successfully deleted the item from the database.'}));
              } else {
                  res.send(JSON.stringify({ 'message' : 'Successfully deleted the item from the database.'}));
                }
           });
          }
        });
      }else {
        res.send({'message':'accessToken verification failed...'});
      }
};

function getAllUsersInfo(req,res){
      var token = JSON.stringify(req.headers.api_key);
      console.log('\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
       const Db = require('../../app');
       var cruiseBookedUsersDb = Db.cruiseBookedUsersDb;

        cruiseBookedUsersDb.list({include_docs:true},function(err,result){
          if(err){
            console.log('Something went Wrong...');
            console.log('UserUD Not Found');
          }else if((JSON.stringify(result.docs))=="[]"){
            res.send('User Not Found..');
          }else {
             console.log(JSON.stringify(result));
            res.send(result);
          }
        });
      }else {
        res.send({'message':'accessToken verification failed...'});
      }
};

function getRegisteredUsersOnly(req,res){
      var token = JSON.stringify(req.headers.api_key);
      console.log('\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
       const Db = require('../../app');
       var regUsersDb = Db.regUsersDb;

        regUsersDb.list({include_docs:true},function(err,result){
          if(err){
            console.log('Something went Wrong...');
            console.log('UserUD Not Found');
          }else if((JSON.stringify(result.docs))=="[]"){
            res.send('User Not Found..');
          }else {
             console.log(JSON.stringify(result));
            res.send(result);
          }
        });
      }else {
        res.send({'message':'accessToken verification failed...'});
      }
};

module.exports = {
 login : login,
 findUserById      :findUserById,
 findUserByName    :findUserByName,
 DeleteUserInfoById:DeleteUserInfoById,
 DeleteUserInfoByName:DeleteUserInfoByName,
 getAllUsersInfo:getAllUsersInfo,
 getRegisteredUsersOnly:getRegisteredUsersOnly
 // UpdateUserInfoByName:UpdateUserInfoByName,
 // UpdateUserInfoById:UpdateUserInfoById
};
