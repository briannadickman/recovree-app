myApp.factory('AdminService', ['$http', '$location', function($http, $location) {

    var location = "admin";

    var adminObject = {
        memberCount: 0,
        countByDay: [],
    };

    var dailyCount = [];
    var dates = [];


    //getuser
    function getadmin() {
        $http.get('/user').then(function(response) {
            if (response.data.id && response.data.userType === 1) {
                // user has a curret session on the server
            } else {

                $location.path("/login");
            }
        });
    } //ends getuser

    function getReflections() {
        getCSVforReflections();
    }

    function getRegistrationInfo() {
        getCSVforRegistration();
    }

    function getCSVforReflections() {
        $http.get('/csvExport/reflections').then(function(response) {
            window.open('/csvExport/reflections');
        });
    }

    function getCSVforRegistration() {
        $http.get('/csvExport/registration').then(function(response) {
            window.open('/csvExport/registration');
        });
    }

    function getAdminObject() {
        countMembers();
        countReflectionsByDay();
    }

    function countMembers() {
        $http.get('/register/memberCount').then(function(response) {
            adminObject.memberCount = response.data.length;
        });
    }

    function countReflectionsByDay() {
        $http.get('reflection/countByDay').then(function(response) {
            adminObject.countByDay = response.data;
            for (var i = 0; i < adminObject.countByDay.length; i++){
              adminObject.countByDay[i].date = convertToLocal(adminObject.countByDay[i].date);
            }
            storeDaysAndCountInArray();
        });
    }

    function convertToLocal(date){
      var stillUtc = moment.utc(date).toDate();
      var local = moment(stillUtc).local().format('MM-DD');
      return local;
    }

    function storeDaysAndCountInArray() {
        dates = [];
        dailyCount = [];
        adminObject.countByDay.sort(function(a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });
        for (var i = 0; i < adminObject.countByDay.length; i++) {
            var reflectionDate = adminObject.countByDay[i].date;
            console.log("reflectionDate", reflectionDate);
            var reflectionCount = adminObject.countByDay[i].count;
            dates.push(reflectionDate);
            dailyCount.push(reflectionCount);
        }
        buildAdminGraphs(dates, dailyCount);
    }

    function buildAdminGraphs(date, count) {
        var ctx = document.getElementById("dailyParticipantsChart");
        var dailyParticipantsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: date,
                datasets: [{
                    label: 'Daily Participants',
                    fill: false,
                    backgroundColor: 'rgba(129, 49, 114, 0.76)',
                    data: count
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            // max: 20,
                            min: 0,
                            stepSize: 1
                        }
                    }]
                },
                legend: {
                    display: false
                },
            }
        });
    } //end build graphs function

    return {
        countMembers: countMembers,
        countReflectionsByDay: countReflectionsByDay,
        adminObject: adminObject,
        getadmin: getadmin,

        getReflections: getReflections,
        getRegistrationInfo: getRegistrationInfo,
        getCSVforReflections: getCSVforReflections,
        getCSVforRegistration: getCSVforRegistration,
        buildAdminGraphs: buildAdminGraphs,
        getAdminObject: getAdminObject
    };

}]);
