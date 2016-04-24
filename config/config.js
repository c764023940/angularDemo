var env = require("./config.json");

exports.config = function() {
    var node_env = process.env.NODE_ENV || 'dev';
    return env[node_env];
};