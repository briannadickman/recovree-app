myApp.controller('NavController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('NavController sourced!');
  $scope.$location = $location;

}]);
