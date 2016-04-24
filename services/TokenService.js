var jwt = require('jsonwebtoken');
var privateKey = "chengfei";
//签名
exports.sign = function (src, callback) {
    var token = jwt.sign(src, privateKey);
    callback(null, token);
}
//验证签名
exports.verify = function (token, callback) {
    jwt.verify(token, privateKey, function (err, decoded) {
        if (err) {
            callback(err);
        } else {
            callback(null, decoded);
        }
    });
}