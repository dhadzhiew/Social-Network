app.factory('authentication', function($http, BASE_URL_SERVICE) {
    var service = {};

    var serviceUrl = BASE_URL_SERVICE + 'users/';

    service.login = function(loginData){
        return $http.post(serviceUrl + 'Login', loginData);
    };

    service.register = function(registerData){
        return $http.post(serviceUrl + 'Register', registerData);
    };

    service.logout = function(){
        return $http.post(serviceUrl + 'Logout', null);
    };

    service.isLogged = function(callback){
        if(!localStorage.username){
            callback(false);
            return;
        }

        $http.get(BASE_URL_SERVICE + 'me',{
            headers: service.getHeaders()
        })
            .success(function(serverData){
                if(serverData.username == localStorage.username){
                    callback(true);
                }else{
                    service.clearCredentials();
                    callback(false);
                }
            })
            .error(function(error){
                if(error != null){
                    service.clearCredentials();
                }

                callback(false);
            });
    };

    service.setCredentials = function (serverData) {
        localStorage['accessToken'] = serverData.access_token;
        localStorage['username'] = serverData.userName;
    };

    service.getUsername = function () {
        return localStorage['username'];
    };

    service.clearCredentials = function () {
        localStorage.clear();
    };

    service.getHeaders = function() {
        return {
            Authorization: "Bearer " + localStorage['accessToken']
        };
    };

    service.isLoggedIn = function () {
        return localStorage['accessToken'];
    };

    return service;
});