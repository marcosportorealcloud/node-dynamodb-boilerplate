var AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
  accessKeyId: "fake",
  secretAccessKey: "fake2",
  endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient()
var table = "RealCloudSpotioClients";
var client_id = "5nS35NgQQ1MM7GYY";
var params = {
    TableName: table,
    Key:{
        "client_id": client_id
    }
};
docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});