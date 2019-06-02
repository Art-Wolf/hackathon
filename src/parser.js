var request = require ('request');
var cheerio = require ('cheerio');
var getUuid = require ('uuid-by-string');
// Load the AWS SDK for Node.js
var AWS = require ('aws-sdk');
// Set the region
AWS.config.update ({region: 'us-west-2'});

module.exports.handler = (event, context) => {
  request ('https://www.ussoccer.com/teams/uswnt', function (err, resp, html) {
    if (!err) {
      const $ = cheerio.load (html);

      $ ('.PlayerThumbnail-module__link--3s667').each (function (i, elem) {
        let player = {};

        player['team'] = 'USA';
        player['bio'] = $ (this).attr ('href');
        let playerRawName = $ (this)
          .find ('.PlayerThumbnail-module__playerName--2bbtZ')
          .text ()
          .split (' ');

        player['number'] = playerRawName[0];
        player['firstName'] = playerRawName[2];
        player['lastName'] = playerRawName[4];

        let playerPosition = $ (this)
          .find ('.PlayerThumbnail-module__playerPosition--KP4od')
          .text ();

        let playerStatsRaw = $ (this).find (
          '.PlayerThumbnail-module__stats--TCgax'
        );

        playerStatsRaw.children ().each (function (i, elem) {
          let statKey = $ (this)
            .find ('.PlayerThumbnail-module__statsName--1QKTL')
            .text ();
          let statValue = $ (this)
            .find ('.PlayerThumbnail-module__statsValue--28-Ju')
            .text ();
          player[statKey] = statValue;
        });

        player['id'] = getUuid (
          player['number'] +
            '-' +
            player['firstName'] +
            '-' +
            player['lastName']
        );

        var ddb = new AWS.DynamoDB ({apiVersion: '2012-08-10'});

        var params = {
          TableName: process.env.SOCCER_TEAM_TABLE,
          Item: {
            id: {S: player['id']},
            team: {S: player['team']},
            number: {S: player['number']},
            firstName: {S: player['firstName']},
            lastName: {S: player['lastName']},
            bio: {S: player['bio']},
            Appearances: {
              S: player['Appearances'] ? player['Appearances'] : '0',
            },
            Goals: {S: player['Goals'] ? player['Goals'] : '0'},
            Assists: {S: player['Assists'] ? player['Assists'] : '0'},
            'World Cups': {
              S: player['World Cups'] ? player['World Cups'] : '0',
            },
            CleanSheets: {
              S: player['CleanSheets'] ? player['CleanSheets'] : '0',
            },
          },
        };

        // Call DynamoDB to add the item to the table
        ddb.putItem (params, function (err, data) {
          if (err) {
            console.log ('Error', err);
          } else {
            console.log ('Success', data);
          }
        });
      });
    }
  });
};

module.exports.full = (event, context) => {
  const docClient = new AWS.DynamoDB.DocumentClient ();
  var params = {
    TableName: process.env.SOCCER_TEAM_TABLE,
  };
  var count = 0;

  docClient.scan (params).eachPage ((err, data, done) => {
    if (data != null) {
      for (let index = 0; index < data.Items.length; index++) {
        const element = data.Items[index];
        let playerUrl = 'https://www.ussoccer.com/teams/uswnt' + element['bio'];

        request (playerUrl, function (err, resp, html) {
          if (!err) {
            const $ = cheerio.load (html);

            let player = {};

            player['id'] = element['id'];

            $ ('.P1Player-module__textColumn--24s4m')
              .find ('li')
              .each (function (i, elem) {
                let playerRawInfo = $ (this).text ().split (' ');

                if (playerRawInfo[0] != 'Date') {
                  player[playerRawInfo[0]] = playerRawInfo
                    .slice (1, playerRawInfo.length + 1)
                    .join (' ');
                } else {
                  player['dob'] = playerRawInfo
                    .slice (3, playerRawInfo.length + 1)
                    .join (' ');
                }
              });

            var ddb = new AWS.DynamoDB ({apiVersion: '2012-08-10'});

            var params = {
              TableName: process.env.SOCCER_TEAM_TABLE,
              Item: {
                id: {S: player['id']},
                dob: {S: player['dob']},
                hometown: {S: player['Hometown']},
                height: {S: player['Height']},
                club: {S: player['Club']},
              },
            };

            // Call DynamoDB to add the item to the table
            ddb.putItem (params, function (err, data) {
              if (err) {
                console.log ('Error', err);
              } else {
                console.log ('Success', data);
              }
            });
          }
        });
      }
    }
  });
};
