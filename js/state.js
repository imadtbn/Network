const State = {
  theme: Storage.get('theme', 'system'),
  updateInterval: Storage.get('updateInterval', 2),
  simSpeed: Storage.get('simSpeed', 100),     // نسبة سرعة الإنترنت %
  trafficLevel: Storage.get('trafficLevel', 1),
  paused: false,
  history: { download: [], upload: [], timestamps: [] },
  lastUpdate: Date.now()
};
