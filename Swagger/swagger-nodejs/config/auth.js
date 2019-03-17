"use strict";

var jwt = require("jsonwebtoken");
var secreteKey = 'cruiseREST';
var issuer = "cruise-Bees.com";

//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
module.exports = {
  issueToken : function(username, role) {
    var token = jwt.sign(
      {
        sub: username,
        iss: issuer,
        role: role
      },
      secreteKey
    );
    return token;
  },
  verifyToken : function(role, token) {
    //these are the scopes/roles defined for the current endpoint
    function sendError() {
      return req.res.status(403).json({ message: "Error: Access Denied" });
    }
    var verified = false;
    //validate the 'Authorization' header. it should have the following format:
    //'Bearer tokenString'
    // console.log('index:'+token.indexOf("Bearer "));
    if (token && token.indexOf("Bearer ") == 1) {
      var tokenString = token.split(" ")[1];
      jwt.verify(tokenString, secreteKey, function(
        verificationError,
        decodedToken
      ) {
        //check if the JWT was verified correctly
        if (
          verificationError == null &&
          Array.isArray(role) &&
          decodedToken &&
          decodedToken.role
         ) {
          // check if the role is valid for this endpoint
          var roleMatch = decodedToken.role == role;
          // check if the issuer matches
          var issuerMatch = decodedToken.iss == issuer;

          // you can add more verification checks for the
          // token here if necessary, such as checking if
          // the username belongs to an active user

          if (roleMatch && issuerMatch)
               verified = true;
          else
               verified = false;
        } //#endif
      });
      return true;
    } else
      return false;
  }
};
