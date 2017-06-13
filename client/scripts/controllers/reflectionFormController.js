myApp.controller('ReflectionFormController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {

    //toggles feeling
    function toggleFeeling(feeling) {
        feeling.value = !feeling.value;
    }

    //from factory objects
    $scope.userObject = UserService.userObject;
    $scope.sessionObject = UserService.sessionObject;
    $scope.reflectionObject = UserService.reflectionObject;

    //from factory functions
    $scope.reflectionFormPrevButton = UserService.reflectionFormPrevButton;
    $scope.reflectionFormNextButton = UserService.reflectionFormNextButton;
    $scope.returnHomeButton = UserService.returnHomeButton;

    //from controller
    $scope.toggleFeeling = toggleFeeling;

}]);