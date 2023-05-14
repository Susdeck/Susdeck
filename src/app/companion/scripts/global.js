/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
document.getElementById('mySidenav').onmouseover = () => {
  const rootElem = document.querySelector(':root');
  rootElem.style.setProperty('--sd-rotationDegrees', Math.ceil(Math.random() * 15) + 'deg');
};

const pages = [
  {
    name: 'Home',
    page: 'index.html',
    icon: 'img/home.png'
  },
  {
    name: 'Themes',
    page: 'themes.html',
    icon: 'img/themes.png'
  },
  {
    name: 'Soundboard',
    page: 'soundboard.html',
    icon: 'img/sounds.png'
  },
  {
    name: 'Icon Editor',
    page: 'iconEditor.html',
    icon: 'img/icon.png'
  },
  {
    name: 'Settings',
    page: 'settings.html',
    icon: 'img/settings.png'
  },
  {
    name: 'Experiments',
    page: 'experiments.html',
    icon: 'img/experiments.png',
    experimental: true
  }
];

const experiments = [
  {
    name: 'Custom Themes',
    html: `<input type="text" id="theme-import" placeholder="theme code">
    <button onclick="importTheme()">Import Theme</button>
    <button onclick="removeTheme()">Remove Custom Theme</button>`
  },
  {
    name: 'Switchable Audio Inputs',
    uuid: 'sai',
    html: '<label for="sai">Select audio input</label><select id="sai"></select>'
  }
];

pages.forEach(page => {
  if (page.experimental && susdeckUniversal.load('experiments') !== 'true') return;
  const btn = document.createElement('a');
  btn.href = page.page;
  if (window.location.href.includes(page.page)) {
    document.title = 'Susdeck Companion - ' + page.name;
    btn.className = 'activePage';
  }
  const btnImg = document.createElement('img');
  btnImg.src = page.icon;
  btnImg.alt = page.page + ' Icon';
  btnImg.width = '32';
  btnImg.height = '32';
  btn.appendChild(btnImg);
  document.getElementById('mySidenav').appendChild(btn);
});

experiments.forEach(experiment => {
  if (document.title !== 'Susdeck Companion - Experiments' || typeof document.getElementById('experiments') === 'undefined') return;
  document.getElementById('exp-count').innerText = `${experiments.length} experiment${experiments.length > 1 ? 's' : ''} available`;
  const newDiv = document.createElement('div');
  newDiv.className = 'experiment';
  newDiv.innerHTML = `<p>${experiment.name}</p>${experiment.html}`;
  document.getElementById('experiments').appendChild(newDiv);
});

setTimeout(() => {
  Susaudio._player.devicesList.forEach(device => {
    const option = document.createElement('option');
    option.value = device.name;
    option.innerText = device.name;
    option.setAttribute('data-sai-id', device.id);
    document.getElementById('sai').appendChild(option);
  });
}, 250);

document.getElementById('sai').onchange = function (ev) {
  Susaudio.setSink(document.getElementById('sai').options[document.getElementById('sai').selectedIndex].getAttribute('data-sai-id'));
  console.log('Changed sink')
};

document.body.onload = () => {
  const susdeckLogo = document.createElement('img');
  susdeckLogo.src = '../assets/icons/companion.png';
  susdeckLogo.className = 'susdeck-logo';
  document.body.appendChild(susdeckLogo);
};

function addToHTMLlog (text) {
  const txt = document.createElement('p');
  txt.innerText = text;
  txt.id = text;
  document.getElementById('console').appendChild(txt);
}

function enableExperiments () {
  if (confirm('Are you sure you want to turn on Susdeck Experiments?')) {
    if (susdeckUniversal.load('experiments') === 'true') {
      if (!confirm('Experiments is already enabled, do you want to turn off Susdeck Experiments?')) return;
      susdeckUniversal.save('experiments', false);
      susdeckUniversal.log('LocalStorage Experiments off');
      alert('Experiments disabled.');
      // Clear the user's custom theme
      susdeckUniversal.remove('custom_theme');
      susdeckUniversal.socket.emit('c-del-theme', '');
      susdeckUniversal.log('Removed theme, requesting refresh');
      susdeckUniversal.socket.emit('c-change');
      return;
    }
    susdeckUniversal.save('experiments', true);

    alert('Experiments enabled.');
    susdeckUniversal.socket.emit('c-change');
  }
}

function importTheme () {
  theme = document.getElementById('theme-import').value;
  if (theme === '' || theme === ' ') {
    susdeckUniversal.remove('custom_theme');
    susdeckUniversal.socket.emit('c-del-theme', theme);
    susdeckUniversal.socket.emit('c-change');
    return;
  }
  susdeckUniversal.save('custom_theme', theme);
  susdeckUniversal.socket.emit('c-send-theme', theme);
  susdeckUniversal.socket.emit('c-change');
}

function removeTheme () {
  theme = document.getElementById('theme-import').value;
  susdeckUniversal.remove('custom_theme');
  susdeckUniversal.socket.emit('c-del-theme', theme);
  susdeckUniversal.socket.emit('c-change');
}
