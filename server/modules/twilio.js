var express = require('express');
var cronJob = require('cron').CronJob;

//TWILIO
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var twilioNumber = process.env.TWILIO_NUMBER;

var welcomeMember = 'Welcome to Recovree';

var reminderMessage = ['This is a friendly reminder to complete your daily Recovree (insert link)',
    'Find a moment to reflect and complete your daily Recovree (insert link)',
    'One day at a time. Find time to complete your daily Recovree (insert link)',
    'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'
  ];
var randomIndex = Math.floor(Math.random() * messageAlerts.length);
var randomomizeReminderMessage = reminderMessage[randomIndex];

var reflectionCompleteMessage = ['Thank you for completing your daily Recovree!',
                                'Thanks for making Recovree a part of your day!',
                                'Many thanks for taking time to complete Recovree today'];

var phoneNumbers = ['6122050534'];

// Using Cron to send automated messages at desiredintervals
// var textJob = new cronJob( '* * * * *', function(){ // send SMS message every minute
// for (var i = 0; i < phoneNumbers.length; i++) {
//   client.messages.create( { to: phoneNumbers[i], from: twilioNumber, body: randomomizeReminderMessage},
//   function( err, data ) {});
//   console.log('Text Reminder Sent To: ', phoneNumbers[i]);
// }
// console.log('CRON PORTION OF CODE');
// },  null, true );




module.exports = client;
