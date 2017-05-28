myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');
  var location = 'weekly';
  UserService.refreshSessionObject(location);
  $scope.sessionObject = UserService.sessionObject;

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


  // function weeklyGraphs(sessionObject) {
    var reflections = $scope.sessionObject.allReflections;
    // console.log('ALL REFLECTIONS', reflections);

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
      // console.log('OVERALL FEELING DATA', overallAmount);
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
        date = moment(date).format('dddd');
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





}]);
