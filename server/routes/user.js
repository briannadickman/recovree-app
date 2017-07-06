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

var moment = require('moment');
var twilio = require('../modules/twilio');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
    console.log('get /user route');
    // check if logged in
    if (req.isAuthenticated()) {
        // send back user object from database
        var userInfo = {
            username: req.user.username,
            id: req.user._id,
            userType: req.user.userType
        };
        res.send(userInfo);
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.sendFile(path.join(__dirname, '../public/views/index.html'));
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
    //pool of characters chance will select from to create random string
    var code = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyz1234567890',
        length: 20
    });

    User.findOne({
        "username": req.body.username
    }, function(err, foundUser) {
        if (err) {
            res.sendStatus(500);
        }

        var baseURL = 'http://localhost:5000';
        var resetMessage = 'Reset your Recovree password here. This link will expire in 24 hours.   ';
        var passwordResetView = '/#confirmreset/';

        var herokuURL = ' www.recovreeapp.com/';

        var passwordResetLink = 'Reset your Recovree password here. This link will expire in 24 hours. ' + herokuURL + '#/confirmreset/' + code;

        if (foundUser.userType == 2) {
            var userNumber = req.body.username;
            twilio(userNumber, passwordResetLink);
        } else {
            // otherwise user is an admin and send password reset via email using nodemailer
        }

        foundUser.code = code;

        var expireCode = moment().add(1, 'days').format();
        foundUser.expiration = expireCode;
        foundUser.save(function(err, savedUser) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
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
            var date = moment().format();
            foundUser.expiration = Date.now();
            if (req.body.code != foundUser.code) {
                res.sendStatus(500);
            }

            foundUser.password = req.body.password;
            foundUser.expiration = Date.now();
            foundUser.save(function(err, savedUser) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            });
        });
});


module.exports = router;