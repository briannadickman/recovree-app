var express = require('express');
var cronJob = require('cron').CronJob;
var Users = require('../models/user');
var asyncMod = require('async');

//TWILIO
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Random Message
var messageAlerts = ['This is a friendly reminder to complete your daily Recovree (insert link)',
                     'Find a moment to reflect and complete your daily Recovree (insert link)',
                     'One day at a time. Find time to complete your daily Recovree (insert link)',
                     'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'];

var twilioNumber = process.env.TWILIO_NUMBER;

//select random message
var randomMessage = function(){
  var randomIndex = Math.floor(Math.random() * messageAlerts.length);
  return messageAlerts[randomIndex];
};

//send out random message to all users
var sendReminders = function(){
  var phoneNumbers = [];
  Users.find({}, function(err, allUsers){
    if (err){
      console.log('error in find users: ', err);
    }
    for (i = 0; i < allUsers.length; i++){
      phoneNumbers.push(allUsers[i].username);
    }
    generateReminders(phoneNumbers);
  });
};

//random reminders combined with all user phone numbers
var generateReminders = function(recipients){
  for (i = 0; i<recipients.length; i++){
    var message = randomMessage();
    // console.log(recipients[i] + ' : ' + message);
  }
};

sendReminders();

module.exports = client;
