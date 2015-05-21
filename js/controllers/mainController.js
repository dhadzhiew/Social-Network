app.controller('mainController', function($scope, authentication, feedData, DEFAULT_USER_AVATAR, userData){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;

    authentication.isLogged(function(isLogged){
        $scope.isLogged = isLogged;
        if(isLogged){
            loadData();
        }else{
            authentication.clearCredentials();
        }
    });

    $scope.showFriendRequests = function(){
        $scope.showFriends = true;
    };

    $scope.hideFriendRequests = function(){
        $scope.showFriends = false;
    };

    $scope.showSearchMenu = function(){
        $scope.shownSearchMenu = true;
    };

    $scope.hideSearchMenu = function(){
        $scope.shownSearchMenu = false;
    };

    $scope.searchUserByName = function(){
        userData.searchUsersByName($scope.search)
            .success(function(serverData){
                $scope.foundUsers = serverData;
            })
            .error();
    };

    $scope.writePost = function(user){
        feedData.writePost(user);
    };

    function loadData(){
        $scope.user = {};
            feedData.getNewsFeed('', 5)
            .success(function(serverData){
                $scope.wallData = serverData;
            }).error(function(){

            });
        userData.getFriends()
            .success(function(serverData){
                $scope.friends = serverData;
            })
            .error(function(){

            });
        userData.getUserData()
            .success(function(serverData){
                $scope.user.name = serverData.name;
                $scope.user.profileImageData = serverData.profileImageData;
            })
            .error();
        userData.getFriendRequests()
            .success(function(serverData){
                console.log(serverData);
                $scope.user.friendRequests = serverData;
            })
            .error();
    }

});