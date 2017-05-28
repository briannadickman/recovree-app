myApp.controller('NavController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('NavController sourced!');
  $scope.user = UserService.user;
  $scope.$location = $location;
  $scope.logout = logout;
  function logout(user){
    user.username = '';
    user.password = '';
    $location.path("/login");
  }

  $scope.goHome = goHome;
  function goHome(){
    $location.path('/home');
  }

}]);
