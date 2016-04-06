(function (){
    angular.module('FriendZone').controller('EventController', ['$scope', '$state', '$http', '$uibModal', 'dataBus', 'auth',
        function ($scope, $state, $http, $uibModal, dataBus, auth) {
            $scope.init = function (){
                $scope.filteredAttendees = [];
                $scope.currentAttendPage = 1;
                $scope.pageSize = 10;

                var val = dataBus.get();
                if (val != null){
                    $scope.event = val;
                }
                auth.getCurrent(function(user){
                    $scope.current = user;
                    if ($scope.event.creator = $scope.current._id){
                        $scope.owner = true;
                    } else {
                        $scope.owner = false;
                    }
                    if ($scope.event.attendees.indexOf($scope.current._id) >= 0){
                        $scope.attending = true;
                    } else {
                        $scope.attending = false;
                    }
                });
                var date = new Date($scope.event.date);
                var time = new Date($scope.event.time);
                var today = new Date();
                if (date > today){
                    $scope.passed = false;
                } else if (date < today){
                    $scope.passed = true;
                } else {
                    time.setYear(today.getYear());
                    time.setMonth(today.getMonth());
                    time.setDate(today.getDate());
                    if (time > today){
                        $scope.passed = false;
                    } else {
                        $scope.passed = true;
                    }
                }

                $http.get('api/users/single', {
                    params: {
                        id: $scope.event.creator
                    }
                }).success(function(res){
                    console.log(res);
                    $scope.creator = res.username;
                });
                $http.get('api/users/many', {
                    params: {
                        ids: $scope.event.attendees
                    }
                }).success(function(res){
                    $scope.attendees = res;
                    $scope.attendPageChanged(1);
                });
            };

            $scope.attend = function (){
                $scope.current.attend_events.push($scope.event._id)
                var inviteIndex = $scope.current.invites.indexOf($scope.event._id);
                if (inviteIndex >= 0){
                    $scope.current.invites.splice(inviteIndex, 1);
                }
                $scope.event.attendees.push($scope.current._id);
                $http.put('api/events', $scope.event).success(function(res){
                    $http.put('api/users', $scope.current).success(function(res){
                        $scope.init();
                    });
                });
            };
            $scope.unattend = function (){
                var eventIndex = $scope.current.attend_events.indexOf($scope.event._id);
                if (eventIndex >= 0){
                    $scope.current.attend_events.splice(eventIndex, 1);
                }
                var userIndex = $scope.event.attendees.indexOf($scope.current._id);
                if (userIndex >= 0){
                    $scope.event.attendees.splice(userIndex, 1);
                }
                $http.put('api/events', $scope.event).success(function(res){
                    $http.put('api/users', $scope.current).success(function(res){
                        $scope.init();
                    });
                });
            };

            $scope.openEditEventModal = function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'edit-event-modal',
                    controller: 'EventModalController',
                    resolve: {
                        event: function () {
                            return $scope.event;
                        }
                    }
                });
                modalInstance.result.then(function (event) {
                    $http.put('api/events', event).success(function(res){
                        $scope.init();
                    });
                }, function () {
                });
            };
            $scope.openReviewUserModal = function(user){
                var modalInstance = $uibModal.open({
                    templateUrl: 'review-user-modal',
                    controller: 'ReviewUserModalController'
                });
                modalInstance.result.then(function (rating) {
                    user.rating_total += rating;
                    user.rating_count++;
                    user.rating = Math.round(user.rating_count/user.rating_total);
                    $http.put('api/users', user);
                }, function () {
                });
            };

            $scope.attendPageChanged = function (current){
                $scope.currentAttendPage = current;
                $scope.filteredAttendees = [];
                var start = ($scope.currentAttendPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredAttendees = $scope.attendees.slice(start, end);
            };

            $scope.gotoUser = function(user){
                dataBus.set(user);
                $state.go('profile');
            };
            $scope.init();
        }]);
    angular.module('FriendZone').controller('EventModalController', ['$scope', '$state', '$http', '$uibModalInstance', 'event',
        function ($scope, $state, $http, $uibModalInstance, event) {
            $scope.init = function() {
                $scope.modal = {};
                if (event == null){
                    $scope.modal.title = 'New Event';
                    $scope.modal.date = new Date();
                } else {
                    $scope.modal.title = 'Edit Event';
                    $scope.modal.event = event;
                    $scope.modal.date = new Date(event.date);
                }

                $scope.dateFormat = 'dd-MMMM-yyyy';
                $scope.dateOptions = {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(2001, 1, 1),
                    startingDay: 1
                };
                $scope.datePopup = {
                    opened: false
                };
            };
            $scope.openDatePopup = function() {
                $scope.datePopup.opened = true;
            };
            $scope.create = function () {
                $scope.modal.event.date = $scope.modal.date;
                $uibModalInstance.close($scope.modal.event);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.init();
        }]);
    angular.module('FriendZone').controller('ReviewUserModalController', ['$scope', '$state', '$http', '$uibModalInstance',
        function ($scope, $state, $http, $uibModalInstance) {
            $scope.confirm = function () {
                $uibModalInstance.close($scope.rating);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());