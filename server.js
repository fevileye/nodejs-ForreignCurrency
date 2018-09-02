const express = require('express');
const router = require ('./controller/router.js');
const bodyParser = require('body-parser');

module.exports.init = function(db){
  
  const app = express();

  app.use(bodyParser.json());

  router.init(db,app);

  return app;
}