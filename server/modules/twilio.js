var express = require('express');
var twilio = require('twilio');
var cronJob = require('cron').CronJob;


//TWILIO
var accountSid = 'AC610eb58033f94d50da2b6a1d43946025';
var authToken = '53cc7f44e80416d531c093f2b934c849';   //need to keep this hidden and gitignore
var client = new twilio(accountSid, authToken);

var phoneNumbers = ['6129918411', '7014294214', '6513997345'];
var twilioNumber = '+17634529159';
// var messageAlerts = ['Keep up the good work!', 'You are doing great!', 'Wow, look at you go!', 'You are a star!'];
var messageAlerts = [ 'This is a friendly reminder to complete your daily Recovree (insert link)',
                      'Find a moment to reflect and complete your daily Recovree (insert link)',
                      'One day at a time. Find time to complete your daily Recovree (insert link)',
                      'Sobriety is a journey. A reminder to complete your daily Recovree (insert link)'];

var randomIndex = Math.floor(Math.random() * messageAlerts.length);
var randomMessage = messageAlerts[randomIndex];
console.log(randomMessage);


var textJob = new cronJob( '* * * * *', function(){ // send SMS message every minute
  for (var i = 0; i < phoneNumbers.length; i++) {
    client.messages.create( { to: phoneNumbers[i], from: twilioNumber, body: randomMessage}, function( err, data ) {});
    console.log('Text Reminder Sent To: ', phoneNumbers[i]);
  }
  console.log('CRON PORTION OF CODE');
},  null, true );

//able to send schedule text alerts with twilio and cron, however need to verify numbers before sending text
//twilio requires phone numbers to be verified before sending a message - unable to do so in node.js because lookupsClient is undefined


// var LookupsClient = require('twilio').LookupsClient;
// console.log(LookupsClient);
// var lookupsClient = new LookupsClient(accountSid, authToken);
// var phoneNumbers = lookupsClient.phoneNumbers(phoneNumber);


// var client = new twilio.LookupsClient(accountSid, authToken);
// //not doing anything.....
// function verify(phoneNumber) {
//   return client.phoneNumbers('6122050534').get().then(function (numberData) {
//     return true;
//   }, function (err) {
//     return false;
//   });
// }



module.exports = client;
