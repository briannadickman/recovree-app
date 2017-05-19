myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');

var userObject = UserService.userObject;
UserService.refreshSessionObject();


//all the REFLECTIONS data
$scope.sessionObject = UserService.sessionObject;
var reflections = $scope.sessionObject.allReflections;
console.log('ALL REFLECTIONS',reflections);


//LOOP THROUGH THE REFLECTION ARRAY AND GET DATA FOR FEELINGS, SLEEP, EXERCISE, AND FOOD
for (var i = 0; i < reflections.length; i++) {
  // console.log('EACH REFLECTIONS IN DB',reflections[i]);

  var feelings = reflections[i].feelings;
  // console.log('FEELINGS ARRAY',feelings);

  var exercise = reflections[i].exercise;
  console.log('EXERCISE',exercise);

  var food = reflections[i].food;
  console.log('FOOD',food);

  var sleep = reflections[i].sleep;
  console.log('SLEEP',sleep);

}



  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });




}]);
