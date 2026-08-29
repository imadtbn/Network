const Theme = {
  init() {
    this.apply(State.theme);
    document.querySelectorAll('[data-theme-toggle]')?.forEach(b =>
      b.addEventListener('click', () => {
        State.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        Storage.set('theme', State.theme);
        this.apply(State.theme);
      }));
  },
  apply(mode) {
    const dark = mode === 'dark' ||
      (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }
};
