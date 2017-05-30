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
},
{
  quote: 'It always seems impossible until it’s done.',
  name: ' – Nelson Mandela'
},
{
  quote: 'Happiness is where we find it, but rarely where we seek it.',
  name: '– J. Petit Senn'
},
{
  quote: 'Have patience with all things, but chiefly have patience with yourself. Do not lose courage in considering your own imperfections, but instantly set about remedying them – every day, begin the task anew.',
  name: ' – Saint Francis de Sales'
},
{
  quote: 'Nothing worthwhile ever happens quickly and easily. You achieve only as you are determined to achieve… and as you keep at it until you have achieved.',
  name: '– Author Robert H. Lauer'
},
{
  quote: 'If you are aware of your weaknesses and are constantly learning, your potential is virtually limitless.',
  name: '– Banker Jay Sidhu'
},
{
  quote: 'In the middle of difficulty lies opportunity.',
  name: ' – Physicist Albert Einstein'
},
{
  quote: 'Our greatest glory is not in never falling, but in rising every time we fall.',
  name: ' – Confucius'
},
{
  quote: 'We all make mistakes, have struggles, and even regret things in our past. But you are not your mistakes, you are not your struggles, and you are here now with the power to shape your day and your future.',
  name: ' – Steve Maraboli'
}

     ];




var randomIndex = Math.floor(Math.random() * reflectionQuote.length);
$scope.randomQuote = reflectionQuote[randomIndex];


}]);
