myApp.controller('LoginController', ['$scope', '$http', '$routeParams', '$location', '$mdDialog', 'UserService', function($scope, $http, $routeParams, $location, $mdDialog, UserService) {
    $scope.user = UserService.user;

    $scope.message = '';
    var userObject = UserService.userObject;

    $scope.sendResetPassword = function () {
      if($scope.user.username === '') {
        $scope.message = "Enter your phone number";
      } else {
        console.log('sending to server...', $scope.user);
        $location.path('/login');
        $http.post('/user/forgotpassword', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
          } else {
            console.log('failure: ', response);
            $scope.message = "Failure";
          }
        });
      }
    };

    $scope.updatePassword = function() {
      //this is the randomly generated code, it's part of the url and will need it to reset password
      //send our password reset request to the server with our username, new password, and code
      console.log($routeParams.code);

      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $scope.user.code = $routeParams.code;

        $http.put('/user/resetpassword', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            $location.path('/login');
          } else {
            console.log('failure: ', response);
            $scope.message = "Username or password is incorrect.";
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
        userObject.userType = response.data.userType;
        // location works with SPA (ng-route)
        if (userObject.userType === 2){
          $location.path('/home');
        } else if (userObject.userType === 1){
          $location.path('/admin-export');
        }

      } else {
        console.log('failure: ', response);
        $scope.message = "Username or password is incorrect.";
      }
    });
  }
};

$scope.showConfirm = function(ev) {
  // Appending dialog to document.body to cover sidenav in docs app
  var confirm = $mdDialog.confirm()
        .title('Would you like to complete registration?')
        // .textContent('All of the banks have agreed to forgive you your debts.')
        // .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Confirm')
        .cancel('Go Back');

  $mdDialog.show(confirm).then(function() {
    console.log("call registerUser()");
    $scope.registerUser($scope.user,$scope.registration);
  }, function() {
  });
};



  $scope.registerUser = UserService.registerUser;


  // SENDS USER DEMOGRAPHIC INFO TO SERVER (No username or password)
  $scope.registration = UserService.registration;
  $scope.userDemographics = UserService.userDemographics;


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
