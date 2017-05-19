myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  //variables
  var userObject = {};
  var sessionObject = {};
  var reflectionObject = {};
  var dailyReflectObject = {};

  //getuser
  function getuser(){
    $http.get('/user').then(function(response) {
        if(response.data.id) {
            // user has a curret session on the server
            userObject.userName = response.data.username;
            userObject.id = response.data.id;
            userObject.memberID = response.data.memberID;

        } else {
            // user has no session, bounce them back to the login page
            $location.path("/login");
        }
    });
  }//ends getuser

  //logout
  function logout() {
      $http.get('/user/logout').then(function(response) {
        console.log('logged out');
        $location.path("/login");
      });
  }//ends logout

  //refreshes session object on each navigation page load
  function refreshSessionObject(){
            // getSessionObject(sessionObject);
            // getReflectionObject(reflectionObject);
    $http.get('/user').then(function(response) {
        if(response.data.id) {
            // user has a curret session on the server
            userObject.userName = response.data.username;
            userObject.id = response.data.id;
            userObject.memberID = response.data.memberID;
            getSessionObject(userObject.memberID);
            getReflectionObject(reflectionObject);
        } else {
            // user has no session, bounce them back to the login page
            $location.path("/login");
        }
    });

  }//ends refreshSessionObject

    //builds sessionObject
    function getSessionObject(memberID){
      $http({
        method: 'GET',
        url: '/reflection/session/' + memberID,
      }).then(function(response){
        console.log('response in getSessionObject:', response);
        sessionObject.streak = response.data.streakCount;
        sessionObject.allReflections = response.data.allReflectionsNewToOld;
        sessionObject.reflectionCompleted = response.data.reflectionCompleted;
        if (sessionObject.reflectionCompleted === true){
          sessionObject.todaysReflectObject = response.data.todaysReflection;
        }
        else{
          sessionObject.todaysReflectObject = {};
        }
        sessionObject.yesterdaysGoal = response.data.yesterdaysGoal;
        sessionObject.takingMeds = response.data.takingMeds;
      });
    }//ends getSessionObject

    //builds reflectionObject
    function getReflectionObject(reflectionObject){
      //creates feelings array
      var listOfFeelings = ['angry','anxious','depressed', 'distant', 'discerning',
        'discouraged', 'excited', 'frustrated', 'grateful', 'guilty', 'happy', 'hopeful',
        'hostile', 'insignificant', 'jealous', 'loving', 'motivated', 'numb', 'optimistic',
        'overwhelmed', 'peaceful', 'proud', 'sad', 'safe', 'thoughtful', 'valuable'];
      var feelingsArray = buildArray(listOfFeelings);

      //creates stressors array
      var listOfStressors = ['children','employment','family','finances','friends',
        'housing','legal issues','no me time','partner','physical pain','school','transportation'];
      var stressorsArray = buildArray(listOfStressors);

      //gets date information
      var today = new Date();
      var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      // assigns key value pairs
      reflectionObject.feelings = feelingsArray;
      reflectionObject.feelingsWhy = '';
      reflectionObject.drugAlcoholIntake = false;
      reflectionObject.medication = false;
      reflectionObject.sleep = 0;
      reflectionObject.dream = false;
      reflectionObject.whatDream = '';
      reflectionObject.exercise = 0;
      reflectionObject.food = 0;
      reflectionObject.spnsrMntrConnect = false;
      reflectionObject.groupMeet = false;
      reflectionObject.commntyService = false;
      reflectionObject.stressors = stressorsArray;
      reflectionObject.selfishDishonest = false;
      reflectionObject.howSelfshDishnt = '';
      reflectionObject.tomorrowGoal = '';
      reflectionObject.dailyGoal = false;
      reflectionObject.gratitude = '';
      reflectionObject.peerSupport = false;
      reflectionObject.counselor = false;
      reflectionObject.reflectionDate = date;
      reflectionObject.reflectionTime = time;
      reflectionObject.userObject = userObject;
      reflectionObject.formPosition = 1;
    //finishes building reflectionObject
    }//ends getReflectionObject

      function buildArray(list){
        var newArray = [];
        for (var i = 0; i < list.length; i++){
          var newObject = {};
          newObject.name = list[i];
          newObject.value = false;
          newArray.push(newObject);
        }//ends loop
        return newArray;
      }//ends buildArray



//reflection From functions
  function reflectionFormNextButton(sessionObject, reflectionObject){
    var medsForm = 3; //number of the form which asks about medication
    var takesMeds = sessionObject.takingMeds;

    if (reflectionObject.formPosition === (medsForm-1) && takesMeds === false){
      reflectionObject.formPosition += 1; //skips past meds form
    }
    //post to database if it is the fist reflection form view
    if (reflectionObject.formPosition === 1){
      $http.get('/user').then(function(response) {
          if(response.data.id) {
              reflectionObject.memberID = response.data.memberID;
              postToReflectionForm(reflectionObject);
          } else {
              // user has no session, bounce them back to the login page
              $location.path("/login");
          }
      });
    }
    //put to database if it is any subsequent reflection form views
    else{
      //updates today's reflectionObject
      updateReflectionForm(reflectionObject);
    }
  }//ends reflectionFormNextButton

    function postToReflectionForm(reflectionObject){
      $http.post('/reflection', reflectionObject).then(function(response) {
        reflectionObject._id = response.data._id;
        console.log('reflectionObject._id: ', reflectionObject._id);
        advanceReflectionForm(reflectionObject);
      });
    }//ends postToReflectionForm

    function updateReflectionForm(reflectionObject){
      $http.put('/reflection', reflectionObject).then(function(response){
        console.log('updateReflectionForm response: ', response.data);
        advanceReflectionForm(reflectionObject);
      });
    }//ends updateReflectionForm

  function advanceReflectionForm(reflectionObject){
    //moves on to the next question
    reflectionObject.formPosition += 1;
    $location.path('/reflection-form/reflect-'+reflectionObject.formPosition);
  }//ends advanceReflectionForm

  function returnHomeButton(sessionObject,reflectionObject){
    //clears out reflectionObject
    getReflectionObject(reflectionObject);
    //updates sessionObject
    getSessionObject(sessionObject);
      //for testing purposes remove once getSessionObject actually does something
      sessionObject.reflectionCompleted = true;
    //moves participant back to home screen
    $location.path('/home');
  }

  //return out of UserService Factory
  return {
    userObject : userObject,
    reflectionObject: reflectionObject,
    sessionObject: sessionObject,
    getuser : getuser,
    logout: logout,
    refreshSessionObject: refreshSessionObject,
    reflectionFormNextButton: reflectionFormNextButton,
    returnHomeButton: returnHomeButton
  };
}]);
