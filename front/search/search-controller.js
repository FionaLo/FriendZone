(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http',
        function ($scope, $state, $http) {

            $scope.init = function () {
                $scope.filteredUsers = [];
                $scope.currentPage = 1;
                $scope.pageSize = 10;

                $scope.updateUserList();
            };

            $scope.updateUserList = function(){
                $http.get('api/users', {
                    params: {
                        group: 'user'
                    }
                }).success(function (res) {
                    $scope.users = res;
                });
            };

            $scope.pageChanged = function (current) {
                $scope.currentPage = current;
                $scope.filteredUsers = [];
                var start = ($scope.currentPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredUsers = $scope.users.slice(start, end);
            };

            $scope.init();
        }]);
}());

