(function(){
    angular.module('FriendZone').controller('NavigationController', ['$scope', '$http', '$state', '$location', 'auth', 'dataBus',
            function($scope, $http, $state, $location, auth, dataBus){
                $scope.init = function() {
                    $scope.searchQuery = '';
                    auth.getCurrent(function(current){
                        $scope.current = current;
                        if ($scope.current.group === 'admin'){
                            $scope.isAdmin = true;
                        } else {
                            $scope.isAdmin = false;
                        }
                    });
                };
                $scope.setActive = function(location){
                    return location == $location.path();
                };
                $scope.search = function(query){
                    dataBus.set(query);
                    $state.go('search');
                };
                $scope.init();
            }
        ]);
}());
