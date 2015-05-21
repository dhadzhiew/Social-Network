var app = angular.module('SocialNetwork', ['ngRoute']);

app.constant('BASE_URL_SERVICE', 'http://softuni-social-network.azurewebsites.net/api/');
app.constant('DEFAULT_USER_AVATAR', 'imgs/avatar.png');
app.constant('BASE_USER_LANDSCAPE', 'imgs/landscape.png');
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partial/home.html',
            controller: 'mainController'
        })
        .when('/Login', {
            templateUrl : 'partial/login.html',
            controller: 'userController'
        })
        .when('/Register', {
            templateUrl: 'partial/register.html',
            controller: 'userController'
        })
        .when('/user/:username', {
            templateUrl: 'partial/user.html',
            controller: 'userController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
