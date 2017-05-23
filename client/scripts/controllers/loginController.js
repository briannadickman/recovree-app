myApp.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
    $scope.user = {
      username: '',
      password: ''
    };
    $scope.message = '';
    var userObject = UserService.userObject;

    $scope.sendResetPassword = function () {
      if($scope.user.username === '') {
        $scope.message = "Enter your phone number";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/user/forgotpassword', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('Password Reset Link Sent');
          } else {
            console.log('failure: ', response);
            $scope.message = "Failure";
          }
        });
      }
    };

    $scope.login = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            userObject.userName = response.data.username;
            userObject.id = response.data.id;
            userObject.memberID = response.data.memberID;
            // location works with SPA (ng-route)
            $location.path('/home');
          } else {
            console.log('failure: ', response);
            $scope.message = "Username or password is incorrect.";
          }
        });
      }
    };

    $scope.registerUser = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/register', $scope.user).then(function(response) {
          console.log('success saving member');
          console.log('response',response);
          console.log('response.data.memberID', response.data.memberID);
          $scope.registration.memberID = response.data.memberID;
          $scope.userDemographics($scope.registration);
        },
        function(response) {
          console.log('error');
          $scope.message = "Please try again.";
        });
      }

    };

  // SENDS USER DEMOGRAPHIC INFO TO SERVER (No username or password)

    $scope.userDemographics = function(){
      console.log('sending demographics', $scope.registration);
      $http.post('/register/registration', $scope.registration).then(function(response) {
        console.log('success saving demographic info', response);
        $location.path('/login');
      });
    };

  // REGISTRATION FORM

      // Generate State Dropdown Options
      $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'WY').split(' ').map(function(state) {
          return {abbrev: state};
       });

      // Generate Gender Dropdown Options
      var comma = ',';
      $scope.genders = ('Female,Male,Trans,Other,Prefer Not to Answer').split(comma).map(function(gender) {
          return {gender: gender};
       });

     // Generate Birth Year Dropdown Options
     var comma = ',';
     $scope.years = ('Female,Male,Trans,Other,Prefer Not to Answer').split(comma).map(function(year) {
         return {year: year};
      });
        $scope.years = [];

        $scope.getYearDropdown = function(){
        var currentYear = new Date().getFullYear();
        console.log(currentYear);
        for(var i = 0; i < 100; i++){
          $scope.years.push(currentYear - i);
        }
        console.log($scope.years);
        return $scope.years;
      };

     // Generate Drugs of Choice Dropdown Options
     $scope.drugs = ('Alcohol,Amphetamine,Benzodiazepines,Cocaine,Crack,Ecstasy,Heroin,Inhalants,Marijuana-Hashish,Methamphetamine,Opiates,PCP,Synthetics,Other').split(comma).map(function(drug) {
         return {drug: drug};
      });

      // Generate Program Payment Options
      $scope.payments = ('Personal Financing,Insurance,Public Assistance,Treatment Program Scholarships').split(comma).map(function(payment) {
          return {payment: payment};
       });

    // Capture Into MemberSchema

    // Capture Into RegistrationSchema

}]);
