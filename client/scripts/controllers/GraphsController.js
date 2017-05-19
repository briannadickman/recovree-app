myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');

  var userObject = UserService.userObject;
  UserService.refreshSessionObject();

  //all the REFLECTIONS data
  $scope.sessionObject = UserService.sessionObject;
  var reflections = $scope.sessionObject.allReflections;
  console.log('ALL REFLECTIONS', reflections);

  var feelingsArray = [];
  var exerciseArray = [];
  var foodArray = [];
  var sleepArray = [];
  var count = 0;

  //LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
  for (var i = 0; i < reflections.length; i++) {
    var feelings = reflections[i].feelings;
    for (var x = 0; x < feelings.length; x++) {
      //if value fo feeling is true, then store feeling name into feelingsArray
      if (feelings[x].value === true) {
        var allFeelings = feelings[x].name;
        feelingsArray.push(allFeelings);
      }
    }

    var exercise = reflections[i].exercise;
    exerciseArray.push(exercise);

    var food = reflections[i].food;
    foodArray.push(food);

    var sleep = reflections[i].sleep;
    sleepArray.push(sleep);
  }
  console.log('Feeling Array', feelingsArray );


// console.log('Exrcise Array', exerciseArray );
// console.log('Food Array', foodArray );
// console.log('Sleep Array', sleepArray );



//chart for feelings
var ctx1 = document.getElementById("feelingsChart");
var areaChart = new Chart (ctx1, {
  type: 'polarArea',
  data: {
    datasets: [{
        data: [
            3,
            7,
            2,
            4,
            5
        ],
        backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
            "#E7E9ED",
            "#36A2EB"
        ],
        label: 'My dataset' // for legend
    }],
    labels: [
        "Sad",
        "Happy",
        "Dissapointed",
        "Optimistic",
        "Distant"
    ]

  },
  options: {
    scales: {

    }
  }

}); //end polar area chart


//line chart for food, sleep, exercise
  var ctx2 = document.getElementById("lineChart");
  var lineChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['5/14', '5/15', '5/16', '5/17', '5/18', '5/19'], //replace with array, that has dates of actual reflections
      datasets: [{
          label: "Exercise",
          fill: false,
          borderColor: "rgba(215, 141, 141,1)",
          pointBackgroundColor: "rgba(215, 141, 141,1)",
          pointBorderColor: "rgba(215,141,141,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 4,
          data: exerciseArray
        },
        {
          label: 'Food',
          fill: false,
          borderColor: "rgba(151,187,205,1)",
          pointBackgroundColor: "rgba(151,187,205,1)",
          pointBorderColor: "rgba(151,187,205,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 4,
          data: foodArray
        },
        {
          label: 'Sleep',
          fill: false,
          borderColor: "rgba(178, 221, 158, 1)",
          pointBackgroundColor: "rgba(178, 221, 158, 1)",
          pointBorderColor: "rgba(178,221,158,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 4,
          data: sleepArray
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







}]); //end of controller
