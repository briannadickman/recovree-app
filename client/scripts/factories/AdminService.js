myApp.factory('AdminService', ['$http', '$location', function($http, $location){


  function getReflections() {
      $http.get('/reflection').then(function(response) {
        console.log('GOTTEN REFLECTIONS', response);
      });
  }

  function getRegistrationInfo() {
      $http.get('/register/registration').then(function(response) {
        console.log('GOTTEN REGISTRATIONS', response);
      });
  }




return {

  getReflections: getReflections,
  getRegistrationInfo: getRegistrationInfo




};

}]);
