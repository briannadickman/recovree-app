myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  //variables
  var user = {};
  var userObject = {};
  var registration = {};
  var sessionObject = {};
  var reflectionObject = {};
  var dailyReflectObject = { data: '' };

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

  function registerUser(user,registration) {
    if(user.username === '' || user.password === '') {
    } else {
      console.log('sending to server...', user);
      $http.post('/register', user).then(function(response) {
        console.log('success saving member');
        console.log('response',response);
        console.log('response.data.memberID', response.data.memberID);
        registration.memberID = response.data.memberID;
        emptyUser(user);
        userDemographics(registration);
      },
      function(response) {
        console.log('error');
        // $scope.message = "Please try again.";
      });
    }
  }//ends registerUser

  function emptyUser(user){
    user.username = '';
    user.password = '';
  }//emptyUser


  function userDemographics(registration){
    console.log('sending demographics', registration);
    $http.post('/register/registration', registration).then(function(response) {
      console.log('success saving demographic info', response);
      emptyDemographics(registration);
      $location.path('/login');
    });
  }//ends userDemographics

  function emptyDemographics(registration){
    registration.gender = '';
    registration.birthYear = '';
    registration.state = '';
    registration.county = '';
    registration.drugChoice = '';
    registration.sobrietyDate = '';
    registration.programPayment = '';
    registration.medication = '';
    registration.termsAgreement = false;
    registration.memberID = '';
  }//ends emptyDemographics

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
        sessionObject.takingMeds = response.data.medication;
        console.log("session Object at end of getSessionObject", sessionObject);
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
      reflectionObject.overallfeeling = '';
      reflectionObject.feelingsWhy = '';
      reflectionObject.drugAlcoholIntake = false;
      reflectionObject.medication = false;
      reflectionObject.sleep = 1;
      reflectionObject.dream = false;
      reflectionObject.whatDream = '';
      reflectionObject.exercise = 1;
      reflectionObject.food =10;
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


//launchReflection
  function launchReflection(){
      $location.path('/reflection-form/reflect-1');
  }

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

  function reflectionFormPrevButton(sessionObject, reflectionObject){
    console.log("you tried to go back, butchyoucantyet");

  }//ends reflectionFormPrevButton

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
    $location.path('/home');
  }

  //return out of UserService Factory
  return {
    user: user,
    userObject : userObject,
    reflectionObject: reflectionObject,
    sessionObject: sessionObject,
    registration: registration,
    getuser : getuser,
    logout: logout,
    registerUser: registerUser,
    userDemographics: userDemographics,
    refreshSessionObject: refreshSessionObject,
    launchReflection: launchReflection,
    reflectionFormNextButton: reflectionFormNextButton,
    reflectionFormPrevButton: reflectionFormPrevButton,
    returnHomeButton: returnHomeButton
  };
}]);
