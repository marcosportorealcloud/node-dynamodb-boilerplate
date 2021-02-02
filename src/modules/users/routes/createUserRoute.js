var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");
var app = express();
var createUserService = require("../src/modules/users/services/createUserService");
app.listen(3000, () => console.log('Cars API listening on port 3000!'))
AWS.config.update({
  region: "eu-west-2",
  accessKeyId: "fake",
  secretAccessKey: "fake2",
  endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
app.use(bodyParser.json());
app.post('/users', function (req, res) {
    var { accounts, client_secret, client_id, company_name }  = req.body;
    var createClient = new createClientService();
    console.log(req.body);
    createClient.execute({accounts, client_secret, client_id, company_name});
    res.send(req.body);
  
  });
