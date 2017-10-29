myApp.factory('UserService', ['$http', '$location', function($http, $location) {

    //variables
    var user = {};
    var userObject = {};
    var registration = {};
    var sessionObject = {};
    var reflectionObject = {};
    var dailyReflectObject = {
        data: ''
    };

    var graphsObject = {};

    //getuser
    function getuser() {
        $http.get('/user').then(function(response) {
            if (response.data.id) {
                // user has a curret session on the server
                userObject.userName = response.data.username;
                userObject.id = response.data.id;
            } else {
                // user has no session, bounce them back to the login page
                $location.path("/login");
            }
        });
    } //ends getuser

    //logout
    function logout() {
        $http.get('/user/logout').then(function(response) {
            $location.path("/landing");
        });
    } //ends logout

    function registerUser(user, registration) {
        if (user.username === '' || user.password === '') {} else {
            $http.post('/register', user).then(function(response) {
                    emptyUser(user);
                    userDemographics(registration);
                },
                function(response) {
                    $scope.message = "Please try again.";
                });
        }
    } //ends registerUser



    function emptyUser(user) {
        user.username = '';
        user.password = '';
    } //emptyUser


    function userDemographics(registration) {
        console.log("userDemographics registration",registration);
        $http.post('/register/registration', registration).then(function(response) {
            emptyDemographics(registration);
            $location.path('/login');
        });
    } //ends userDemographics

    function emptyDemographics(registration) {
        registration.gender = '';
        registration.birthYear = '';
        registration.state = '';
        registration.county = '';
        registration.drugChoice = '';
        registration.sobrietyDate = '';
        registration.programPayment = '';
        registration.medication = '';
        registration.howHear = '';
        registration.termsAgreement = false;
        registration.memberID = '';
    } //ends emptyDemographics

    //refreshes session object on each navigation page load
    function refreshSessionObject(location) {
        getSessionObject(location); //took out argument, build in backend and erase
        getReflectionObject(reflectionObject);
    } //ends refreshSessionObject

    var thisWeek = moment().week();
    var lastWeek = thisWeek - 1;
    var thisMonth = moment().month();
    var lastMonth = thisMonth - 1;

    var thisWeeksObject = {
        reflections: [],
    };
    var lastWeeksObject = {
        reflections: [],
    };
    var thisMonthsObject = {
        reflections: [],
    };
    var lastMonthsObject = {
        reflections: [],
    };

    graphsObject.thisWeeksObject = thisWeeksObject;
    graphsObject.lastWeeksObject = lastWeeksObject;
    graphsObject.thisMonthsObject = thisMonthsObject;
    graphsObject.lastMonthsObject = lastMonthsObject;

    var displayThisWeek = function() {
        // weeklyGraphs(thisWeeksObject);
        $location.path('/weekly-graphs');
    };
    var displayLastWeek = function() {
        // weeklyGraphs(lastWeeksObject);
        $location.path('/last-week');
    };
    var displayThisMonth = function() {
        $location.path('/this-month');
    };
    var displayLastMonth = function() {
        // weeklyGraphs(lastMonthsObject);
        $location.path('/last-month');
    };

    var getWeeklyData = function(reflections) {
        thisWeeksObject.reflections = [];
        lastWeeksObject.reflections = [];
        for (var i = 0; i < reflections.length; i++) {
            var currentReflection = reflections[i];
            var reflectionWeek = moment(currentReflection.reflectionDate).week();
            if (reflectionWeek === thisWeek) {
                thisWeeksObject.reflections.push(currentReflection);
            } else if (reflectionWeek === lastWeek) {
                lastWeeksObject.reflections.push(currentReflection);
            }
        }
    };

    var getMonthlyData = function(reflections) {
        thisMonthsObject.reflections = [];
        lastMonthsObject.reflections = [];
        for (var i = 0; i < reflections.length; i++) {
            var currentReflection = reflections[i];
            var reflectionMonth = moment(currentReflection.reflectionDate).month();
            if (reflectionMonth === thisMonth) {
                thisMonthsObject.reflections.push(currentReflection);
            } else if (reflectionMonth === lastMonth) {
                lastMonthsObject.reflections.push(currentReflection);
            }
        }
    };


    //builds sessionObject
    function getSessionObject(location) {
        $http.get('reflection/session/')
            .then(function(response) {
                sessionObject.streak = response.data.streakCount;
                sessionObject.allReflections = response.data.allReflectionsNewToOld;
                sessionObject.reflectionCompleted = response.data.reflectionCompleted;
                if (sessionObject.reflectionCompleted === true) {
                    sessionObject.todaysReflectObject = response.data.todaysReflection;
                    sessionObject.currentDailyReflection = response.data.todaysReflection;
                } else {
                    sessionObject.todaysReflectObject = {};
                }
                if (response.data.yesterdaysGoal === "" || response.data.yesterdaysGoal == "No goal set yesterday") {
                    sessionObject.yesterdaysGoal = false;
                } else {
                    sessionObject.yesterdaysGoal = response.data.yesterdaysGoal;
                }
                sessionObject.takingMeds = response.data.medication;
                getWeeklyData(sessionObject.allReflections);
                getMonthlyData(sessionObject.allReflections);
                buildGraphs(location, graphsObject);
            });

    } //ends getSessionObject

    function buildGraphs(location, graphsObject) {
        if (location === 'home') {
            streakGraph(sessionObject);
        }
        if (location === 'weekly') {
            weeklyGraphs(thisWeeksObject);
        }
        switch (location) {
            case "/weekly-graphs":
                weeklyGraphs(graphsObject.thisWeeksObject);
                break;
            case "/last-week":
                weeklyGraphs(graphsObject.lastWeeksObject);
                break;
            case "/this-month":
                weeklyGraphs(graphsObject.thisMonthsObject);
                break;
            case "/last-month":
                weeklyGraphs(graphsObject.lastMonthsObject);
                break;
        } //ends swith
    }

    function streakGraph(sessionObject) {
        var streakGoal = 30;
        var streak = sessionObject.streak;

        //if streak is over 30 days, reset so it still increments
        if (streak > 30) {
            streak = streak % 30;
        }

        var goal = streakGoal - streak;

        var ctx3 = document.getElementById("streakDonughtChart");
        var streakDonughtChart = new Chart(ctx3, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [streak, goal],
                    backgroundColor: ['#813172', '#bfbfbf'],
                }],
                labels: ['Streak', 'Goal']
            },
            options: {
                legend: {
                    display: false
                },
            }
        });
    } //ends streakGraph

    function weeklyGraphs(timeframe) {
        var feelingNames = [];
        var exerciseAmount = [];
        var foodAmount = [];
        var sleepAmount = [];
        var overallAmount = [];

        var singleFeelings = [];
        var feelingsCount = [],
            prev;
        var countOfFeelings = {},
            sortByCount, topFiveFeelings;
        var dates = [];

        var reflections = timeframe.reflections;

        //LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
        for (var i = 0; i < reflections.length; i++) {
            var feelings = reflections[i].feelings;
            for (var x = 0; x < feelings.length; x++) {
                if (feelings[x].value === true) {
                    var allFeelings = feelings[x].name;
                    feelingNames.push(allFeelings);
                }
            }

            var exercise = reflections[i].exercise;
            exerciseAmount.push(exercise);

            var food = reflections[i].food;
            foodAmount.push(food);

            var sleep = reflections[i].sleep;
            sleepAmount.push(sleep);

            var overall = reflections[i].overallfeeling;
            overallAmount.push(overall);
        }

        //count occurence of each feeling and save in new object
        function countFeelings(array) {
            for (var i = 0; i < array.length; ++i) {
                if (!countOfFeelings[array[i]])
                    countOfFeelings[array[i]] = 0;
                ++countOfFeelings[array[i]];
            }
            // //sorts values from largest to smallest count
            sortByCount = Object.keys(countOfFeelings).map(function(key) {
                return {
                    key: key,
                    value: this[key]
                };
            }, countOfFeelings);

            sortByCount.sort(function(p1, p2) {
                return p2.value - p1.value;
            });

            topFiveFeelings = sortByCount.slice(0, 5);

            //push feeling names into one array and feeling count into another array - will use for chart
            topFiveFeelings.forEach(function(item) {
                singleFeelings.push(item.key);
                feelingsCount.push(item.value);
            });
        }
        countFeelings(feelingNames);


        //FORMAT TIMESTAMP TO JUST DAY OF WEEK
        function formatTimestamp() {
            //order from last to most recent refleciton
            reflections.reverse();
            for (var z = 0; z < reflections.length; z++) {
                var date = reflections[z].reflectionDate;
                // date = moment(date).format('L');
                date = moment(date).format('dd');
                dates.push(date);
            }
        }
        formatTimestamp();

        //chart for top five feelings
        var ctx1 = document.getElementById("feelingsChart");
        var areaChart = new Chart(ctx1, {
            type: 'polarArea',
            data: {
                datasets: [{
                    data: feelingsCount,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.71)",
                        "rgba(75, 193, 193, 0.71)",
                        "rgba(255, 206, 85, 0.71)",
                        "rgba(231, 233, 237, 0.71)",
                        "rgba(54, 162, 235, 0.71)"
                    ],
                    label: 'My dataset'
                }],
                labels: singleFeelings
            },
            options: {
                scale: {
                    // ticks: {
                    //     stepSize: 1
                    // }
                }
            }
        }); //end polar area chart


        //line chart for food, sleep, exercise
        var ctx2 = document.getElementById("overallChart");
        var overallChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                        label: "Exercise",
                        fill: false,
                        borderColor: "rgba(215, 141, 141,1)",
                        pointBackgroundColor: "rgba(215, 141, 141,1)",
                        pointBorderColor: "rgba(215,141,141,1)",
                        backgroundColor: "rgba(215,141,141,1)",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointRadius: 4,
                        data: exerciseAmount
                    },
                    {
                        label: 'Food',
                        fill: false,
                        borderColor: "rgba(151,187,205,1)",
                        pointBackgroundColor: "rgba(151,187,205,1)",
                        pointBorderColor: "rgba(151,187,205,1)",
                        backgroundColor: "rgba(151,187,205,1)",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointRadius: 4,
                        data: foodAmount
                    },
                    {
                        label: 'Sleep',
                        fill: false,
                        borderColor: "rgba(178, 221, 158, 1)",
                        pointBackgroundColor: "rgba(178, 221, 158, 1)",
                        pointBorderColor: "rgba(178,221,158,1)",
                        backgroundColor: "rgba(178,221,158,1)",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointRadius: 4,
                        data: sleepAmount
                    },
                    {
                        label: 'Overall Feelings',
                        fill: false,
                        borderColor: "rgba(166, 117, 215, 1)",
                        pointBackgroundColor: "rgba(166, 117, 215, 1)",
                        pointBorderColor: "rgba(166, 117, 215, 1)",
                        backgroundColor: "rgba(166, 117, 215, 1)",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointRadius: 4,
                        data: overallAmount
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 5,
                            min: 0,
                            stepSize: 1
                        }
                    }]
                }
            }
        }); //end line chart

    } //ends weeklyGraphs

    //builds reflectionObject
    function getReflectionObject(reflectionObject) {
        //creates feelings array
        var listOfFeelings = ['angry', 'anxious', 'depressed', 'distant', 'discerning',
            'discouraged', 'excited', 'frustrated', 'grateful', 'guilty', 'happy', 'hopeful',
            'hostile', 'insignificant', 'jealous', 'loving', 'motivated', 'numb', 'optimistic',
            'overwhelmed', 'peaceful', 'proud', 'sad', 'safe', 'thoughtful', 'valuable'
        ];
        var feelingsArray = buildArray(listOfFeelings);

        //creates stressors array
        var listOfStressors = ['children', 'employment', 'family', 'finances', 'friends',
            'housing', 'legal issues', 'no me time', 'partner', 'physical pain', 'school', 'transportation'
        ];
        var stressorsArray = buildArray(listOfStressors);

        // assigns key value pairs
        reflectionObject.feelings = feelingsArray;
        reflectionObject.overallfeeling = 3;
        reflectionObject.feelingsWhy = '';
        reflectionObject.drugAlcoholIntake = false;
        reflectionObject.medication = false;
        reflectionObject.sleep = 3;
        reflectionObject.dream = false;
        reflectionObject.whatDream = '';
        reflectionObject.exercise = 3;
        reflectionObject.food = 3;
        reflectionObject.spnsrMntrConnect = false;
        reflectionObject.groupMeet = false;
        reflectionObject.commntyService = false;
        reflectionObject.stressors = stressorsArray;
        reflectionObject.selfishDishonest = false;
        reflectionObject.howSelfshDishnt = '';
        reflectionObject.tomorrowGoal = '';
        reflectionObject.dailyGoal = false;
        reflectionObject.gratitude = '';
        reflectionObject.peerSupport = false;
        reflectionObject.counselor = false;
        reflectionObject.userObject = userObject;
        reflectionObject.formPosition = 1;

        //finishes building reflectionObject
    } //ends getReflectionObject

    function buildArray(list) {
        var newArray = [];
        for (var i = 0; i < list.length; i++) {
            var newObject = {};
            newObject.name = list[i];
            newObject.value = false;
            newArray.push(newObject);
        } //ends loop
        return newArray;
    } //ends buildArray


    //launchReflection
    function launchReflection() {
        $location.path('/reflection-form/reflect-1');
    }

    //reflection From functions
    function reflectionFormNextButton(sessionObject, reflectionObject) {
        var medsForm = 3; //number of the form which asks about medication
        var takesMeds = sessionObject.takingMeds;

        if (reflectionObject.formPosition === (medsForm - 1) && takesMeds === false) {
            reflectionObject.formPosition += 1; //skips past meds form
        }
        //post to database if it is the fist reflection form view
        if (sessionObject.reflectionCompleted === false) {
            postToReflectionForm(reflectionObject);
        }
        //put to database if it is any subsequent reflection form views
        else {
            //updates today's reflectionObject
            updateReflectionForm(reflectionObject);
        }
    } //ends reflectionFormNextButton


    function reflectionFormPrevButton(sessionObject, reflectionObject) {
        //moves on to the next question
        var medsForm = 3; //number of the form which asks about medication
        var takesMeds = sessionObject.takingMeds;

        if (reflectionObject.formPosition === (medsForm + 1) && takesMeds === false) {
            reflectionObject.formPosition -= 1; //skips past meds form
        }
        reflectionObject.formPosition -= 1;

        $location.path('/reflection-form/reflect-' + reflectionObject.formPosition);

    } //ends reflectionFormPrevButton

    function postToReflectionForm(reflectionObject) {
        $http.post('/reflection', reflectionObject).then(function(response) {
            reflectionObject._id = response.data._id;
            sessionObject.reflectionCompleted = true;
            advanceReflectionForm(reflectionObject);
        });
    } //ends postToReflectionForm

    function updateReflectionForm(reflectionObject) {
        $http.put('/reflection', reflectionObject).then(function(response) {
            advanceReflectionForm(reflectionObject);
        });
    } //ends updateReflectionForm

    function advanceReflectionForm(reflectionObject) {
        //moves on to the next question
        reflectionObject.formPosition += 1;
        $location.path('/reflection-form/reflect-' + reflectionObject.formPosition);
    } //ends advanceReflectionForm

    function returnHomeButton(sessionObject, reflectionObject) {
        $location.path('/home');
    }

    //return out of UserService Factory
    return {
        user: user,
        userObject: userObject,
        reflectionObject: reflectionObject,
        sessionObject: sessionObject,
        registration: registration,
        getuser: getuser,
        logout: logout,
        registerUser: registerUser,
        userDemographics: userDemographics,
        refreshSessionObject: refreshSessionObject,
        launchReflection: launchReflection,
        reflectionFormNextButton: reflectionFormNextButton,
        reflectionFormPrevButton: reflectionFormPrevButton,
        returnHomeButton: returnHomeButton,
        displayThisWeek: displayThisWeek,
        displayLastWeek: displayLastWeek,
        displayThisMonth: displayThisMonth,
        displayLastMonth: displayLastMonth
    };
}]);
