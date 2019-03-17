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

function findCruiseByName(req,res){
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
        'selector':{
          'cruiseName': name
        }
      }
      const Db = require('../../app');
      var cruiseDetailsDb = Db.cruiseDetailsDb;

       cruiseDetailsDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
           res.send(result.docs[0]);
         }
       });
  }//endsearchDocs
};

//2. addNewCruise
function addNewCruise(req,res){
      console.log('request body:'+JSON.stringify(req.body));
      var token = JSON.stringify(req.headers.api_key);
      console.log('\naccessToken:'+token);

      var isProtectedResource = true;
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
      var cruiseDetailsDb = Db.cruiseDetailsDb;

       cruiseDetailsDb.insert(req.body,function(err,result){
         if(err){
           console.log('Something went Wrong...'+err);
         }else {
           res.send({'message':'Successfully Inserted the Cruise'});
         }
       });
  }//endsearchDocs
};

//3. UpdateCruiseInfoByName

function UpdateCruiseInfoByName(req,res){
  var token = JSON.stringify(req.headers.api_key);
  console.log('\naccessToken:'+token);

  var isProtectedResource = true;
  var role = 'admin';
   if(isProtectedResource == true && verifyToken(role,token) == true){
       //currently this endpoint is not protected...
      updateCruise();
  }else if(isProtectedResource == false){
      updateCruise();
  }
  else {
    res.send({'message':'accessToken verification failed...'});
  }

function updateCruise(){
    console.log('cruise-name:'+JSON.stringify(req.body.customer.old_name));
     var schema                   = {
         "selector":{
                  "cruiseName" : req.body.customer.old_name  //existing cruise name
          }
     }
  const Db = require('../../app');
  var cruiseDetailsDb = Db.cruiseDetailsDb;
  cruiseDetailsDb.find(schema,function(err,data){
     if(err) console.log('something went wrong...');
         // console.log('data found:'+data.docs[0]);
       if((JSON.stringify(data.docs))!="[]")
        {
            schema = {
                 "_id": data.docs[0]._id,
                 "_rev": data.docs[0]._rev,
                 "cruiseName"   : req.body.customer.new_name,
                 "roll" : req.body.customer.roll,
                 "price" : req.body.customer.price
            }
            console.log('idko:'+data.docs[0]._id);
            console.log('idkorev:'+data.docs[0]._rev);
            console.log('new-name'+req.body.customer.new_name);
         cruiseDetailsDb.insert(schema,function(err,result){
           if(err){
              console.log('error:'+err);
           }else{
                  console.log('successfully updated...');
                  res.send({"message":'Successfully Updated Cruise...'});
    // res.send({        "customer": {
    //                          "old_id" : jsonobj.old_id,
    //                          "new_id" : jsonobj.new_id,
    //                          "name" : jsonobj.name,
    //                          "roll" : jsonobj.roll,
    //                          "price": jsonobj.price
    //                    }
    // }).end();
                }
        });//enddb
       }else{
              console.log('Cruise Not Found...');
              res.send({"message":'Cruise Not Found...'});
        }
   });//end dbfind
  }//updateCruise()
};

//4.DeleteCruiseInfoByName
function DeleteCruiseInfoByName(req,res){
      var name = req.swagger.params.name.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Name:'+name+'\naccessToken:'+token);
      var isProtectedResource = true;
      var role = 'admin';
       if(isProtectedResource == true && verifyToken(role,token) == true){
          deleteDoc();
      }else {
        res.send({'message':'accessToken verification failed...'});
      }
function deleteDoc(){
  var schema = {
    'selector':{
      'cruiseName': name
    }
  }
  const Db = require('../../app');
  var cruiseDetailsDb = Db.cruiseDetailsDb;

   cruiseDetailsDb.find(schema,function(err,result){
     if(err){
       console.log('Something went Wrong...');
       console.log('UserUD Not Found');
     }else if((JSON.stringify(result.docs))=="[]"){
       res.send('User Not Found..');
     }else {
       var docId = result.docs[0]._id;
       var docRev = result.docs[0]._rev
       cruiseDetailsDb.destroy(docId, docRev,  function(err) {
         if (!err) {
          console.log("Successfully deleted doc with Id: "+ docId);
          res.send(JSON.stringify({ 'message' : 'Successfully deleted the item from the database.'}));
         } else {
             res.send(JSON.stringify({ 'message' : 'Successfully deleted the item from the database.'}));
           }
      });
     }
   });
}//function deleteDocs
}

//5. findCruiseByDestinations

function findCruiseByDestinations(req,res){
      var name = req.swagger.params.Dest.value;
      var token = JSON.stringify(req.headers.api_key);
      console.log('Destination:'+name+'\naccessToken:'+token);

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
          'destination': name
        }
      }
      const Db = require('../../app');
      var cruiseDetailsDb = Db.cruiseDetailsDb;

       cruiseDetailsDb.find(schema,function(err,result){
         if(err){
           console.log('Something went Wrong...');
           console.log('UserUD Not Found');
         }else if((JSON.stringify(result.docs))=="[]"){
           res.send('User Not Found..');
         }else {
           res.send(result.docs[0]);
         }
       });
  }//endsearchDocs
};

//6.findAllCruises
function findAllCruises(req,res){
var token = JSON.stringify(req.headers.api_key);
console.log('\naccessToken:'+token);
var isProtectedResource = false;
var role = 'admin';
 if(isProtectedResource == true && verifyToken(role,token) == true){
   searchAllDocs();
 }else if(isProtectedResource == false){
    searchAllDocs();
 }else {
  res.send({'message':'accessToken verification failed...'});
}
   function searchAllDocs(){
     const Db = require('../../app');
     var cruiseDetailsDb = Db.cruiseDetailsDb;

      cruiseDetailsDb.list({include_docs:true},function(err,result){
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
   }
};

module.exports = {
  findCruiseByName:findCruiseByName,
  addNewCruise:addNewCruise,
  UpdateCruiseInfoByName:UpdateCruiseInfoByName,
  DeleteCruiseInfoByName:DeleteCruiseInfoByName,
  findCruiseByDestinations:findCruiseByDestinations,
  findAllCruises:findAllCruises
};
