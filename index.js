const server = require("./server.js");
const configs = require("./configs/initConfig.js");
const db= require("./model/connectToDB.js");

const serverConfig= configs.getServerConfig();
const databaseConfig= configs.getDatabaseConfig();

const dbServer=  db.pooling(databaseConfig);
const appServer= server.init(dbServer);

appServer.listen(serverConfig.port,function(){
    console.log("Server on port %d is running",serverConfig.port);
});