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

    return service;
});