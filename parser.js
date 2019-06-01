var request = require ('request');
var cheerio = require ('cheerio');
var getUuid = require ('uuid-by-string');

module.exports.handler = (event, context) => {
  let playerList = [];

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
        playerList.push (player);
      });
    }
    console.log (playerList);
  });
};
