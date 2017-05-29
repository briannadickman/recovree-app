var express = require('express');
var router = express.Router();

//node modules
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var moment = require('moment');
moment().format();
var asyncMod = require('async');
var path = require('path');
var mongoose = require("mongoose");

//models
var Users = require('../models/user');
var Reflection = require('../models/reflection');
var Registration = require('../models/registration');

//our modules
var generateSessionObject = require('../modules/sessionObject');
var convertCount = require('../modules/convertCount');

///get reflections from database
router.get('/', function (req, res) {
  if(req.isAuthenticated()) {
  Reflection.find().lean().exec(function(err, reflections){
    if(err){
      console.log("Mongo Error: ", err);
      res.send(500);
    }
    res.send(reflections);
  });
} else {
    res.sendStatus(403);
  }
});

router.get('/countByDay', function(req, res){
  if(req.isAuthenticated()){
  Reflection.aggregate(
    [{$group: {
      _id : { month: {$month : '$reflectionDate'}, day: {$dayOfMonth: '$reflectionDate'}, year: { $year : '$reflectionDate'}},
      count: { $sum : 1 },
      }
    }], function(err, countData){
    if (err){
      console.log('error in count by day: ', err);
    }
    console.log('count data: ', countData);
    var reflectionCountByDate = convertCount(countData);
    res.send(reflectionCountByDate);
  });
} else {
    res.sendStatus(403);
  }
});

router.get('/session/', function(req, res){//took out memberID
  if (req.isAuthenticated()){
  var reflections;
  var medication;
  console.log('memberID in session: ', req.user.memberID);
  var memberID = req.user.memberID;
  //asyncMod is a node package that handles mongoose async calls for multiple database queries
  //parallel will make both calls in parallel since neither call depends on the other
  asyncMod.parallel([
    function(callback){
      //finds all reflections for logged in member
      Reflection.find({'memberID': memberID})
      //orders allReflections from new to old
        .sort({'reflectionDate': -1})
        .exec(function(err, allReflections){
          if (err){
            console.log('error in find reflections: ', err);
            res.sendStatus(500);
          }
          //all reflections are saved in the asyncMod's  sessionOutput[0]
          sessionOutput = allReflections;
          callback(null, sessionOutput);
        });
    },
    function(callback, sessionOutput){
      //determines whether the current member should be asked medication question
      Registration.findOne({'memberID' : memberID})
      .select('medication')
      .exec(function(err, hasMedication){
        if (err){
          console.log('error in find meds: ', err);
        }
        //medication boolean returned from database saved as sessionOutput[1]
        sessionOutput = hasMedication;
        callback(null, sessionOutput);
      });
    }
  ],
  function(err, sessionOutput){
    //sessionOutput from reflection collection call saved as reflections now that the async calls have both completed
    reflections = sessionOutput[0];
    //sessionOutput from medication determination
    medication = sessionOutput[1].medication;
    //runs the streak determination then saves the streak to the database after the determinations has been completed
    asyncMod.waterfall([
      function(callback){
        var serverSessionObject = generateSessionObject(reflections, medication);
        callback(null, serverSessionObject);
      }
    ],
    function(err, results){
      //server session object is passed as results per async plugin
      var newCount = results.streakCount;
      console.log('newCount: ', newCount);
      //if a reflection exists (not a new user) this saves the results from the streak count determination
      if (results.allReflectionsNewToOld[0]){
        Reflection.findOne({'_id' : results.allReflectionsNewToOld[0]._id}, function(err, curReflection){
          if (err) {
            console.log('streak count first reflection update error: ', err);
          }
          curReflection.streakCount = newCount || curReflection.streakCount;
          console.log('curReflection.streakCount: ', curReflection.streakCount);
          curReflection.save(function(err, updatedReflection){
            if (err){
              console.log('error in reflection put: ', err);
              res.sendStatus(500);
            }
            console.log('updated reflection: ', updatedReflection);
            res.send(results);
          });
        });
      } else {
        //this sends the defaults for sessionObject for new users
        res.send(results);
      }
    });
  });
  } else {
    console.log('user not authorized');
    res.sendStatus(403);
  }
});

