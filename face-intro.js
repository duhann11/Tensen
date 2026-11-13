(() => {
  if (location.hash || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.className = 'face-intro';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const stop = () => {
    cancelAnimationFrame(frame);
    canvas.remove();
    window.removeEventListener('keydown', stop);
    window.removeEventListener('wheel', stop);
  };
  let frame = 0;
  canvas.onpointerdown = stop;
  window.addEventListener('keydown', stop);
  window.addEventListener('wheel', stop, { passive: true });

  // Sample each silhouette along the same rays so the outline morphs continuously.
  const circle = () => 1;
  const polygon = (sides, offset = 0) => angle => {
    const step = 2 * Math.PI / sides;
    const local = ((angle - offset) % step + step) % step;
    return Math.cos(step / 2) / Math.cos(local - step / 2);
  };
  const silhouettes = [
    circle, polygon(5, -Math.PI / 2), polygon(8, Math.PI / 8),
    polygon(6), polygon(4, Math.PI / 4), circle
  ];
  const rays = Array.from({length: 120}, (_, i) => i * Math.PI / 60);
  const profiles = silhouettes.map(shape => rays.map(shape));
  const smooth = t => t * t * (3 - 2 * t);
  const clamp = t => Math.min(1, Math.max(0, t));
  let start;
  function paint(now) {
    start ??= now;
    const elapsed = now - start;
    if (elapsed >= 2450) { stop(); return; }
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const pixelRatio = Math.min(devicePixelRatio, 2);
    if (canvas.width !== Math.round(w * pixelRatio) || canvas.height !== Math.round(h * pixelRatio)) {
      canvas.width = Math.round(w * pixelRatio);
      canvas.height = Math.round(h * pixelRatio);
    }
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const zoom = clamp((elapsed - 1710) / 740);
    const base = Math.min(w * .34, 210, h * .34) / 460;
    const final = Math.hypot(w, h) / (2 * 144.55) * 1.05;
    const scale = base * Math.pow(final / base, smooth(zoom));
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    // Fixed midpoint of the complete logomark's visible bounds.
    ctx.translate(-590.675, -787.5);
    ctx.fillStyle = '#000';
    ctx.fillRect(394.5, 492, 338.5, 591);
    ctx.clearRect(424, 521.5, 279.5, 532.5);
    ctx.fillStyle = '#fff';
    ctx.fillRect(424, 521.5, 279.5, 532.5);
    ctx.fillStyle = '#000';
    ctx.fillRect(503.5, 970, 120, 29.5);
    const position = clamp((elapsed - 70) / 1620) * (profiles.length - 1);
    const index = Math.min(Math.floor(position), profiles.length - 2);
    const blend = smooth(position - index);
    function eye(x, y, size) {
      ctx.beginPath();
      rays.forEach((angle, i) => {
        const r = size * (profiles[index][i] * (1 - blend) + profiles[index + 1][i] * blend);
        const px = x + r * Math.cos(angle), py = y + r * Math.sin(angle);
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
    }
    eye(443.25, 799.3, 75.25);
    eye(668.8, 788.2, 144.55);
    canvas.style.opacity = 1 - smooth(clamp((zoom - .36) / .64));
    frame = requestAnimationFrame(paint);
  }
  frame = requestAnimationFrame(paint);
})();
