myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');
  var userObject = UserService.userObject;

  console.log("userObject", userObject);
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject();
  $scope.sessionObject = UserService.sessionObject;
  console.log("sessionObject", $scope.sessionObject);
  console.log("sessionObject.allReflections", $scope.sessionObject.allReflections);

  $scope.launchReflection = function(){
    $location.path('/reflection-form/reflect-1');
  };
}]);
