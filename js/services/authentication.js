app.factory('authentication', function adsData($http, BASE_URL_SERVICE) {
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

    service.isLogged = function(logged){
        $http.get(BASE_URL_SERVICE + 'me',{
            headers: service.getHeaders()
        })
            .success(function(serverData){
                if(serverData.username == localStorage.username){
                    logged(true);
                }else{
                    logged(false);
                }
            })
            .error(function(){
                logged(false);
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