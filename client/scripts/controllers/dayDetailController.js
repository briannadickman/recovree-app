myApp.controller('DayDetailController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('DayDetailController sourced!');

var refreshSessionObject = UserService.refreshSessionObject;
refreshSessionObject();
// $scope.dailyReflectObject = UserService.dailyReflectObject;
$scope.sessionObject = UserService.sessionObject;
$scope.launchReflection = UserService.launchReflection;


// random message to display when reflection is less than zero or 1
var reflectionQuote = [
{
quote: 'Self-reflection is a humbling process. It is essential to find out why you think, say, and do certain things...then better yourself.',
 name: '-Sonya Teclai'
},
// {
//   quote:
//   name:
// }

     ];

var randomIndex = Math.floor(Math.random() * reflectionQuote.length);
$scope.randomQuote = reflectionQuote[randomIndex];

console.log($scope.randomQuote);


}]);
