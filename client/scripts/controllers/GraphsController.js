myApp.controller('GraphsController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  console.log('GraphsController sourced!');
  var location = 'weekly';
  UserService.refreshSessionObject(location);
  $scope.sessionObject = UserService.sessionObject;


  var thisWeek = moment().week();
  var lastWeek = thisWeek - 1;
  var thisMonth = moment().month();
  var lastMonth = thisMonth - 1;
  console.log('this month: ', thisMonth);

  var thisWeeksObject = {
    reflections : [],
    feelingNames : [],
    exerciseAmount : [],
    foodAmount : [],
    sleepAmount : [],
    overallAmount : [],
  };
  var lastWeeksObject = {
    reflections : [],
    feelingNames : [],
    exerciseAmount : [],
    foodAmount : [],
    sleepAmount : [],
    overallAmount : [],
  };
  var thisMonthsObject = {
    reflections : [],
    feelingNames : [],
    exerciseAmount : [],
    foodAmount : [],
    sleepAmount : [],
    overallAmount : [],
  };
  var lastMonthsObject = {
    reflections : [],
    feelingNames : [],
    exerciseAmount : [],
    foodAmount : [],
    sleepAmount : [],
    overallAmount : [],
  };

  var reflections = UserService.sessionObject.allReflections;
  console.log(UserService.sessionObject.allReflections);

  var getWeeklyData = function(reflections){
    for (var i = 0; i<reflections.length; i++){
      var currentReflection = reflections[i];
      var reflectionWeek = moment(currentReflection.reflectionDate).week();
      if (reflectionWeek === thisWeek){
        thisWeeksObject.reflections.push(currentReflection);
      }
      else if (reflectionWeek === lastWeek){
        lastWeeksObject.reflections.push(currentReflection);
      }
    }
    console.log('this weeks reflections: ', thisWeeksObject.reflections);
    console.log('last weeks reflections: ', lastWeeksObject.reflections);
  };

  var getMonthlyData = function(reflections){
    for (var i = 0; i<reflections.length; i++){
      var currentReflection = reflections[i];
      var reflectionMonth = moment(currentReflection.reflectionDate).month();
      if (reflectionMonth === thisMonth){
        thisMonthsObject.reflections.push(currentReflection);
      } else if (reflectionMonth === lastMonth){
        lastMonthsObject.reflections.push(currentReflection);
      }
    }
    console.log('this months reflections: ', thisMonthsObject.reflections);
    console.log('last months reflections: ', lastMonthsObject.reflections);
  };

  getWeeklyData(reflections);
  getMonthlyData(reflections);

}]);
