myApp.controller('NavController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('NavController sourced!');
  $scope.user = UserService.user;
  $scope.$location = $location;
  $scope.logout = logout;
  var routeHeaderMenu = UserService.routeHeaderMenu;
  var route = '';

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
    route = 'gratitude';
    routeHeaderMenu(route);
  };

  $scope.goToResources = function(){
    console.log('Resources button clicked!');
    route = 'resources';
    routeHeaderMenu(route);
  };


}]);
