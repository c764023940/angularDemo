exports.code = {
    ok: 200,
    err:401,
}
var entity = {};
exports.jsonEntity = function(res, code, data, message) {
    entity.statusCode = code;
    entity.data = data;
    entity.message = message;
    res.json(entity);
}
exports.jsonEntities = function(res, code, data, message, pageNo, pageSize, totalItems) {
    entity.statusCode = code;
    entity.data = data;
    entity.message = message;
    entity.pageNo = pageNo;
    entity.pageSize = pageSize;
    entity.totalItems = totalItems;
    res.json(entity);
}