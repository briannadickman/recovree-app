myApp.factory('AdminService', ['$http', '$location', function($http, $location){

  var location = "admin";

  var adminObject = {
    memberCount : 0,
    countByDay : []
  };


  function getReflections() {
      getCSVforReflections();
  }

  function getRegistrationInfo() {
      getCSVforRegistration();
  }

  function buildGraphs() {
    buildAdminGraphs();
  }

  function getCSVforReflections(){
    $http.get('/csvExport/reflections').then(function(response){
      window.open('/csvExport/reflections');
    });
  }

  function getCSVforRegistration(){
    $http.get('/csvExport/registration').then(function(response){
      window.open('/csvExport/registration');
    });
  }

  function countMembers(){
    $http.get('/register/memberCount').then(function(response){
      adminObject.memberCount = response.data.length;
      console.log('memberCount: ', adminObject.memberCount);
    });
  }

  function countReflectionsByDay(){
    $http.get('reflection/countByDay').then(function(response){
      adminObject.countByDay = response.data;
      console.log('count by day: ', adminObject.countByDay);
    });
  }

  function buildAdminGraphs() {
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
      }
    });
  } //end build graphs function


return {
  countMembers : countMembers,
  countReflectionsByDay : countReflectionsByDay,
  adminObject : adminObject,

  getReflections: getReflections,
  getRegistrationInfo: getRegistrationInfo,
  getCSVforReflections : getCSVforReflections,
  getCSVforRegistration : getCSVforRegistration,
  buildAdminGraphs: buildAdminGraphs



};

}]);
