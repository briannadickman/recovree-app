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
{
  quote: 'It is always our own self that we find at the end of the journey. The sooner we face that self, the better.',
  name: '– Ella Maillart'
},
{
  quote: 'Believe you can and you’re halfway there.',
  name:  '– Theodore Roosevelt'
},
{
  quote: 'Success is the sum of small efforts, repeated day in and day out.',
  name: '– Robert Collier'
},
{
  quote: 'It is not easy to find happiness in ourselves, and it is not possible to find it elsewhere.',
  name: ' – Agnes Repplier'
}

     ];

var randomIndex = Math.floor(Math.random() * reflectionQuote.length);
$scope.randomQuote = reflectionQuote[randomIndex];

console.log($scope.randomQuote);


}]);
