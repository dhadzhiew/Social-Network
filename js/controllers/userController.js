app.controller('userController', function($scope, authentication, $routeParams, $location, DEFAULT_USER_AVATAR, userData){
    $scope.defaultUserAvatar = DEFAULT_USER_AVATAR;
    $scope.user = {};
    $scope.user.username = authentication.getUsername();
    $scope.visitUser = {};
    function clearData() {
        $scope.loginData = {};
        $scope.registerData = {};
    };

    $scope.login = function login(){
        $scope.loadingLogin = true;
        authentication.login($scope.loginData)
            .success(function(serverData){
                $scope.invalidLogin = false;
                $scope.loadingLogin = false;
                authentication.setCredentials(serverData);
                clearData();
                $location.path('/')
            })
            .error(function(error){
                $scope.invalidLogin = true;
                $scope.loadingLogin = false;
            });
    };

    $scope.register = function register(){
        $scope.loadingRegister = true;

        authentication.register($scope.registerData)
            .success(function(serverData){
                $scope.isLogged = true;
                $scope.loadingRegister = false;
                $scope.registerErrors = [];
                authentication.setCredentials(serverData);
                clearData();
                $location.path('/');
            })
            .error(function(error){
                $scope.registerErrors = error.modelState[""];
                $scope.loadingRegister = false;
            });
    };

    $scope.loadUserData = function(){
        userData.getUserData()
            .success(function(serverData){
                $scope.user.username = serverData.username;
                $scope.user.name = serverData.name;
                $scope.user.profileImageData = serverData.profileImageData;
            })
            .error();
        userData.getFriendRequests()
            .success(function(serverData){
                $scope.user.friendRequests = serverData;
            })
            .error();
    };

    $scope.loadMyFriends = function(){
        userData.getFriends()
            .success(function(serverData){
                $scope.user.friends = serverData;
            })
            .error(function(){

            });
    };

    $scope.loadVisitUserData = function loadVisitUserData(){
        userData.getUserDataByUsername($routeParams.username)
            .success(function(data){
                $scope.visitUser = data;
            });
    };

    $scope.loadVisitUserPreviewFriends = function(){
        userData.getFriendFriendsPreview($routeParams.username)
            .success(function(serverData){
                $scope.visitUser.friendsPreview = serverData;
            });
    };

    $scope.acceptFriendRequest = function(id){
        userData.acceptFriendRequest(id)
            .success(function(){
                $scope.user.friendRequests
                    .forEach(function(req){
                        $scope.loadMyFriends();
                        if(req.id === id){
                            req.processed = true;
                        }
                    });
                userData.getFriends()
                    .success(function(serverData){
                        $scope.friends = serverData;
                    })
                    .error(function(){

                    });
            });
    };

    $scope.rejectFriendRequest = function(id){
        userData.rejectFriendRequest(id)
            .success(function(){
                $scope.user.friendRequests
                    .forEach(function(req){
                        if(req.id === id){
                            req.processed = true;
                        }
                    });
            });
    };

    $scope.sendRequest = function sendRequest(){
        userData.sendFriendRequest($scope.visitUser.username)
            .success(function(){
                $scope.visitUser.hasPendingRequest = true;
            });
    };

});