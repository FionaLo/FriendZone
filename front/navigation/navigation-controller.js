(function(){
    angular.module('FriendZone').controller('NavigationController', ['$scope', '$http', '$state', '$location', 'auth',
            function($scope, $http, $state, $location, auth){
                $scope.init = function() {
                    auth.getCurrent(function(current){
                       $scope.current = current;
                    });
                };
                $scope.setActive = function(location){
                    return location == $location.path();
                };
                $scope.init();
            }
        ]);
}());
