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
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        Reflection.find().lean().exec(function(err, reflections) {
            if (err) {
                console.log("Mongo Error: ", err);
                res.send(500);
            }
            res.send(reflections);
        });
    } else {
        res.sendStatus(403);
    }
});

//admin - return count by day
router.get('/countByDay', function(req, res) {
    if (req.isAuthenticated()) {
        Reflection.aggregate(
            [{
                $group: {
                    _id: { month: { $month: '$reflectionDate' }, day: { $dayOfMonth: '$reflectionDate' }, year: { $year: '$reflectionDate' } },
                    count: { $sum: 1 },
                }
            }],
            function(err, countData) {
                if (err) {
                    console.log('error in count by day: ', err);
                }
                var reflectionCountByDate = convertCount(countData);
                res.send(reflectionCountByDate);
            });
    } else {
        res.sendStatus(403);
    }
});

//async session generation
router.get('/session/', function(req, res) { //took out memberID
    if (req.isAuthenticated()) {
        var reflections;
        var medication;
        var memberID = req.user.memberID;
        //find reflections by memberID
        asyncMod.parallel([
                function(callback) {
                    Reflection.find({ 'memberID': memberID })
                        .sort({ 'reflectionDate': -1 })
                        .exec(function(err, allReflections) {
                            if (err) {
                                console.log('error in find reflections: ', err);
                                res.sendStatus(500);
                            }
                            sessionOutput = allReflections;
                            callback(null, sessionOutput);
                        });
                },
                function(callback, sessionOutput) {
                    //does the user have medication?  called in the backend to protect anonymity
                    Registration.findOne({ 'memberID': memberID })
                        .select('medication')
                        .exec(function(err, hasMedication) {
                            if (err) {
                                console.log('error in find meds: ', err);
                            }
                            sessionOutput = hasMedication;
                            callback(null, sessionOutput);
                        });
                }
            ],
            function(err, sessionOutput) {
                reflections = sessionOutput[0];
                medication = sessionOutput[1].medication;
                //create session object
                asyncMod.waterfall([
                        function(callback) {
                            var serverSessionObject = generateSessionObject(reflections, medication);
                            callback(null, serverSessionObject);
                        }
                    ],
                    function(err, results) {

                        if (err) {
                          console.log('error in serverSessionObject response');
                          res.sendStatus(500);
                        }
                        else{
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
router.post('/', function(req, res) {
    if (req.isAuthenticated()) {
        var memberID = req.user.memberID;
        var reflection = req.body;
        var newReflection = new Reflection({
            id: req.user._id,
            overallfeeling: reflection.overallfeeling,
            feelings: reflection.feelings,
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
            streakCount: reflection.streakCount,
            memberID: memberID
        });

        newReflection.save(newReflection, function(err, savedReflection) {
            if (err) {
                console.log("Error: ", err);
                res.sendStatus(500);
            }
            res.send(savedReflection);
        });
    } else {
        console.log('user not authorized');
        res.sendStatus(403);
    }
});

//updates reflections at each step of the form
router.put('/', function(req, res) {
    if (req.isAuthenticated()) {
        var reflectionUpdate = req.body;
        Reflection.findOne({ '_id': req.body._id }, function(err, curReflection) {
            if (err) {
                console.log('reflection put err: ', err);
                res.sendStatus(500);
            }
            //updates reflection found by id or reverts to original if property hasn't been passed
            curReflection.feelings = reflectionUpdate.feelings || curReflection.feelings;
            curReflection.feelingsWhy = reflectionUpdate.feelingsWhy || curReflection.feelingsWhy;
            curReflection.overallfeeling = reflectionUpdate.overallfeeling || curReflection.overallfeeling;
            curReflection.drugAlcoholIntake = reflectionUpdate.drugAlcoholIntake || curReflection.drugAlcoholIntake;
            curReflection.medication = reflectionUpdate.medication || curReflection.medication;
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

            curReflection.save(function(err, updatedReflection) {
                if (err) {
                    console.log('error in reflection put: ', err);
                    res.sendStatus(500);
                }
                res.send(updatedReflection);
            });
        });
    } else {
        console.log('user not authorized');
        res.sendStatus(403);
    }
});

module.exports = router;
