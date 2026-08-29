const App = {
  async init() {
    Theme.init();
    this.markNav();
    this.onlineStatus();
    setInterval(() => {
      if (!State.paused) {
        SimulationProvider.tick();
        document.dispatchEvent(new CustomEvent('state:tick'));
      }
    }, State.updateInterval * 1000);
  },
  markNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === page));
  },
  onlineStatus() {
    const update = () => document.body.classList.toggle('offline', !navigator.onLine);
    addEventListener('online', () => { update(); Toast.show('عودة الاتصال بالإنترنت'); });
    addEventListener('offline', () => { update(); Toast.show('أنت تعمل الآن دون اتصال'); });
    update();
  }
};

const Toast = {
  show(msg) {
    const wrap = document.querySelector('.toast-wrap') || (() => {
      const w = document.createElement('div'); w.className = 'toast-wrap';
      document.body.appendChild(w); return w;
    })();
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
