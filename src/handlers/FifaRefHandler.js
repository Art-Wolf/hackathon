export default class FifaRefHandler {
  constructor (alexa) {
    this.alexa = alexa;
    this.userProvidedName = this.alexa.event.request.intent.slots.name.value;
  }

  respond () {
    if (!this.userProvidedName) return this.promptForName ();
    const say = `I do bid you a good day ${this.userProvidedName}`;
    this.alexa.emit (':tell', say);
  }

  promptForName () {
    const say = 'Sure, what is your first name?';
    this.alexa.emit (':elicitSlot', 'name', say);
  }
}
