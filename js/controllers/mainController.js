app.controller('mainController', function($scope, authentication, mainData, DEFAULT_USER_AVATAR){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;
    authentication.isLogged(function(isLogged){
        $scope.isLogged = isLogged;
    });

    mainData.getNewsFeed(undefined, 5)
        .success(function(serverData){
            console.log(serverData);
            $scope.wallData = serverData;
        }).error(function(){

        });

});