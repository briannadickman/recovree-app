var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var Users = require('../models/user');
var path = require('path');
var Registration = require('../models/registration');

var mongoose = require("mongoose");

var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'benbizzey@outlook.com',
    pass: '',
  },
});

var randomIdGenerator = function(){
  var newId = Math.round(Math.random() * (9999 - 1000) + 1000);
  Users.count({'memberID' : newId}, function(err, count){
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

var registrationMemberId = 0;


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

router.get('/memberCount', function(req, res){
  console.log('member count hit');
  Registration.distinct('memberID', function(err, uniqueMembers){
    if (err) {
      console.log('error counting members');
    }
    console.log('uniqueMembers: ', uniqueMembers.length);
    res.send(uniqueMembers);
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
    memberID: registrationMemberId
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
  registrationMemberId = newId;
  console.log('newId in post: ', newId);
  var newUser = req.body;
  var userToSave = new Users({
    username: newUser.username,
    password: newUser.password,
    memberID: newId,
  });
  console.log("userToSave", userToSave);
  userToSave.save(userToSave, function(err, post) {
    if (err) {
      next(err);
    } else {
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
