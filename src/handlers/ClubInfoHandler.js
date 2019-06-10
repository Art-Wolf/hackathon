// Load the AWS SDK for Node.js
var AWS = require ('aws-sdk');
// Set the region
AWS.config.update ({region: 'us-west-2'});

// Load the Google Distance Matrix API
var distance = require ('google-distance');

export default class ClubInfoHandler {
  constructor (alexa) {
    this.alexa = alexa;
    this.userProvidedState = this.alexa.event.request.intent.slots.state.value;
    this.docClient = new AWS.DynamoDB.DocumentClient ();
  }

  respond () {
    if (!this.userProvidedState) return this.promptForState ();

    // Lets get all the clubs and states
    this.getClubInfo ();

    const say = `I do bid you a good day ${this.userProvidedState}`;
    this.alexa.emit (':tell', say);
  }

  promptForState () {
    const say = 'No problem, what state do you live in?';
    this.alexa.emit (':elicitSlot', 'state', say);
  }

  getClubInfo () {
    var params = {
      TableName: process.env.CLUB_INFO_TABLE,
      ProjectionExpression: 'id, team, city, state',
      ExpressionAttributeNames: {
        '#pfn': 'firstName',
        '#pln': 'lastName',
        '#pn': 'number',
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
      data.Items.forEach (function (club) {
        console.log (
          club.id + ': ',
          club.team + ' - ',
          club.city + ', ',
          club.state
        );

        //distance.get (
        //  {
        //    origin: this.userProvidedState,
        //    destination: club.city + ', ' + club.state,
        //  },
        //  function (err, data) {
        //    if (err) return console.log (err);
        //    console.log (data);
        //  }
        //);
      });

      // continue scanning if we have more players, because
      // scan can retrieve a maximum of 1MB of data
      if (typeof data.LastEvaluatedKey != 'undefined') {
        console.log ('Scanning for more...');
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        this.docClient.scan (params, this.onScan);
      }
    }
  }
}
