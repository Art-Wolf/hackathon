// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'us-west-2' });

export default class FifaRefHandler {
  constructor(alexa) {
    this.alexa = alexa;
    this.userProvidedName = this.alexa.event.request.intent.slots.name.value;
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  respond() {
    if (!this.userProvidedName) return this.promptForName();

    // Lets search for that player..
    return this.getPlayerInfo();
  }

  promptForName() {
    const say = 'Sure, which player would you like to learn about?';
    this.alexa.emit(':elicitSlot', 'name', say);
  }

  getPlayerInfo() {
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

    this.docClient.scan(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to scan the table. Error JSON:',
          JSON.stringify(err, null, 2)
        );
      } else {
        // print all the info
        console.log('Scan succeeded.');


        data.Items.forEach(player => {
          const say = player.firstName + ' ' +
            player.lastName + ' plays as ' +
            player.number + ' for Team USA. Her local team is ' +
            player.team + '. She was born ' +
            player.dob + ' and her home town is ' + player.hometown;

          this.alexa.emit(':tell', say);
        });

      }
    });
  }
}
