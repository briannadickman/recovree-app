myApp.controller('NavController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('NavController sourced!');
  $scope.user = UserService.user;
  $scope.$location = $location;
  $scope.logout = logout;
  $scope.sessionObject = UserService.sessionObject;
  var reflections = $scope.sessionObject.allReflections;

  function logout(user){
    user.username = '';
    user.password = '';
    $location.path("/login");
  }

  $scope.goHome = goHome;
  function goHome(){
    $location.path('/home');
  }

  $scope.goToGratitude = function(){
    console.log('Gratitude button clicked!');
    $location.path('/gratitude');
    console.log(reflections);
  };

  $scope.goToResources = function(){
    console.log('Resources button clicked!');
    $location.path('/resources');
  };


}]);
