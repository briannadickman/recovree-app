var express = require('express');
var cronJob = require('cron').CronJob;
var Users = require('../models/user');
var asyncMod = require('async');
// var User = require('../routes/user');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('../models/user');
var User = mongoose.model('users', UserModel.UserSchema);

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var twilioNumber = process.env.TWILIO_NUMBER;

var allPhoneNumbers = [];
var newMember = '';

var welcomeMember = 'Welcome to Recovree';
var reminderMessage = ['This is a friendly reminder to complete your daily Recovree (insert link)',
    'Find a moment to reflect and complete your daily Recovree (insert link)',
    'One day at a time. Find time to complete your daily Recovree (insert link)',
    'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'
];
var randomIndex = Math.floor(Math.random() * reminderMessage.length);
var randomomizeReminderMessage = reminderMessage[randomIndex];
var reflectionCompleteMessage = ['Thank you for completing your daily Recovree!',
    'Thanks for making Recovree a part of your day!',
    'Many thanks for taking time to complete Recovree today'
];
var randomIndex = Math.floor(Math.random() * reminderMessage.length);
var randomomizeReminderMessage = reminderMessage[randomIndex];


function sendSMS(phoneNumber, message) {
    client.messages.create({ to: phoneNumber, from: twilioNumber, body: message },
        function(err, data) {
            if (err) {
                console.log('Error Sending Message');
            } else {
                console.log('SMS SENT', data);
            }
        });
}

//save all new member's phone numbers in an array and send daily text reminders
function storePhoneNumbers(newPhoneNumber) {
    allPhoneNumbers.push(newPhoneNumber);
}

// Send SMS message 6pm everyday
function getPhoneNumbers() {
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        }
        for (var i = 0; i < users.length; i++) {
            var numbers = users[i].username;
            console.log('ALL THE NUMBERS', numbers);
            allPhoneNumbers.push(numbers);
        }
    });
}

function dailyReminderSMS() {
    var textJob = new cronJob('0 18 * * *', function() {
                //run test message here
            }
        },
        null, true);
}
// var textJob = new cronJob( '* * * * *', function(){ 
// for (var i = 0; i < phoneNumbers.length; i++) {
//   client.messages.create( { to: phoneNumbers[i], from: twilioNumber, body: randomomizeReminderMessage},
//   function( err, data ) {});
//   console.log('Text Reminder Sent To: ', phoneNumbers[i]);
// }
// console.log('CRON PORTION OF CODE');
// },  null, true );


module.exports = sendSMS;