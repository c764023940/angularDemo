angular.module('app.member')
    .controller('memberCtrl',['$scope', "$timeout", '$state', 'toasterService', 'memberService',
    function($scope, $timeout, $state, toasterService, memberService) {
        $scope.loading = true;
        $scope.members = [];
        //分页对象
        $scope.pager = {
            pageNo : 1,
            pageSize : 6,
            totalItems : 0
        };
        $scope.search = {};
        $scope.getMemberList = function() {
            var query = {
                pageNo: $scope.pager.pageNo,
                pageSize: $scope.pager.pageSize,
                searchInfo : $scope.search.detailInfo
            };
            memberService.getMemberList(query)
                .then(function(res){
                    $scope.members = res.data;
                    $scope.pager.totalItems = res.totalItems;
                },
            function(err){
                toasterService.errMsg();
            }).finally(function() {
                    $scope.loading = false;
                });
        };
        $scope.getMemberList();
        var timeout;
        $scope.$watch("search.detailInfo", function(nv,ov) {
            if(nv != ov) {
                if(timeout) $timeout.cancel(timeout);
                timeout = $timeout(function() {
                    $scope.getMemberList();
                },500);
            }
        });
        $scope.editMember = function(m) {
            memberService.setTemp(m);
            $state.go("menu.addMember", {memberId: m.id});
        };
        $scope.delMemberById = function(m) {
            memberService.delMember(m.id);
            $scope.getMemberList();
        };
    }])
    .controller('memberDetailCtrl', ['$scope','$state', '$stateParams', 'toasterService', 'memberService',
        function($scope,$state,$stateParams, toasterService, memberService) {
            $scope.userInfo = {};
            var memberId = $stateParams.memberId;
            if(typeof memberId != 'undefined') {
                $scope.userInfo = memberService.getTemp();
                if($scope.userInfo.sex == '男') {
                    $scope.selectM = true;
                }
            }
            var checkTel = function(tel) {
                var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
                return mobile.test(tel) || phone.test(tel);
            };
            var checkUserName=function(userName){
                var regex=/^[0-9A-Za-z_]{6,15}$/;
                return regex.test(userName);
            };
            $scope.startDateOpened = false;
            $scope.openStartDate = function (e) {
                $scope.startDateOpened = !$scope.startDateOpened;
            };
            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yyyy',
                maxDate: new Date(2030, 01, 01),
                minDate: new Date(1980, 01, 01),
                startingDay: 1
            };
            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            };
            $scope.save = function() {
                if(!$scope.userInfo.userName) {
                    toasterService.errMsg('提示', '请填写用户名');
                    return;
                }
                if(!checkUserName($scope.userInfo.userName)){
                    toasterService.errMsg('提示', '请输入正确的用户名');
                    return;
                }
                if(!$scope.userInfo.password) {
                    toasterService.errMsg('提示', '请填写密码');
                    return;
                }
                if(!$scope.userInfo.name) {
                    toasterService.errMsg('提示', '请填写姓名');
                    return;
                }
                if(!$scope.userInfo.mobile) {
                    toasterService.errMsg('提示', '请填写手机号码');
                    return;
                }
                if(!checkTel($scope.userInfo.mobile)) {
                    toasterService.errMsg('提示', '请输入正确的手机号');
                    return;
                }
                $scope.loading = true;
                if(typeof memberId != 'undefined'){
                    memberService.editMember($scope.userInfo,memberId)
                        .then(function(res){
                            toasterService.sucMsg('提示','修改成功');
                            $state.go('menu.members');
                        },function(err) {
                            toasterService.errMsg('提示', err);
                        }).finally(function() {
                            $scope.loading = false;
                        });
                    return;
                }
                memberService.addMember($scope.userInfo)
                    .then(function(res){
                        toasterService.sucMsg('提示','创建成功');
                        $state.go('menu.members');
                    },function(err) {
                        toasterService.errMsg('提示', err);
                    }).finally(function() {
                        $scope.loading = false;
                    });
            };
            $scope.selectM = false;
            $scope.userInfo.sex = '女';
            $scope.selectMan = function() {
                $scope.selectM = !$scope.selectM;
                $scope.userInfo.sex = $scope.selectM ? '男': '女';
            };
        }]);