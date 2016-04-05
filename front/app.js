(function(){
    angular.module('FriendZone', ['ui.router', 'ui.bootstrap', 'ngFlash'])
        .config(function($stateProvider, $urlRouterProvider){
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
            }).state('admin', {
                url: '/admin',
                templateUrl: 'front/admin/admin.html',
                controller: 'AdminController'
            });
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
    angular.module('FriendZone').factory('auth', ['$http', function ($http) {
            var current = null;
            var authenticated = false;
            return {
                login: function (user, callback){
                    $http.post('api/login', user).success(function(res){
                        callback(true);
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
}());