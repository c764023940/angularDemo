var memberService = require("../services/memberService");
var dateFormat = require("../utils/dateFormat");
exports.getMemberList = function(req,res) {
    var query = req.query;
    memberService.getMemberList(query,function(err, list) {
        if(err) {
            res.json({statusCode:500,message:"系统错误"});
            return;
        }
        res.json(list);
    });
};
exports.addMember = function(req, res) {
    var createTime = dateFormat.newDateFormat(),
        remark = '无',
        status = 0,
        createN = req.user.name || '成飞',
        birthday = dateFormat.format(req.body.birthday);
    //包装信息
    var userInfo = {
        userName : req.body.userName,
        name : req.body.name,
        nickName : req.body.nickName,
        password : req.body.password,
        mobile : req.body.mobile,
        email : req.body.email,
        birthday : birthday,
        status : status,
        remark : remark,
        sex : req.body.sex,
        createTime: createTime,
        createN : createN
    };
    memberService.addMember(userInfo, function(err,result) {
        if(err) {
            res.json({statusCode:500,message:"系统错误"});
            return;
        }
        res.json(result);
    });
};
exports.delMember = function(req, res) {
    var memberId = req.params.id;
    memberService.delMember(memberId,function(err,result) {
        if(err) {
            res.json({statusCode:500,message:"系统错误"});
            return;
        }
        res.json(result);
    });
};
exports.editMember = function(req, res) {
    var memberId = req.params.id;
    var createTime = dateFormat.newDateFormat(),
        remark = '无',
        status = 0,
        createN = req.user.name || '成飞',
        birthday = dateFormat.format(req.body.birthday);
    //包装信息
    var userInfo = {
        id : memberId,
        userName : req.body.userName,
        name : req.body.name,
        nickName : req.body.nickName,
        password : req.body.password,
        mobile : req.body.mobile,
        email : req.body.email,
        birthday : birthday,
        status : status,
        remark : remark,
        sex : req.body.sex,
        createTime: createTime,
        createN : createN
    };
    memberService.editMember(userInfo, function(err,result) {
        if(err) {
            res.json({statusCode:500,message:"系统错误"});
            return;
        }
        res.json(result);
    });
};
