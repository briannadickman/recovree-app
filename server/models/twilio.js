var express = require('express');
var twilio = require('twilio');
var cronJob = require('cron').CronJob;


//TWILIO
var accountSid = 'AC610eb58033f94d50da2b6a1d43946025';
var authToken = '53cc7f44e80416d531c093f2b934c849';   //need to keep this hidden and gitignore

var client = new twilio(accountSid, authToken);


var phoneNumbers = ['9522155883', '6123233908', '6122050534'];
var twilioNumber = '+17634529159';
var messageAlerts = [ 'This is a friendly reminder to complete your daily Recovree (insert link)',
                      'Find a moment to reflect and complete your daily Recovree (insert link)',
                      'One day at a time. Find time to complete your daily Recovree (insert link)',
                      'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'];

var randomIndex = Math.floor(Math.random() * messageAlerts.length);
var randomMessage = messageAlerts[randomIndex];
console.log(randomMessage);

//twilio requires phone numbers to be verified before sending a message


var textJob = new cronJob( '* * * * *', function(){ // send SMS message every minute
  for (var i = 0; i < phoneNumbers.length; i++) {
    client.messages.create( { to: phoneNumbers[i], from: twilioNumber, body: randomMessage}, function( err, data ) {});
    console.log('Text Reminder Sent To: ', phoneNumbers[i]);
  }
},  null, true );












//SYNTAX WITH OUT CRON, WILL SEND EVERYTIME SERVER IS TURNED ON RATHER THAN ON A SCHEDULE
  // client.messages.create({
  //     body: 'Hello from Node - :p',
  //     to: '+16122050534',  // Text this number
  //     from: '+17634529159' // From a valid Twilio number
  //   }, function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     } console.log(data);
  //   });



module.exports = client;
