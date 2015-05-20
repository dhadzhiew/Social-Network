app.factory('mainData', function($http, authentication, BASE_URL_SERVICE){
    var service = {};

    service.getNewsFeed = function getWallFeed(startId, pageSize){
        return $http.get(
            BASE_URL_SERVICE + 'me/feed?StartPostId=' + startId + '&PageSize=' + pageSize,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    return service;
});