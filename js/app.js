var app = angular.module('SocialNetwork', ['ngRoute']);

app.constant('BASE_URL_SERVICE', 'http://softuni-social-network.azurewebsites.net/api/');
app.constant('DEFAULT_USER_AVATAR', 'imgs/avatar.png');
app.constant('DEFAULT_USER_COVER', 'imgs/cover.png');
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
            controller: 'mainController'
        })
        .when('/profile', {
            templateUrl: 'partial/editProfile.html',
            controller: 'mainController'
        })
        .when('/user/:username/friends', {
            templateUrl: 'partial/friendFriends.html',
            controller: 'mainController'
        })
        .when('/friends', {
            templateUrl: 'partial/friendsPage.html',
            controller: 'mainController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
app.run(function($rootScope, $location, authentication) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        authentication.isLogged(function(isLogged){
            if(($location.path().indexOf('/Login') != -1 || $location.path().indexOf('/Register') != -1) && isLogged){
                $location.path('/');
            }

            if(($location.path().indexOf('user') != -1 || $location.path().indexOf('/friends') != -1 || $location.path().indexOf('/profile') != -1) && !isLogged){
                $location.path('/');
            }
        });
    });
});