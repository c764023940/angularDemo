var userService = require("../services/UserService");
var tokenService = require("../services/TokenService");
var jsonWrite = require("../services/jsonWrite");
exports.login = function (req, res) {
  userService.login(req.body.userName, req.body.password, function(err, user){
    if(err){
      jsonWrite.jsonEntity(res,401,null,err||"用户名或密码错误");
      return;
    }

    delete user.passWord;
    //res.cookie('token', 'this is a fake token');
    var copy = {};
    copy.userName = user.userName;
    copy.mobile = user.mobile;
    copy.nickName = user.nickName;
    copy.email = user.email;
    tokenService.sign(copy, function(err, token){
      if(err){
        jsonWrite.jsonEntity(res,500,null,"内部错误！");
      } else {
        user.token = token;
        jsonWrite.jsonEntity(res,200,user,"登录成功");
      }
    });
  });
};

exports.validateToken = function(req, res, next){
  //登陆请求不需要校验token
  if(req.path.indexOf('login') >= 0){
    next();
    return;
  }
 //获得token
  var token = req.get('token');

  if(!token) {
    jsonWrite.jsonEntity(res,401,null,"没有访问权限");
    return;
  }

  tokenService.verify(token, function(err, user){
    if(err){
      jsonWrite.jsonEntity(res,401,null,"没有访问权限");
    } else {
      req.user = user;
      next();
    }
  });
};
