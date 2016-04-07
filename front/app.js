(function(){
    angular.module('FriendZone', ['ui.router', 'ui.bootstrap', 'ngFlash'])
        .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
            $urlRouterProvider.otherwise('/landing');
            $stateProvider.state('landing', {
                url: '/landing',
                templateUrl: 'front/landing/landing.html',
                controller: 'LandingController'
            }).state('search', {
                url: '/search',
                templateUrl: 'front/search/search.html',
                controller: 'SearchController'
            }).state('profile', {
                url: '/profile',
                templateUrl: 'front/profile/profile.html',
                controller: 'ProfileController'
            }).state('event', {
                url: '/event',
                templateUrl: 'front/event/event.html',
                controller: 'EventController'
            }).state('admin', {
                url: '/admin',
                templateUrl: 'front/admin/admin.html',
                controller: 'AdminController'
            });
            $httpProvider.interceptors.push('authInterceptor');
            $locationProvider.html5Mode(true);
        });
        angular.module('FriendZone').factory('dataBus', function () {
            var data = null;
            return {
                set: function(val){
                    data = val;
                },
                get: function(){
                    var temp = data;
                    data = null;
                    return temp;
                }
            }
        });
    angular.module('FriendZone').factory('auth', ['$http', function ($http, $scope, $window) {
            var current = null;
            var authenticated = false;
            return {
                login: function (user, callback){
                    $http.post('api/login', user).success(function(data, status, headers, config){
                        callback(true);
                        console.log(headers());
                        console.log(data.token);
                    }).error(function(error){
                        callback(false);
                    });
                },
                logout: function (){
                    current = null;
                },
                register: function (user, callback){
                    $http.post('api/signup', user).success(function(response){
                        callback(true);
                    }).error(function(error){
                        callback(false);
                    });
                },
                isAuthenticated: function (){
                    return current != null;
                },
                getCurrent: function(callback){
                    $http.get('api/users/current').success(function(res){
                        current = res;
                        callback(current);
                    }).error(function(err){
                        console.log(err);
                        current = null;
                        callback(current);
                    });
                }
            }
        }]);

    angular.module('FriendZone').factory('authInterceptor', function($rootScope, $q, $window, $location) {
        return {
            request: function (config) {
                // config.headers = config.headers || {};
                config.headers.Authorization = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDU5OTEwMjk4LCJzdWIiOiJ1c2VyIn0.DXDUkB0ZqPGZfbX0CQR8O9E3azafA_2unM-2jqf1VEk';
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                    $location.url('/');
                }
                return response || $q.when(response);
            }
        };
    })
}());