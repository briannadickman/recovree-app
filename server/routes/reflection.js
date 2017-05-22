var express = require('express');
var router = express.Router();

//node modules
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var moment = require('moment');
moment().format();
var async = require('async');
var path = require('path');
var mongoose = require("mongoose");

//models
var Users = require('../models/user');
var Reflection = require('../models/reflection');
var Registration = require('../models/registration');

//our modules
var generateSessionObject = require('../modules/sessionObject');







///get reflections from database
router.get('/', function (req, res) {
  Reflection.find().lean().exec(function(err, reflections){
    if(err){
      console.log("Mongo Error: ", err);
      res.send(500);
    }
    res.send(reflections);
  });
});

router.put('/streak', function(req, res){
  console.log('memberID in streak: ', req.params.memberID);
  memberID = req.params.memberID;
  console.log('streak in reflection/streak: ', req.body.streak);
  streakCount = req.body.streak;
  Reflection.findOne({memberID: memberID})
    .sort({date: -1})
    .exec(function(err, lastReflection){
      if (err){
        console.log('error in streak determination: ', err);
        res.sendStatus(500);
      }
      console.log('lastReflection: ', lastReflection);
    });
});

router.get('/session/:memberID', function(req, res){
  var reflections;
  var medication;
  console.log('memberID in session: ', req.params.memberID);
  var memberID = req.params.memberID;
  async.parallel([
    function(callback){
      Reflection.find({'memberID': req.params.memberID})
      //orders allReflections from new to old
        .sort({'reflectionDate': -1})
        .exec(function(err, sessionOutput){
          if (err){
            console.log('error in find most recent reflection: ', err);
            // res.sendStatus(500);
          }
          // var serverSessionObject = generateSessionObject(allReflections);
          // console.log(serverSessionObject);
          // res.send(serverSessionObject);
          console.log('allReflections in session query: ', sessionOutput);
          callback(null, sessionOutput);
        });
    },
    function(callback, sessionOutput){
      // console.log('in find medications - reflections: ', reflections);
      Registration.findOne({'memberID' : memberID})
      .select('medication')
      .exec(function(err, hasMedication){
        if (err){
          console.log('error in find meds: ', err);
        }
        console.log('hasMedication? ', hasMedication);
        sessionOutput = hasMedication;
        callback(null, sessionOutput);

      });
    }
  ],
    function(err, sessionOutput){
      console.log('reflections: ', sessionOutput[0]);
      reflections = sessionOutput[0];
      console.log('medication: ', sessionOutput[1]);
      medication = sessionOutput[1].medication;
      async.waterfall([
        function(callback){
          var serverSessionObject = generateSessionObject(reflections, medication);
          console.log('streakCount: ', serverSessionObject.streakCount);
          callback(null, serverSessionObject);
        }],
        function(err, results){
          console.log('results: ', results);
          var newCount = results.streakCount;
          if (results.allReflectionsNewToOld[0]){
            Reflection.findOne({'_id' : results.allReflectionsNewToOld[0]._id}, function(err, curReflection){
                  if (err) {
                    console.log('streak count first reflection update error: ', err);
                  }
                  curReflection.streakCount = newCount || curReflection.streakCount;
                  console.log('streak count blub blub: ', curReflection.streakCount);
                  res.send(results);
            });
          } else {
            res.send(results);
          }
      });





  });
});




router.post('/', function(req,res){
  //req.isAuthenticated do before all of this, also check User type
  console.log(req.user.memberID);
  var memID = req.user.memberID;
  var reflection = req.body;
  var newReflection = new Reflection({
    id : req.user._id,
    date: reflection.reflectionDate,
    // time: reflection.reflectionTime,
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
    memberID: memID
  });
  console.log(newReflection.memberID);
  console.log('----NEW REFLECTION---', newReflection);

  newReflection.save(newReflection, function(err, savedReflection){
    if(err){
      console.log("Error: ", err);
      res.sendStatus(500);
    }
    console.log('saved to db ----------', newReflection);
    res.send(savedReflection);
  });
});


router.put('/', function (req, res) {
  console.log('----PUT---', req.body);
  console.log('id in put: ', req.body._id);


  var reflectionUpdate = req.body;
  Reflection.findOne({'_id' : req.body._id}, function(err, curReflection){
    if (err) {
      console.log('reflection put err: ', err);
      res.sendStatus(500);
    }
    console.log('curRefliction in reflection put: ', curReflection);

    curReflection.feelings = reflectionUpdate.feelings || curReflection.feelings;
    curReflection.feelingsWhy = reflectionUpdate.feelingsWhy || curReflection.feelingsWhy;
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
});



module.exports = router;
