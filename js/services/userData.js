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

    service.getFriendFriendsPreview = function(username){
        return $http.get(
            BASE_URL_SERVICE + 'users/' + username + '/friends/preview',
            {
                headers: authentication.getHeaders()
            }
        );
    };

    service.editProfile = function(user){
        var data = {
            name: user.name,
            email: user.email,
            gender: user.gender
        };

        if(user.tempProfileImageData){
            data.profileImageData = user.tempProfileImageData.data;
        }else{
            data.profileImageData = user.profileImageData;
        }
        if(user.tempCoverImageData){
            data.coverImageData = user.tempCoverImageData.data;
        }else{
            data.coverImageData = user.coverImageData;
        }
        return $http(
            {
                url: serviceUrl,
                method: "PUT",
                headers: authentication.getHeaders(),
                data: data
            }
        );
    };

    service.changePassword = function(user){
        var data = {
            oldPassword: user.oldPassword,
            newPassword: user.password,
            confirmPassword: user.passwordAgain
        };
        return $http(
            {
                url: serviceUrl + 'changepassword',
                method: "PUT",
                headers: authentication.getHeaders(),
                data: data
            }
        );
    };

    service.getAllFriends = function(){
        return $http(
            {
                url: serviceUrl + 'friends',
                method: "GET",
                headers: authentication.getHeaders()
            }
        );
    };


    service.getUserAllFriends = function(username){
        return $http({
            url: BASE_URL_SERVICE + 'users/' + username + '/friends',
            method: "GET",
            headers: authentication.getHeaders()
        });
    };

    return service;
});