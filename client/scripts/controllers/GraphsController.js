myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    $scope.location = $location.path();
    UserService.refreshSessionObject($scope.location);

    $scope.sessionObject = UserService.sessionObject;

    $scope.displayThisWeek = UserService.displayThisWeek;
    $scope.displayLastWeek = UserService.displayLastWeek;
    $scope.displayThisMonth = UserService.displayThisMonth;
    $scope.displayLastMonth = UserService.displayLastMonth;

}]);