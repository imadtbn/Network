const Charts = {
  live(ctx, dataD, dataU, max) {
    const w = ctx.canvas.width = ctx.canvas.clientWidth * devicePixelRatio;
    const h = ctx.canvas.height = ctx.canvas.clientHeight * devicePixelRatio;
    const css = getComputedStyle(document.documentElement);
    const cD = css.getPropertyValue('--primary'), cU = css.getPropertyValue('--success');
    ctx.clearRect(0, 0, w, h);
    const n = dataD.length; if (n < 2) return;
    const top = Math.max(max, Math.max(...dataD, ...dataU) * 1.1, 10);
    const line = (data, color, fill) => {
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = w - (i / (n - 1)) * w, y = h - (v / top) * h;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = color; ctx.lineWidth = 2 * devicePixelRatio; ctx.stroke();
      ctx.lineTo(0, h); ctx.lineTo(w, h); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
    };
    line(dataD, cD, 'rgba(37,99,235,.12)');
    line(dataU, cU, 'rgba(22,163,74,.10)');
  },

  bars(canvas, labels, values, color) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth * devicePixelRatio;
    const h = canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.clearRect(0, 0, w, h);
    const max = Math.max(...values, 1);
    const bw = w / values.length * 0.6, gap = w / values.length;
    values.forEach((v, i) => {
      const bh = (v / max) * (h - 30 * devicePixelRatio);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(i * gap + (gap - bw) / 2, h - bh - 20*devicePixelRatio, bw, bh, 4*devicePixelRatio);
      ctx.fill();
      ctx.fillStyle = getComputedStyle(document.body).color;
      ctx.font = `${11*devicePixelRatio}px Cairo`;
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], i * gap + gap / 2, h - 4*devicePixelRatio);
    });
  }
};
