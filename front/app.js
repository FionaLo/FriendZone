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
        }).factory('data-bus', function () {
            var data = {};
            return {
                set: function(data){
                    data = data;
                },
                get: function(){
                    var temp = data;
                    data = {};
                    return temp;
                }
            }
        }).factory('auth', function () {
            var current;
            return {
                login: function (){

                },
                logout: function (){

                },
                getCurrent: function(){
                    return current;
                }
            }
        });
}());