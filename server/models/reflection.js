var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var date = new Date();
var newdate = date.toLocaleString();


var ReflectionSchema = mongoose.Schema({
    feelings: { type: Array },
    overallfeeling: { type: Number },
    feelingsWhy: { type: String },
    drugAlcoholIntake: { type: Boolean },
    medication: { type: Boolean },
    sleep: { type: Number },
    dream: { type: Boolean },
    whatDream: { type: String },
    exercise: { type: Number },
    food: { type: Number },
    spnsrMntrConnect: { type: Boolean },
    groupMeet: { type: Number },
    commntyService: { type: Boolean },
    stressors: { type: Array },
    selfishDishonest: { type: Boolean },
    howSelfshDishnt: { type: String },
    tomorrowGoal: { type: String },
    dailyGoal: { type: Boolean },
    gratitude: { type: String },
    peerSupport: { type: Boolean },
    counselor: { type: Boolean },
    streakCount: { type: Number, default: 0 },
    reflectionDate: { type: Date, default: Date.now },
    memberID: { type: Number, ref: 'Registration' } //references Registration Schema
});


module.exports = mongoose.model('reflection', ReflectionSchema);