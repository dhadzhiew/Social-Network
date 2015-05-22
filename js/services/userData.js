app.factory('userData', function(authentication, $http, BASE_URL_SERVICE) {
    var service = {};

    var serviceUrl = BASE_URL_SERVICE + 'me/';

    service.getFriends = function getFriends(){
        return $http.get(
            serviceUrl + 'friends/preview',
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.getUserFriends  = function getUserFriends(username){
        return $http.get(
            BASE_URL_SERVICE + 'users/' + username + '/friends',
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.searchUsersByName = function searchFriends(userName){
        return $http.get(
            BASE_URL_SERVICE + 'users/search?searchTerm=' + userName,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.getUserData = function getUserData(){
        return $http.get(
            serviceUrl,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.getUserDataByUsername = function getUserDataByUsername(username){
        return $http.get(
            BASE_URL_SERVICE + 'users/' + username,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.getFriendRequests = function getFriendRequests(){
        return $http.get(
            serviceUrl + 'requests',
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.makeFriendRequest = function(username){
        return $http.post(
            serviceUrl + 'requests/' + username,
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.acceptFriendRequest = function acceptFriendRequest(id){
        return $http({
            method: 'PUT',
            url: BASE_URL_SERVICE + 'me/requests/' + id + '?status=approved',
            headers: authentication.getHeaders()
        });
    };

    service.rejectFriendRequest = function rejectFriendRequest(id){
        return $http({
            method: 'PUT',
            url: BASE_URL_SERVICE + 'me/requests/' + id + '?status=rejected',
            headers: authentication.getHeaders()
        });
    };

    service.sendFriendRequest = function sendFriendRequest(username){
        return $http({
            method: 'POST',
            url: BASE_URL_SERVICE + 'me/requests/' + username,
            headers: authentication.getHeaders()
        });
    };

    return service;
});