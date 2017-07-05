myApp.controller('LoginController', ['$scope', '$http', '$routeParams', '$location', '$mdDialog', 'UserService', function($scope, $http, $routeParams, $location, $mdDialog, UserService) {
    $scope.user = UserService.user;

    $scope.message = '';
    var userObject = UserService.userObject;

    $scope.sendResetPassword = function() {
        if ($scope.user.username === '') {
            $scope.message = "Enter your phone number";
        } else {
            $location.path('/login');
            $http.post('/user/forgotpassword', $scope.user).then(function(response) {
                if (response.data.username) {} else {
                    $scope.message = "Failure";
                }
            });
        }
    };

    $scope.updatePassword = function() {
        //this is the randomly generated code, it's part of the url and will need it to reset password
        //send password reset request to the server with username, new password, and code
        if ($scope.user.username === '' || $scope.user.password === '') {
            $scope.message = "Enter your username and password!";
        } else {
            $scope.user.code = $routeParams.code;
            $http.put('/user/resetpassword', $scope.user).then(function(response) {
                if (response.data.username) {
                    $location.path('/login');
                } else {
                    $scope.message = "Username or password is incorrect.";
                }
            });
        }
    };

    $scope.login = function() {
        if ($scope.user.username === '' || $scope.user.password === '') {
            $scope.message = "Enter your username and password!";
        } else {
            $http.post('/', $scope.user).then(function(response) {
                if (response.data.username) {
                    userObject.userName = response.data.username;
                    userObject.id = response.data.id;
                    userObject.userType = response.data.userType;
                    // location works with SPA (ng-route)
                    if (userObject.userType === 2) {
                        $location.path('/home');
                    } else if (userObject.userType === 1) {
                        $location.path('/admin-export');
                    }

                } else {
                    $scope.message = "Username or password is incorrect.";
                }
            });
        }
    };

    $scope.showConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to complete registration?')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Go Back');

        $mdDialog.show(confirm).then(function() {
            $scope.registerUser($scope.user, $scope.registration);
        }, function() {});
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
        return { abbrev: state };
    });

    // Generate Gender Dropdown Options
    var comma = ',';
    $scope.genders = ('Female,Male,Trans,Other,Prefer Not to Answer').split(comma).map(function(gender) {
        return { gender: gender };
    });

    $scope.years = [];

    $scope.getYearDropdown = function() {
        var currentYear = new Date().getFullYear();
        for (var i = 0; i < 100; i++) {
            $scope.years.push(currentYear - i);
        }
        return $scope.years;
    };

    // Generate Drugs of Choice Dropdown Options
    $scope.drugs = ('Alcohol,Amphetamine,Benzodiazepines,Cocaine,Crack,Ecstasy,Heroin,Inhalants,Marijuana-Hashish,Methamphetamine,Opiates,PCP,Synthetics,Other').split(comma).map(function(drug) {
        return { drug: drug };
    });

    // Generate Program Payment Options
    $scope.payments = ('Personal Financing,Insurance,Public Assistance,Treatment Program Scholarships').split(comma).map(function(payment) {
        return { payment: payment };
    });

    // TERMS OF USE MODAL
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

}]);