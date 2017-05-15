myApp.controller('DayDetailController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('DayDetailController sourced!');

$scope.dailyReflectObject = UserService.dailyReflectObject;
UserService.getReflections();
console.log(UserService.dailyReflectObject);


// function getDailyReflection() {
//   console.log($scope.dailyReflectObject.data);
//   // var dailyReflect = $scope.dailyReflectObject.data;
//   // console.log('daily reflect is: ', dailyReflect);
//   // for(var i = 0; i < UserService.dailyReflectObject.data.length; i++){
//   //     console.log(UserService.dailyReflectObject.data[i]);
//   // }
//
// }
//
// getDailyReflection();

// if(date === this date) {
//   display this days reflection data
//  -must ng-repeat through array of feelings as well and only print if == true
// }

// for (var index of relatives.savedBios) {
//          if (index.birthday) {
//            index.birthday = moment(index.birthday).subtract(10, ‘days’).calendar();
//          }
//        }

}]);
