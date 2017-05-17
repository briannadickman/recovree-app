myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');

  $scope.launchReflection = function(){
    $location.path('/reflection-form/reflect-1');
  };
  $scope.sessionObject = UserService.sessionObject;


  // var userObject = UserService.userObject;
  // var onHome = UserService.onHome;
  //
  // console.log("userObject", userObject);
  // console.log("userObject.id", userObject.id);
  // console.log("userObject.memberID",userObject.memberID);
  // console.log("userObject.userName",userObject.userName);
  // onHome();
}]);
