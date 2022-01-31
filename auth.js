'use strict';

const jwt = require('jsonwebtoken'); // auth0 documentation
const jwksClient = require('jwks-rsa'); // auth0 documentation

// this comes directly from the jsonwebtoken docs
// define a client, this is connected to YOUR auth0 account

const client = jwksClient({
  // this url comes from your app on the auth0 dashboard
  jwksUri: process.env.JWKS_URI
});

// this function comes directly from the jsonwebtoken docs
// https://www.npmjs.com/package/jsonwebtoken
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    // console.log(err)
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// we are writing this function to verify the user on our route

function verifyUser(req, errFirstOrUserCallbackFunction) {
  try {
    // define the token from the header on the request
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    // this line comes from the docs for jsonWebToken
    jwt.verify(token, getKey, {}, errFirstOrUserCallbackFunction);
  } catch (error) {
    errFirstOrUserCallbackFunction('not Authorized');
  }
}


module.exports = verifyUser;
