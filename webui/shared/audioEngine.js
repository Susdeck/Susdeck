const UAE = {
	_nowPlaying: [[], [], []],
	_end: (event) => {
		universal.audioClient._nowPlaying.splice(
			universal.audioClient._nowPlaying.indexOf(event.target),
			1,
		);
		universal.updatePlaying();
	},
	_player: {
		sink: 0,
		monitorPotential: [],
		monitorSink: "default",
		recsink: 0,
		normalVol: 1,
		monitorVol: 1,
		pitch: 1,
	},
	stopAll: async () => {
		for (const audio of universal.audioClient._nowPlaying) {
			try {
				await audio.pause();
				audio.currentTime = audio.duration;
				await audio.play();
				universal.audioClient._end({ target: audio });
				audio.remove();
			} catch (err) {
				// "waah waah waah noo you cant just abuse audio api" -companion
				// > i dont care :trole:
			}
		}
	},
	setPitch: (pitch) => {
		universal.audioClient._player.pitch = pitch;
		for (const audio of universal.audioClient._nowPlaying) {
			audio.playbackRate = pitch;
		}
		universal.save("pitch", pitch);
	},
	setVolume: (vol) => {
		universal.audioClient._player.normalVol = vol;
		for (const audio of universal.audioClient._nowPlaying) {
			audio.volume = vol;
		}
		universal.save("vol", vol);
	},
	channels: {
		cable: 0,
		monitor: 1,
		ui: 2,
	},
	sinks: [],
	initialize: () => {
    universal.CLU("Boot / UAE", "Initializing audio engine");
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
    } else {
      const devices = [];
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
          devices.filter((device) => device.kind === "audiooutput"),
        )
        .catch((err) => {
          console.error(err);
        });
      for (const device of devices) {
        universal.audioClient._player.monitorPotential.push(device);
        universal.CLU("Boot / UAE", "Created monitor potential devices");
      }
    }
    if (universal.load("vb.sink"))
      universal.audioClient._player.sink = universal.load("vb.sink");
    universal.CLU("Boot / UAE", "Loaded vb.sink");
    if (universal.load("monitor.sink"))
      universal.audioClient._player.monitorSink =
        universal.load("monitor.sink");
    else universal.audioClient._player.monitorSink = "default";
    universal.CLU("Boot / UAE", "Loaded monitor.sink");
  },
	play: async ({
		file,
		name,
		isMonitor = false,
		stopPrevious = universal.load("playback-mode") === "stop_prev",
		volume = universal.load("vol") || 1,
		pitch = universal.load("pitch") || 1,
		channel = isMonitor
			? universal.audioClient.channels.monitor
			: universal.audioClient.channels.cable,
	}) => {
		const ch = universal.audioClient.channels;
		const channelSelected = ch[channel];
		const audioInstance = new Audio();
		audioInstance.src = file;
		audioInstance.load();

		audioInstance.setAttribute("data-name", name);
		audioInstance.setAttribute("data-channel", channel);

		if (channelSelected === ch.monitor) {
			await UAE.useSinkIfExists(audioInstance, "monitor.sink", universal.audioClient._player.monitorSink)
			audioInstance.volume = universal.audioClient._player.monitorVol;
		} else {
			await UAE.useSinkIfExists(audioInstance, "vb.sink", universal.audioClient._player.sink)
			audioInstance.volume = universal.audioClient._player.normalVol;
		}

		audioInstance.playbackRate = pitch;
		audioInstance.volume = volume;
		audioInstance.preservesPitch = false;

		audioInstance.dataset.name = name;
		audioInstance.dataset.monitoring = isMonitor;

		if (stopPrevious === true) {
			for (const audio of universal.audioClient._nowPlaying) {
				try {
					if (audio.dataset.name === audioInstance.dataset.name) {
						await audio.pause();
						audio.currentTime = audio.duration;
						await audio.play();
						audio.remove();
					}
				} catch (err) {
					// "waah waah waah noo you cant just abuse audio api" -companion
					// > i dont care :trole:
				}
			}
		}

		await audioInstance.play();
		window.lasti = audioInstance;

		audioInstance.onended = (ev) => {
			universal.sendEvent("audio-end", { audioInstance, name, channel });
			universal.audioClient._end(ev);
			audioInstance.remove();
		};

		universal.audioClient._nowPlaying.push(audioInstance);
		universal.sendEvent("now-playing", { audioInstance, name, channel });
		universal.updatePlaying();
		return audioInstance;
	},
	useSinkIfExists: async (audioElem, sink, local) => {
		navigator.mediaDevices.getUserMedia({ audio: true, video: false });

		if (universal.load(sink))
			await audioElem.setSinkId(universal.load(sink)); 
		else
			await audioElem.setSinkId(local);
	}
};

export default UAE;