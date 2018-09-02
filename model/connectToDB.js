const {pg,Pool} = require("pg");

module.exports.pooling= function(dbConfig)
{
    var poolClient=new Pool({
      user: dbConfig.user,
      host: dbConfig.ipAddress,
      database: dbConfig.databaseName,
      port: dbConfig.port
    });

    return poolClient;
}

module.exports.doQuery=function (db,query){
  return new Promise (function (resolve,reject){
      db.query(query,function(err,res){
          if (err)
          {
            reject(err);
          }
          else
          {
            resolve(res);
          }
          
      });
  });
}
