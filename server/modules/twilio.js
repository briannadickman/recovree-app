var express = require('express');
var cronJob = require('cron').CronJob;
var Users = require('../models/user');
var asyncMod = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('../models/user');
var User = mongoose.model('users', UserModel.UserSchema);

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var twilioNumber = process.env.TWILIO_NUMBER;

var herokuURl = 'https://recovree.herokuapp.com/';
var welcomeMember = 'Welcome to Recovree';
var reminderMessage = ['This is a friendly reminder to complete your daily Recovree  ' + herokuURl,
    'Find a moment to reflect and complete your daily Recovree  ' + herokuURl,
    'One day at a time. Find time to complete your daily Recovree  ' + herokuURl,
    'Sobriety is a journey. A reminder to complete your daily Recovree  ' + herokuURl,
];
var randomIndex = Math.floor(Math.random() * reminderMessage.length);
var randomomizeReminderMessage = reminderMessage[randomIndex];
var reflectionCompleteMessage = ['Thank you for completing your daily Recovree!',
    'Thanks for making Recovree a part of your day!',
    'Many thanks for taking time to complete Recovree today'
];
var randomIndex = Math.floor(Math.random() * reminderMessage.length);
var randomomizeReminderMessage = reminderMessage[randomIndex];

dailyReminderSMS();

function dailyReminderSMS() {
    var textJob = new cronJob('0 18 * * *', function() {
            // var textJob = new cronJob('* * * * *', function() {      //every minute for development purposes
            getPhoneNumbers();
        },
        null, true);
}

function getPhoneNumbers() {
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        }
        for (var i = 0; i < users.length; i++) {
            var numbers = users[i].username;
            sendSMS(numbers, randomomizeReminderMessage);
        }
    });
}

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




module.exports = sendSMS;