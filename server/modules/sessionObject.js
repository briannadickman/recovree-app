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
  //defines the start of the day using moment js
  var todayStart = dateNow.clone().startOf('day');
  // defines the start of yesterday using moment js
  var yesterdayStart = dateNow.clone().subtract(1, 'day').startOf('day');
  //if the user has completed a reflection
  if (allReflections.length >= 1){
    //defines the most recent reflection as mostRecentReflection
    var mostRecentReflection = allReflections[0];
    //defines the start of the day for the most current reflection
    var mostRecentReflectionStart = moment(mostRecentReflection.reflectionDate).startOf('day');
    //sets the serverSessionObject allReflectionsNewToOld property equal to all of the members reflections
    serverSessionObject.allReflectionsNewToOld = allReflections;
    //if the start of the day today is the same as the start of the day for the most recent reflection, it must have happened today
    if (todayStart.clone().diff(mostRecentReflectionStart) === 0){
      console.log('reflection completed today!');
      //so todays reflection has been completed
      serverSessionObject.reflectionCompleted = true;
      //it just so happens to be the most recent reflection
      serverSessionObject.todaysReflection = mostRecentReflection;
      //if there is more than one reflection completed
      if (allReflections[1] !== undefined){
        //define nextMostRecent to  be the second reflection in the new to old reflection array
        var nextMostRecent = allReflections[1];
        serverSessionObject.streakCount = nextMostRecent.streakCount;
        //define start of day for next most recent
        var nextMostRecentStart = moment(nextMostRecent.reflectionDate).startOf('day');
        //if today is complete and another entry exists, check to see if it happened yesterday
        if (yesterdayStart.clone().diff(nextMostRecentStart) === 0){
          //if it did, set yesterday completed to true
          serverSessionObject.yesterdayCompleted = true;
          serverSessionObject.streakCount++;
          //if today and yesterday exist, define yesterdays goal as the second most recent reflection goal
          if (nextMostRecent.tomorrowGoal !== ''){
            serverSessionObject.yesterdayGoal = nextMostRecent.tomorrowGoal;

          } else {
            serverSessionObject.yesterdaysGoal = "";
            console.log('reflections completed yesterday and today, but no goal was set yesterday!');
          }
          return serverSessionObject;
          //otherwise the last reflection was not yesterday and
        } else {
          //we reflect that in the boolean set for yesterday completed
          serverSessionObject.yesterdayCompleted = false;
          //there will not be a goal since there was not an entry
          serverSessionObject.yesterdaysGoal = 'No goal set yesterday';
          //and the streak will be reset
          //reset streak - since todays reflection is completed, its set to 1
          serverSessionObject.streakCount = 1;
          return serverSessionObject;
        }
        //this catches new users that have completed their first reflection
      } else {
        //only one reflection exists, and since it is complete, we increase the streakCount
        serverSessionObject.streakCount++;
        return serverSessionObject;
      }
    }
    //the reflection hasn't been completed today, so check to see if a reflection happened yesterday
    else if (yesterdayStart.clone().diff(mostRecentReflectionStart) === 0){
      serverSessionObject.streakCount = mostRecentReflection.streakCount;
      //the streak does not need to restart, but we're going to wait until the reflection is completed to increase the streak
      serverSessionObject.yesterdayCompleted = true;
      if (mostRecentReflection.tomorrowGoal !== ''){
        //set yesterday's goal to the goal set on the most recent reflection
        serverSessionObject.yesterdaysGoal = mostRecentReflection.tomorrowGoal;
      } else {
        serverSessionObject.yesterdaysGoal = 'No goal set yesterday';
        console.log('yesterday\'s reflection was completed, but there was no goal set');
      }
      return serverSessionObject;
      //if a reflection exists and it didn't happen today or yesterday
    } else {
      serverSessionObject.yesterdayCompleted = false;
      serverSessionObject.yesterdaysGoal = 'No goal set yesterday.';
      serverSessionObject.message = 'Glad to have you back!';
      serverSessionObject.streakCount = 0;
      return serverSessionObject;
    }
  } else if (allReflections[0] === undefined){
  serverSessionObject.message = "Welcome to Recovree!";
  return serverSessionObject;
  }
};

module.exports = generateSessionObject;
