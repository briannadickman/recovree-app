myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');
  $scope.sessionObject = UserService.sessionObject;

  $scope.launchReflection = function(){
    $location.path('/reflection-form/reflect-1');
  };
}]);
