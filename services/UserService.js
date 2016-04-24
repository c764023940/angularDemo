var pool = require('./DBService.js').getPool();

exports.validate = function(userName, password, callback) {
	var saltedPwd = password + '{' + userName + '}';
	var pwd = require('crypto').createHash('md5').update(saltedPwd,'utf8').digest("hex");

	pool.query("select user_id as userId, userName, userPassword as password, userNickname, "
		+ "shop_id as shopId from user where userName=?", 
		[userName], function(err,rows,fields){
		if(err) {
			callback(err)
			return;
		}

		if(rows.length == 0) {
			callback("找不到用户")
			return;
		}

		if(rows[0].password != pwd){
			callback("密码错误");
			return;
		}

		var user = rows[0];
		getRole(user, callback);
	});
}
exports.login = function(userName, password, callback) {
	var sql = "select id,userName,passWord,mobile,nickName,email from user where userName=?"
	pool.query(sql,[userName], function(err, rows,fields) {
		if(err) {
			callback(err);
			return ;
		}
		if(rows.length == 0) {
			callback("找不到用户");
			return;
		}
		if(rows[0].passWord != password){
			callback("密码不正确");
			return;
		};
		var user = rows[0];
		callback(null,user);
	})
}
exports.getUserById = function(query, callback) {
	pool.query("select user_id as userId, userName, userPassword as password, userNickname," +
		"shop_id as shopId from user where user_id=?",[query.userId], function(err, rows,fields) {
		if(err) {
			callback(err)
			return;
		}
		if(rows.length == 0) {
			callback("找不到用户")
			return;
		}
		var user = rows[0];
		console.log(JSON.stringify(user));
		callback(null,user);
	});
}