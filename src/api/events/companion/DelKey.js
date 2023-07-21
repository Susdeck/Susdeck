const sounds = require('../../../settings/sounds');
const fs = require('fs');
const Event = require('../Event');

const ev = new Event('c-delete-key', ({ socket, args, meta }) => {
  if (sounds.Sounds.length === 1) {
    socket.emit('server_notification', 'You must have at least 1 button!');
    return;
  }
  sounds.Sounds.splice(sounds.Sounds.indexOf({ name: args.name }), 1);
  fs.writeFileSync('./src/settings/sounds.js', `/* eslint-disable quotes, quote-props, indent, no-unused-vars */
const SoundOnPress = ${sounds.SoundOnPress};
const ScreenSaverActivationTime = ${sounds.ScreenSaverActivationTime};
const soundDir = '../assets/sounds/';
const Sounds = ${JSON.stringify(sounds.Sounds)};
if (typeof module !== 'undefined') module.exports = { cfg:{v:'${meta.fdVersion}'}, SoundOnPress, ScreenSaverActivationTime, soundDir, Sounds };`);
  return 'c-change';
});

module.exports = ev;
