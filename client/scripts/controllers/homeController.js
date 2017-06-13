myApp.controller('HomeController', ['$scope', '$http', '$location', '$q', 'UserService', function($scope, $http, $location, $q, UserService) {
    var location = "home";

    var userObject = UserService.userObject;
    var refreshSessionObject = UserService.refreshSessionObject;
    refreshSessionObject(location);

    $scope.sessionObject = UserService.sessionObject;
    $scope.launchReflection = UserService.launchReflection;

    // random message to display when reflection is less than zero or 1
    var reflectionQuote = [{
            quote: 'Self-reflection is a humbling process. It is essential to find out why you think, say, and do certain things...then better yourself.',
            name: '-Sonya Teclai'
        },
        {
            quote: 'It is always our own self that we find at the end of the journey. The sooner we face that self, the better.',
            name: '– Ella Maillart'
        },
        {
            quote: 'Success is the sum of small efforts, repeated day in and day out.',
            name: '– Robert Collier'
        },

    ];

    var randomIndex = Math.floor(Math.random() * reflectionQuote.length);
    $scope.randomQuote = reflectionQuote[randomIndex];


}]);