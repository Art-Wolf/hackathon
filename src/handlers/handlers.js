import FifaRefHandler from './FifaRefHandler';

const handlers = {
  FifaRefIntent () {
    const fifaRefHandler = new FifaRefHandler (this);
    return fifaRefHandler.respond ();
  },
  LaunchRequest () {
    this.emit (':ask', this.t ('WELCOME_PROMPT'), this.t ('WELCOME_REPROMPT'));
  },
  'AMAZON.CancelIntent': function () {
    this.emit (':tell', this.t ('GOODBYE'));
  },
  'AMAZON.HelpIntent': function () {
    this.emit (':ask', this.t ('HELP_PROMPT'), this.t ('WELCOME_REPROMPT'));
  },
  'AMAZON.StopIntent': function () {
    this.emit (':tell', this.t ('GOODBYE'));
  },
  SessionEndedRequest () {
    this.emit (':tell', this.t ('GOODBYE'));
  },
};

export default [handlers];
