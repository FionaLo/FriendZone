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

                $scope.currentInvitePage = 1;
                $scope.invites = [];
                $scope.filteredInvites = [];

                $scope.suggests = [];

                var val = dataBus.get();
                auth.getCurrent(function(user){
                    $scope.current = user;
                    if (val == null){
                        $scope.user = user;
                        $scope.self = true;
                        $scope.userRating = 0;
                        $scope.initEvents();
                    } else {
                        $scope.user = val;
                        $scope.self = false;
                        $scope.userRating = 0;
                        $scope.initEvents();
                    }
                });
            };
            $scope.initEvents = function(){
                var eventIds = $scope.user.events.concat($scope.user.attend_events);
                if (eventIds.length > 0){
                    $http.get('api/events/many', {
                        params: {
                            ids: eventIds
                        }
                    }).success(function(res){
                        for (var i = 0; i < res.length; i++){
                            var e = res[i];
                            var date = new Date(e.date);
                            var time = new Date(e.time);
                            var today = new Date();
                            if (date > today){
                                $scope.upcomingEvents.push(e);
                            } else if (date < today){
                                $scope.pastEvents.push(e);
                            } else {
                                time.setYear(today.getYear());
                                time.setMonth(today.getMonth());
                                time.setDate(today.getDate());
                                if (time > today){
                                    $scope.upcomingEvents.push(e);
                                } else {
                                    $scope.pastEvents.push(e);
                                }
                            }
                        }
                        $scope.upcomingPageChanged(1);
                        $scope.pastPageChanged(1);
                    });
                }
                if ($scope.current.location !== '' &&
                    $scope.current.location  !== 'undef'){
                    $http.get('api/events', {
                       params: {
                            location: $scope.current.location
                       }
                    }).success(function(res){
                        $scope.suggests = res.slice(0, 5);
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
                    controller: 'UserModalController',
                    resolve: {
                        user: function () {
                            return $scope.user;
                        },
                        isAdmin: function() {
                            return $scope.current.group === 'admin';
                        }
                    }
                });
                modalInstance.result.then(function (user) {
                    $scope.user = user;
                    $http.put('api/users', $scope.user);
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
            $scope.invitePageChanged = function(current){
                $scope.currentInvitePage = current;
                $scope.filteredInvites = [];
                var start = ($scope.currentInvitePage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredInvites = $scope.invites.slice(start, end);
            };

            $scope.gotoEvent = function(event){
                dataBus.set(event);
                $state.go('event');
            };
            $scope.init();
        }]);
    angular.module('FriendZone').controller('UserModalController', ['$scope', '$state', '$http', '$uibModalInstance', 'user', 'isAdmin',
        function ($scope, $state, $http, $uibModalInstance, user, isAdmin) {
            $scope.isAdmin = isAdmin;
            $scope.groupSelect = ['user', 'admin'];
            $scope.genderSelect = ['Male', 'Female'];
            $scope.user = user;
            $scope.newPassword = '';
            $scope.confirm = function () {
                if ($scope.newPassword !== ''){
                    $scope.user.password = $scope.newPassword;
                }
                $uibModalInstance.close($scope.user);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
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