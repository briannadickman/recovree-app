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

  // $scope.adminObject = AdminService.adminObject;
  // console.log('19', $scope.adminObject.memberCount);

  //replace with actual dates
  var days = ['5/16','5/17','5/18', '5/19', '5/20'];
  //replace with actual count of daily participants
  var reflectionCount = [8, 6, 10];

  var ctx4 = document.getElementById("dailyParticipantsChart");
  var dailyParticipantsChart = new Chart(ctx4, {
    type: 'line',
    data: {
      labels: days,
  //     datasets: [{
  //      fillColor: "rgba(220,220,220,0)",
  //      strokeColor: "rgba(220,180,0,1)",
  //      pointColor: "rgba(220,180,0,1)",
  //      data: [20, 30, 80, 20, 40, 10, 60]
  //  }, {
  //      fillColor: "rgba(151,187,205,0)",
  //      strokeColor: "rgba(151,187,205,1)",
  //      pointColor: "rgba(151,187,205,1)",
  //      data: [60, 10, 40, 30, 80, 30, 20]
  //  }]
      dataset: [{
        label: 'Participants',
        data: [4, 9, 12, 8, 5]
      }]
    },
    options: {
      scales: {
          yAxes: [{
              ticks: {
                  max: 20,
                  min: 0,
                  stepSize: 1
              }
          }]
      }
  }
  });

}]);
