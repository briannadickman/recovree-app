myApp.factory('AdminService', ['$http', '$location', function($http, $location){


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




return {

  getReflections: getReflections,
  getRegistrationInfo: getRegistrationInfo,
  getCSVforReflections : getCSVforReflections,
  getCSVforRegistration : getCSVforRegistration




};

}]);
