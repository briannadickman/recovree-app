var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var path = require('path');
var mongoose = require('mongoose');

//Schema
var Users = require('../models/user');
var Registration = require('../models/registration');
var Reflection = require('../models/reflection');


//Exports demographic info into a .CSV saved in the root directory
router.get('/registration', function(req, res) {
    if (req.isAuthenticated() && req.user.userType == 1) {
        var fields = ['memberID',
            'state',
            'county',
            'gender',
            'birthYear',
            'drugChoice',
            'sobrietyDate',
            'programPayment',
            'recoverySpecialist',
            'treatmentFacility',
            'medication',
            'howHear',
            'termsAgreement'
        ];
        var fieldNames = ['Member ID',
            'State',
            'County',
            'Gender',
            'Birth Year',
            'Drug(s) of Choice',
            'Sobriety Date',
            'Form of Program Payment',
            'First name of your peer recovery specialist',
            'Treatment facility/organization where you are receiving care',
            'Medication?',
            'How did you hear about Recovree?',
            'Terms of Agreement?'
        ];
        Registration.find().lean().exec(function(err, allRegistrations) {
            if (err) {
                console.log('error in csv find for reflections: ', err);
                res.sendStatus(500);
            }
            var registrationData = json2csv({ data: allRegistrations, fields: fields, fieldNames: fieldNames });
            res.attachment('registration.csv');
            res.status(200).send(registrationData);
        });
    } else {
        console.log('not authorized');
        res.sendStatus(403);
    }
});

//Exports demographic info into a .CSV saved in the root directory
router.get('/reflections', function(req, res) {
    if (req.isAuthenticated() && req.user.userType == 1) {
        var fields = ['phoneNum',
            'memberID',
            'feelingsWhy',
            'drugAlcoholIntake',
            'medication',
            'sleep',
            'dream',
            'whatDream',
            'exercise',
            'food',
            'spnsrMntrConnect',
            'groupMeet',
            'commntyService',
            'selfishDishonest',
            'howSelfshDishnt',
            'tomorrowGoal',
            'dailyGoal',
            'gratitude',
            'peerSupport',
            'counselor',
            'reflectionDate',
            'feelings[0].value',
            'feelings[1].value',
            'feelings[2].value',
            'feelings[3].value',
            'feelings[4].value',
            'feelings[5].value',
            'feelings[6].value',
            'feelings[7].value',
            'feelings[8].value',
            'feelings[9].value',
            'feelings[10].value',
            'feelings[11].value',
            'feelings[12].value',
            'feelings[13].value',
            'feelings[14].value',
            'feelings[15].value',
            'feelings[16].value',
            'feelings[17].value',
            'feelings[18].value',
            'feelings[19].value',
            'feelings[20].value',
            'feelings[21].value',
            'feelings[22].value',
            'feelings[23].value',
            'feelings[24].value',
            'feelings[25].value',
            'stressors[0].value',
            'stressors[1].value',
            'stressors[2].value',
            'stressors[3].value',
            'stressors[4].value',
            'stressors[5].value',
            'stressors[6].value',
            'stressors[7].value',
            'stressors[8].value',
            'stressors[9].value',
            'stressors[10].value',
            'stressors[11].value',
        ];
        var fieldNames = ['Phone Number',
            'Member ID',
            'Feelings Description',
            'Used Drugs/Alcohol?',
            'Took Medication?',
            'Sleep',
            'Using Dream?',
            'Dream Description',
            'Exercise',
            'Food',
            'Sponsors?',
            'Number of Meetings',
            'Community Service?',
            'Dishonest/Selfish?',
            'How Dishonest/Selfish?',
            'Tomorrow\'s Goal',
            'Completed Goal?',
            'Gratitude',
            'Peer Support?',
            'Counselor?',
            'Reflection Date',
            'Feelings: Angry?',
            'Feelings: Anxious?',
            'Feelings: Depressed?',
            'Feelings: Distant?',
            'Feelings: Discerning?',
            'Feelings: Discouraged?',
            'Feelings: Excited?',
            'Feelings: Frustrated?',
            'Feelings: Grateful?',
            'Feelings: Guilty?',
            'Feelings: Happy?',
            'Feelings: Hopeful?',
            'Feelings: Hostile?',
            'Feelings: Insignificant?',
            'Feelings: Jealous?',
            'Feelings: Loving?',
            'Feelings: Motivated?',
            'Feelings: Numb?',
            'Feelings: Optimistic?',
            'Feelings: Overwhelmed?',
            'Feelings: Peaceful?',
            'Feelings: Proud?',
            'Feelings: Sad?',
            'Feelings: Safe?',
            'Feelings: Thoughtful?',
            'Feelings: Valuable?',
            'Stressors: Children?',
            'Stressors: Employment?',
            'Stressors: Family?',
            'Stressors: Finances?',
            'Stressors: Friends?',
            'Stressors: Housing?',
            'Stressors: Legal Issues?',
            'Stressors: No \'Me Time\'?',
            'Stressors: Partner?',
            'Stressors: Physical Pain?',
            'Stressors: School?',
            'Stressors: Transportation?'
        ];
        Reflection.find({}, function(err, allReflections) {
            if (err) {
                console.log('error in csv find for reflections: ', err);
                res.sendStatus(500);
            }
            var reflectionData = json2csv({ data: allReflections, fields: fields, fieldNames: fieldNames });
            res.attachment('reflection.csv');
            res.status(200).send(reflectionData);
        });
    } else {
        console.log('not authorized');
        res.sendStatus(403);
    }
});

module.exports = router;
