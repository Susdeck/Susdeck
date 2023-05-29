const { sockApiEvents } = require('../init');
const debug = require('../../util/debug')

class Event {
  constructor (event, callback) {
    this.eventStr = event;
    this.callbackFn = callback;
    sockApiEvents.set(event, { callback: this.callbackFn, event: this.eventStr });
    debug.log(event, 'Events');
  }

  init () {
    sockApiEvents.set(this.eventStr, { callback: this.callbackFn, event: this.eventStr });
  }

  set event (event) {
    this.eventStr = event;
  }

  set callback (callback) {
    this.callbackFn = callback;
  }

  get event () {
    return this.eventStr;
  }

  get callback () {
    return this.callbackFn;
  }
}

module.exports = Event;
