app.controller('feedController', function($scope, authentication, feedData, DEFAULT_USER_AVATAR, DEFAULT_USER_COVER, $routeParams, notify){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;
    $scope.defaultUserCover = DEFAULT_USER_COVER;
    $scope.post = {};
    $scope.visitUserFeed = [];
    $scope.lastVisitUserPostId = '';

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

    $scope.loadUserFeed = function loadFeedUser(fake,pageSize){
        $scope.postLoading = true;
        feedData.getUserFeed($routeParams.username, $scope.lastVisitUserPostId, pageSize)
            .success(function(userFeed){
                $scope.postLoading = false;
                userFeed.forEach(function (post){
                    $scope.visitUserFeed.push(post);
                    $scope.lastVisitUserPostId = post.id;
                });
            });
    };

    $scope.loadAllComments = function(post){
        feedData.getAllComments(post.id)
            .success(function(data){
                data.allCommentsShowed = true;
                post.comments = data;
            });

    };

    $scope.loadFeed = function(){
        if($scope.postLoading){
            return;
        }
        if(!$routeParams.username){
            var lastId = $scope.myFeed[$scope.myFeed.length - 1].id || '' ;
            $scope.postLoading = true;
            feedData.getNewsFeed(lastId, 5)
                .success(function(userFeed){
                    $scope.postLoading = false;
                    userFeed.forEach(function(post){
                        $scope.myFeed.push(post);
                    });
                });
        }else{
            $scope.postLoading = true;
            $scope.loadUserFeed('', 5);
        }
    };

    $(document).ready(function(){
        //lastAddedLiveFunc();
        $(window).scroll(function(){

            var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
            var  scrolltrigger = 0.95;

            if  ((wintop/(docheight-winheight)) > scrolltrigger) {
                $scope.loadFeed();
            }
        });
    });


});