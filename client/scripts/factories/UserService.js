myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  //variables
  var userObject = {};
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

  //onHome
  function onHome(){
            // getSessionObject(sessionObject);
            // getReflectionObject(reflectionObject);
    $http.get('/user').then(function(response) {
        if(response.data.id) {
            // user has a curret session on the server
            userObject.userName = response.data.username;
            userObject.id = response.data.id;
            userObject.memberID = response.data.memberID;
            getSessionObject(sessionObject);
            getReflectionObject(reflectionObject);
        } else {
            // user has no session, bounce them back to the login page
            $location.path("/login");
        }
    });

  }//ends onHome

    //builds sessionObject
    function getSessionObject(sessionObject){
      sessionObject.numberOfDays = getStreak();
      sessionObject.reflectionCompleted = getReflectionCompleted();
      sessionObject.takingMeds = getTakingMeds();
      sessionObject.yesterdaysGoal = getYesterdaysGoal();
      sessionObject.todaysDate = Date.now();
    }//ends getSessionObject

      //sessionObject related functions
        function getStreak(){
          console.log("inside getStreak");
          //$http.get which retrieves
          $http.get('/register/streak').then(function(response){
            console.log("I've returned from the other side, and I have this:");
            console.log("response",response);
          });

          //for testing purposes
          return 14;
        }//ends numberOfDays

        function getReflectionCompleted(){
          console.log("inside getReflectionCompleted");

          //for testing purposes
          return false;
        }//ends getReflectionCompleted

        function getTakingMeds(){
          console.log("inside getTakingMeds");
          console.log("userObject", userObject, userObject.id);
          var id = userObject.id;
          console.log("id",id);

          $http.get('/register/meds/' + id).then(function(response) {
              console.log('GOTTEN REFLECTIONS', response);
            });

          return false;
        }//ends getTakingMeds

        function getYesterdaysGoal(){
          console.log("inside getYesterdaysGoal");

          //for testing purposes
          return "To meditate for at least 10 minutes";
        }//ends getYesterdaysGoal


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


  function reflectionFormNextButton(sessionObject, reflectionObject){
    var medsForm = 3; //number of the form which asks about medication
    var takesMeds = sessionObject.takingMeds;

    if (reflectionObject.formPosition === (medsForm-1) && takesMeds === false){
      reflectionObject.formPosition += 1; //skips past meds form
    }
    //post to database if it is the fist reflection form view
    if (reflectionObject.formPosition === 1){
      //makes intial post to database
      postToReflectionForm(reflectionObject);
    }
    //put to database if it is any subsequent reflection form views
    else{
      //updates today's reflectionObject
      updateReflectionForm(reflectionObject);
    }
  }//ends reflectionFormNextButton

    function postToReflectionForm(reflectionObject){
      // advanceReflectionForm(reflectionObject);
      if (userObject.id) {
        console.log('FEELINGS SAVED TO DB - NEW REFLECTION POSTED');
        $http.post('/reflection', reflectionObject).then(function(response) {
          reflectionObject._id = response.data._id;
          console.log('reflectionObject._id: ', reflectionObject._id);
          advanceReflectionForm(reflectionObject);
        });
      }
    }//ends postToReflectionForm

    function updateReflectionForm(reflectionObject){
      console.log("$http.put:", reflectionObject);
      console.log('_id in put request: ', reflectionObject._id);

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

  function getReflections() {
    if (userObject.id) {
      console.log('GET', userObject.id);
      $http.get('/reflection').then(function(response) {
        console.log('GOTTEN REFLECTIONS', response.data);
        dailyReflectObject.data = response.data;
        console.log('dailyReflectObject is: ', dailyReflectObject);
        // console.log('dayArray is: ', dailyReflectObject.data.length);

      //   for (var i = 0; i < dailyReflectObject.data.length; i++) {
      //     console.log(dailyReflectObject.data[i].reflectionDate);
      //    if (dailyReflectObject.data[i].reflectionDate) {
      //      dailyReflectObject.data[i].reflectionDate = moment(dailyReflectObject.data[i].reflectionDate).format('L');
      //    }
      //    console.log(dailyReflectObject.data[i].reflectionDate);
      //  }
      });
    }
  }

  //return out of UserService Factory
  return {
    userObject : userObject,
    reflectionObject: reflectionObject,
    sessionObject: sessionObject,
    getuser : getuser,
    logout: logout,
    onHome: onHome,
    reflectionFormNextButton: reflectionFormNextButton,
    returnHomeButton: returnHomeButton,
    getReflections: getReflections,
    dailyReflectObject : dailyReflectObject
  };
}]);
