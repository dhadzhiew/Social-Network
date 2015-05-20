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
        //$scope.registerData.profileImageData = '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';
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