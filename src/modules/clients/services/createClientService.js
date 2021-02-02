var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-2",
    accessKeyId: "fake",
    secretAccessKey: "fake2",
    endpoint: new AWS.Endpoint("http://localhost:8000")
  });

var dynamodb = new AWS.DynamoDB.DocumentClient();
module.exports = class createClientService {
    constructor(){}
    execute({accounts,client_secret,client_id,company_name}) {
        var params = {
            TableName: "RealCloudSpotioClients",
            Item: {
                "client_id": client_id,
                "accounts": accounts,
                "client_secret": client_secret,
                "company_name": company_name
                
            }
        };
        console.log(client_id);
        dynamodb.put(params, function(err, data){
            if (err) {
                console.error("Unable to insert Item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Inserted item. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    }
}
