(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http',
        function ($scope, $state, $http) {
            $scope.updateUserList = function(){
                $http.get('api/users', {
                    params: {
                        group: 'user'
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.users = res;
                });
            };

            $scope.updateUserList();
        }]);
}());

