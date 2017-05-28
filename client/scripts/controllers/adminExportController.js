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


  //replace with actual dates
  var days = ['5/21', '5/22', '5/23', '5/24', '5/25', '5/26', '5/27'];
  //replace with actual count of daily participants
  var reflectionCount = [12, 13, 18, 12, 10, 8, 16];

  var ctx = document.getElementById("dailyParticipantsChart");
  var dailyParticipantsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Daily Participants',
        fill: false,
        backgroundColor: 'rgba(129, 49, 114, 0.76)',
        data: reflectionCount
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
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      }
    }
  });

}]);
