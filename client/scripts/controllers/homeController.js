myApp.controller('HomeController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('HomeController sourced!');

  $scope.launchReflection = function(){
    $location.path('/reflection-form/reflect-1');
  };
  $scope.sessionObject = UserService.sessionObject;

<<<<<<< HEAD
  var userObject = UserService.userObject;
  var onHome = UserService.onHome;
=======
  // var userObject = UserService.userObject;
  // var onHome = UserService.onHome;
>>>>>>> 9924b9b801a09c80d8a2e30f9c3b119dd6fc7432
  //
  // console.log("userObject", userObject);
  // console.log("userObject.id", userObject.id);
  // console.log("userObject.memberID",userObject.memberID);
  // console.log("userObject.userName",userObject.userName);
  // onHome();
}]);
