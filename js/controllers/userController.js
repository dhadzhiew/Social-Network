app.controller('userController', function($scope, authentication){

    function clearData() {
        $scope.loginData = {};
        $scope.registerData = {};
    };

    $scope.login = function login(){
        authentication.login($scope.loginData)
            .success(function(serverData){
                authentication.setCredentials(serverData);
                clearData();
            })
            .error(function(error){
                notifyService.error("Invalid login", error.message);
            });
    }
});