(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http', '$uibModal', 'auth',
        function ($scope, $state, $http, $uibModal, auth) {

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
                    controller: 'NewEventModalController'
                });

                modalInstance.result.then(function (event) {
                    $http.post('api/events', event).success(function (res) {
                        console.log(res);
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

            $scope.init();
        }]);
    angular.module('FriendZone').controller('NewEventModalController', ['$scope', '$state', '$http', '$uibModalInstance',
        function($scope, $state, $http, $uibModalInstance){
            $scope.dateFormat = 'dd-MMMM-yyyy';
            $scope.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
            $scope.datePopup = {
                opened: false
            };
            $scope.openDatePopup = function() {
                $scope.datePopup.opened = true;
            };
            $scope.create = function () {
                $uibModalInstance.close($scope.event);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());

