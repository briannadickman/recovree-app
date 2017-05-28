myApp.controller('AdminExportController', ['$scope', '$http', '$location', 'AdminService', function($scope, $http, $location, AdminService) {
  console.log('AdminExportController sourced!');

  $scope.demographicExport = function() {
    console.log('demographicExport button clicked!');
    AdminService.getRegistrationInfo();
  };

  $scope.reflectionExport = function() {
    console.log('reflectionExport button clicked!');
    AdminService.getReflections();

  };

  AdminService.countMembers();
  AdminService.countReflectionsByDay();


}]); //end controller
