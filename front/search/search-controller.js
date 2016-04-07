(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http', '$uibModal', 'auth', 'dataBus',
        function ($scope, $state, $http, $uibModal, auth, dataBus) {

            $scope.init = function () {
                $scope.filteredUsers = [];
                $scope.currentPage = 1;
                $scope.pageSize = 10;

                var val = dataBus.get();
                if (val != null){
                    $scope.nameSearch = val;
                } else {
                    $scope.nameSearch = "";
                }

                $scope.locationSearch = "";
                $scope.genderSearch = 'doesn\'t matter';
                $scope.genderSelect = ['Male', 'Female', 'doesn\'t matter'];
                $scope.sortSelect = ['Name', 'Rating', 'Time in FriendZone'];
                $scope.sortBy = 'Name';
                $scope.updateUserList();
                auth.getCurrent(function(current){
                    $scope.current = current;
                });
            };

            $scope.updateUserList = function(){
                var genderFilter = "";
                if ($scope.genderSearch !== 'doesn\'t matter'){
                    genderFilter = $scope.genderSearch;
                }
                var searchParams = {
                    group: 'user',
                    username: $scope.nameSearch,
                    location: $scope.locationSearch,
                    gender: genderFilter
                };

                var sortParams = {};
                switch ($scope.sortBy){
                    case 'Name':
                        sortParams = {
                            username: 1
                        };
                        break;
                    case 'Rating':
                        sortParams = {
                            rating: -1
                        };
                        break;
                    case 'Time in FriendZone':
                        sortParams = {
                            _id: -1
                        };
                        break;
                }

                $http.get('api/users', {
                    headers: {
                        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDU5NzkxNjIwLCJzdWIiOiJ1c2VyIn0.YynGJn_oV41NF7jh3VHTipNRYIxd_Qa8bmqdzQBHkPc'
                    },
                    params: {
                        filter: searchParams,
                        sort: sortParams
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.users = res;
                    $scope.pageChanged(1);
                }).error(function (err){
                    console.log(err);
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
                        console.log(res);
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
            $scope.openInviteModal = function(user){
                var modalInstance = $uibModal.open({
                    templateUrl: 'invite-modal',
                    controller: 'InviteModalController',
                    resolve: {
                        events: function () {
                            return $scope.current.events;
                        }
                    }
                });
                modalInstance.result.then(function (event) {
                    user.invites.push(event._id);
                    $http.put('api/users', user);
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
    angular.module('FriendZone').controller('InviteModalController', ['$scope', '$state', '$http', '$uibModalInstance', 'events',
        function ($scope, $state, $http, $uibModalInstance, events) {
            $scope.init = function () {
                $scope.modal = {};
                $scope.modal.pageSize = 10;
                $scope.modal.events = [];
                $scope.modal.currentEventsPage = 1;
                $scope.modal.filteredEvents = [];

                $http.get('api/events/many', {
                    params: {
                        ids: events
                    }
                }).success(function(res){
                    $scope.modal.events = res;
                    $scope.eventsPageChanged(1);
                });
            };

            $scope.eventsPageChanged = function(current){
                $scope.modal.currentEventsPage = current;
                $scope.modal.filteredEvents = [];
                var start = ($scope.modal.currentEventsPage - 1) * $scope.modal.pageSize;
                var end = start + $scope.modal.pageSize;
                $scope.modal.filteredEvents = $scope.modal.events.slice(start, end);
            };

            $scope.invite = function (event) {
                $uibModalInstance.close(event);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.init();
        }]);
}());

