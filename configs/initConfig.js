const configs = require("../configs/config.json");

module.exports.getDatabaseConfig = function () {
    return configs.database;
}

module.exports.getServerConfig = function () {
    return configs.server;
}