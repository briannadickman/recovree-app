myApp.controller('DayDetailController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('DayDetailController sourced!');

$scope.dailyReflectObject = UserService.dailyReflectObject;
UserService.getReflections();

// $scope.day_index = 0;
console.log('dailyReflectObject is: ', $scope.dailyReflectObject);
//
// $scope.next = function() {
//     if ($scope.day_index >= $scope.dailyReflectObject.data.length - 1) {
//         $scope.day_index = 0;
//     }
//     else {
//         $scope.day_index ++;
//     }
// };

}]);
