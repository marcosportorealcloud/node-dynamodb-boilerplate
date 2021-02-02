var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");
var app = express();
var createClientService = require("../src/modules/clients/services/createClientService");
app.listen(3000, () => console.log('Cars API listening on port 3000!'))
AWS.config.update({
  region: "eu-west-2",
  accessKeyId: "fake",
  secretAccessKey: "fake2",
  endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'jade');
app.get('/', function (req, res) {
  res.send({ title: "Clients API Entry Point" })
})
app.get('/clients', function (req, res) {
var params = {
    TableName: "RealCloudSpotioClients",
    ProjectionExpression: "#client_id, #accounts, #client_secret, #company_name",
    ExpressionAttributeNames: {
        "#client_id": "client_id",
        "#accounts": "accounts",
        "#client_secret": "client_secret",
        "#company_name": "company_name"
    }
};
console.log("Scanning Clients table.");
docClient.scan(params, onScan);
function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        res.send(data)
        // print all the Clients
        console.log("Scan succeeded.");
        data.Items.forEach(function(client) {
           console.log(client.client_id, client.accounts, client.company_name)
        });
if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
  }
});
app.post('/clients', function (req, res) {
  var { accounts, client_secret, client_id, company_name }  = req.body;
  var createClient = new createClientService();
  console.log(req.body);
  createClient.execute({accounts, client_secret, client_id, company_name});
  res.send(req.body);

});
app.get('/clients/:client_id', function (req, res) {
  var clientID = req.url.slice(9);
    console.log(req.url)
    console.log(clientID)
  var params = {
        TableName : "RealCloudSpotioClients",
        KeyConditionExpression: "#client_id = :client_id",
        ExpressionAttributeNames:{
            "#client_id": "client_id"
        },
        ExpressionAttributeValues: {
            ":client_id": clientID
        }
    };
  docClient.query(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          res.send(data)
          data.Items.forEach(function(client) {
              console.log(client.client_id, client.accounts, client.company_name);
          });
      }
  });
  });
module.exports = app;
