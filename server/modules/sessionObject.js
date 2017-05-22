var moment = require('moment');
moment().format();
var Reflection = require('../models/reflection');
var async = require('async');

var generateSessionObject = function(allReflections, medication){
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
  var newCount;
  var dateNow = moment(Date.now());
  //defines the start of the day using moment js
  var todayStart = dateNow.clone().startOf('day');
  // defines the start of yesterday using moment js
  var yesterdayStart = dateNow.clone().subtract(1, 'day').startOf('day');
  console.log('todayStart: ' + todayStart + '   yesterdayStart: ' + yesterdayStart);
  //if the user has completed a reflection
  console.log('allReflections.length: ', allReflections.length);
  if (allReflections.length >= 1){
    console.log('inside catch');
    //defines the most recent reflection as mostRecentReflection
    var mostRecentReflection = allReflections[0];
    //sets the serverSessionObject allReflectionsNewToOld property equal to all of the members reflections
    serverSessionObject.allReflectionsNewToOld = allReflections;
    //defines the current streak count based on the most recent reflection
    // allReflections[0].streakCount = 10;//delete me *****************
    serverSessionObject.streakCount = allReflections[0].streakCount;
    console.log('current streak count: ', serverSessionObject.streakCount);
    //defines the start of the day for the most current reflection
    var mostRecentReflectionStart = moment(mostRecentReflection.reflectionDate).startOf('day');
    console.log('mostRecentReflectionStart: ', mostRecentReflectionStart);

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
        //define start of day for next most recent
        var nextMostRecentStart = moment(nextMostRecent.reflectionDate).startOf('day');
        console.log('nextMostRecent: ', nextMostRecent);
        //if today is complete and another entry exists, check to see if it happened yesterday
        if (yesterdayStart.clone().diff(nextMostRecentStart) === 0){
          //if it did, set yesterday completed to true
          serverSessionObject.yesterdayCompleted = true;

          //********INCREASE STREAK*******
          serverSessionObject.streakCount++;

          console.log('increase streak - goes up by one!');
          console.log('u did it!');
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
          console.log('reset streak - since todays reflection is completed, its set to 1');
          serverSessionObject.streakCount = 1;
          return serverSessionObject;
        }
        //this catches new users that have completed their first reflection
      } else {
        console.log('only one reflection exists');
        serverSessionObject.streakCount++;
        return serverSessionObject;



      }
    }

      //the reflection hasn't been completed today, so check to see if a reflection happened yesterday
    else if (yesterdayStart.clone().diff(mostRecentReflectionStart) === 0){
      //the streak does not need to restart, but we're going to wait until the reflection is completed to increase the streak
      serverSessionObject.yesterdayCompleted = true;
      if (mostRecentReflection.tomorrowGoal !== ''){
        serverSessionObject.yesterdaysGoal = mostRecentReflection.tomorrowGoal;

      } else {
        serverSessionObject.yesterdaysGoal = 'No goal set yesterday';

      }

      // *************Retrieve current streak ******************************************

      serverSessionObject.streakCount = mostRecentReflection.streakCount;
      return serverSessionObject;

      //if a reflection exists and it didn't happen today or yesterday
    } else {
      serverSessionObject.yesterdayCompleted = false;
      serverSessionObject.yesterdaysGoal = 'No goal set yesterday.';
      serverSessionObject.message = 'Glad to have you back!';
      serverSessionObject.streakCount = 0;
      console.log('you did not do it, but you can start again!');
      return serverSessionObject;
    }


  } else if (allReflections[0] === undefined){
  serverSessionObject.message = "Welcome to Recovree!";
  return serverSessionObject;
  }
};

module.exports = generateSessionObject;
