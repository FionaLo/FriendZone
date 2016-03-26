(function(){
    angular.module('FriendZone')
        .controller('NavigationController', ['$scope', '$http', "$state", function($scope, $http, $state){
            if (localStorage['User-Data']){
                $scope.authenticated = true;
            } else {
                $scope.authenticated = false;
            }
        }]);
}());
