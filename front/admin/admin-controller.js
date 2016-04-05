(function () {
    angular.module('FriendZone').controller('AdminController', ['$scope', '$state', '$http', '$uibModal', 'dataBus',
        function ($scope, $state, $http, $uibModal, dataBus) {
            $scope.init = function() {
                $scope.filteredUsers = [];
                $scope.filteredEvents = [];
                $scope.filteredReports = [];
                $scope.currentUserPage = 1;
                $scope.currentEventPage = 1;
                $scope.currentReportedPage = 1;
                $scope.pageSize = 10;

                $scope.users = [];
                $scope.events = [];
                $scope.reports = [];
                $scope.getUsers();
                $scope.getEvents();
                $scope.getReports();
            };
            $scope.getUsers = function() {
                $http.get('api/users', {
                    params: {
                    }
                }).success(function (res) {
                    $scope.users = res;
                    $scope.userPageChanged(1);
                });
            };
            $scope.getEvents = function () {
                $http.get('api/events', {
                    params: {
                    }
                }).success(function (res) {
                    $scope.events = res;
                    $scope.eventPageChanged(1);
                });
            };
            $scope.getReports = function() {
                $http.get('api/users', {
                    params: {
                        reported: true
                    }
                }).success(function (res) {
                    $scope.reports = res;
                    $scope.reportedPageChanged(1);
                });
            };

            $scope.openConfirm = function (selectedType, item) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'confirm-modal',
                    controller: 'ConfirmModalController'
                });

                modalInstance.result.then(function () {
                    switch(selectedType){
                        case 'user':
                            $http.delete('api/users', {
                                params: {
                                    user_id: item._id
                                }
                            }).success(function (){
                                $scope.init();
                            }).error( function (err){
                                console.log(err);
                            });
                            break;
                        case 'event':
                            break;
                    }
                }, function () {
                });
            };
            $scope.openEditUser = function (user){
                var modalInstance = $uibModal.open({
                    templateUrl: 'edit-user-modal',
                    controller: 'UserModalController',
                    resolve: {
                        user: function () {
                            return user;
                        }
                    }
                });
                modalInstance.result.then(function (user) {
                    $http.put('api/users', user).success(function () {
                        $scope.init();
                    });
                }, function () {
                });
            };
            $scope.openEditEvent = function (event) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'edit-event-modal',
                    controller: 'EventModalController',
                    resolve: {
                        event: function () {
                            return event;
                        }
                    }
                });

                modalInstance.result.then(function () {
                }, function () {
                });
            };
            $scope.openReviewReport = function (user) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'review-report-modal',
                    controller: 'ReviewReportModalController',
                    resolve: {
                        user: function () {
                            return user;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    user.reported = false;
                    user.reported_text = "";
                    $http.put('api/users', user).success(function () {
                        $scope.init();
                    });
                }, function () {
                });
            };

            $scope.gotoUser = function (user){
                dataBus.set(user);
                $state.go('profile');
            };
            $scope.gotoEvent = function (event){
                dataBus.set(event);
                $state.go('event');
            };

            $scope.userPageChanged = function (current) {
                $scope.currentUserPage = current;
                $scope.filteredUsers = [];
                var start = ($scope.currentUserPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredUsers = $scope.users.slice(start, end);
            };
            $scope.eventPageChanged = function (current) {
                $scope.currentEventPage = current;
                $scope.filteredEvents = [];
                var start = ($scope.currentEventPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredEvents = $scope.events.slice(start, end);
            };
            $scope.reportedPageChanged = function (current) {
                $scope.currentReportedPage = current;
                $scope.filteredReports = [];
                var start = ($scope.currentReportedPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredReports = $scope.reports.slice(start, end);
            };
            $scope.init();
        }]);
    angular.module('FriendZone').controller('ConfirmModalController', ['$scope', '$state', '$http', '$uibModalInstance',
        function ($scope, $state, $http, $uibModalInstance) {
            $scope.confirm = function () {
                $uibModalInstance.close('confirm');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
    angular.module('FriendZone').controller('ReviewReportModalController', ['$scope', '$state', '$http', '$uibModalInstance', 'user',
        function ($scope, $state, $http, $uibModalInstance, user) {
            $scope.reportText = user.reported_text;
            $scope.clear = function () {
                $uibModalInstance.close('confirm');
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());