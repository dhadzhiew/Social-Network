app.factory('feedData', function($http, authentication, BASE_URL_SERVICE){
    var service = {};
    var serviceUrl = BASE_URL_SERVICE + 'posts/';

    service.getNewsFeed = function getWallFeed(startId, pageSize){
        return $http.get(
            BASE_URL_SERVICE + 'me/feed?StartPostId=' + startId + '&PageSize=' + pageSize,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.getUserFeed = function getUserFeed(username, startId, pageSize){
        return $http.get(
            BASE_URL_SERVICE + 'users/' + username + '/wall?StartPostId=' + startId + '&PageSize=' + pageSize,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.writePost = function(data){
        return $http.post(
            serviceUrl,
            data,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.likePost = function likePost(postId){
        return $http({
            method: "POST",
            url: serviceUrl + postId + '/likes',
            headers: authentication.getHeaders()
        });
    };

    service.unlikePost = function unlikePost(postId){
        return $http({
            method: "DELETE",
            url: serviceUrl + postId + '/likes',
            headers: authentication.getHeaders()
        });
    };

    service.addCommentToPost = function addCommentToPost(postId, commentContent){
        var data = {
            commentContent: commentContent
        };
        return $http({
            url: serviceUrl + postId + '/comments',
            method: "POST",
            headers: authentication.getHeaders(),
            data: data
        });
    };

    service.likeComment = function likeComment(postId, commentId){
        return $http({
            url: serviceUrl + postId + '/comments/' + commentId + '/likes',
            method: "POST",
            headers: authentication.getHeaders()
        });
    };

    service.unlikeComment = function unlikeComment(postId, commentId){
        return $http({
            url: serviceUrl + postId + '/comments/' + commentId + '/likes',
            method: "DELETE",
            headers: authentication.getHeaders()
        });
    };

    service.editPost = function editPost(post){
        var data = {
            postContent: post.postContent
        };
        return $http({
            url: serviceUrl + post.id,
            method: "PUT",
            data: data,
            headers: authentication.getHeaders()
        });
    };

    service.deletePost = function deletePost(postId){
        return $http({
            url: serviceUrl + postId,
            method: "DELETE",
            headers: authentication.getHeaders()
        });
    };

    service.deleteComment = function deleteComment(postId, commentId){
        return $http({
            url: serviceUrl + postId + '/comments/' + commentId,
            method: "DELETE",
            headers: authentication.getHeaders()
        });
    };

    service.editComment = function editComment(postId, comment){
        var data = {
            commentContent: comment.commentContent
        };

        return $http({
            url: serviceUrl + postId + '/comments/' + comment.id,
            method: "PUT",
            data: data,
            headers: authentication.getHeaders()
        });
    };

    return service;
});