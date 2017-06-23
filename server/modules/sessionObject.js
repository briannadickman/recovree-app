var moment = require('moment');
moment().format();
var Reflection = require('../models/reflection');

var generateSessionObject = function(allReflections, medication){
//default sessionObject for new users
  var serverSessionObject = {
    reflectionCompleted : false,
    yesterdayCompleted : false,
    streakCount : 0,
    allReflectionsNewToOld : [],
    yesterdaysGoal : "",
    medication : medication,
    todaysReflection : {},
    message : ''
  };

  //if the user has completed a reflection
  if (allReflections.length >= 1){
    serverSessionObject.allReflectionsNewToOld = allReflections;
    return serverSessionObject;
  }
  else if (allReflections[0] === undefined){
  return serverSessionObject;
  }
};


module.exports = generateSessionObject;
