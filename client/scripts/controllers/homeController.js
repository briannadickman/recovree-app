myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');
  var userObject = UserService.userObject;
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject();

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
         backgroundColor: ['#813172','#bfbfbf'],
      }],
      // labels: ['Goal','Streak']
    },
    // options:
  });

}]);