//initial reflections post
router.post('/', function(req,res){
  if(req.isAuthenticated()){
  console.log(req.user.memberID);
  var memberID = req.user.memberID;
  var reflection = req.body;
  var newReflection = new Reflection({
    id : req.user._id,
    date: reflection.reflectionDate,
    overallfeeling: reflection.overallfeeling,
    feelings : reflection.feelings,
    feelingsWhy: reflection.feelingsWhy,
    drugAlcoholIntake: reflection.drugAlcoholIntake,
    medication: reflection.medication,
    sleep: reflection.sleep,
    dream: reflection.dream,
    whatDream: reflection.whatDream,
    exercise: reflection.exercise,
    food: reflection.food,
    spnsrMntrConnect: reflection.spnsrMntrConnect,
    groupMeet: reflection.groupMeet,
    commntyService: reflection.commntyService,
    stressors: reflection.stressors,
    selfishDishonest: reflection.selfishDishonest,
    howSelfshDishnt: reflection.howSelfshDishnt,
    tomorrowGoal: reflection.tomorrowGoal,
    dailyGoal: reflection.dailyGoal,
    gratitude: reflection.gratitude,
    peerSupport: reflection.peerSupport,
    counselor: reflection.counselor,
    memberID: memberID
  });

  newReflection.save(newReflection, function(err, savedReflection){
    if(err){
      console.log("Error: ", err);
      res.sendStatus(500);
    }
    console.log('saved to db ----------', newReflection);
    res.send(savedReflection);
  });
  } else {
    console.log('user not authorized');
    res.sendStatus(403);
  }
});

//updates reflections at each step of the form
router.put('/', function (req, res) {
  if(req.isAuthenticated()){
  var reflectionUpdate = req.body;
  Reflection.findOne({'_id' : req.body._id}, function(err, curReflection){
    if (err) {
      console.log('reflection put err: ', err);
      res.sendStatus(500);
    }
    //updates reflection found by id or reverts to original if property hasn't been passed
    curReflection.feelings = reflectionUpdate.feelings || curReflection.feelings;
    curReflection.feelingsWhy = reflectionUpdate.feelingsWhy || curReflection.feelingsWhy;
    curReflection.overallfeeling = reflectionUpdate.overallfeeling || curReflection.overallfeeling;
    curReflection.drugAlcoholIntake = reflectionUpdate.drugAlcoholIntake || curReflection.drugAlcoholIntake;
    curReflection.medication =  reflectionUpdate.medication || curReflection.medication;
    curReflection.sleep = reflectionUpdate.sleep || curReflection.sleep;
    curReflection.dream = reflectionUpdate.dream || curReflection.dream;
    curReflection.whatDream = reflectionUpdate.whatDream || curReflection.whatDream;
    curReflection.exercise = reflectionUpdate.exercise || curReflection.exercise;
    curReflection.food = reflectionUpdate.food || curReflection.food;
    curReflection.spnsrMntrConnect = reflectionUpdate.spnsrMntrConnect || curReflection.spnsrMntrConnect;
    curReflection.groupMeet = reflectionUpdate.groupMeet || curReflection.groupMeet;
    curReflection.commntyService = reflectionUpdate.commntyService || curReflection.commntyService;
    curReflection.stressors = reflectionUpdate.stressors || curReflection.stressors;
    curReflection.selfishDishonest = reflectionUpdate.selfishDishonest || curReflection.selfishDishonest;
    curReflection.howSelfshDishnt = reflectionUpdate.howSelfshDishnt || curReflection.howSelfshDishnt;
    curReflection.tomorrowGoal = reflectionUpdate.tomorrowGoal || curReflection.tomorrowGoal;
    curReflection.dailyGoal = reflectionUpdate.dailyGoal || curReflection.dailyGoal;
    curReflection.gratitude = reflectionUpdate.gratitude || curReflection.gratitude;
    curReflection.peerSupport = reflectionUpdate.peerSupport || curReflection.peerSupport;
    curReflection.counselor = reflectionUpdate.counselor || curReflection.counselor;

    curReflection.save(function(err, updatedReflection){
      if (err){
        console.log('error in reflection put: ', err);
        res.sendStatus(500);
      }
      console.log('updated reflection: ', updatedReflection);
      res.send(updatedReflection);
    });
  });
  } else {
    console.log('user not authorized');
    res.sendStatus(403);
  }
});

module.exports = router;
