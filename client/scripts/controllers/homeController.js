myApp.controller('HomeController', ['$scope', '$http', '$location', '$q', 'UserService', function($scope, $http, $location, $q, UserService) {
  console.log('HomeController sourced!');
  var location = "home";

  var userObject = UserService.userObject;
  var refreshSessionObject = UserService.refreshSessionObject;
  refreshSessionObject(location);

  $scope.sessionObject = UserService.sessionObject;
  $scope.launchReflection = UserService.launchReflection;

  // random message to display when reflection is less than zero or 1
  var reflectionQuote = [
  {
  quote: 'Self-reflection is a humbling process. It is essential to find out why you think, say, and do certain things...then better yourself.',
   name: '-Sonya Teclai'
 }

  ];

  var randomIndex = Math.floor(Math.random() * reflectionQuote.length);
  $scope.randomQuote = reflectionQuote[randomIndex];

  console.log($scope.randomQuote);


}]);
