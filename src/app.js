var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");
var app = express();
var createClientService = require("../src/modules/clients/services/createClientService");
var clients = require('./modules/clients/routes/clientsRoute')
app.listen(3000, () => console.log('NodeJS+DynamoDB boilerplate API listening on port 3000!'))
AWS.config.update({
  region: "eu-west-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: "fake2",
  endpoint: "http://localhost:8000"
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/clients',clients);
app.set('view engine', 'jade');
app.get('/', function (req, res) {
  res.send({ title: "Clients API Entry Point" })
})

module.exports = app;
