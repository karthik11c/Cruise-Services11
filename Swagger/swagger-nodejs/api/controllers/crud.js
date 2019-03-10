'use strict'
var express = require('express');
// var cfenv = require('cfenv');
var request = require('request');
var Cloudant = require('@cloudant/cloudant');
var path = require('path');
var bodyParser = require('body-parser');
const keys = require('../../keys');
var fs = require('fs');
var dotenvVar = require('dotenv').config();
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var querystring = require('querystring');
var http = require('http');
app.use(bodyParser.urlencoded({extended:true}));
module.exports = app; // for testing

module.exports = {
 // getAccessToken:getAccessToken,
 login : login,
 getAllUsersInfo   :getAllUsersInfo,
 findUserById      :findUserById,
 findUserByName    :findUserByName,
 DeleteUserInfoById:DeleteUserInfoById,
 UpdateUserInfoByName:UpdateUserInfoByName,
 UpdateUserInfoById:UpdateUserInfoById
};

//1.NewUser

// function getAccessToken(req,res){
//   console.log('ok.........=m');
//   console.log('dsdsd');
//   res.send('poko');
//  var client_id = req.swagger.params.client_id.value;
//  const data = client_id;
//  var options = {
//      host: 'uinodejs',
//      port: 10010,
//      path: '/loginRest',
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/x-www-form-urlencoded'
//      }
//    };
//
//    var httpreq = http.request(options, function (response) {
//        // response.setEncoding('utf8');
//        var result='';
//        response.on('data', function (chunk) {
//          result += chunk;
//        });
//        response.on('end', function() {
//          console.log('result:'+result);
//          res.send(result);
//        })
//    });
// httpreq.on('error', (e) => {
// console.error(`problem with request...`);
// });
// httpreq.write(data);
// httpreq.end();
// } //#endgetAccessToken
//
//

function login(req,res){
 var client_id = req.swagger.params.client_id.value;
 var data = client_id;
 console.log('1.client_id:'+client_id);
 // console.log('dsd:'+client_id);
 var options = {
   host: 'uinodejs',
   port: 10010,
   path: '/loginget',
   method: 'POST',
   headers: {
               'Content-Type': 'application/octet-stream',
                'client_id' : ''+client_id
    }
 };

 var httpreq = http.request(options, function (response) {
     // response.setEncoding('utf8');
     var result='';
     response.on('data', function (chunk) {
       result += chunk;
     });
     // console.log('result::'+result);
     response.on('end', function() {
        console.log('2.result:'+response);
        console.log('3.result::+'+result);
        console.log('4.headers:'+response.headers);
        console.log('5.statuscode:'+response.statusCode);
        if(response.statusCode == 403)
         var message = "Error: Credentials incorrect";
        else
          var message = result;
        res.send({ 'accessToken': message});
     });
 });
httpreq.on('error', (e) => {
  console.error(`problem with request...`);
});
httpreq.write(data);
httpreq.end();
};


//2.findUserById

function findUserById(req,res){
      var uid = req.swagger.params.uid.value;
      var accessToken = JSON.stringify(req.headers.api_key);
      console.log('UID:'+uid+'\naccessToken:'+accessToken);
      var options = {
        host: 'uinodejs',
        port: 10010,
        path: '/findUserById?uid='+uid,
        method: 'GET',
        headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+accessToken
         }
      };

      var httpreq = http.request(options, function (response) {
          // response.setEncoding('utf8');
          var result='';
          response.on('data', function (chunk) {
            result += chunk;
          });
          // console.log('result::'+result);
          response.on('end', function() {
             console.log('2.result:'+response);
             console.log('3.result::+'+result);
             console.log('4.headers:'+response.headers);
             console.log('5.statuscode:'+response.statusCode);
             if(response.statusCode == 403)
              var message = "Error: Credentials incorrect";
             else
               var message = result;
             res.send(message);
          });
      });
     httpreq.on('error', (e) => {
       console.error(`problem with request...`);
     });
     // httpreq.write(data);
     httpreq.end();
};

//3.findUserByName


