myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  // created dailyReflectObject
  var dailyReflectObject = {
    data: ''
  };

  //created userObject
  var userObject = {};

  // create sessionObject
  var sessionObject = getSessionObject();

  function getSessionObject(){
    var newSessionObject = {};
    newSessionObject.numberOfDays = getNumberOfDays();
    newSessionObject.reflectionCompleted = getReflectionCompleted();
    newSessionObject.takingMeds = getTakingMeds();
    newSessionObject.yesterdaysGoal = getYesterdaysGoal();

    return newSessionObject;
  }//ends getSessionObject

  //sessionObject related functions
    function getNumberOfDays(){
      console.log("inside getNumberOfDays");
      //$http.get which retrieves

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

      ////for testing purposes
      return false;
    }//ends getTakingMeds

    function getYesterdaysGoal(){
      console.log("inside getYesterdaysGoal");

      //for testing purposes
      return "To meditate for at least 10 minutes";
    }//ends getYesterdaysGoal


  //builds reflectionObject
  var reflectionObject = getReflectionObject();

  function getReflectionObject(){
    var newReflectionObject = {};
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
    newReflectionObject.feelings = feelingsArray;
    newReflectionObject.feelingsWhy = '';
    newReflectionObject.drugAlcoholIntake = false;
    newReflectionObject.medication = false;
    newReflectionObject.sleep = 0;
    newReflectionObject.dream = false;
    newReflectionObject.whatDream = '';
    newReflectionObject.exercise = 0;
    newReflectionObject.food = 0;
    newReflectionObject.spnsrMntrConnect = false;
    newReflectionObject.groupMeet = false;
    newReflectionObject.commntyService = false;
    newReflectionObject.stressors = stressorsArray;
    newReflectionObject.selfishDishonest = false;
    newReflectionObject.howSelfshDishnt = '';
    newReflectionObject.tomorrowGoal = '';
    newReflectionObject.dailyGoal = false;
    newReflectionObject.gratitude = '';
    newReflectionObject.peerSupport = false;
    newReflectionObject.counselor = false;
    newReflectionObject.reflectionDate = date;
    newReflectionObject.reflectionTime = time;
    newReflectionObject.userObject = userObject;
    newReflectionObject.formPosition = 1;
  //finishes building newReflectionObject

    return newReflectionObject;
  }//ends getReflectionObject

  //builds an array of objects based on a list of values
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

  function getuser(){
    $http.get('/user').then(function(response) {
        if(response.data.id) {
            // user has a curret session on the server
            userObject.userName = response.data.username;
            userObject.id = response.data.id;
            userObject.memberID = response.data.memberID;
            // console.log('User Data: ', userObject.userName, userObject.id);
        } else {
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    });
  }

   function logout() {
      $http.get('/user/logout').then(function(response) {
        console.log('logged out');
        $location.path("/home");
      });
  }

  // takes reflectionObject and either posts it or updates it then advances to the next screen
  function reflectionFormNextButton(sessionObject, reflectionObject){
    console.log("sessionObject, reflectionObject", sessionObject, reflectionObject);
    //check to see if we need to skip meds formPosition
    var medsForm = 3; //number of the form which asks about medication
    var takesMeds = sessionObject.takingMeds;
    if (reflectionObject.formPosition === (medsForm-1) && takesMeds === false){
      reflectionObject.formPosition += 1; //skips past meds form
    }

    if (reflectionObject.formPosition === 1){
      //makes intial post to database
      postToReflectionForm(reflectionObject);
    }
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

  function returnHomeButton(reflectionObject){
    //clears out reflectionObject
    console.log("clearing out this:", reflectionObject);
    reflectionObject = getReflectionObject();
    console.log("should be empty:", reflectionObject);
    //sets sessionObject property completed to true
    console.log("set sessionObject property to true");
    sessionObject = getSessionObject();
    //moves participant back to home screen
    $location.path('/home');
  }

  function getReflections() {
    if (userObject.id) {
      console.log('GET', userObject.id);
      $http.get('/reflection').then(function(response) {
        console.log('GOTTEN REFLECTIONS', response.data);
        dailyReflectObject.data = response.data;
        console.log('object is: ', dailyReflectObject);

        for (var i = 0; i < dailyReflectObject.data.length; i++) {
          console.log(dailyReflectObject.data[i].reflectionDate);
         if (dailyReflectObject.data[i].reflectionDate) {
           dailyReflectObject.data[i].reflectionDate = moment(dailyReflectObject.data[i].reflectionDate).format('L');
         }
         console.log(dailyReflectObject.data[i].reflectionDate);
       }
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
    reflectionFormNextButton: reflectionFormNextButton,
    returnHomeButton: returnHomeButton,
    getReflections: getReflections,
    dailyReflectObject : dailyReflectObject
  };
}]);
