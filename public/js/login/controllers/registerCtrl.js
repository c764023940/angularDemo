/**
 * Created by caoyu on 2015/8/5.
 */
angular.module('app.login')
    .controller('registerCtrl', ['$scope', 'registerService', '$location', 'toaster','$interval','$timeout','loginService','$rootScope',
        function ($scope, registerService, $location, toaster,$interval,$timeout,loginService,$rootScope) {
            $scope.loading = false;
            $scope.company = {};
            $scope.company.admin = {};
            $scope.tip="获取验证码";
//验证手机号
            var checkTel = function (tel)
            {
                var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
                return mobile.test(tel) || phone.test(tel);
            }
            var checkUserName=function(userName){
                var regex=/^[0-9A-Za-z_]{6,15}$/;
                return regex.test(userName);
            }

            $scope.register = function () {
                if (!$scope.company.name) {
                    toaster.pop({type: 'info', title: '提示', body: '请输入公司名', showCloseButton: true});
                    return;
                }

                if (!$scope.company.admin.userName) {
                    toaster.pop({type: 'info', title: '提示', body: '请输入用户名', showCloseButton: true});
                    return;
                }
                if(!checkUserName($scope.company.admin.userName)){
                    toaster.pop({type: 'info', title: '提示', body: '用户名必须由6-15位英文、数字、下划线组成', showCloseButton: true});
                    return;
                }
                if (!$scope.company.admin.password) {
                    toaster.pop({type: 'info', title: '提示', body: '请输入密码', showCloseButton: true});
                    return;
                }
                if (!$scope.company.admin.mobile) {
                    toaster.pop({type: 'info', title: '提示', body: '请输入手机号', showCloseButton: true});
                    return;
                }
                if (!checkTel($scope.company.admin.mobile)) {
                    toaster.pop('info', "提示",  "请输入正确手机号");
                    return;
                }
                if (!$scope.company.code) {
                    toaster.pop({type: 'info', title: '提示', body: '请输入验证码', showCloseButton: true});
                    return;
                }
                $scope.loading = true;
                registerService.register($scope.company,function (err, res) {
                    $scope.loading = false;
                    if (err || !res) {
                        toaster.pop('error', "错误", err || "注册失败");
                    } else {
                        toaster.pop({type: 'success', title: '', body: '注册成功', showCloseButton: true});
                        $scope.errMsg = null;
                        $scope.loading = true;
                        loginService.login($scope.company.admin.userName, $scope.company.admin.password, function(err, userInfo) {
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
                                $location.path("/profile");
                                return;
                            }

                            toaster.pop({
                                type: 'error',
                                title: '提示',
                                body: '登陆失败',
                                showCloseButton: true
                            });
                        });
                    }
                });
            };
            var interval;
            $scope.getCode = function () {
                if($scope.getCoding){
                    return;
                }

                if (!$scope.company.admin.mobile) {
                    toaster.pop({type: 'info', title: '提示', body: '请输入手机号', showCloseButton: true});
                    return;
                }

                if (!checkTel($scope.company.admin.mobile)) {
                    toaster.pop('info', "提示",  "请输入正确手机号");
                    return;
                }

                $scope.loading = true;
                registerService.getCode($scope.company.admin.mobile, function (err, res) {
                    $scope.loading = false;
                    if (err) {
                        toaster.pop('error', "错误", err || "获取验证码失败");

                    } else {
                        $scope.tip="";
                        $scope.getCoding=true;
                        $scope.time=60;
                        $interval.cancel(interval);
                        interval = $interval(function(){
                            $scope.time--;
                            if($scope.time == 0){
                                $scope.time='';
                                $scope.tip="获取验证码";
                                $interval.cancel(interval);
                                $scope.getCoding = false;
                            }
                        },1000);

                    }
                });

            }

        }]);