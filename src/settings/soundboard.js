/**
 * Welcome to the Soundboard config.
 * To add a sound, ensure the name corresponds to the one on your Susdeck.
 * Companion *WILL NOT* change this file *EVER* (unless this text is gone).
 */

const soundDir = '../assets/sounds/'
const sounds = [
  { name: 'Shooting', path: 'shooting.mp3' },
  { name: 'Vine Boom', path: 'vineboom.mp3' },
  { name: 'Footsteps', path: 'loudfootsteps.mp3' },
  { name: 'Whoppah', path: 'WHOPPER.mp3' },
  { name: "Didn't I Do It", path: 'borzio.mp3' },
  { name: 'Biggest Bird', path: 'biggestbird.wav' },
  { name: 'Disconnect', path: 'disconnect.mp3' },
  { name: 'Vine Boom', path: 'vineboom.mp3' },
  { name: 'Semtex', path: 'semtex.mp3' },
  { name: 'Whoppah Remix', path: 'DSJSJSK.wav' },
  { name: 'Ohio Sound', path: 'ohio.mp3' },
  { name: 'Whoppah Remix', path: 'wopha_remix.wav' },
  { name: 'Stop All', path: '--Stop_all' }
]

if (typeof module !== 'undefined') {
  module.exports = { sounds, soundDir }
}