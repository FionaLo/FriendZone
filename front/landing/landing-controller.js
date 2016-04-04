(function () {
    angular.module('FriendZone').controller('LandingController', ['$scope', '$state', '$http', 'Flash', 'auth',
        function ($scope, $state, $http, Flash, auth) {
            $scope.onClickFind = function () {
                $("#find-btn").fadeOut("slow", function(){
                    $("#login-form").fadeIn("medium");
                });
            };
            $scope.onClickRegister = function() {
                $("#login-form").fadeOut("slow", function(){
                    $("#register-form").fadeIn("medium");
                });
            };

            $scope.register = function () {
                auth.register($scope.newUser, function(success){
                    if (success){
                        $state.go('search');
                    } else {
                        var message = '<strong>Error!</strong>';
                        Flash.create('danger', message);
                    }
                });
            };

            $scope.login = function () {
                auth.login($scope.user, function(success){
                    if (success){
                        $state.go('search');
                    } else {
                        var message = '<strong>Error!</strong> Wrong username or password.';
                        Flash.create('danger', message);
                    }
                });
            }
        }]);
}());
