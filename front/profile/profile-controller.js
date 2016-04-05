(function () {
    angular.module('FriendZone').controller('ProfileController', ['$scope', '$state', '$http', '$uibModal', 'auth', 'dataBus',
        function ($scope, $state, $http, $uibModal, auth, dataBus) {
            $scope.init = function(){
                $scope.pageSize = 10;
                $scope.currentUpcomingPage = 1;
                $scope.upcomingEvents = [];
                $scope.filteredUpcomingEvents = [];

                $scope.currentPastPage = 1;
                $scope.pastEvents = [];
                $scope.filteredPastEvents = [];
                var val = dataBus.get();
                if (val == null){
                    auth.getCurrent(function(user){
                        $scope.user = user;
                        $scope.self = true;
                        $scope.userRating = 0;
                        $scope.initEvents();
                    });
                } else {
                    $scope.user = val;
                    $scope.self = false;
                    $scope.userRating = 0;
                    $scope.initEvents();
                }
            };
            $scope.initEvents = function(){
                var eventIds = $scope.user.events + $scope.user.attended_events;
                if (eventIds.length > 0){
                    $http.get('api/events', {
                        params: {
                            '_id': { $in: eventIds}
                        }
                    }).success(function(res){
                        $scope.upcomingEvents = res;
                        $scope.pastEvents = res;
                    });
                }
            };

            $scope.openReportModal = function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'report-modal',
                    controller: 'ReportModalController'
                });
                modalInstance.result.then(function (reportText) {
                    $scope.user.reported = true;
                    $scope.user.reported_text += reportText;
                    $http.put('api/users', $scope.user).success(function (res) {
                    });
                }, function () {
                });
            };
            $scope.openEditProfile = function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'edit-profile-modal',
                    controller: 'EditUserModalController',
                    resolve: {
                        user: function () {
                            return $scope.user;
                        }
                    }
                });
                modalInstance.result.then(function (user) {
                    $scope.user = user;
                    $http.put('api/users', $scope.user).success(function () {
                    });
                }, function () {
                });
            };

            $scope.upcomingPageChanged = function(current){
                $scope.currentUpcomingPage = current;
                $scope.filteredUpcomingEvents = [];
                var start = ($scope.currentUpcomingPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredUpcomingEvents = $scope.upcomingEvents.slice(start, end);
            };
            $scope.pastPageChanged = function(current){
                $scope.currentPastPage = current;
                $scope.filteredPastEvents = [];
                var start = ($scope.currentPastPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredPastEvents = $scope.pastEvents.slice(start, end);
            };
            $scope.init();
        }]);
    angular.module('FriendZone').controller('ReportModalController', ['$scope', '$state', '$http', '$uibModalInstance',
        function ($scope, $state, $http, $uibModalInstance) {
            $scope.report = function () {
                $uibModalInstance.close($scope.reportText);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());