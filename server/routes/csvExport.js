var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var Users = require('../models/user');
var Registration = require('../models/registration');
var Reflection = require('../models/reflection');
var path = require('path');
var mongoose = require('mongoose');

//Exports demographic info into a .CSV saved in the root directory
router.get('/registration', function(req, res){
  //Defines key names json2csv expects, _id and __v not included in export.
  var fields =      ['state',
                    'county',
                    'gender',
                    'birthYear',
                    'drugChoice',
                    'sobrietyDate',
                    'programPayment',
                    'medication',
                    'termsAgreement'];
  //Defines titles as they appear in registration.csv
  var fieldNames = ['State',
                    'County',
                    'Gender',
                    'Birth Year',
                    'Drug(s) of Choice',
                    'Sobriety Date',
                    'Form of Program Payment',
                    'Medication?',
                    'Terms of Agreement?'];
  //returns all registration documents
  Registration.find().lean().exec(function(err, allRegistrations){
    if (err){
      console.log('error in csv find for reflections: ', err);
      res.sendStatus(500);
    }
    //runs a json2csv function to prepare and save registration data
    var registrationData = json2csv({data: allRegistrations, fields: fields, fieldNames: fieldNames}, function(err, csv){
      if (err) {
        console.log('registrationToCSV error: ', err);
        res.sendStatus(500);
      }
      // console.log('csv in registrationToCSV: ', csv);
      fs.writeFile('registration.csv', csv, function(err){
          if(err){
            console.log('error: ', err);
            res.sendStatus(500);
          }
          console.log('saved registration.csv');
          res.send(csv);
      });
      //returns registration data to client for future display?
    });
  });
});

router.get('/reflections', function(req, res){
  var fields = ['feelingsWhy',
                    'drugAlcoholIntake',
                    'medication',
                    'sleep',
                    'dream',
                    'whatDream',
                    'exercise',
                    'food',
                    'spnsrMntrConnect',
                    'groupMeet',
                    'commntyService',
                    'selfishDishonest',
                    'howSelfshDishnt',
                    'tomorrowGoal',
                    'dailyGoal',
                    'gratitude',
                    'peerSupport',
                    'counselor',
                    'reflectionDate'
                   ];
  var fieldNames = ['Feelings Description',
                    'Used Drugs/Alcohol?',
                    'Took Medication?',
                    'Sleep',
                    'Using Dream?',
                    'Dream Description',
                    'Exercise',
                    'Food',
                    'Sponsors?',
                    'Number of Meetings',
                    'Community Service?',
                    'Dishonest/Selfish?',
                    'How Dishonest/Selfish?',
                    'Tomorrow\'s Goal',
                    'Completed Goal?',
                    'Gratitude',
                    'Peer Support?',
                    'Counselor?',
                    'Reflection Date'
                    ];
  Reflection.find({}, function(err, allReflections){
    if (err) {
      console.log('error in csv find for reflections: ', err);
      res.sendStatus(500);
    }
    var reflectionData = json2csv({data: allReflections, fields: fields, fieldNames: fieldNames}, function(err, csv){
      if (err){
        console.log('error in json2csv conversion: ', err);
        res.sendStatus(500);
      }
      fs.writeFile('reflection.csv', csv, function(err){
        if (err){
          console.log('error in reflection file save: ', err);
          res.sendStatus(500);
        }
        console.log('saved reflection.csv');
        res.send(csv);
      });
    });
  });
});

module.exports = router;
