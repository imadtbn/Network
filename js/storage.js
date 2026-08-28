const Storage = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem('nm_' + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem('nm_' + key, JSON.stringify(value)); },
  remove(key) { localStorage.removeItem('nm_' + key); },
  clearAll() { Object.keys(localStorage).filter(k => k.startsWith('nm_')).forEach(k => localStorage.removeItem(k)); }
};
