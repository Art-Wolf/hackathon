import { expect } from 'chai';
import sinon from 'sinon';
import resources from '../src/etc/resources';
import { setSlotValue, newSession } from './utils/alexaTestHelper';

const responses = resources.en.translation;
const va = require('virtual-alexa');
const stubs = [];
let alexa = newSession(va);

describe('Amazon Standard Intents', () => {
  describe('Launch Intent', () => {
    it('Returns the correct prompt', async () => {
      const result = await alexa.launch();
      expect(result.response.outputSpeech.ssml).to.include(responses.WELCOME_PROMPT);
    });
  });

  describe('Help Intent', () => {
    it('Returns the correct prompt', async () => {
      const result = await alexa.utter('help');
      expect(result.response.outputSpeech.ssml).to.include(responses.HELP_PROMPT);
    });
  });

  describe('Cancel Intent', () => {
    it('Returns the correct prompt', async () => {
      const result = await alexa.utter('cancel');
      expect(result.response.outputSpeech.ssml).to.include(responses.GOODBYE);
    });
  });

  describe('Stop Intent', () => {
    it('Returns the correct prompt', async () => {
      const result = await alexa.utter('stop');
      expect(result.response.outputSpeech.ssml).to.include(responses.GOODBYE);
    });
  });
});
