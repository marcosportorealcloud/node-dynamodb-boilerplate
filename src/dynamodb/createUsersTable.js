var AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
  accessKeyId: "fake",
  secretAccessKey: "fake2",
  endpoint: new AWS.Endpoint("http://localhost:8000")
});
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName : "RealCloudCustomerSuccessUsers",
    KeySchema: [
        { AttributeName: "user_id", KeyType: "HASH"},  //Partition key
],
    AttributeDefinitions: [
        { AttributeName: "user_id", AttributeType: "S" },
],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};
dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});