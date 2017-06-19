var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', '$mdThemingProvider',
      function($routeProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('');

  // COLOR THEME
    // This defines the main color palette to use. The colors we are using are commented below and defined in the primary palette.
  $mdThemingProvider.definePalette('primary', {
    '50': '000000',
    '100': 'FFFFFF', //white
    '200': '000000',
    '300': '000000',
    '400': '000000',
    '500': '454B49', //grey
    '600': '000000',
    '700': '000000',
    '800': '000000',
    '900': '000000', //black
    'A100': '000000',
    'A200': '000000',
    'A400': '000000',
    'A700': '000000',
    'contrastDefaultColor': 'light'
  });

  // This defines the accent palette to use. The colors we are using are commented below and defined in the accent palette.
  $mdThemingProvider.definePalette('accent', {
    '50': 'ffffff',
    '100': 'ffffff',
    '200': 'ffffff',
    '300': 'ffffff',
    '400': 'ffffff',
    '500': 'e62832', //accent-warning-orange
    '600': 'ffffff',
    '700': 'ffffff',
    '800': 'ffffff',
    '900': '813172', //accent-indigo
    'A100': 'ffffff',
    'A200': 'ffffff',
    'A400': 'ffffff',
    'A700': 'ffffff',
    'contrastDefaultColor': 'dark'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('primary', {
      'default': '900', //black
      'hue-1' : '100', //white
      'hue-2' : '500', //grey
      // 'hue-3' : '900',
    })
    .accentPalette('accent', {
      'default' : '900', // accent-indigo
      'hue-3': '500' //accent-warning-orange
    });


  $routeProvider
//landing
.when('/landing', {
  templateUrl: '/views/templates/landingPage.html',
  controller: 'LoginController'
})

//login
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController'
    })

//terms of use
    .when('/terms', {
      templateUrl: '/views/templates/termsOfUse.html',
      controller: 'LoginController'
    })

//register
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController'
    })

//forgot password
.when('/forgotpassword', {
  templateUrl: '/views/templates/forgot.html',
  controller: 'LoginController'
})

//confirm password reset
.when('/confirmreset/:code', {
  templateUrl: '/views/templates/confirm.html',
  controller: 'LoginController'
})

//home
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'HomeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//incomplete form
    .when('/incomplete-form', {
      templateUrl: '/views/templates/incompleteForm.html',
      controller: 'DayDetailController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//reflection form
      //feelings
      .when('/reflection-form/reflect-1', {
        templateUrl: '/views/templates/reflectionForm/reflect1.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 2
      .when('/reflection-form/reflect-2', {
        templateUrl: '/views/templates/reflectionForm/reflect2.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 3
      .when('/reflection-form/reflect-3', {
        templateUrl: '/views/templates/reflectionForm/reflect3.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 4
      .when('/reflection-form/reflect-4', {
        templateUrl: '/views/templates/reflectionForm/reflect4.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 5
      .when('/reflection-form/reflect-5', {
        templateUrl: '/views/templates/reflectionForm/reflect5.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 6
      .when('/reflection-form/reflect-6', {
        templateUrl: '/views/templates/reflectionForm/reflect6.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 7
      .when('/reflection-form/reflect-7', {
        templateUrl: '/views/templates/reflectionForm/reflect7.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 8
      .when('/reflection-form/reflect-8', {
        templateUrl: '/views/templates/reflectionForm/reflect8.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 9
      .when('/reflection-form/reflect-9', {
        templateUrl: '/views/templates/reflectionForm/reflect9.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 10
      .when('/reflection-form/reflect-10', {
        templateUrl: '/views/templates/reflectionForm/reflect10.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 11
      .when('/reflection-form/reflect-11', {
        templateUrl: '/views/templates/reflectionForm/reflect11.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })

      //check in 12
      .when('/reflection-form/reflect-12', {
        templateUrl: '/views/templates/reflectionForm/reflect12.html',
        controller: 'ReflectionFormController',
        resolve: {
          getuser : ['UserService', function(UserService){
            return UserService.getuser();
          }]
        }
      })
//ends check in form

//resources
    .when('/resources', {
      templateUrl: '/views/templates/resources.html',
      controller: 'NavController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//gratitude
    .when('/gratitude', {
      templateUrl: '/views/templates/gratitude.html',
      controller: 'NavController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//contact-us
    .when('/contact-us', {
      templateUrl: '/views/templates/contactUs.html',
      controller: 'NavController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//day detail
    .when('/day-detail', {
      templateUrl: '/views/templates/dayDetail.html',
      controller: 'DayDetailController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//graph summary
    .when('/weekly-graphs', {
      templateUrl: '/views/templates/Weeklygraphs.html',
      controller: 'GraphsController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

    .when('/last-week', {
      templateUrl: '/views/templates/lastWeeksGraph.html',
      controller: 'GraphsController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

    .when('/this-month', {
      templateUrl: '/views/templates/thisMonthsGraph.html',
      controller: 'GraphsController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

    .when('/last-month', {
      templateUrl: '/views/templates/lastMonthsGraph.html',
      controller: 'GraphsController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })

//admin export
    .when('/admin-export', {
      templateUrl: '/views/templates/adminExport.html',
      controller: 'AdminExportController',
      resolve: {
        getuser : ['AdminService', function(AdminService){
          return AdminService.getadmin();
        }]
      }
    })

    .otherwise({
      redirectTo: '/landing'
    });
}]);
