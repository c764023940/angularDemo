angular.module('app.toast',['toaster'])

   .factory('toasterService',['toaster', function(toaster) {
        var _errMsg = function(title, error) {
            toaster.pop({
                type: 'info',
                title: title || '错误',
                body: error || '系统异常，请稍后',
                showCloseButton: true
            });
        };
        var _sucMsg = function(title, success) {
            toaster.pop({
                type: 'success',
                title: title || '提示',
                body: success || '操作成功',
                showCloseButton: true
            });
        };
        return {
            errMsg: _errMsg,
            sucMsg: _sucMsg
        }
    }]);