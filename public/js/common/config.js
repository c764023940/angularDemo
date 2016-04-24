angular.module('app.config',[])

    .constant('config', {
        VERSION: "1.0.3",
        ORDER_SOURCE: "pos",
        DELIVERY_METHOD_DEFAULT: 0,
        DELIVERY_METHOD_DELIVER_TO_DOOR: 1,
        /*devstart*/
        //baseUrl: "http://test.mipopos.com/pos"
        /*devend*/
        /*productstart
         baseUrl: "http://api.mipopos.com/pos"
         productend*/
        baseUrl: "http://localhost:3000"
    })

    .factory('versionChecker',['$http', 'config', function($http, config){
        var ret = {};
        ret.checkUpdates = function() {
            var url = config.baseUrl + "/version";
            $http.get(url).success(function(v) {
                //如果有版本更新，则强制刷新，防止JS过时
                if(v && v > config.VERSION) {
                    location.reload(true);
                }
            });
        };
        return ret;
    }]);