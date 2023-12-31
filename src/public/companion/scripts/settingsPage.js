import {
  universal,
} from '../../scripts/universal.js';

await universal.init('Companion:Settings');
universal.audioClient._player.monitorPotential.forEach((data) => {
  const tmpBtn = document.createElement('option');
  tmpBtn.innerText = data.label;
  tmpBtn.value = data.deviceId;
  tmpBtn.id = data.deviceId;
  document.querySelector('#audioclient-monitor-devices').appendChild(tmpBtn);
});

const devices = await navigator.mediaDevices.enumerateDevices();
devices.forEach((device) => {
  if (device.kind == 'audiooutput') {
    const tmpBtn = document.createElement('option');
    tmpBtn.innerText = device.label;
    tmpBtn.value = device.deviceId;
    tmpBtn.id = device.deviceId;
    document.querySelector('#audioclient-vb-devices').appendChild(tmpBtn);
  }
});

Object.keys(universal.config.profiles).forEach((data) => {
  const tmpBtn = document.createElement('option');
  tmpBtn.innerText = data;
  tmpBtn.value = data;
  tmpBtn.id = data;
  document.querySelector('#default-profile').appendChild(tmpBtn);
});

document.querySelector('#default-profile').value = universal.config.profile;
document.querySelector('#audioclient-monitor-devices').value = universal.audioClient._player.monitorSink;
document.querySelector('#audioclient-vb-devices').value = universal.audioClient._player.sink;
document.querySelector('#settings-save').onclick = save;

/**
 * @name save
 * @description Save the settings that are currently selected on the page.
 */
function save() {
  universal.save('monitor.sink', document.querySelector('#audioclient-monitor-devices').value);
  universal.send(universal.events.companion.set_profile, document.querySelector('#default-profile').value);
  universal.sendToast('Saved!');
}
