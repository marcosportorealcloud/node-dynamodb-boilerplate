var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({
    region: "eu-west-2",
    accessKeyId: "fake",
    secretAccessKey: "fake2",
    endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing Clients into DynamoDB. Please wait.");
var clients = JSON.parse(fs.readFileSync('clientData.json', 'utf8'));
clients.forEach(function(client) {
  console.log(client)
var params = {
        TableName: "RealCloudSpotioClients",
        Item: {
            "client_id": client.client_id,
            "accounts": client.accounts,
            "client_secret": client.client_secret,
            "company_name": client.company_name
            
        }
    };
docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add Client", client.company_name, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", client.company_name);
       }
    });
});