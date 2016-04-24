/**
 * Created by caoyu on 2015/8/5.
 */
angular.module('app.login')

    .factory('registerService',["$http", "config", function($http, config){
        var baseUrl = config.baseUrl;

        var _register = function(company, callback) {
            var url = baseUrl + "/register";
            $http.post(url, company)
                .success(function(res){
                    if(res.statusCode == 200) {
                        company = res.data;
                        callback(null, company);
                    } else {
                        company = null;
                        callback(res.message);
                    }
                }).error(function(err){
                    company= null;
                    callback(err);
                });
        };
        var _getCode=function(mobile,callback){
            var url = baseUrl +"/vc";
            $http.get(url,{params:{mobile:mobile}})
                .success(function(res){
                    if(res.statusCode == 200) {
                        var  code = res.data;
                        callback(null, code);
                    } else {

                        callback(res.message);
                    }
                }).error(function(err){

                    callback(err);
                });
        };

        return {
            register:_register,
            getCode:_getCode

        }
    }]);