function findUserByName(req,res){
  var name = req.swagger.params.name.value;
  var accessToken = JSON.stringify(req.headers.api_key);
  console.log('UID:'+uid+'\naccessToken:'+accessToken);
  var options = {
    host: 'uinodejs',
    port: 10010,
    path: '/findUserById?name='+name,
    method: 'GET',
    headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+accessToken
     }
  };

  var httpreq = http.request(options, function (response) {
      // response.setEncoding('utf8');
      var result='';
      response.on('data', function (chunk) {
        result += chunk;
      });
      // console.log('result::'+result);
      response.on('end', function() {
         console.log('2.result:'+response);
         console.log('3.result::+'+result);
         console.log('4.headers:'+response.headers);
         console.log('5.statuscode:'+response.statusCode);
         if(response.statusCode == 403)
          var message = "Error: Credentials incorrect";
         else
           var message = result;
         res.send(message);
      });
  });
 httpreq.on('error', (e) => {
   console.error(`problem with request...`);
 });
 // httpreq.write(data);
 httpreq.end();
};

//4.UpdateUserInfoByName

function UpdateUserInfoByName(req,res){
       var jsonobj             = req.swagger.params.customer.value.customer;
       schema                  = {
           "selector":{
                         "name" : jsonobj.old_name
            }
       }

db.find(schema,function(err,data){
if(err) console.log('couldnt find...');
db.destroy(data.docs[0]._id,data.docs[0]._rev,function(err,data){
  if(err) console.log('deletion failed...');
  console.log('okkk....');
});
    var schema = {
    "_id"  : JSON.stringify(data.docs._id),
    "_rev" : JSON.stringify(data.docs._rev),
    "id"   : jsonobj.id,
    "name" : jsonobj.new_name,
    "roll" : jsonobj.roll,
    "price": jsonobj.price
  };
   db.insert(schema,function(err,result){
    if(err){
      throw err;
    }else{

           console.log('successfully inserted...');
           res.send({        "customer": {
                                    "id"   : jsonobj.id,
                                    "old_name" : jsonobj.old_name,
                                    "new_name" : jsonobj.new_name,
                                    "roll" : jsonobj.roll,
                                    "price": jsonobj.price
                              }
           }).end();

         }
   });

});
};

//5.UpdateUserInfoById

function UpdateUserInfoById(req,res){
  var jsonobj             = req.swagger.params.customer.value.customer;
  var f                   = {
      "selector":{
                    "id" : jsonobj.old_id
       }
  }
console.log(jsonobj.old_id);
db.find(f,function(err,data){
if(err) console.log('couldnt find...');
console.log(data.docs[0]);
var schema = {
"_id"  : JSON.stringify(data.docs._id),
"_rev" : JSON.stringify(data.docs._rev),
"id"   : jsonobj.new_id,
"name" : jsonobj.name,
"roll" : jsonobj.roll,
"price": jsonobj.price
};
console.log('schema'+schema);
db.destroy(data.docs[0]._id,data.docs[0]._rev,function(err,data){
if(err) console.log('deletion failed...');
console.log('okkk....');
});
db.insert(schema,function(err,result){
if(err){
 throw err;
}else{

      console.log('successfully inserted...');
      res.send({"message":{

      }}).end();
      // res.send({        "customer": {
      //                          "old_id" : jsonobj.old_id,
      //                          "new_id" : jsonobj.new_id,
      //                          "name" : jsonobj.name,
      //                          "roll" : jsonobj.roll,
      //                          "price": jsonobj.price
      //                    }
      // }).end();
    }
});

});
};

//6.DeleteUserInfoById

function DeleteUserInfoById(req,res){
    var jsonobj = req.swagger.params;
    var ok = jsonobj.Id.value;
    console.log(ok);
    console.log(jsonobj.Rev.value);
    db.destroy(jsonobj.Id.value,jsonobj.Rev.value,function(err,data){
         if(err){
            console.log('something went wrong...');
            res.send({"message":"Deletion Failed..."}).end();
         }else {
           console.log('deleted successfully...');
            res.send({"message":"Deleted successfully..."}).end();
         }
       });
};

//7.DeleteUserInfoByName

// function DeleteUserInfoByName(req,res){
//
//
// };

//8.getAllUsersInfoByName

function getAllUsersInfo(req,res){
  var v = {
    "selector": {
      "_id"   : {
         "$gt": "0"
      }
     }
   }
  db.find(v,function(err,result){
  if(err){
    throw err;
  }else {
    console.log(result.docs);
  }
  res.send(result.docs).end();
});
};
