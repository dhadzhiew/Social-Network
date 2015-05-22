app.controller('mainController', function($scope, authentication, feedData, DEFAULT_USER_AVATAR, userData, $routeParams, DEFAULT_USER_COVER){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;
    $scope.defaultUserCover = DEFAULT_USER_COVER;
    $scope.post = {};
    authentication.isLogged(function(isLogged){
        $scope.isLogged = isLogged;
        if(isLogged){
            loadData();
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

    $scope.likePost = function(post){
        if(!post.liked){
            feedData.likePost(post.id)
                .success(function(){
                    post.liked = true;
                    post.likesCount++;
                })
                .error(function(error){
                    console.log(error);
                });
        }else{
            feedData.unlikePost(post.id)
                .success(function(){
                    post.liked = false;
                    post.likesCount--;
                });
        }
    };

    $scope.sendRequest = function sendRequest(){
        $scope.currentProfileData.hasPendingRequest = true;
    };

    $scope.submitComment = function submitComment(post){
        feedData.addCommentToPost(post.id, post.unsubmitCommentContent)
            .success(function(serverData){
                post.unsubmitCommentContent = '';
                post.comments.push(serverData);
                post.totalCommentsCount++;
            });
    };

    $scope.likeComment = function likeComment(postId, comment){
        if(!comment.liked){
            feedData.likeComment(postId, comment.id)
                .success(function(){
                    comment.liked = true;
                    comment.likesCount++;
                });
        }else{
            feedData.unlikeComment(postId, comment.id)
                .success(function(){
                    comment.liked = false;
                    comment.likesCount--;
                });
        }
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