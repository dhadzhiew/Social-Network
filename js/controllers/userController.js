app.controller('userController', function($scope, authentication, $routeParams, $location, DEFAULT_USER_AVATAR, notify, userData){
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
                $scope.user = serverData;
                userData.getFriendRequests()
                    .success(function(serverData){
                        $scope.user.friendRequests = serverData;
                    })
                    .error();
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
        if($routeParams.username == authentication.getUsername()){
            userData.getFriends()
                .success(function(serverData){
                    $scope.visitUser.friendsPreview = serverData;
                })
                .error(function(error){
                    notify.showError(error);
                });
        }else{
            userData.getFriendFriendsPreview($routeParams.username)
                .success(function(serverData){
                    $scope.visitUser.friendsPreview = serverData;
                });
        }
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

    $scope.editProfile = function(form, user){
        console.log(user);
        if(user.tempProfileImageData && user.tempProfileImageData.size > 128000){
            notify.showError('Avatar size cannot be more than 128KB.');
            return;
        }
        if(user.tempCoverImageData && user.tempCoverImageData.size > 1024000){
            notify.showError('Cover size cannot be more than 1024KB.');
            return;
        }

        userData.editProfile(user)
            .success(function(data){
                notify.showInfo(data.message);
            }).error(function(serverError){
                notify.showError('', serverError);
            });
    };

    $scope.logout = function(){
        authentication.clearCredentials();
        $location.path('/');
    };

    $scope.changePassword = function (user){
        userData.changePassword(user)
            .success(function(serverData){
                notify.showInfo(serverData.message);
            }).error(function(error){
                notify.showError('Changing password failed.', error);
            });
    };

    $scope.loadAllFriends = function(){
        userData.getAllFriends()
            .success(function(friends){
                $scope.user.allFriends = friends;
            }).error(function(error){
                notify.showError('Loading friends failed.', error);
            });
    };
});