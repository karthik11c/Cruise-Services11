'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing
// var config = {
//   appRoot: __dirname // required config
// };

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
  var port = process.env.PORT || 10010;
  app.listen(port);
  console.log('\nServer is started(at swaggernodejs:10010 in container)... \nYou can Check the Swaggerui at localhost:5000/swagger-ui...\n');
  console.log('\n');
});
