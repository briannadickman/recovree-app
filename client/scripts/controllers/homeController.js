myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');
  var userObject = UserService.userObject;

  console.log("userObject");
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject();
  $scope.sessionObject = UserService.sessionObject;
  console.log( 'HOME',$scope.sessionObject);

  $scope.launchReflection = function(){
    $location.path('/reflection-form/reflect-1');
  };
}]);
