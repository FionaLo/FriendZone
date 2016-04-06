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
                });
                $http.get('api/users/single', {
                    params: {
                        id: $scope.event.creator
                    }
                }).success(function(res){
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
                $scope.current.attend_events.push($scope.event._id);
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

            $scope.attendPageChanged = function (current){
                $scope.currentAttendPage = current;
                $scope.filteredAttendees = [];
                var start = ($scope.currentAttendPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                $scope.filteredAttendees = $scope.attendees.slice(start, end);
            };
            $scope.init();
        }]);
    angular.module('FriendZone').controller('EventModalController', ['$scope', '$state', '$http', '$uibModalInstance', 'event',
        function ($scope, $state, $http, $uibModalInstance, event) {

            $scope.init = function() {
                $scope.modal = {};
                if (event == null){
                    $scope.modal.title = 'New Event';
                } else {
                    $scope.modal.title = 'Edit Event';
                    $scope.modal.event = event;
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
                $scope.modal.date = new Date(event.date);

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
}());