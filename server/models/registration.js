var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegistrationSchema = mongoose.Schema({
  state: {type: String},
  county: {type: String},
  gender: {type: String},
  birthYear: {type: Number},
  drugChoice: {type: String},
  sobrietyDate: {type: Date},
  programPayment: {type: String},
  medication: {type: Boolean},
  howHear: {type: String},
  termsAgreement: {type: Boolean},
  memberID: {type: Number}
});

module.exports = mongoose.model('registration', RegistrationSchema);
