app.controller('feedController', function($scope, authentication, feedData, DEFAULT_USER_AVATAR, DEFAULT_USER_COVER, $routeParams, notify){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;
    $scope.defaultUserCover = DEFAULT_USER_COVER;
    $scope.post = {};

    $scope.writePost = function(username){
        var data = {
            postContent: $scope.post.postContent,
            username: username
        };
        feedData.writePost(data)
            .success(function(serverData){
                $scope.post = {};
                $scope.visitUserFeed.push(serverData);
                $scope.visitUserFeed = $scope.visitUserFeed.sort(function(a,b){
                    return b.id - a.id;
                });
            });
    };

    $scope.likePost = function(post){
        if(post.author.isFriend == false && post.wallOwner.isFriend == false && post.author.username != authentication.getUsername()){
            return;
        }
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

    $scope.submitComment = function submitComment(post){
        feedData.addCommentToPost(post.id, post.unsubmitCommentContent)
            .success(function(serverData){
                post.unsubmitCommentContent = '';
                post.comments.push(serverData);
                post.totalCommentsCount++;
            });
    };

    $scope.likeComment = function likeComment(post, comment){
        if(post.author.isFriend == false && post.wallOwner.isFriend == false && post.author.username != authentication.getUsername()){
            return;
        }

        if(!comment.liked){
            feedData.likeComment(post.id, comment.id)
                .success(function(){
                    comment.liked = true;
                    comment.likesCount++;
                });
        }else{
            feedData.unlikeComment(post.id, comment.id)
                .success(function(){
                    comment.liked = false;
                    comment.likesCount--;
                });
        }
    };

    $scope.rejectFriendRequest = function(id){
        userData.rejectFriendRequest(id)
            .success(function(){
                $scope.user.friendRequests
                    .forEach(function(req){
                        if(req.id === id){
                            req.processed = true;
                        }
                    });
            });
    };

    $scope.editPost = function editPost(form, post){

        if(form.$dirty){
            feedData.editPost(post)
                .success(function(){
                    post.editing = false;
                });
        }
    };

    $scope.deletePost = function deletePost(post){
        feedData.deletePost(post.id)
            .success(function(){
                if($routeParams.username){
                    $scope.loadUserFeed('', 5);
                }else{
                    $scope.loadMyFeed('', 5);
                }
            });
    };

    $scope.deleteComment = function deleteComment(post, comment){
        feedData.deleteComment(post.id, comment.id)
            .success(function(){
                comment.deleted = true;
                post.totalCommentsCount--;
            })
            .error(function(error){
                notify.showError('Liking failed.', error);
            });
    };

    $scope.editComment = function editComment(postId, comment){
        feedData.editComment(postId, comment)
            .success(function(){
                comment.editing = false;
            });
    };

    $scope.loadMyFeed = function loadMyFeed(startId, pageSize){
        feedData.getNewsFeed(startId, pageSize)
            .success(function(myFeed){
                $scope.myFeed = myFeed;
            });
    };

    $scope.loadUserFeed = function loadFeedUser(startId, pageSize){
        feedData.getUserFeed($routeParams.username, startId, pageSize)
            .success(function(userFeed){
                $scope.visitUserFeed = userFeed;
            });
    }

});