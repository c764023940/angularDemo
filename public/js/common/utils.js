angular.module('app.utils',[])

    .factory('utils',['$rootScope','$timeout', function($rootScope, $timeout){
        return {
            get2DigitFloat:function(val) { //获取两位浮点数
                if(!val) {
                    return 0;
                }

                var floatVal = parseFloat(val);
                if(isNaN(floatVal)) {
                    return 0;
                }

                return Math.round(floatVal * 100) / 100;
            },
            get6DigitFloat:function(val) { //获取两位浮点数
                if(!val) {
                    return 0;
                }

                var floatVal = parseFloat(val);
                if(isNaN(floatVal)) {
                    return 0;
                }

                return Math.round(floatVal * 1000000) / 1000000;
            },
            checkMobile:function (tel) {  //验证手机号
                var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
                return mobile.test(tel) || phone.test(tel);
            }
        }
    }]);