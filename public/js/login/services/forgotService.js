angular.module('app.login')

    .factory('forgotService',["$http", "config", function($http, config){
        var baseUrl = config.baseUrl;
        return {
            forgotPassword: function (mobile, callback) {
                var url = baseUrl + "/vc";
                var query = {mobile:mobile};
                $http.get(url, {params:query})
                    .success(function (res) {
                        if (res.statusCode == 200) {
                            callback(null, res);
                        } else {
                            callback(res.message);
                        }
                    }).error(function (err) {
                        callback(err);
                    });
            },
            updatePassword: function (mobile,verificationCode,password, callback) {
                var url = baseUrl + "/updatepassword/"+verificationCode;
                $http.post(url, {mobile:mobile,password:password})
                    .success(function (res) {
                        if (res.statusCode == 200) {
                            callback(null, res.data);
                        } else {
                            callback(res.message);
                        }
                    }).error(function (err) {
                        callback(err);
                    });
            }
        }


    }]);