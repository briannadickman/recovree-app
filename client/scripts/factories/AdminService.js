myApp.factory('AdminService', ['$http', '$location', function($http, $location){

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



return {
  countMembers : countMembers,
  countReflectionsByDay : countReflectionsByDay,

  getReflections: getReflections,
  getRegistrationInfo: getRegistrationInfo,
  getCSVforReflections : getCSVforReflections,
  getCSVforRegistration : getCSVforRegistration




};

}]);
