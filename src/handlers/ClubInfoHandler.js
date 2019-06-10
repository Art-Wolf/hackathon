// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'us-west-2' });

export default class ClubInfoHandler {
  constructor(alexa) {
    this.alexa = alexa;
    this.userProvidedState = this.alexa.event.request.intent.slots.state.value;
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  respond() {
    if (!this.userProvidedState) return this.promptForState();

    // Lets get all the clubs and states
    return this.getClubInfo();

  }

  promptForState() {
    const say = 'No problem, what state do you live in?';
    this.alexa.emit(':elicitSlot', 'state', say);
  }

  getClubInfo() {
    var params = {
      TableName: process.env.CLUB_INFO_TABLE,
      ProjectionExpression: 'id, team, city, #pstate',
      FilterExpression: '#pstate = :p_state',
      ExpressionAttributeNames: {
        '#pstate': 'state',
      },
      ExpressionAttributeValues: {
        ':p_state': this.userProvidedState,
      },
    };

    return this.docClient.scan(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to scan the table. Error JSON:',
          JSON.stringify(err, null, 2)
        );
      } else {
        // print all the info
        console.log('Scan succeeded.');
        var dataFound = false;
        data.Items.forEach(function (club) {
          dataFound = true;
          if (club.state == this.userProvidedState) {
            console.log('Team found: ' + club.team);
            const say = `Congrats! You're team is the ${club.team}`;
            this.alexa.emit(':tell', say);
          }
        });

        if (!dataFound) {
          console.log('Team not found');
          const say = `I'm afraid you don't live in a state with a team. Do you here the list of teams?`;
          this.alexa.emit(':ask', say);
        }
      }
    });
  }
}
