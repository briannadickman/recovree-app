myApp.factory('UserService', ['$http', '$location', function($http, $location) {
  console.log('User Service Loaded');

  //variables
  var user = {};
  var userObject = {};
  var registration = {};
  var sessionObject = {};
  var reflectionObject = {};
  var dailyReflectObject = {
    data: ''
  };

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
      console.log('logged out');
      $location.path("/login");
    });
  } //ends logout

  function registerUser(user, registration) {
    if (user.username === '' || user.password === '') {} else {
      console.log('sending to server...', user);
      $http.post('/register', user).then(function(response) {
          console.log('success saving member');
          console.log('response', response);
          console.log('response.data.memberID', response.data.memberID);
          emptyUser(user);
          userDemographics(registration);
        },
        function(response) {
          console.log('error');
          // $scope.message = "Please try again.";
        });
    }
  } //ends registerUser

  function emptyUser(user) {
    user.username = '';
    user.password = '';
  } //emptyUser


  function userDemographics(registration) {
    console.log('sending demographics', registration);
    $http.post('/register/registration', registration).then(function(response) {
      console.log('success saving demographic info', response);
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
    registration.termsAgreement = false;
    registration.memberID = '';
  } //ends emptyDemographics

  //refreshes session object on each navigation page load
  function refreshSessionObject(location) {
    getSessionObject(location); //took out argument, build in backend and erase
    getReflectionObject(reflectionObject);
  } //ends refreshSessionObject

  //builds sessionObject
  function getSessionObject(location) {
    console.log('what is going on', location);
    $http.get('reflection/session/')
      .then(function(response) {
        console.log('response in getSessionObject:', response);
        sessionObject.streak = response.data.streakCount;
        sessionObject.allReflections = response.data.allReflectionsNewToOld;
        sessionObject.reflectionCompleted = response.data.reflectionCompleted;
        if (sessionObject.reflectionCompleted === true) {
          sessionObject.todaysReflectObject = response.data.todaysReflection;
        } else {
          sessionObject.todaysReflectObject = {};
        }
        if (response.data.yesterdaysGoal === "" || response.data.yesterdaysGoal == "No goal set yesterday") {
          sessionObject.yesterdaysGoal = false;
        } else {
          sessionObject.yesterdaysGoal = response.data.yesterdaysGoal;
        }
        sessionObject.takingMeds = response.data.medication;
        console.log("session Object at end of getSessionObject", sessionObject);
        buildGraphs(location);
      });
  } //ends getSessionObject

  function buildGraphs(location) {
    console.log("inside buildGraphs", sessionObject, location);
    if (location === 'home') {
      streakGraph(sessionObject);
    }
    if (location === 'weekly') {
      weeklyGraphs(sessionObject);
    }
  }

  function streakGraph(sessionObject) {
    var streakGoal = 30;
    var streak = sessionObject.streak;
    var goal = streakGoal - streak;
    // console.log("streak",streak);

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
  
  function weeklyGraphs(location){

      $scope.weeks = weeks;

      var allReflectionsObject = $scope.sessionObject.allReflections;
      console.log('ALL REFLECTIONS', allReflectionsObject);

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
      var week = [];
      var weekObject = {
        week: week,
        weekRange: ''
      };
      // var weeks = weekObject;
      var weeks = [];

    //determines what the current week in time is
    var currentWeek = moment().week();

    //Selecting weekly summary
    function weeklySummary(allReflectionsObject) {
      // var weekObjectWeek = weekObject.week;
      // weekObjectWeek = [];

      // take all reflections objects and loop through reflecton object to grab current week
      for (var q = 0; q < allReflectionsObject.length; q++) {
        var reflection = allReflectionsObject[q];
        var date = reflection.reflectionDate;
        var reflectionsWeek = moment(date).week(); //determines what the week of a specific date is

          if (reflectionsWeek == currentWeek) {
            week.push(reflection);
          } else { // when changing to a new week
            console.log('WEEK ' + currentWeek + ' IS: ', week);
            week = weekObject.week;
            console.log('WEEK OBJECT ' + currentWeek + ' IS: ', weekObject);
            // weeks.push(weekObject);
            // console.log('WEEKS ARE: ', weeks);
            formatWeeklyDropdown(weekObject);
            currentWeek = reflectionsWeek;
            week = [];
            // console.log('empty week: ', week);
            weekObject.week = [];
            // console.log('empty weekObject.week: ', weekObject.week);
            // weekObject.weekRange = '';
            // console.log('empty weekObject.weekRange: ', weekObject.weekRange);
            week.push(reflection);
          }
          //push final weekObject into weeks
          // console.log(week.length);
          // if (week.length < 7) {
          //   console.log('q is: ', q);
          //   // formatWeeklyDropdown(week);
          //   // console.log('WEEKS ARE: ', weeks);
          //   console.log('week for ' + currentWeek + ' is', week);
          //   weeks.push(week);
          //
          // }
        }
        //for drop-down: get dates for that week
        // ng-change

        //return only reflection objects that fit into that week
        arrayForSummaryData(allReflectionsObject);
        formatTimestamp(allReflectionsObject);
      }

      //pass in actual reflection object
      weeklySummary(allReflectionsObject);

      // FORMAT TIMESTAMP TO MONTH AND DAY FOR WEEKLY RANGE DROP DOWN
        function formatWeeklyDropdown(weekObject) {
          // console.log('WEEK OBJECT in dropdown IS ', weekObject);
          week = weekObject.week;
          for (var z = 0; z < week.length; z++) {
            var date = week[z].reflectionDate;
            var weekRange = moment(date).weekday(0).format('l') + ' to ' + moment(date).weekday(6).format('l');
            // console.log('weekRange is: ', weekRange);
            weekObject.weekRange = weekRange;
            // console.log('WeekObject is: ', weekObject);
            weeks.push(weekObject);
            console.log('ALL WEEKS ARE: ', weeks);
          }
        }


      //LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
      function arrayForSummaryData(){
      for (var i = 0; i < allReflectionsObject.length; i++) {
        var feelings = allReflectionsObject[i].feelings;
        for (var x = 0; x < feelings.length; x++) {
          //if value fo feeling is true, then store feeling name into feelingNames
          if (feelings[x].value === true) {
            var allFeelings = feelings[x].name;
            feelingNames.push(allFeelings);
          }
        }

        var exercise = allReflectionsObject[i].exercise;
        exerciseAmount.push(exercise);

        var food = allReflectionsObject[i].food;
        foodAmount.push(food);

        var sleep = allReflectionsObject[i].sleep;
        sleepAmount.push(sleep);

        var overall = allReflectionsObject[i].overallfeeling;
        overallAmount.push(overall);
      }
    console.log('OVERALL FEELING DATA', overallAmount);
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
        console.log('TOP FIVE FEELINGS', topFiveFeelings);

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
        allReflectionsObject.reverse();
        for (var z = 0; z < allReflectionsObject.length; z++) {
          var date = allReflectionsObject[z].reflectionDate;
          // date = moment(date).format('L');
          date = moment(date).format('dddd');
          // console.log(date);
          //push dates as dddd into array - will use for charts
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
      var ctx2 = document.getElementById("lineChart");
      var lineChart = new Chart(ctx2, {
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
              borderColor: "rgba(246, 239, 175, 1)",
              pointBackgroundColor: "rgba(246, 239, 175, 1)",
              pointBorderColor: "rgba(246, 239, 175, 1)",
              backgroundColor: "rgba(246, 239, 175, 1)",
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


  }//ends weeklyGraphs

  // function weeklyGraphs(location){
  //   var feelingNames = [];
  //   var exerciseAmount = [];
  //   var foodAmount = [];
  //   var sleepAmount = [];
  //   var overallAmount = [];
  //
  //   var singleFeelings = [];
  //   var feelingsCount = [],
  //     prev;
  //   var countOfFeelings = {},
  //     sortByCount, topFiveFeelings;
  //   var dates = [];
  //
  //
  //   // function weeklyGraphs(sessionObject) {
  //     var reflections = sessionObject.allReflections;
  //     // console.log('ALL REFLECTIONS', reflections);
  //
  //     //LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
  //     for (var i = 0; i < reflections.length; i++) {
  //       var feelings = reflections[i].feelings;
  //       for (var x = 0; x < feelings.length; x++) {
  //         if (feelings[x].value === true) {
  //           var allFeelings = feelings[x].name;
  //           feelingNames.push(allFeelings);
  //         }
  //       }
  //
  //       var exercise = reflections[i].exercise;
  //       exerciseAmount.push(exercise);
  //
  //       var food = reflections[i].food;
  //       foodAmount.push(food);
  //
  //       var sleep = reflections[i].sleep;
  //       sleepAmount.push(sleep);
  //
  //       var overall = reflections[i].overallfeeling;
  //       overallAmount.push(overall);
  //       // console.log('OVERALL FEELING DATA', overallAmount);
  //     }
  //
  //
  //     //count occurence of each feeling and save in new object
  //     function countFeelings(array) {
  //       for (var i = 0; i < array.length; ++i) {
  //         if (!countOfFeelings[array[i]])
  //           countOfFeelings[array[i]] = 0;
  //         ++countOfFeelings[array[i]];
  //       }
  //       // //sorts values from largest to smallest count
  //       sortByCount = Object.keys(countOfFeelings).map(function(key) {
  //         return {
  //           key: key,
  //           value: this[key]
  //         };
  //       }, countOfFeelings);
  //
  //       sortByCount.sort(function(p1, p2) {
  //         return p2.value - p1.value;
  //       });
  //
  //       topFiveFeelings = sortByCount.slice(0, 5);
  //
  //       //push feeling names into one array and feeling count into another array - will use for chart
  //       topFiveFeelings.forEach(function(item) {
  //         singleFeelings.push(item.key);
  //         feelingsCount.push(item.value);
  //       });
  //     }
  //     countFeelings(feelingNames);
  //
  //
  //     //FORMAT TIMESTAMP TO JUST DAY OF WEEK
  //     function formatTimestamp() {
  //       //order from last to most recent refleciton
  //       reflections.reverse();
  //       for (var z = 0; z < reflections.length; z++) {
  //         var date = reflections[z].reflectionDate;
  //         // date = moment(date).format('L');
  //         date = moment(date).format('dddd');
  //         dates.push(date);
  //       }
  //     }
  //     formatTimestamp();
  //
  //
  //
  //     //chart for top five feelings
  //     var ctx1 = document.getElementById("feelingsChart");
  //     var areaChart = new Chart(ctx1, {
  //       type: 'polarArea',
  //       data: {
  //         datasets: [{
  //           data: feelingsCount,
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.71)",
  //             "rgba(75, 193, 193, 0.71)",
  //             "rgba(255, 206, 85, 0.71)",
  //             "rgba(231, 233, 237, 0.71)",
  //             "rgba(54, 162, 235, 0.71)"
  //           ],
  //           label: 'My dataset'
  //         }],
  //         labels: singleFeelings
  //       },
  //       options: {
  //         scale: {
  //           // ticks: {
  //           //     stepSize: 1
  //           // }
  //         }
  //       }
  //     }); //end polar area chart
  //
  //
  //     //line chart for food, sleep, exercise
  //     var ctx2 = document.getElementById("overallChart");
  //     var overallChart = new Chart(ctx2, {
  //       type: 'line',
  //       data: {
  //         labels: dates,
  //         datasets: [{
  //             label: "Exercise",
  //             fill: false,
  //             borderColor: "rgba(215, 141, 141,1)",
  //             pointBackgroundColor: "rgba(215, 141, 141,1)",
  //             pointBorderColor: "rgba(215,141,141,1)",
  //             backgroundColor: "rgba(215,141,141,1)",
  //             pointBorderWidth: 1,
  //             pointHoverRadius: 5,
  //             pointRadius: 4,
  //             data: exerciseAmount
  //           },
  //           {
  //             label: 'Food',
  //             fill: false,
  //             borderColor: "rgba(151,187,205,1)",
  //             pointBackgroundColor: "rgba(151,187,205,1)",
  //             pointBorderColor: "rgba(151,187,205,1)",
  //             backgroundColor: "rgba(151,187,205,1)",
  //             pointBorderWidth: 1,
  //             pointHoverRadius: 5,
  //             pointRadius: 4,
  //             data: foodAmount
  //           },
  //           {
  //             label: 'Sleep',
  //             fill: false,
  //             borderColor: "rgba(178, 221, 158, 1)",
  //             pointBackgroundColor: "rgba(178, 221, 158, 1)",
  //             pointBorderColor: "rgba(178,221,158,1)",
  //             backgroundColor: "rgba(178,221,158,1)",
  //             pointBorderWidth: 1,
  //             pointHoverRadius: 5,
  //             pointRadius: 4,
  //             data: sleepAmount
  //           },
  //           {
  //             label: 'Overall Feelings',
  //             fill: false,
  //             borderColor: "rgba(246, 239, 175, 1)",
  //             pointBackgroundColor: "rgba(246, 239, 175, 1)",
  //             pointBorderColor: "rgba(246, 239, 175, 1)",
  //             backgroundColor: "rgba(246, 239, 175, 1)",
  //             pointBorderWidth: 1,
  //             pointHoverRadius: 5,
  //             pointRadius: 4,
  //             data: overallAmount
  //           }
  //         ]
  //       },
  //       options: {
  //         scales: {
  //           yAxes: [{
  //             ticks: {
  //               beginAtZero: true,
  //               max: 5,
  //               min: 0,
  //               stepSize: 1
  //             }
  //           }]
  //         }
  //       }
  //     }); //end line chart
  //
  // }//ends weeklyGraphs



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

    //gets date information
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    // assigns key value pairs
    reflectionObject.feelings = feelingsArray;
    reflectionObject.overallfeeling = 1;
    reflectionObject.feelingsWhy = '';
    reflectionObject.drugAlcoholIntake = false;
    reflectionObject.medication = false;
    reflectionObject.sleep = 1;
    reflectionObject.dream = false;
    reflectionObject.whatDream = '';
    reflectionObject.exercise = 1;
    reflectionObject.food = 1;
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
    reflectionObject.reflectionDate = date;
    reflectionObject.reflectionTime = time;
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
    if (reflectionObject.formPosition === 1) {
      console.log('Before POST', reflectionObject);
      postToReflectionForm(reflectionObject);
    }
    //put to database if it is any subsequent reflection form views
    else {
      //updates today's reflectionObject
      updateReflectionForm(reflectionObject);
    }
  } //ends reflectionFormNextButton

  function reflectionFormPrevButton(sessionObject, reflectionObject) {
    console.log("you tried to go back, butchyoucantyet");
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
      console.log('reflectionObject._id: ', reflectionObject._id);
      advanceReflectionForm(reflectionObject);
    });
  } //ends postToReflectionForm

  function updateReflectionForm(reflectionObject) {
    $http.put('/reflection', reflectionObject).then(function(response) {
      console.log('updateReflectionForm response: ', response.data);
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
  };
}]);
