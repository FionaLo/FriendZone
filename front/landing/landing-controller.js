(function () {
    angular.module('FriendZone').controller('LandingController', ['$scope', '$state', '$http', 'Flash',
        function ($scope, $state, $http, Flash) {
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
                $http.post('user/signup', $scope.newUser).success(function(response){
                    $state.go('search');
                    $scope.authenticated = true;
                }).error(function(error){
                    console.log(error);
                });
            };

            $scope.login = function () {
                $http.post('user/login', $scope.user).success(function(response){
                    // localStorage.setItem('User-Data', JSON.stringify(response));
                    console.log(response);
                    $state.go('search');
                    $scope.authenticated = true;
                }).error(function(error){
                    console.log(error);
                    var message = '<strong>Error!</strong> Wrong username or passpword.';
                    Flash.create('danger', message);
                });
            }


        }]);
}());
