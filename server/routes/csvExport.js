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

router.get('/registration', function(req, res){
  console.log('registration get route hit');
});

router.get('/reflections', function(req, res){
  console.log('reflection get route hit');
  Reflection.find({}, function(err, allReflections){
    if (err) {
      console.log('error in user find for reflections: ', err);
      res.sendStatus(500);
    }
    console.log(allReflections);
    res.send(allReflections);
  });
});

module.exports = router;
