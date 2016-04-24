var app = angular.module("app", ["app.toast", "ui.router", "ngAnimate", "ui.bootstrap", "ui.tree",
    "app.directives", "ja.qr", 'textAngular', "app.login", "app.profile", "app.member"]);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'partials/login/login.html',
            controller: 'loginCtrl',
            cache: false
        })
        .state('menu', {
            url: '/menu',
            cache: false,
            abstract: true,
            templateUrl: 'partials/home/menu.html',
            controller: 'appCtrl'
        })
        .state('menu.profile', {
            url: '/profile',
            cache: false,
            views:{
                'menuContent': {
                    templateUrl: 'partials/home/profile.html',
                    controller: 'profileCtrl'
                }

            }

        })
        .state('menu.members', {
            url: '/members',
            cache: false,
            views:{
                'menuContent': {
                    templateUrl: 'partials/member/memberLists.html',
                    controller: 'memberCtrl'
                }

            }
        })
        .state('menu.addMember', {
            url: '/addMember?memberId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'partials/member/memberDetail.html',
                    controller: 'memberDetailCtrl as vm'
                }
            }

        })

})
app.factory('authInterceptor', ['$rootScope', '$q', '$location',
    function ($rootScope, $q, $location) {
        return {
            request: function (config) {
                if ($location.path().indexOf("/login") >= 0
                    || $location.path().indexOf("/register") >= 0
                    || $location.path().indexOf("/forgot") >= 0
                    || $location.path().indexOf("/newPassword") >= 0
                ) {
                    return config;

                }
                var rm = false;
                if (localStorage.remeberMe) {
                    rm = JSON.parse(localStorage.remeberMe);
                }
                if (rm) {
                    if (!localStorage.user) {
                        $location.path("/login");
                        return config;
                    }
                } else {
                    if (!sessionStorage.user) {
                        $location.path("/login");
                        return config;
                    }
                }
                var user;
                if (rm) {
                    user = JSON.parse(localStorage.user);
                } else {
                    user = JSON.parse(sessionStorage.user);
                }
                if (!user || !user.token) {
                    $location.path("/login");
                    return config;
                }

                var token = user.token;
                config.headers = config.headers || {};
                config.headers["token"] = token;

                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("user");
                    $location.path("/login");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 401) {
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("user");
                    //$location.path()不工作，强制跳转
                    window.location.href = "#login";
                } else {
                    return $q.reject(response);
                }
            }
        };
    }]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]);

/*
app.run(['$rootScope', '$modalStack',
    function ($rootScope, $modalStack) {
        $rootScope.$on('$locationChangeStart', function (event) {
            var top = $modalStack.getTop();
            if (top) {
                $modalStack.dismiss(top.key);
                event.preventDefault();
            }
        });
    }
]);
*/

/*app.directive("requirePermissions", ['loginService', function (loginService) {
    return {
        restrict: "A",
        link: function (scope, ele, attrs) {
            //格式: "resource|resouce.method"
            var rp = attrs.requirePermissions;
            var permissions = rp.split("|");

            var checkPermission = function () {
                ele.hide();
                for (var i = 0; i < permissions.length; i++) {
                    var permission = permissions[i];
                    if (loginService.hasPermission(permission)) {
                        ele.show();
                        break;
                    }
                }
            };

            //首先检查权限
            checkPermission();

            //权限发生变化时，重新检查权限
            scope.$on("authenticated", function (event, data) {
                checkPermission();
            });
        }
    }
}]);*/

app.controller("appCtrl", ["$rootScope", "$scope", "$location", '$uibModal', 'versionChecker',
    "loginService", 'toaster',
    function ($rootScope, $scope, $location, $uibModal, versionChecker, loginService,  toaster) {
        //检测更新
       /* versionChecker.checkUpdates();*/

        $scope.hideNav = function () {
            $('#app').removeClass('on-canvas');
        };

        $scope.isSpecificPage = function () {
            var path = $location.path();
            return path.indexOf('/login') >= 0
                || path.indexOf("/register") >= 0
                || path.indexOf('/lineup') >= 0
                || path.indexOf('/cv') >= 0
                || path.indexOf('/forgot') >= 0;
        };

        $scope.logout = function () {
            loginService.logout();
            $location.path("/login");
        };
        $rootScope.user = loginService.getUser();

        //监听浏览器关闭 不是正常退出
        //window.onbeforeunload = function(event){
        //    sessionStorage.testItem = "rest";
        //    var message = 'Important: Please click on \'Save\' button to leave this page.';
        //    if (typeof event == 'undefined') {
        //        event = window.event;
        //    }
        //    if (event) {
        //        event.returnValue = message;
        //    }
        //    return message;
        //var n = window.event.screenX - window.screenLeft;
        //var b = n > document.documentElement.scrollWidth-20;
        //if(b && window.event.clientY < 0 || window.event.altKey)
        //{
        //    //浏览器是关闭而不是刷新
        //    var state =  loginService.getRemeberMeState();
        //    if(!state){
        //        sellService.clearTempOrder();
        //        loginService.logout();
        //    }
        //window.event.returnValue = ""; //这里可以放置你想做的操作代码
        //}

        //};
    }])
    .controller('changeTopPasswordCtrl', ['$scope', '$location', '$uibModalInstance', 'user', 'userService', 'toaster',
        function ($scope, $location, $uibModalInstance, user, userService, toaster) {
            $scope.userName = user.userName;
            $scope.content = {};
            $scope.ok = function () {
                if (!$scope.content.oldPassword) {
                    toaster.pop("info", "提示", "原密码不能为空");
                    return;
                }
                if (!$scope.newPassword) {
                    toaster.pop("info", "提示", "新密码不能为空");
                    return;
                }
                if (!$scope.confirmPassword) {
                    toaster.pop("info", "提示", "确认密码不能为空");
                    return;
                }
                if ($scope.newPassword != $scope.confirmPassword) {
                    toaster.pop("info", "提示", "新密码与确认密码不同");
                    return;
                }
                $uibModalInstance.close({
                    userId: "" + user.id,
                    oldPassword: $scope.content.oldPassword,
                    newPassword: $scope.newPassword
                });

            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }]);