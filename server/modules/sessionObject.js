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

  var dateNow = moment(Date.now());
  var todayStart = dateNow.clone().startOf('day');
  var yesterdayStart = dateNow.clone().subtract(1, 'day').startOf('day');

  //if the user has completed a reflection
  if (allReflections.length >= 1){
    var mostRecentReflection = allReflections[0];
    var mostRecentReflectionDate =allReflections[0].reflectionDate;
    var mostRecentReflectionStart = moment(mostRecentReflectionDate).startOf('day');
    serverSessionObject.allReflectionsNewToOld = allReflections;
    //if todays reflection is complete
    if (todayStart.clone().diff(mostRecentReflectionStart) === 0){
      serverSessionObject.reflectionCompleted = true;
      serverSessionObject.todaysReflection = mostRecentReflection;
      //if there is more than one reflection completed
      if (allReflections[1] !== undefined){
        var nextMostRecent = allReflections[1];
        var nextMostRecentDate = allReflections[1].reflectionDate;
        serverSessionObject.streakCount = nextMostRecent.streakCount;
        var nextMostRecentStart = moment(nextMostRecentDate).startOf('day');
        //if today is complete and another entry exists, check to see if it happened yesterday
        if (yesterdayStart.clone().diff(nextMostRecentStart) === 0){
          serverSessionObject.yesterdayCompleted = true;
          serverSessionObject.streakCount++;
          //if there was a goal set yesterday
          if (nextMostRecent.tomorrowGoal !== ''){
            serverSessionObject.yesterdaysGoal = nextMostRecent.tomorrowGoal;
          } else {
            serverSessionObject.yesterdaysGoal = "";
          }
          return serverSessionObject;
          //otherwise the last reflection was not yesterday
        } else {
          serverSessionObject.yesterdayCompleted = false;
          serverSessionObject.yesterdaysGoal = 'No goal set yesterday';
          serverSessionObject.streakCount = 1;
          return serverSessionObject;
        }
      //first reflection
      } else {
        serverSessionObject.streakCount++;
        return serverSessionObject;
      }
    }
    //the reflection hasn't been completed today, so check to see if a reflection happened yesterday
    else if (yesterdayStart.clone().diff(mostRecentReflectionStart) === 0){
      serverSessionObject.streakCount = mostRecentReflection.streakCount;
      serverSessionObject.yesterdayCompleted = true;
      //yep. goal?
      if (mostRecentReflection.tomorrowGoal !== ''){
        serverSessionObject.yesterdaysGoal = mostRecentReflection.tomorrowGoal;
      } else {
        serverSessionObject.yesterdaysGoal = 'No goal set yesterday';
      }
      return serverSessionObject;
    //its been a while eh?
    } else {
      serverSessionObject.yesterdayCompleted = false;
      serverSessionObject.yesterdaysGoal = 'No goal set yesterday';
      serverSessionObject.message = 'Glad to have you back!';
      serverSessionObject.streakCount = 0;
      return serverSessionObject;
    }
  //first login - return defaults.
  } else if (allReflections[0] === undefined){
  return serverSessionObject;
  }
};


module.exports = generateSessionObject;
