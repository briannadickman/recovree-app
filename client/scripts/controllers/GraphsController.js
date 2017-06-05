myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');
  // var location = 'weekly';
  // UserService.refreshSessionObject(location);
  $scope.location = $location.path();
  console.log("$scope.location", $scope.location);
  UserService.refreshSessionObject($scope.location);
  
  $scope.sessionObject = UserService.sessionObject;

  $scope.displayThisWeek = UserService.displayThisWeek;
  $scope.displayLastWeek = UserService.displayLastWeek;
  $scope.displayThisMonth = UserService.displayThisMonth;
  $scope.displayLastMonth = UserService.displayLastMonth;

}]);
