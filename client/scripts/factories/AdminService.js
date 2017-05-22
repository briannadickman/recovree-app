myApp.factory('AdminService', ['$http', '$location', function($http, $location){


  function getReflections() {
      $http.get('/reflection').then(function(response) {
        console.log('GOTTEN REFLECTIONS', response);
      });
      getCSVforReflections();
  }

  function getRegistrationInfo() {
      $http.get('/register/registration').then(function(response) {
        console.log('GOTTEN REGISTRATIONS', response);
      });
      getCSVforRegistration();
  }

  function getCSVforReflections(){
    $http.get('/csvExport/reflections').then(function(response){
      console.log('reflections in getCSV: ', response.data);
    });
  }

  function getCSVforRegistration(){
    $http.get('/csvExport/registration').then(function(response){
      console.log('registrations in getCSV: ', response.data);
    });
  }




return {

  getReflections: getReflections,
  getRegistrationInfo: getRegistrationInfo,
  getCSVforReflections : getCSVforReflections,
  getCSVforRegistration : getCSVforRegistration




};

}]);
