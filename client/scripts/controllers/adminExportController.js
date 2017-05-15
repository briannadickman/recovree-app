myApp.controller('AdminExportController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('AdminExportController sourced!');

  $scope.demographicExport = function(){
    console.log('demographicExport button clicked!');
    UserService.getRegistrationInfo();
  };

  $scope.reflectionExport = function(){
    console.log('reflectionExport button clicked!');
    UserService.getReflections();

  };

}]);
