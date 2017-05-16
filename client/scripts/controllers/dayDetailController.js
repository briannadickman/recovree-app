myApp.controller('DayDetailController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('DayDetailController sourced!');

$scope.dailyReflectObject = UserService.dailyReflectObject;
UserService.getReflections();
console.log(UserService.dailyReflectObject);


}]);
