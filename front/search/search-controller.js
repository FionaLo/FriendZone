(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http', '$uibModal', 'auth', 'dataBus',
        function ($scope, $state, $http, $uibModal, auth, dataBus) {

            $scope.init = function () {
                $scope.filteredUsers = [];
                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.updateUserList();
                auth.getCurrent(function(current){
                    $scope.current = current;
                });
            };

            $scope.updateUserList = function(){
                $http.get('api/users', {
                    headers: {
                        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDU5NzkxNjIwLCJzdWIiOiJ1c2VyIn0.YynGJn_oV41NF7jh3VHTipNRYIxd_Qa8bmqdzQBHkPc'
                    },
                    params: {
                        group: 'user'
                    }
                }).success(function (res) {
                    $scope.users = res;
                    $scope.pageChanged(1);
                });
            };

            $scope.openNewEvent = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'new-event-modal',
                    controller: 'EventModalController',
                    resolve: {
                        event: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (event) {
                    event.creator = $scope.current._id;
                    event.attendees = [$scope.current._id];
                    $http.post('api/events', event).success(function (res) {
                        $scope.current.events.push(res._id);
                        $scope.current.attend_events.push(res._id);
                        $http.put('api/users', $scope.current).error(function (err){
                            console.log(err);
                        });
                    }).error(function (err) {
                        console.log(err);
                    });
                }, function () {
                });
            };

            $scope.pageChanged = function (current) {
                $scope.currentPage = current;
                $scope.filteredUsers = [];
                var start = ($scope.currentPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredUsers = $scope.users.slice(start, end);
            };

            $scope.gotoUser = function(user){
                dataBus.set(user);
                $state.go('profile');
            };

            $scope.init();
        }]);
    angular.module('FriendZone').controller('NewEventModalController', ['$scope', '$state', '$http', '$uibModalInstance',
        function($scope, $state, $http, $uibModalInstance){

        }]);
}());

