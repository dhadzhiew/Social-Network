app.controller('mainController', function($scope, authentication, feedData, DEFAULT_USER_AVATAR, userData, $routeParams, DEFAULT_USER_COVER){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;
    $scope.defaultUserCover = DEFAULT_USER_COVER;
    $scope.post = {};
    authentication.isLogged(function(isLogged){
        $scope.isLogged = isLogged;
        if(isLogged){
            loadData();
        }else{
            authentication.clearCredentials();
        }
    });

    if($routeParams.username){
        loadCurrentProfileData($routeParams.username);
    }

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

    $scope.writePost = function(){
        var data = {
            postContent: $scope.post.postContent,
            username: $scope.currentProfileData.username
        };
        feedData.writePost(data)
            .success(function(serverData){
                $scope.currentProfileData.posts.push(serverData);
                $scope.currentProfileData.posts = $scope.currentProfileData.posts.sort(function(a,b){
                    return b.id - a.id;
                });
            });
    };

    $scope.sendRequest = function sendRequest(){
        $scope.currentProfileData.hasPendingRequest = true;
        //userData.makeFriendRequest($scope.currentProfileData.username);
    };

    function loadCurrentProfileData(username){
        $scope.currentProfileData = {};

        userData.getUserDataByUsername(username)
            .success(function(serverData){
                $scope.currentProfileData = serverData;
                if(serverData.isFriend){
                    userData.getUserFriends(username)
                        .success(function(serverData){
                            $scope.currentProfileData.friends= serverData;
                        });
                    feedData.getFriendFeed(username, '', 5)
                        .success(function(serverData){
                            $scope.currentProfileData.posts = serverData;
                            $scope.currentProfileData.posts = $scope.currentProfileData.posts.sort(function(a,b){
                                return b.id - a.id;
                            });
                        });
                }
            })
            .error(function(){

            });
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
                $scope.user.friendRequests = serverData;
            })
            .error();
    }

});