app.factory('feedData', function($http, authentication, BASE_URL_SERVICE){
    var service = {};

    service.getNewsFeed = function getWallFeed(startId, pageSize){
        return $http.get(
            BASE_URL_SERVICE + 'me/feed?StartPostId=' + startId + '&PageSize=' + pageSize,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.getFriendFeed = function getUserFeed(username, startId, pageSize){
        return $http.get(
            BASE_URL_SERVICE + 'users/' + username + '/wall?StartPostId=' + startId + '&PageSize=' + pageSize,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.writePost = function(data){
        return $http.post(
            BASE_URL_SERVICE + 'posts',
            data,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.likePost = function likePost(postId){
        return $http({
            method: "POST",
            url: BASE_URL_SERVICE + 'Posts/' + postId + '/likes',
            headers: authentication.getHeaders()
        });
    };

    service.unlikePost = function unlikePost(postId){
        return $http({
            method: "DELETE",
            url: BASE_URL_SERVICE + 'Posts/' + postId + '/likes',
            headers: authentication.getHeaders()
        });
    };

    service.addCommentToPost = function addCommentToPost(postId, commentContent){
        var data = {
            commentContent: commentContent
        };
        return $http({
            url: BASE_URL_SERVICE + 'posts/' + postId + '/comments',
            method: "POST",
            headers: authentication.getHeaders(),
            data: data
        });
    };

    service.likeComment = function likeComment(postId, commentId){
        return $http({
            url: BASE_URL_SERVICE + 'posts/' + postId + '/comments/' + commentId + '/likes',
            method: "POST",
            headers: authentication.getHeaders()
        });
    };

    service.unlikeComment = function unlikeComment(postId, commentId){
        return $http({
            url: BASE_URL_SERVICE + 'posts/' + postId + '/comments/' + commentId + '/likes',
            method: "DELETE",
            headers: authentication.getHeaders()
        });
    };

    return service;
});