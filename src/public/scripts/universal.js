const universal = {
    _socket: io(),
    _information: {},
    _init: false,
    _authStatus: false,
    page: 0,
    events: {},
    config: {},
    keys: document.querySelector('#keys') ? document.querySelector('#keys') : document.createElement('div'),
    save: (k, v) => {
        return localStorage.setItem(btoa('fd.' +k), btoa(v));
    },
    load: (k)=> {
        return atob(localStorage.getItem(btoa('fd.' + k)));
    },
    loadObj: (k) => {
        return JSON.parse(atob(localStorage.getItem(btoa('fd.' + k))));
    },
    updatePlaying: () => {
        if (document.querySelector('.now-playing')) {
            let fixed = [];
            universal.audioClient._nowPlaying.forEach(itm => {
                console.log(itm)
            })
            document.querySelector('.now-playing').innerText = fixed;
        }
    },
    audioClient: {
        _nowPlaying: [],
        _end: (event) => {
            universal.audioClient._nowPlaying.splice(universal.audioClient._nowPlaying.indexOf(event.target), 1);
            universal.updatePlaying();
        },
        _player: {
            sink: 0,
        },
        play: async (file, name) => {
            const audioInstance = new Audio(file);
            if (universal.audioClient._player.sink !== 0)  audioInstance.setSinkId(universal.audioClient._player.sink);
            audioInstance.setAttribute('data-name', name);
            await audioInstance.play();

            audioInstance.onended = (ev) => {universal.audioClient._end(ev)};

            universal.audioClient._nowPlaying.push(audioInstance);
            universal.updatePlaying();
        }
    },
    init: async function (/** @type {string} */ user) {
        return new Promise((resolve, reject) => {
            universal.send('fd.greetings', user)
            universal.on('fd.info', (data) => {
                const parsed = JSON.parse(data);
                universal._information = JSON.parse(data);
                universal._pluginData = {};
                universal.events = parsed.events;
                universal.config = parsed.cfg;
                universal.plugins = parsed.plugins;
                universal._init = true;

                universal.on(universal.events.not_trusted, () => {
                    console.log('Not trusted to do this action.')
                })

                universal.on(universal.events.keypress, (interactionData) => {
                    const interaction = JSON.parse(interactionData).sound;
                    if (user !== 'Companion') return;
                    if (interaction.type !== 'fd.sound') return;
                    universal.audioClient.play(interaction.data.path + '/' + interaction.data.file, interactionData.name);
                })

                universal.on(universal.events.log, (data) => {
                    data = JSON.parse(data);
                    console.log(data.sender + ': ' + data.data);
                })

                universal.on(universal.events.plugin_info, (data) => {
                    universal._pluginData[JSON.parse(data).requested] = JSON.parse(data).response;
                })

                universal.on(universal.events.login, (auth) => universal.authStatus = auth);

                resolve(true);
            })
        })
    },
    send: (event, value) => {
        universal._socket.emit(event, value);
    },
    on: (event, callback) => {
        universal._socket.on(event, callback);
    }
};

export { universal };
window['universal'] = universal;