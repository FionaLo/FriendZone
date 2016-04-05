(function (){
    angular.module('FriendZone').controller('EventController', ['$scope', '$state', '$http', '$uibModal', 'dataBus',
        function ($scope, $state, $http, $uibModal, dataBus) {
            $scope.init = function (){
                $scope.event = dataBus.get();
            };

            $scope.init();
        }]);
    angular.module('FriendZone').controller('EventModalController', ['$scope', '$state', '$http', '$uibModalInstance', 'event',
        function ($scope, $state, $http, $uibModalInstance, event) {
            $scope.modal = {};
            var modal = $scope.modal;
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
                $uibModalInstance.close($scope.modal.event);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());