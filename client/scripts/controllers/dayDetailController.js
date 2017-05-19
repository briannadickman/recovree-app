myApp.controller('DayDetailController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('DayDetailController sourced!');

var onHome = UserService.onHome;
onHome();
$scope.sessionObject = UserService.sessionObject;



}]);
