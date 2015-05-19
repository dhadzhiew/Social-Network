app.controller('userController', function($scope, authentication){
    function clearData() {
        $scope.loginData = {};
        $scope.registerData = {};
    };

    $scope.login = function login(){
        $scope.loadingLogin = true;
        authentication.login($scope.loginData)
            .success(function(serverData){
                $scope.invalidLogin = false;
                $scope.loadingLogin = false;
                authentication.setCredentials(serverData);
                clearData();
            })
            .error(function(error){
                $scope.invalidLogin = true;
                $scope.loadingLogin = false;
            });
    };

    $scope.register = function register(){
        $scope.loadingRegister = true;
        authentication.register($scope.registerData)
            .success(function(serverData){
                $scope.loadingRegister = false;
                $scope.registerErrors = [];
                authentication.setCredentials(serverData);
                clearData();
            })
            .error(function(error){
                console.log(error);
                $scope.registerErrors = error.modelState[""];
                $scope.loadingRegister = false;
            });
    }
});