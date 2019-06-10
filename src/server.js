import Alexa from 'alexa-sdk';
import bodyParser from 'body-parser'; // eslint-disable-line import/no-extraneous-dependencies
import express from 'express'; // eslint-disable-line import/no-extraneous-dependencies
import './environment';
import handlers from './handlers/handlers';
import resources from './etc/resources';
import Raven from 'raven';
import { handler } from './alexa'

Raven.config(process.env.sentry_dsn).install();

const server = express();
server.use(Raven.requestHandler());
server.use(Raven.errorHandler());

server.use(bodyParser.json());

server.post('/', (req, res) => {
  const context = {
    fail: () => {
      res.sendStatus(500);
    },
    succeed: (data) => {
      res.send(data);
    },
  };

  handler(req.body, context);
});

server.listen(3000, () => {
  console.log('Listening...');
});
