myApp.factory('AdminService', ['$http', '$location', function($http, $location){

  var location = "admin";

  var adminObject = {
    memberCount : 0,
    countByDay : []
  };

  var dailyCount = [];
  var dates = [];


  //getuser
  function getadmin() {
    $http.get('/user').then(function(response) {
      if (response.data.id && response.data.userType === 1) {
        console.log('login response: ', response.data);
        // user has a curret session on the server
        adminObject.userName = response.data.username;
        adminObject.id = response.data.id;
      } else {
        console.log('login response: ', response.data);
        // user has no session, bounce them back to the login page
        $location.path("/login");
      }
    });
  } //ends getuser

  function getReflections() {
      getCSVforReflections();
  }

  function getRegistrationInfo() {
      getCSVforRegistration();
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
      storeDaysAndCountInArray();
    });
  }

  function storeDaysAndCountInArray() {
      for (var i = 0; i < adminObject.countByDay.length; i++) {
        var reflectionDate = adminObject.countByDay[i].date;
        var reflectionCount = adminObject.countByDay[i].count;
        dates.push(reflectionDate);
        dailyCount.push(reflectionCount);
      }
      // console.log('DATES', dates);
      // console.log('COUNTS', dailyCount);
      buildAdminGraphs(dates, dailyCount);
  }

  function buildAdminGraphs(date, count) {
    var ctx = document.getElementById("dailyParticipantsChart");
    var dailyParticipantsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: date,
        datasets: [{
          label: 'Daily Participants',
          fill: false,
          backgroundColor: 'rgba(129, 49, 114, 0.76)',
          data: count
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              // max: 20,
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
  getadmin : getadmin,

  getReflections: getReflections,
  getRegistrationInfo: getRegistrationInfo,
  getCSVforReflections : getCSVforReflections,
  getCSVforRegistration : getCSVforRegistration,
  buildAdminGraphs: buildAdminGraphs



};

}]);
