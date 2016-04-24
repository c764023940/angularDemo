angular.module('app.login')

    .controller('loginCtrl',['$rootScope', '$state', '$location', '$scope', 'loginService', 'toaster',
        function($rootScope, $state, $location, $scope, loginService, toaster){

            var user = loginService.getUser();
            if(user) {
                $rootScope.user = user;
                $rootScope.$broadcast("authenticated");
                $state.go("menu.profile");
                return;
            }
//初始化记住登录状态
            var ste = loginService.getRemeberMeState();
            $scope.loginState = ste;
            $scope.loginStateChanged = function(){
                loginService.setRemeberMeState($scope.loginState);
            };
            $scope.loading = false;

            $scope.login = function() {
                $scope.errMsg = null;

                if(!$scope.userName){
                    toaster.pop({
                        type: 'warning',
                        title: '提示',
                        body: '请输入用户名',
                        showCloseButton: true
                    });
                    return;
                }

                if(!$scope.password){
                    toaster.pop({
                        type: 'warning',
                        title: '提示',
                        body: '请输入密码',
                        showCloseButton: true
                    });
                    return;
                }

                $scope.loading = true;
                loginService.login($scope.userName, $scope.password, function(err, userInfo) {
                    $scope.loading = false;

                    if(err || !userInfo) {
                        toaster.pop({
                            type: 'error',
                            title: '提示',
                            body: '登陆失败',
                            showCloseButton: true
                        });
                        return;
                    }

                    if(userInfo) {
                        $scope.errMsg = null;
                        $rootScope.user = userInfo;
                        $rootScope.$broadcast("authenticated");
                        $state.go("menu.profile");
                        return;
                    }

                    toaster.pop({
                        type: 'error',
                        title: '提示',
                        body: '登陆失败',
                        showCloseButton: true
                    });
                });
            };

        }])

    .controller('noPermissionCtrl',['$rootScope','$state', '$scope', 'loginService',
        function($rootScope, $location, $scope, loginService){

            $scope.logout = function () {
                loginService.logout();
                $state.go("login");
            };

        }]);
