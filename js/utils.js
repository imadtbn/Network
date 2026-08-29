const Utils = {
  fmt: (n, d = 1) => n.toFixed(d).replace(/\.0$/, ''),
  fmtBytes: (mb) => {
    if (mb >= 1024 * 1024) return (mb / 1048576).toFixed(2) + ' TB';
    if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB';
    return mb.toFixed(1) + ' MB';
  },
  clamp: (v, min, max) => Math.min(max, Math.max(min, v)),
  smooth: (current, target, factor = 0.25) => current + (target - current) * factor,
  timeAgo: (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'الآن';
    if (s < 3600) return `قبل ${Math.floor(s / 60)} دقيقة`;
    if (s < 86400) return `قبل ${Math.floor(s / 3600)} ساعة`;
    return `قبل ${Math.floor(s / 86400)} يوم`;
  },
  uid: () => 'device-' + Math.random().toString(36).slice(2, 8),
  $: (sel) => document.querySelector(sel),
  esc: (s) => s.replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]))
};
