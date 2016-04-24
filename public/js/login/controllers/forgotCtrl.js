angular.module('app.login')

    .controller('forgotCtrl',['$rootScope','$location', '$scope', 'toaster','forgotService','$interval',
        function($rootScope, $location, $scope, toaster,forgotService,$interval){
            $scope.tip="获取验证码";
            var interval;
//验证手机号
            var checkTel = function (tel)
            {
                var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
                return mobile.test(tel) || phone.test(tel);
            }
            $scope.getCode = function () {
                if($scope.getCoding){
                    return;
                }
                /*if(!$scope.userName){
                 toaster.pop('warning', "提示",  "请输入用户名");
                 return;
                 }*/
                if(!$scope.mobile){
                    toaster.pop('warning', "提示",  "请输入手机号");
                    return;
                }

                if (!checkTel($scope.mobile)) {
                    toaster.pop('info', "提示",  "请输入正确手机号");
                    return;
                }

                $scope.loading = true;
                forgotService.forgotPassword( $scope.mobile, function(err, res) {
                    $scope.loading = false;
                    if (err||!res) {
                        toaster.pop('error', "错误", err||res.message || "获取验证码失败");

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

            $scope.changePassword=function(){

                if (!checkTel($scope.mobile)) {
                    toaster.pop('info', "提示",  "请输入正确手机号");
                    return;
                }
                if(!$scope.verificationCode){
                    toaster.pop('warning', "提示",  "请输入验证码");
                    return;
                }
                if(!$scope.password){
                    toaster.pop('warning', "提示",  "请输入新密码");
                    return;
                }
                if(!$scope.rePassword){
                    toaster.pop('warning', "提示",  "请输入重复密码");
                    return;
                }
                if($scope.password!=$scope.rePassword){
                    toaster.pop('warning', "提示",  "两次密码不一致，请重新输入");
                    return;
                }

                $scope.loading = true;
                forgotService.updatePassword( $scope.mobile, $scope.verificationCode,$scope.password, function(err, userInfo) {
                    $scope.loading = false;

                    if(err||!userInfo) {
                        toaster.pop('error', "错误", err || "修改密码失败");
                        return;
                    }

                    if(userInfo) {
                        toaster.pop('info', "提示",  "修改密码成功");
                        $location.path("/login");
                        return;
                    }

                    toaster.pop('error', "错误", err || "修改密码失败");

                });

            }

        }]);
