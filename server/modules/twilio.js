var express = require('express');
var cronJob = require('cron').CronJob;

//TWILIO
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


var phoneNumbers = ['6129918411', '7014294214', '6513997345'];
var twilioNumber = process.env.TWILIO_NUMBER;
// var messageAlerts = ['Keep up the good work!', 'You are doing great!', 'Wow, look at you go!', 'You are a star!'];
var messageAlerts = ['This is a friendly reminder to complete your daily Recovree (insert link)',
  'Find a moment to reflect and complete your daily Recovree (insert link)',
  'One day at a time. Find time to complete your daily Recovree (insert link)',
  'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'
];

var randomIndex = Math.floor(Math.random() * messageAlerts.length);
var randomMessage = messageAlerts[randomIndex];
console.log(randomMessage);

// Using Cron to send automated messages at desiredintervals
var textJob = new cronJob( '* * * * *', function(){ // send SMS message every minute
for (var i = 0; i < phoneNumbers.length; i++) {
  client.messages.create( { to: phoneNumbers[i], from: twilioNumber, body: randomMessage}, function( err, data ) {});
  console.log('Text Reminder Sent To: ', phoneNumbers[i]);
}
console.log('CRON PORTION OF CODE');
},  null, true );

module.exports = client;
