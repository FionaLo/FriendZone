(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http',
        function ($scope, $state, $http) {
            $http.get('api/user').success(function (res) {
                $scope.users = res;
            })
        }]);
}());

