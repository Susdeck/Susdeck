// Freedeck setup script

const path = require('path');
const fs = require('fs');
const { createHash } = require('./util/crypto');

const pkg = require(path.resolve('./package.json'));

const question = (q) => {
  let response;

  return new Promise((resolve, reject) => {
    console.log(q);
    process.stdin.once('data', (data) => {
      response = data.toString().trim();
      resolve(response);
    });
  });
};

console.clear();
console.log(`Freedeck v${pkg.version} setup`);
console.log('=-= Sound Initial Setup =-=');
console.log('Each of these are changeable from Companion at any time!');
const setters = { false: false, true: true, yes: true, no: false };
// eslint-disable-next-line no-var
var ssat, ua, passwd, lm, yn, port;

question('Screensaver activation time?' + ' (number, max: 15) >').then(ssatr => {
  if (Number(ssatr) >= 15) ssatr = 15;
  ssat = ssatr;
  console.log('\n=-= Settings Initial Setup =-=');
  console.log('Each of these are changeable from Settings.js at any time!');
  console.log('-=- Authentication -=-');
  question('Use authentication?' + ' (yes/no) >').then(uar => {
    ua = setters[uar.toLowerCase()];
    if (ua === false) {
      question('Your Name [If not using auth, leave blank!]' + ' (string) >').then(ynr => {
        yn = ynr;
        question('Port to host server? [Usually 5754]' + ' (number) >').then(response => {
          if (!Number(response)) response = 5754;
          port = response;
          afterResponses(ssat, ua, 'Unset!', 'Unset!', yn, port);
        });
      });
    } else {
      question('Password' + ' (string) >').then(pw => {
        passwd = pw;
        question('Login Message' + ' (string) >').then(lmr => {
          lm = lmr;
          question('Your Name' + ' (string) >').then(ynr => {
            yn = ynr;
            question('Port to host server? [Usually 5754]' + ' (number) >').then(response => {
              if (!Number(response)) response = 5754;
              port = response;
              afterResponses(ssat, ua, passwd, lm, yn, port);
            });
          });
        });
      });
    }
  });
});

const afterResponses = (ssat, ua, passwd, lm, yn, port) => {
  const soundsJSDefault = `/* eslint-disable quotes, quote-props, indent, no-unused-vars */
const ScreenSaverActivationTime = ${ssat};
const soundDir = '../assets/sounds/';
const Sounds = ${JSON.stringify([{ name: 'Shooting', icon: 'shooting.png', path: 'shooting.mp3' }, { name: 'Footsteps', icon: 'footsteps.png', path: 'loudfootsteps.mp3' }, { name: 'Whoppah', path: 'WHOPPER.mp3', icon: 'whopper.png' }, { name: "Didn't I Do It", icon: 'borzoi.png', path: 'borzio.mp3' }, { name: 'Biggest Bird', icon: 'bird.png', path: 'biggestbird.wav' }, { name: 'Disconnect', icon: 'disconnect.png', path: 'disconnect.mp3' }, { name: 'Vine Boom', icon: 'boom.png', path: 'vineboom.mp3' }, { name: 'Semtex', icon: 'semtex.png', path: 'semtex.mp3' }, { name: 'Huh', path: 'huh.mp3' }, { name: 'Haha', path: 'haha.mp3' }, { name: 'Alt Tab', keys: '["alt","tab"]' }, { name: 'Whoppah Remix', path: 'wopha_remix.wav' }, { name: 'Bugatti', path: 'bugatti.mp3' }, { name: 'Metal Pipe', path: 'metal_pipe.mp3' }, { name: 'RAHH', path: 'rah.mp3' }])};
if (typeof module !== 'undefined') module.exports = { cfg:{v:'${pkg.version}'}, ScreenSaverActivationTime, soundDir, Sounds };
`;

  const settingsJSDefault = `// These settings are autoset by setup.
const Settings = {
  UseAuthentication: ${ua},
  Password: '${passwd === 'Unset!' ? passwd : createHash(passwd)}',
  LoginMessage: '${lm}',
  YourName: '${yn}',
  Port: ${port},
  fdv: '${pkg.version}'
};
module.exports = Settings;
`;
  console.log('[Freedeck] Writing your settings..');
  if (!fs.existsSync(path.resolve('./src/settings'))) fs.mkdirSync(path.resolve('./src/settings'));
  fs.writeFileSync(path.join(path.resolve('./src/settings') + '/sounds.js'), soundsJSDefault);
  fs.writeFileSync(path.resolve('./Settings.js'), settingsJSDefault);
  if (!fs.existsSync(path.resolve('./src/api/persistent'))) fs.mkdirSync(path.resolve('./src/api/persistent'));
  fs.writeFileSync(path.join(path.resolve('./src/api/persistent') + '/theme.sd'), 'Default');
  console.log('[Freedeck] Finished setup, exiting!');
  process.exit(0);
};
