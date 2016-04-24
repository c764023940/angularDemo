angular.module('app.member')
    .factory('memberService', ['$http','$q', 'config',
        function($http, $q, config){
            var baseUrl = config.baseUrl;
            var temp_member = {};
            return {
                getMemberList : function(pager){
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    var url = baseUrl + "/memberList";
                    $http.get(url,{params:pager})
                        .success(function(res){
                            if(res.statusCode == 200) {
                                deferred.resolve(res);
                                return;
                            }
                            deferred.reject(res.message);
                        }).error(function(err){
                            deferred.reject(err);
                        });
                    return promise;
                },
                addMember : function(userInfo) {
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    var url = baseUrl +  "/addMember";
                    $http.post(url,userInfo)
                        .success(function(res){
                            if(res.statusCode == 200) {
                                deferred.resolve(res);
                                return;
                            }
                            deferred.reject(res.message);
                        }).error(function(err) {
                            deferred.reject(err);
                        });
                    return promise;
                },
                delMember : function(id) {
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    var url = baseUrl + "/delMember/" + id;
                    $http.get(url)
                        .success(function(res) {
                            if(res.statusCode == 200) {
                                deferred.resolve(res);
                                return;
                            }
                            deferred.reject(res.message);
                        }).error(function(err) {
                            deferred.reject(err);
                        });
                    return promise;
                },
                editMember : function(userInfo,id) {
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    var url = baseUrl + "/editMember/" + id;
                    $http.post(url,userInfo)
                        .success(function(res) {
                            if(res.statusCode == 200) {
                                deferred.resolve(res);
                                return;
                            }
                            deferred.reject(res.message);
                        }).error(function(err) {
                            deferred.reject(err);
                        });
                    return promise;
                },
                setTemp : function(member) {
                    temp_member = member;
                },
                getTemp : function() {
                    return temp_member;
                }
            }
        }]);