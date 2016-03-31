(function () {
    angular.module('FriendZone').controller('AdminController', ['$scope', '$state', '$http',
        function ($scope, $state, $http) {
            console.log("test");
            $scope.getUsers = function() {
                $http.get('api/users', {
                    params: {
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.users = res;
                });
            };
            $scope.deleteUser = function(user){
                $http.delete('api/users', {
                    params: {
                        user_id: user._id
                    }
                }).success(function (res){
                    console.log(res);
                    $scope.getUsers();
                });
            };
            $scope.getUsers();
        }]);
}());