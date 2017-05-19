myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');

  var userObject = UserService.userObject;
  UserService.refreshSessionObject();


  //all the REFLECTIONS data
  $scope.sessionObject = UserService.sessionObject;
  var reflections = $scope.sessionObject.allReflections;
  console.log('ALL REFLECTIONS', reflections);


  //LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
  for (var i = 0; i < reflections.length; i++) {
    // console.log('EACH REFLECTIONS IN DB',reflections[i]);

    var feelings = reflections[i].feelings;
    // console.log('FEELINGS ARRAY',feelings);

    var exercise = reflections[i].exercise;
    console.log('EXERCISE', exercise);

    var food = reflections[i].food;
    console.log('FOOD', food);

    var sleep = reflections[i].sleep;
    console.log('SLEEP', sleep);

  }



  //line chart for food, sleep, exercise
  var ctx2 = document.getElementById("lineChart");
  var lineChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['5/14', '5/15', '5/16', '5/17', '5/18', '5/19'], //replace with array, that has dates of actual reflections
      datasets: [{
          label: "Exercise",
          fill: false,
          pointBackgroundColor: "rgba(215, 141, 141,1)",
          pointBorderColor: "rgba(215,141,141,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 1,
          data: [2, 1, 5, 4, 2, 3]
        },
        {
          label: 'Food',
          fill: false,
          pointBackgroundColor: "rgba(151,187,205,1)",
          pointBorderColor: "rgba(151,187,205,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 1,
          data: [0, 1, 1, 2, 3, 5]
        },
        {
          label: 'Sleep',
          fill: false,
          pointBackgroundColor: "rgba(178, 221, 158, 1)",
          pointBorderColor: "rgba(178,221,158,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 1,
          data: [0, 5, 1, 4, 3, 4]
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







  //example bar chart
  // var ctx1 = document.getElementById("myChart");
  // var myChart = new Chart(ctx1, {
  //   type: 'bar',
  //   data: {
  //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //     datasets: [{
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(255, 159, 64, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgba(255,99,132,1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)'
  //       ],
  //       borderWidth: 1
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero: true
  //         }
  //       }]
  //     }
  //   }
  // }); //end bar chart example








}]); //end of controller
