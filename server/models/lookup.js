var express = require('express');


//TWILIO
var accountSid = 'AC610eb58033f94d50da2b6a1d43946025';
var authToken = '53cc7f44e80416d531c093f2b934c849';   //need to keep this hidden and gitignore
var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(accountSid, authToken);
var phoneNumbers = client.phoneNumbers('+16122050534');

phoneNumbers.get(function(error, number) {
  console.log(number.carrier.type);
  console.log(number.carrier.name);
});


// client.phoneNumbers('+16122050534').get({type: 'carrier'}, function(error, number) {
//   console.log(number.carrier.type);
//   console.log(number.carrier.name);
// });
