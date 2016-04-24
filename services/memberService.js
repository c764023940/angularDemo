var pool = require('./DBService.js').getPool();
exports.getMemberList = function(query, callback) {
    var limit = parseInt(query.pageSize);
    var page = parseInt(query.pageNo);
    var searchInfo = query.searchInfo;
    var startIndex = (page-1)*limit;
    var sqlCount,
        sql,
        countParams,
        params;
    if(typeof searchInfo == 'undefined') {
        sqlCount = "select count(1) as total from user";
        countParams = [];
        sql = "select id,name,userName,mobile,nickName,email,createTime,birthday from user limit ?,?";
        params = [startIndex,limit];
    }else {
        searchInfo = '%' + searchInfo + '%';
        sqlCount = "select count(1) as total from user where (name like ? or userName like ? or mobile like ? or email like ?)";
        countParams = [searchInfo,searchInfo,searchInfo,searchInfo],
        sql = "select id,name,userName,mobile,nickName,email,createTime,birthday from user where (name like ? or userName like ? or mobile like ? or email like ?) limit ?,?";
        params = [searchInfo,searchInfo,searchInfo,searchInfo,startIndex,limit];
    }

    pool.query(sqlCount,countParams,function(err, rows, fields) {
        if(err) {
            callback(err);
            return;
        }
        var total = rows[0].total;
        if(total == 0) {
            callback(null,{statusCode: 200,data:[],message:"没有数据",pageNo:startIndex,pageSize:limit,totalItems:total});
            return;
        }
        pool.query(sql,params, function(err,rows,fields) {
            if(err) {
                callback(err);
                return;
            }
            callback(null,{statusCode: 200,data:rows,message:"查询成功",pageNo:startIndex,pageSize:limit,totalItems:total});
        });
    });
};
exports.addMember = function(userInfo, callback) {
    var sql = "insert into user (name,userName,Password,mobile,nickname,createTime,remark,status,email,birthday,createN) values (?,?,?,?,?,?,?,?,?,?,?)";
    var params = [userInfo.name,userInfo.userName,userInfo.password,userInfo.mobile,userInfo.nickName,userInfo.createTime,userInfo.remark,userInfo.status,userInfo.email,userInfo.birthday,userInfo.createN];
    pool.query(sql,params,function(err, rows, fields){
        if(err) {
            callback(err);
            return;
        }
        callback(null,{statusCode: 200,message:"创建成功"});
    });
};
exports.delMember = function(id, callback) {
    var sql = "delete from user where id = ?";
    pool.query(sql,[id],function(err,rows) {
        if(err) {
            callback(err);
            return;
        }
        callback(null,{statusCode: 200,message:"删除成功"});
    });
};
exports.editMember = function(userInfo, callback) {
    var sql = "update user set name=?,userName=?,Password=?,mobile=?,nickname=?,createTime=?,remark=?,status=?,email=?,birthday=?,createN=? where id = ?";
    var params = [userInfo.name,userInfo.userName,userInfo.password,userInfo.mobile,userInfo.nickName,userInfo.createTime,userInfo.remark,userInfo.status,userInfo.email,userInfo.birthday,userInfo.createN,userInfo.id];
    pool.query(sql,params,function(err, rows, fields){
        if(err) {
            console.log(JSON.stringify(userInfo));
            callback(err);
            return;
        }
        callback(null,{statusCode: 200,message:"保存成功"});
    });
};