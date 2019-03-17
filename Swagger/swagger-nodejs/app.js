'use strict';
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const keys = require('./keys');
var bodyParser = require('body-parser');
var Cloudant = require('@cloudant/cloudant');
var dotenv = require('dotenv').config({ path: '/appDir/src/config/.env' });

var usersDb1 = process.env.usersDb;
console.log('oskdo:'+usersDb1);
module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    BearerAuth: function (req, authOrSecDef, scopesOrApiKey, cb) {
       if(scopesOrApiKey)
        cb();
      else
        cb(new Error('Access Denied...'));
    }
  }
};
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);
  // DB Config
  var usersDb1 = process.env.usersDb;
  var regUsersDb1 = process.env.regUsersDb;
  var cruiseBookedUsersDb1 = process.env.cruiseBookedUsersDb;
  var cruiseDetailsDb1 = process.env.cruiseDetailsDb;
  var cruiseHotelsDb1 = process.env.cruiseHotelsDb;
  var ordersDb1 = process.env.ordersDb;
  var feedbackDb1 = process.env.feedbackDb;
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
  console.log('cruiseHotelsDb:'+cruiseHotelsDb1);
  console.log('ordersDb:'+ordersDb1);
  console.log('feedbackDb:'+feedbackDb1);


  const usersDb = nano.use(usersDb1);
  const regUsersDb = nano.use(regUsersDb1);
  const cruiseBookedUsersDb = nano.use(cruiseBookedUsersDb1);
  const cruiseDetailsDb = nano.use(cruiseDetailsDb1);
  const cruiseHotelsDb = nano.use(cruiseHotelsDb1);
  const ordersDb = nano.use(ordersDb1);
  const feedbackDb = nano.use(feedbackDb1);

  module.exports = {
   usersDb:usersDb,
   regUsersDb:regUsersDb,
   cruiseBookedUsersDb:cruiseBookedUsersDb,
   cruiseDetailsDb:cruiseDetailsDb,
   cruiseHotelsDb:cruiseHotelsDb,
   ordersDb:ordersDb,
   feedbackDb:feedbackDb
 };

  var port = process.env.PORT || 10010;
  app.listen(port);
  console.log('\nServer is started(at swaggernodejs:10010 in container)... \nYou can Check the Swaggerui at localhost:5000/swagger-ui...\n');
  console.log('\n');
});
