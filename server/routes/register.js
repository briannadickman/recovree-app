var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var Users = require('../models/user');
var path = require('path');
var Registration = require('../models/registration');

var mongoose = require("mongoose");

//SAVE ONLY USERNAME AND PASSWORD FROM REGISTER VIEW
// Handles request for HTML file
// router.get('/', function(req, res, next) {
//   res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
// });

var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'benbizzey@outlook.com',
    pass: '9670no5^BXN^0'
  },
});

var randomIdGenerator = function(){
  var newId = Math.round(Math.random() * (9999 - 1000) + 1000);
  Users.count({'memberID' : 7167}, function(err, count){
    if (err) {
      console.log(err);
    }
    if (count >= 1){
      randomIdGenerator();
    } else {
      console.log('no duplicate found');
    }
  });
return newId;
};


//SAVE ALL OTHER REGISTRATION DATA FROM REGISTER VIEW

var RegistrationSchema = mongoose.Schema({
  state: {type: String},
  county: {type: String},
  gender: {type: String},
  birthYear: {type: Number},
  drugChoice: {type: String},
  sobrietyDate: {type: Date},
  programPayment: {type: String},
  medication: {type: Boolean},
  termsAgreement: {type: Boolean},
  memberID: {type: Number}
});

var Registration = mongoose.model('registrations', RegistrationSchema, 'registrations');

////get registration information from database
router.get('/registration', function(req, res){
  Registration.find({}, function(err, registrations){
    if(err){
      console.log("Mongo Error: ", err);
      res.send(500);
    }
    res.send(registrations);
  });
});

router.get('/meds/:id', function(req, res){
  console.log("req.params.id",req.params.id);
  var id = req.params.id;
  Registration.findById({'_id': id}, function(err, registrations){
    if(err){
      console.log("Mongo Error: ", err);
      res.send(500);
    }
    res.send(registrations);
  });
});

router.post("/registration", function(req,res){
  var registration = req.body;
  console.log("inside post to /registration:", req.body);
  var newForm = new Registration({
    state : registration.state,
    county : registration.county,
    gender : registration.gender,
    birthYear : registration.birthYear,
    drugChoice : registration.drugChoice,
    sobrietyDate : registration.sobrietyDate,
    programPayment : registration.programPayment,
    medication : registration.medication,
    termsAgreement : registration.termsAgreement,
    memberID: registration.memberID
  });
  console.log("inside post, newForm:", newForm);

  newForm.save(newForm, function(err, savedRegistration){
    if(err){
      console.log("Error: ", err);
      res.sendStatus(500);
    }
    res.send(savedRegistration);
  });
});


// Handles POST request with new user data
router.post('/', function(req, res, next) {
  var newId = randomIdGenerator();
  console.log('newId in post: ', newId);
  var newUser = req.body;
  var userToSave = new Users({
    username: newUser.username,
    password: newUser.password,
    memberID: newId,
    // userType: newUser.userType
  });
  console.log("userToSave", userToSave);
  userToSave.save(userToSave, function(err, post) {
    if (err) {
      // next() here would continue on and route to routes/index.js
      next(err);
    } else {
      // route a new express request for GET '/'
      console.log('post: ', post);
      var newUserEmail = {
        from: '"Ben Bizzey" <benbizzey@outlook.com>',
        to: 'benbizzey@outlook.com',
        subject: 'New Recovree Registration',
        text: '',
        html: '<b>New Participant added:</b><br>' +
              '<p>Member ID: ' + userToSave.memberID +'</p>' +
              '<p>Phone Number: ' + userToSave.username +'</p>' +
              '<br><br>This is an automatically generated email message.'
      };
      transporter.sendMail(newUserEmail, function(err, info){
        if (err){
          console.log('nodemailer error: ', err);
          return;
        }
        console.log('New User email sent: %s', info.messageId, info.response);
      });
      // res.redirect('/');
      res.send(post);
    }
  });
});


module.exports = router;
