var mysql = require('mysql');
var config = require('../config/config.js').config();

var pool = mysql.createPool(config.db);

exports.getPool = function(){
	return pool;
};