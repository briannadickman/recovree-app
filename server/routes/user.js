var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

var Chance = require('chance');
var chance = new Chance();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('../models/user');
var User = mongoose.model('users', UserModel.UserSchema);

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username,
      password: req.user.password,
      id: req.user._id,
      memberID: req.user.memberID
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

router.post('/forgotpassword', function(req, res) {
  console.log('Password Reset Route', req.body);
  var code = chance.string({
    pool: 'abcdefghijklmnopqrstuvwxyz1234567890',
    length: 20
  });
  //pool of characters chance will select from to create random string
  console.log('HERE WILL CHECK FOR CODE COLLISON');
  //you should check for collision - can technically put userid.specialcharacter
  User.findOne({
    "username": req.body.username
  }, function(err, foundUser) {
    if (err) {
      res.sendStatus(500);
    }
    console.log(foundUser);

    var baseURL = 'http://localhost:5000'; //or env.VAR
    console.log('password reset link/' + baseURL + '/#confirmreset/' + code);
    // TODO: Mail out this link to reset password

    foundUser.code = code;
    //foundUser.expration = ' some time in the future'

    foundUser.save(function(err, savedUser) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      // res.send(foundUser);
    });
  });
});


router.put('/resetpassword', function(req, res) {
  User.findOne({
    "username": req.body.username
  },
    function(err, foundUser) { //getting ERR with User here

      if (err) {
        res.sendStatus(500);
      }

    //should also check to see if expiration has passed here
    // TODO: send 500 error if expiration is expired

      if (req.body.code != foundUser.code) {
        res.sendStatus(500);
      } //need to re-run gen.SALT on the new password

    //this is non-salted password
        foundUser.password = req.body.password;
    //foundUser.expiraton = reset expiration to Now, once password is reset

      foundUser.save(function(err, savedUser) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        res.send(foundUser);
    });
  });
});


module.exports = router;
