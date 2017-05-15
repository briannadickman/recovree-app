myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  //created userObject
  var userObject = {};

  // create sessionObject
  var sessionObject = {};
  sessionObject.numberOfDays = getNumberOfDays();
  sessionObject.reflectionCompleted = getReflectionCompleted();
  sessionObject.takingMeds = getTakingMeds();
  sessionObject.yesterdaysGoal = getYesterdaysGoal();

    function getNumberOfDays(){
      console.log("inside getNumberOfDays");
      //$http.get - logic happens on the server side
      //

    }//ends numberOfDays

    function getReflectionCompleted(){
      console.log("inside getReflectionCompleted");

    }//ends getReflectionCompleted

    function getTakingMeds(){
      console.log("inside getTakingMeds");

    }//ends getTakingMeds

    function getYesterdaysGoal(){
      console.log("inside getYesterdaysGoal");


    }//ends getYesterdaysGoal


  //builds reflectionObject
  var reflectionObject = {};

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
    }

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
    reflectionObject.reflectionDate = '';
    // reflectionObject.reflectionTime = time;
    reflectionObject.userObject = userObject;
    reflectionObject.formPosition = 1;
  //finishes building reflectionObject

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
  function reflectionFormNextButton(reflectionObject){
    console.log("you clicked the next button");
    console.log("reflectionObject from NEXT Btn:", reflectionObject);

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
    console.log("$http.post:", reflectionObject);
    //this funciton will need to post to the database
    //posts date, id, and feelings
    //beacuse of async we will need to .then take the response set the
    //reflectionObject = response and then pass reflectionObject into the
    //advance to next function
    advanceReflectionForm(reflectionObject);
    if (userObject.id) {
      console.log('FEELINGS SAVED TO DB - NEW REFLECTION POSTED');
      $http.post('/reflection', reflectionObject).then(function(response) {
        reflectionObject._id = response.data._id;
        console.log('reflectionObject._id: ', reflectionObject._id);
      });
    }
  }//ends postToReflectionForm

  function updateReflectionForm(reflectionObject){
    console.log("$http.put:", reflectionObject);
    console.log('_id in put request: ', reflectionObject._id);

    //this funciton will need to update the database
    //find by id and date then update
    //beacuse of async we will need to .then take the response set the
    //reflectionObject = response and then pass reflectionObject into the
    //advance to next function
    $http.put('/reflection', reflectionObject).then(function(response){
      console.log('updateReflectionForm response: ', response.data);
    });

    advanceReflectionForm(reflectionObject);
    if (userObject.id) {
      console.log('TODAYS REFLECTION UPDATED IN DB');
      // $http.put('/reflection', reflectionObject).then(function(response) {
      // });
    }
  }//ends updateReflectionForm

  function advanceReflectionForm(reflectionObject){
    //moves on to the next question
    reflectionObject.formPosition += 1;
    console.log("formPosition",reflectionObject.formPosition);
    $location.path('/reflection-form/reflect-'+reflectionObject.formPosition);
  }//ends advanceReflectionForm

  function returnHomeButton(){
    //clears out reflectionObject
    console.log("clearing out this:", reflectionObject);

    console.log("should be empty:", reflectionObject);
    //sets sessionObject property completed to true
    console.log("set sessionObject property to true");
    //moves participant back to home screen
    $location.path('/home');
  }

  function getReflections() {
    if (userObject.id) {
      console.log('GET', userObject.id);
      $http.get('/reflection').then(function(response) {
        console.log('GOTTEN REFLECTIONS', response);
      });
    }
  }

  function getRegistrationInfo() {
      console.log('GET', userObject.id);
      $http.get('/registration').then(function(response) {
        console.log('GOTTEN REGISTRATIONS', response);
      });
  }


  //return out of UserService Factory
  return {
    userObject : userObject,
    reflectionObject: reflectionObject,
    date: date,
    time: time,
    getuser : getuser,
    logout: logout,
    reflectionFormNextButton: reflectionFormNextButton,
    returnHomeButton: returnHomeButton,
    getReflections: getReflections,
    getRegistrationInfo: getRegistrationInfo
  };
}]);
