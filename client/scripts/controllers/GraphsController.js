myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');
  var location = 'weekly';
  UserService.refreshSessionObject(location);
  $scope.sessionObject = UserService.sessionObject;
}]);
