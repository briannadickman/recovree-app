var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var Users = require('../models/user');
var Reflection = require('../models/reflection');
var path = require('path');

var mongoose = require("mongoose");

var RecovreeSchema = mongoose.Schema({});

// var ReflectionSchema = mongoose.Schema({
//   feelings: {type: Array},
//   feelingsWhy: {type: String},
//   drugAlcoholIntake: {type: Boolean},
//   medication: {type: Boolean},
//   sleep: {type: Number},
//   dream: {type: Boolean},
//   whatDream: {type: String},
//   exercise: {type: Number},
//   food: {type: Number},
//   spnsrMntrConnect: {type: Boolean},
//   groupMeet: {type: Number},
//   commntyService: {type: Boolean},
//   stressors: {type: Array},
//   selfishDishonest: {type: Boolean},
//   howSelfshDishnt: {type: String},
//   tomorrowGoal: {type: String},
//   dailyGoal: {type: Boolean},
//   gratitude: {type: String},
//   peerSupport: {type: Boolean},
//   counselor: {type: Boolean},
//   // reflectionDate: {type: String},
//   // reflectionTime: {type: String},
//   reflectionDate: {type: Date, default: Date.now},
//   // memberID: {type: Schema.ObjectId, ref: 'Registration'} //references Registration Schema
// });
//
// var Reflection = mongoose.model('reflection', ReflectionSchema);
// module.exports = Reflection;

///get reflections from database
router.get('/', function (req, res) {
  Reflection.find().lean().exec(function(err, reflections){
    if(err){
      console.log("Mongo Error: ", err);
      res.send(500);
    }
    // var reflectionsJSON = JSON.stringify(reflections);
    // console.log('reflectionsJSON: ', reflectionsJSON);
    // var fields = ['feelings.name', 'feelings.value',
    //               'feelingsWhy', 'drugAlcoholIntake', 'medication',
    //               'sleep', 'dream', 'whatDream', 'exercise', 'food', 'spnsrMntrConnect',
    //               'groupMeet', 'commntyService', 'stressors.name', 'stressors.value',
    //               'selfishDishonest', 'howSelfshDishnt', 'tomorrowGoal', 'dailyGoal', 'gratitude',
    //               'peerSupport', 'counselor'];
    // var data = reflectionsJSON;
    // var csv = json2csv({data : data, fields: fields, unwindPath: [reflections.feelings, reflections.stressors]});
    // fs.writeFile('recoveree-reflections.csv', csv, function(err){
    //   if (err){
    //     console.log('csv save error: ', err);
    //   }
    //   console.log('csv saved: ', csv);
    // });

    // console.log(reflections, reflectionsJSON);
    res.send(reflections);
  });
});


router.post('/', function(req,res){
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
    counselor: reflection.counselor
  });

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
