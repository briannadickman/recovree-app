var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var moment = require('moment');
moment().format();
var Users = require('../models/user');
var Reflection = require('../models/reflection');
var path = require('path');

var mongoose = require("mongoose");

var RecovreeSchema = mongoose.Schema({});



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

// router.get('/streak/:memberID', function(req, res){
//   console.log('memberID in streak: ', memberID);
//   Reflection.findOne({memberID: memberID})
//     .sort({date: -1})
//     .exec(function(err, lastReflection){
//       if (err){
//         console.log('error in streak determination: ', err);
//         res.sendStatus(500);
//       }
//       console.log('lastReflection: ', lastReflection);
//     });
// });

router.get('/session/:memberID', function(req, res){
  console.log('memberID in session: ', req.params.memberID);
  Reflection.find({'memberID': req.params.memberID})
  //orders allReflections from new to old
    .sort({'reflectionDate': -1})
    .exec(function(err, allReflections){
      if (err){
        console.log('error in find most recent reflection: ', err);
        // res.sendStatus(500);
      }
      var serverSessionObject ={
        reflectionCompleted : false,
        streakCount : 1,
        allReflectionsNewToOld : [],
        yesterdaysGoal : "",
        medication : false,
        todaysReflection : {}
      };
      //sets the serverSessionObject allReflectionsNewToOld property equal to all of the members reflections
      serverSessionObject.allReflectionsNewToOld = allReflections;
      //defines the most recent reflection as lastReflection
      var lastReflection = allReflections[0];
      var dateNow = moment();
      //defines the start of the day using moment js
      var todayStart = dateNow.clone().startOf('day');
      // defines the start of yesterday using moment js
      var yesterdayStart = dateNow.clone().subtract(1, 'day').startOf('day');
      console.log('todayStart: ' + todayStart + '   yesterdayStart: ' + yesterdayStart);
      //defines the start of the day for the most current reflection
      var lastReflectionStart = moment(lastReflection.reflectionDate).startOf('day');
      console.log('lastReflectionStart: ', lastReflectionStart);
      //if the start of the day today is the same as the start of the day for the most recent reflection, it must have happened today
      if (todayStart.clone().diff(lastReflectionStart) === 0){
        console.log('last reflection is today!');
        //so todays reflection has been completed
        serverSessionObject.reflectionCompleted = true;
        //it just so happens to be the most recent reflection
        serverSessionObject.todaysReflection = lastReflection;
        //tomorrows goal yesterday is yesterdays goal today - paul mccartney
        // serverSessionObject.yesterdaysGoal = allReflections[1].tomorrowGoal;
        //Note Note Note ***** if reflections can be completed twice in a day, the above needs to be changed
        console.log('yesterdays goal', serverSessionObject.yesterdaysGoal);
      }
      //if the most recent reflection did not happen today
      if(serverSessionObject.todaysReflection !== lastReflection){
        //this checks to see if the start of yesterday is the same as the start of the day for the most recent reflection
        if (yesterdayStart.clone().diff(lastReflectionStart) === 0){
          //in which case they have completed reflections two days in a row and thus the streak goes up by one
          serverSessionObject.streakCount++;
          console.log('u did it!', serverSessionObject.streak);
        } else {
          //if the most recent reflection happened before yesterday, today's completed reflection starts a new streak at one
          serverSessionObject.streakCount = 1;
          console.log('you did not do it, but you can start again!');
        }
      }
      console.log(serverSessionObject);
      res.send(serverSessionObject);
    });
});


router.post('/', function(req,res){
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
  //edit an employee

    // var foundReflection = new Reflection(){
    //
    // }
    // Reflection.findByIdAndRemove(reflection, function(err, foundReflection){
    //   if (err) {
    //     console.log(err);
    //     res.sendStatus(500);
    //   }
    //   foundReflection.save(function(err, savedEmployee) {
    //     if (err){
    //       console.log(err);
    //       res.sendStatus(500);
    //     }
    //     res.send(savedEmployee);
    //   });
    // });

// });






module.exports = router;
