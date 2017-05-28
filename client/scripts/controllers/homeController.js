myApp.controller('HomeController', ['$scope', '$http', '$location', '$q', 'UserService', function($scope, $http, $location, $q, UserService) {
  console.log('HomeController sourced!');
  var location = "home";

  var userObject = UserService.userObject;
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject(location);

  $scope.sessionObject = UserService.sessionObject;
  $scope.launchReflection = UserService.launchReflection;

  console.log('SESSION OBJ', $scope.sessionObject);

  //strek graph
  var streakGoal = 30;
  var streak = $scope.sessionObject.streak;
  var goal = streakGoal - streak;

  var ctx = document.getElementById("streakDonughtChart");
  var streakDonughtChart = new Chart(ctx, {
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
}]);
