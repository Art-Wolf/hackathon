import ClubInfoHandler from './ClubInfoHandler';
import TeamInfoHandler from './TeamInfoHandler';

const handlers = {
  TeamInfoIntent() {
    const teamInfoHandler = new TeamInfoHandler(this);
    return teamInfoHandler.respond();
  },
  ClubInfoIntent() {
    const clubInfoHandler = new ClubInfoHandler(this);
    return clubInfoHandler.respond();
  },
  LaunchRequest() {
    this.emit(':ask', this.t('WELCOME_PROMPT'), this.t('WELCOME_REPROMPT'));
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('GOODBYE'));
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', this.t('HELP_PROMPT'), this.t('WELCOME_REPROMPT'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('GOODBYE'));
  },
  SessionEndedRequest() {
    this.emit(':tell', this.t('GOODBYE'));
  },
};

export default [handlers];
