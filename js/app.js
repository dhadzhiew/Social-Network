var app = angular.module('SocialNetwork', ['ngRoute']);

app.constant('BASE_URL_SERVICE', 'http://softuni-social-network.azurewebsites.net/api/');

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partial/home.html',
            controller: 'userController'
        })
        .when('/Login', {
            templateUrl : 'partial/login.html',
            controller: 'userController'
        })
        .when('/Register', {
            templateUrl: 'partial/register.html',
            controller: 'userController'
        })
        .otherwise({
            redirectTo: '/'
        });
});