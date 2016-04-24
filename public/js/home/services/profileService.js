/**
 * Created by caoyu on 2015/8/6.
 */
angular.module('app.login')

    .factory('profileService',["$http", "config", function($http, config) {

        var baseUrl = config.baseUrl;

        var _getTodayReport = function (callback) {
            var url = baseUrl + "/profile/today";
            $http.get(url)
                .success(function (res) {
                    if (res.statusCode == 200) {
                        callback(null, res);
                    } else {
                        callback(res.message);
                    }
                }).error(function (err) {
                    callback(err);
                });
        };

        var _getMonthReport=function(callback){
            var url=baseUrl+"/profile/monthreport";
            $http.get(url)
                .success(function (res) {
                    if (res.statusCode == 200) {
                        callback(null, res);
                    } else {
                        callback(res.message);
                    }
                }).error(function (err) {
                    callback(err);
                });
        };

        var _getConsumeSource=function(callback){
            var url=baseUrl+"/profile/consumesource";
            $http.get(url)
                .success(function (res) {
                    if (res.statusCode == 200) {
                        callback(null, res);
                    } else {
                        callback(res.message);
                    }
                }).error(function (err) {
                    callback(err);
                });
        }
        return {
            getTodayReport: _getTodayReport,
            getMonthReport:_getMonthReport,
            getConsumeSource:_getConsumeSource
        };
    }]);