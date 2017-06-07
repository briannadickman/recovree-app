var express = require('express');
var cronJob = require('cron').CronJob;
var Users = require('../models/user');
var asyncMod = require('async');

//TWILIO
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var twilioNumber = process.env.TWILIO_NUMBER;

var phoneNumbers = [];
var newMember = '';

var welcomeMember = 'Welcome to Recovree';
var reminderMessage = ['This is a friendly reminder to complete your daily Recovree (insert link)',
    'Find a moment to reflect and complete your daily Recovree (insert link)',
    'One day at a time. Find time to complete your daily Recovree (insert link)',
    'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'
];
var randomIndex = Math.floor(Math.random() * reminderMessage.length);
var randomomizeReminderMessage = reminderMessage[randomIndex];

function sendReminderText(phoneNumber, message) {
    client.messages.create({ to: phoneNumber, from: twilioNumber, body: message },
        function(err, data) {
            if(err) {
              console.log('Error Sending Message');
            } else {
              console.log('SMS SENT', data);
            }
        });
}

app.get('/', function(req, res) {
  console.log('FROM RESET PASSWORD');
});
//send out random message to all users
// var sendReminders = function() {
//     var phoneNumbers = [];
//     Users.find({}, function(err, allUsers) {
//         if (err) {
//             console.log('error in find users: ', err);
//         }
//         for (i = 0; i < allUsers.length; i++) {
//             phoneNumbers.push(allUsers[i].username);
//         }
//         generateReminders(phoneNumbers);
//     });
// };
//
// //random reminders combined with all user phone numbers
// var generateReminders = function(recipients) {
//     for (i = 0; i < recipients.length; i++) {
//         var message = randomMessage();
//         // console.log(recipients[i] + ' : ' + message);
//     }
// };


module.exports = client;
