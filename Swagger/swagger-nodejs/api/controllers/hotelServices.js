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

function findHotelsByCruiseName(req,res){
      var name = req.swagger.params.Name.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Name:'+name+'\naccessToken:'+token);

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
          "_id": {
            "$gt": null
          },
          "cruiseName": "Royals"
        }
      }
      const Db = require('../../app');
      var cruiseHotelsDb = Db.cruiseHotelsDb;

       cruiseHotelsDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
                var data = '';
                result.docs.forEach(function(item){
                  data +='  '+item.hotelName;
                });
                console.log('data'+data);
           res.send(JSON.stringify({"hotels":"{ "+data+"}"}));
         }
       });
  }//endsearchDocs
};
function PlaceOrderForFood(req,res){
      var token = JSON.stringify(req.headers.api_key);
      console.log('\naccessToken:'+token);

      var isProtectedResource = false;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
           //currently this endpoint is not protected...
         searchDocs();
      }else if(isProtectedResource == false){
          addDocs();
      }
      else {
        res.send({'message':'accessToken verification failed...'});
      }

  function addDocs(){
      const Db = require('../../app');
      var ordersDb = Db.ordersDb;

       ordersDb.insert(req.body,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
            console.log('data:'+JSON.stringify(req.body));
           res.send(req.body);
         }
       });
  }//endsearchDocs
};

//3.

function FindPurchaseByOrderId(req,res){
      var orderId = req.swagger.params.orderId.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('orderId:'+orderId+'\naccessToken:'+token);

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
      const Db = require('../../app');
      var ordersDb = Db.ordersDb;

     var schema = {
       "selector": {
          "orderId" : orderId
       }
     }

       ordersDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
           console.log('data:'+JSON.stringify(result.docs));
           res.send(result.docs);
         }
       });
  }//endsearchDocs
};

function cancelOrderforFoodById(req,res){
      var orderId = req.swagger.params.orderId.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('orderId:'+orderId+'\naccessToken:'+token);

      var isProtectedResource = false;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
           //currently this endpoint is not protected...
         deleteDocs();
      }else if(isProtectedResource == false){
          deleteDocs();
      }
      else {
        res.send({'message':'accessToken verification failed...'});
      }

  function deleteDocs(){
      const Db = require('../../app');
      var ordersDb = Db.ordersDb;

     var schema = {
       "selector": {
          "orderId" : orderId
       }
     }
       ordersDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
           console.log('ook');
           var docId = result.docs[0]._id;
           var docRev = result.docs[0]._rev
           ordersDb.destroy(docId, docRev,  function(err) {
            if(err){throw err;}else{
            console.log('successfully cancelled the ordered');
            res.send(JSON.stringify({"message":"successfully cancelled the ordered"}));
            }
          });//enddb
        }
       });
  }//endsearchDocs
};



module.exports = {
  findHotelsByCruiseName:findHotelsByCruiseName,
  PlaceOrderForFood:PlaceOrderForFood,
  FindPurchaseByOrderId:FindPurchaseByOrderId,
  cancelOrderforFoodById:cancelOrderforFoodById
};
