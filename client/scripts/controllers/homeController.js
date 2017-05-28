myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');
  var userObject = UserService.userObject;
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject();

  $scope.sessionObject = UserService.sessionObject;
  $scope.launchReflection = UserService.launchReflection;

  console.log('SESSION OBJ', $scope.sessionObject);

  //strek graph
  var streak = $scope.sessionObject.streak;
  console.log('STREAK', streak);
  var goal = 30 - streak;
  console.log('GOAL LEFT: ', goal);
  var ctx3 = document.getElementById("streakDonughtChart");
  var streakDonughtChart = new Chart(ctx3, {
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
