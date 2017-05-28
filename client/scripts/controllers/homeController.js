myApp.controller('HomeController', ['$scope', '$http', '$location', '$q', 'UserService', function($scope, $http, $location, $q, UserService) {
  console.log('HomeController sourced!');
  var location = "home";

  var userObject = UserService.userObject;
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject(location);

  $scope.sessionObject = UserService.sessionObject;
  $scope.launchReflection = UserService.launchReflection;

}]);
