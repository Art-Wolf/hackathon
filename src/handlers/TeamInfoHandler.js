// Load the AWS SDK for Node.js
var AWS = require ('aws-sdk');
// Set the region
AWS.config.update ({region: 'us-west-2'});

export default class FifaRefHandler {
  constructor (alexa) {
    this.alexa = alexa;
    this.userProvidedName = this.alexa.event.request.intent.slots.name.value;
    this.docClient = new AWS.DynamoDB.DocumentClient ();
  }

  respond () {
    if (!this.userProvidedName) return this.promptForName ();

    // Lets search for that player..
    this.getPlayerInfo ();

    const say = `I do bid you a good day ${this.userProvidedName}`;
    this.alexa.emit (':tell', say);
  }

  promptForName () {
    const say = 'Sure, which player would you like to learn about?';
    this.alexa.emit (':elicitSlot', 'name', say);
  }

  getPlayerInfo () {
    var params = {
      TableName: process.env.SOCCER_TEAM_TABLE,
      ProjectionExpression: 'id, team, #pn, #pfn, #pln',
      FilterExpression: '#pfn = :p_name',
      ExpressionAttributeNames: {
        '#pfn': 'firstName',
        '#pln': 'lastName',
        '#pn': 'number',
      },
      ExpressionAttributeValues: {
        ':p_name': this.userProvidedName,
      },
    };

    this.docClient.scan (params, this.onScan);
  }

  onScan (err, data) {
    if (err) {
      console.error (
        'Unable to scan the table. Error JSON:',
        JSON.stringify (err, null, 2)
      );
    } else {
      // print all the info
      console.log ('Scan succeeded.');
      data.Items.forEach (function (player) {
        console.log (
          player.id + ': ',
          player.firstName + ' ',
          player.lastName + ' [',
          player.number + '] - ',
          player.team
        );
      });

      // continue scanning if we have more players, because
      // scan can retrieve a maximum of 1MB of data
      if (typeof data.LastEvaluatedKey != 'undefined') {
        console.log ('Scanning for more...');
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        this.docClient.scan (params, onScan);
      }
    }
  }
}
