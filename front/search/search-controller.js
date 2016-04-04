(function () {
    angular.module('FriendZone').controller('SearchController', ['$scope', '$state', '$http',
        function ($scope, $state, $http) {
            $scope.updateUserList = function(){
                $http.get('api/users', {
                    headers: {
                        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDU5NzkxNjIwLCJzdWIiOiJ1c2VyIn0.YynGJn_oV41NF7jh3VHTipNRYIxd_Qa8bmqdzQBHkPc'
                    },
                    params: {
                        group: 'user'
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.users = res;
                });
            };

            $scope.updateUserList();
        }]);
}());

