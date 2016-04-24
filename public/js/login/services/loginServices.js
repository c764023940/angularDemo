angular.module('app.login')

.factory('loginService',["$http", "config", function($http, config){
	var baseUrl = config.baseUrl;

	var user = null;
	var permissions = null;
		var _setRemeberMeState = function(state){
			if (!state){
				localStorage.remeberMe = JSON.stringify(state);
			} else {
				localStorage.remeberMe = JSON.stringify(state);
			}
		};
		var _getRemeberMeState = function() {
			var rm = false;
			if (localStorage.remeberMe) {
				rm = JSON.parse(localStorage.remeberMe);
			}
			return rm;
		};
	var _login = function(userName, password, callback) {
		var url = baseUrl + "/login";
		$http.post(url, {userName:userName, password: password})
			.success(function(res){
				if(res.statusCode == 200) {
					user = res.data;
					//保存用户信息 rememberMe存localStorage 没有记住登录状态sessionStorage
					if (!_getRemeberMeState()){
						sessionStorage.user = JSON.stringify(user);
					} else {
						localStorage.user = JSON.stringify(user);
					};
					callback(null, user);
				} else {
					user = null;
					localStorage.removeItem('user');
					sessionStorage.removeItem('user');
					callback(res.message);
				}
			}).error(function(err){
				user = null;
				localStorage.removeItem('user');
				sessionStorage.removeItem('user');
				callback(err);
			});
	};

	var _getUser = function( ) {
		/*
		if(user) {
			return user;
		}
		*/
		user = null;
		if (_getRemeberMeState()) {
			if(localStorage.user) {
				user = JSON.parse(localStorage.user);
			}
		}else {
			if (sessionStorage.user) {
				user = JSON.parse(sessionStorage.user);
			}
		}
		return user;
	};

	var _getToken = function(){
		return user? user.token : "";
	};

	var _getUserName = function() {
		var user = _getUser();
		return user ? user.userName : "";
	};

	var _getOutletName = function() {
		var user = _getUser();
		return user ? user.outlet.name : "";
	};

	var _logout = function(){
		permissions = null;
		user = null;
		localStorage.removeItem('user');
		sessionStorage.removeItem('user');
	};

	var _getPermissions = function() {
		if(permissions) {
			return permissions;
		}
		if(!user) {
			return null;
		}

		try {
			permissions = "";
			var roles = user.roles;
			for(var i=0; i<roles.length; i++) {
				var role = roles[i];
				for(var j=0; j<role.permissions.length; j++) {
					var  p = role.permissions[j];
					permissions = permissions + ","
						+ p.resource.toLowerCase() + "." + p.method.toLowerCase();
				}
			}
			if(permissions.indexOf(',') == 0) {
				permissions = permissions.substring(1);
			}
			return permissions;
		} catch (err) {
			return null;
		}
	};

	var _hasPermission = function(permission) {
		permissions = _getPermissions();
		if(!permissions) {
			return false;
		}

		try {
			return permissions.indexOf(permission.toLowerCase()) >= 0;
		} catch (err) {
			return false;
		}
	};

	return {
		login:_login,
		getUser: _getUser,
		getToken: _getToken,
		getPermissions: _getPermissions,
		hasPermission: _hasPermission,
		logout: _logout,
		setRemeberMeState: _setRemeberMeState,
		getRemeberMeState: _getRemeberMeState
	}
}]);