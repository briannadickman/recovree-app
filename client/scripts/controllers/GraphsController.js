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
  var feelingsCount = [], prev;
  var countOfFeelings = {}, sortByCount, topFiveFeelings;

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


//FORMAT DATES FOR GRAPH DATA
for (var z= 0; z < reflections.length; z++) {
  var date = reflections[z].reflectionDate;
  date = moment(date).format('dddd');
  console.log(date);
}


//chart for top five feelings
  var ctx1 = document.getElementById("feelingsChart");
  var areaChart = new Chart(ctx1, {
    type: 'polarArea',
    data: {
      datasets: [{
        data: feelingsCount,
        backgroundColor: [ //show only top 5 most occuring feelings
          "#FF6384",
          "#4BC0C0",
          "#FFCE56",
          "#E7E9ED",
          "#36A2EB"
        ],
        label: 'My dataset' // for legend
      }],
      labels: singleFeelings
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
