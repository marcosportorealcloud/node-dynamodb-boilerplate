var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");
var router = express.Router();
var createClientService = require("../src/modules/clients/services/createClientService");

AWS.config.update({
  region: "eu-west-2",
  accessKeyId: "fake",
  secretAccessKey: "fake2",
  endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
app.use(bodyParser.json());
app.post('/clients', function (req, res) {
    var { accounts, client_secret, client_id, company_name }  = req.body;
    var createClient = new createClientService();
    console.log(req.body);
    createClient.execute({accounts, client_secret, client_id, company_name});
    res.send(req.body);
  
  });

  module.exports = router;