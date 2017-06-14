myApp.controller('AdminExportController', ['$scope', '$http', '$location', 'AdminService', function($scope, $http, $location, AdminService) {

    $scope.demographicExport = function() {
        AdminService.getRegistrationInfo();
    };

    $scope.reflectionExport = function() {
        AdminService.getReflections();
    };

    $scope.getAdminObject = AdminService.getAdminObject;
    $scope.getAdminObject();
    $scope.adminObject = AdminService.adminObject;
}]); //end controller