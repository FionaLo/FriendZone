(function(){
    angular.module('FriendZone')
        .controller('NavigationController', ['$scope', '$http', '$state', '$location',
            function($scope, $http, $state, $location){
                $scope.setActive = function(location){
                    return location == $location.path();
                }
            }
        ]);
}());
