myApp.controller('DayDetailController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('DayDetailController sourced!');

var refreshSessionObject = UserService.refreshSessionObject;
refreshSessionObject();
// $scope.dailyReflectObject = UserService.dailyReflectObject;
$scope.sessionObject = UserService.sessionObject;
// console.log("$scope.sessionObject",$scope.sessionObject.todaysReflectObject);
// var getReflections = UserService.getReflections;
// getReflections();


}]);
