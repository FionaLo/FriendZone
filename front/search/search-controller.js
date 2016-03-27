(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http',
        function ($scope, $state, $http) {
            $http.get('api/users').success(function (res) {
                console.log(res);
                $scope.users = res;
            })
        }]);
}());

