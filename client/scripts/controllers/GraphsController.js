myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');

  UserService.refreshSessionObject();

  //all the REFLECTIONS data
  $scope.sessionObject = UserService.sessionObject;
  var reflections = $scope.sessionObject.allReflections;
  // console.log('ALL REFLECTIONS', reflections);

  var feelingNames = [];
  var exerciseAmount = [];
  var foodAmount = [];
  var sleepAmount = [];
  var singleFeelings = [];
  var countOfFeelings = [], prev;

  //LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
  for (var i = 0; i < reflections.length; i++) {
    var feelings = reflections[i].feelings;
    for (var x = 0; x < feelings.length; x++) {
      //if value fo feeling is true, then store feeling name into feelingNames
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
  }

// console.log('Feelings', feelingNames );

//count occurence of each feeling and save in new Array
  function countFeelings(array) {
    array.sort();
    for ( var i = 0; i < array.length; i++ ) {
        if ( array[i] !== prev ) {
            singleFeelings.push(array[i]);
            countOfFeelings.push(1);
        } else {
            countOfFeelings[countOfFeelings.length-1]++;
        }
        prev = array[i];
    }
    return [singleFeelings, countOfFeelings];
}
console.log([singleFeelings, countOfFeelings]);
countFeelings(feelingNames);

// console.log('Exrcise Array', exerciseAmount );
// console.log('Food Array', foodAmount );
// console.log('Sleep Array', sleepAmount );



//chart for feelings
var ctx1 = document.getElementById("feelingsChart");
var areaChart = new Chart (ctx1, {
  type: 'polarArea',
  data: {
    datasets: [{
        data: [  //this should be the number of times eahc feeling has shown up for this weeks reflection
            3,
            7,
            2,
            4,
            5
        ],
        backgroundColor: [ //show only top 5 most occuring feelings
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
            "#E7E9ED",
            "#36A2EB"
        ],
        label: 'My dataset' // for legend
    }],
    labels: [  //should be names and correspond to 'data' that shows scale of each feeling
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
          data: exerciseAmount
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
          data: foodAmount
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
          data: sleepAmount
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
