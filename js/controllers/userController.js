app.controller('userController', function($scope, authentication, $location){
    function clearData() {
        $scope.loginData = {};
        $scope.registerData = {};
    };

    authentication.isLogged(function(isLogged){
        $scope.isLogged = isLogged;
        if(($location.path() === '/Login' || $location.path() === '/Register') && isLogged){
            $location.path('/');
        }
    });

    $scope.login = function login(){
        $scope.loadingLogin = true;
        authentication.login($scope.loginData)
            .success(function(serverData){
                $scope.invalidLogin = false;
                $scope.loadingLogin = false;
                authentication.setCredentials(serverData);
                clearData();
                $location.path('/')
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
                $location.path('/');
            })
            .error(function(error){
                console.log(error);
                $scope.registerErrors = error.modelState[""];
                $scope.loadingRegister = false;
            });
    }
});