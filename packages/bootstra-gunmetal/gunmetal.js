/*!
 * GUNMETAL OS v0.6 — runtime (no dependencies; Bootstrap JS optional)
 * Data API:
 *   [data-gm-accent-set="cyan"]    switch glow colour
 *   [data-gm-wall-set="night"]     switch wallpaper on .gm-viewport
 *   [data-gm-target="#id"]         icon → show section (group by data-gm-group)
 *   .gm-draggable .gm-window       drag by .gm-window-bar (≥992px)
 *   [data-gm-reset] [data-gm-close] inside a window / module
 */
(() => {
  const root = document.documentElement;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem('gm:' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('gm:' + k, v); } catch (e) {} }
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── glow colour ── */
  const PRESETS = { orange: '#ff6b1a', amber: '#ffb000', lime: '#a6e22e', cyan: '#2fd6f0',
                    ice: '#7fa9ff', magenta: '#ff4fb0', red: '#ff4033', chalk: '#e2e2d6' };
  function setAccent(v) {
    root.style.removeProperty('--gm-accent'); root.style.removeProperty('--gm-accent-rgb');
    if (PRESETS[v]) { root.dataset.gmAccent = v; }
    else if (/^#[0-9a-f]{6}$/i.test(v)) {
      root.dataset.gmAccent = 'custom';
      const n = parseInt(v.slice(1), 16);
      root.style.setProperty('--gm-accent', v);
      root.style.setProperty('--gm-accent-rgb', `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`);
    } else return;
    store.set('accent', v);
    $$('[data-gm-accent-set]').forEach(b => b.classList.toggle('is-on', b.dataset.gmAccentSet === v));
    $$('[data-gm-accent-name]').forEach(el => el.textContent = PRESETS[v] ? v : v.toUpperCase());
    document.dispatchEvent(new CustomEvent('gm:accent', { detail: v }));
  }
  const cycleAccent = () => {
    const keys = Object.keys(PRESETS), cur = keys.indexOf(root.dataset.gmAccent);
    setAccent(keys[(cur + 1) % keys.length]);
  };

  /* ── wallpaper ── */
  const WALLS = { sunrise: 'Sea - sunrise', overcast: 'Dusk - overcast', night: 'Night - grid',
                  arctic: 'Arctic - noon', desert: 'Desert - haze', studio: 'Studio - flat' };
  function setWall(v, label) {
    const vp = $('.gm-viewport'); if (!vp) return;
    Object.keys(WALLS).forEach(k => vp.classList.remove('gm-wall-' + k));
    vp.style.backgroundImage = '';
    if (WALLS[v]) { vp.classList.add('gm-wall-' + v); store.set('wall', v); }
    else if (v && v.startsWith('data:')) { vp.style.backgroundImage = `url("${v}")`; }
    $$('[data-gm-wall-set]').forEach(b => b.classList.toggle('is-on', b.dataset.gmWallSet === v));
    $$('[data-gm-wall-name]').forEach(el => el.textContent = label || WALLS[v] || 'Custom');
    const pv = $('[data-gm-wall-preview]');
    if (pv) { pv.className = 'gm-preview' + (WALLS[v] ? ' gm-wall-' + v : ''); pv.style.backgroundImage = WALLS[v] ? '' : `url("${v}")`; }
  }
  function loadWallFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => setWall(r.result, file.name.slice(0, 18));
    r.readAsDataURL(file);
  }

  /* ── text size / effects ── */
  const setText = v => { root.dataset.gmText = v; store.set('text', v);
    $$('[data-gm-text-set]').forEach(b => b.checked = b.dataset.gmTextSet === v);
    $$('[data-gm-action="text-toggle"]').forEach(b => b.classList.toggle('is-on', v === 'large')); };
  const setFx = on => { root.classList.toggle('gm-fx-off', !on); store.set('fx', on ? '1' : '0');
    $$('[data-gm-fx-set]').forEach(b => b.checked = (b.dataset.gmFxSet === 'quality') === on); };

  /* ── sections (icon bar) ── */
  function showSection(btn) {
    const target = $(btn.dataset.gmTarget); if (!target) return;
    const group = target.dataset.gmGroup;
    $$(`[data-gm-group="${group}"]`).forEach(s => s.hidden = s !== target);
    $$('.gm-icon[data-gm-target]').forEach(i => i.classList.toggle('is-active', i === btn));
    const win = target.closest('.gm-window');
    if (win) {
      const t = $('.gm-title', win), st = $('.gm-subtitle', win);
      if (t && target.dataset.gmTitle) t.textContent = target.dataset.gmTitle;
      if (st && target.dataset.gmSub) st.textContent = ': ' + target.dataset.gmSub;
      win.classList.remove('is-collapsed');
    }
  }

  /* ── windows: drag / reset / close ── */
  let zTop = 10;
  function initDrag() {
    $$('.gm-draggable .gm-window').forEach(win => {
      const bar = $('.gm-window-bar', win); if (!bar) return;
      let sx, sy, ox = 0, oy = 0, drag = false;
      bar.addEventListener('pointerdown', e => {
        if (e.target.closest('button, a, input') || !matchMedia('(min-width: 992px)').matches) return;
        drag = true; sx = e.clientX; sy = e.clientY;
        const m = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(win.style.transform || '');
        ox = m ? +m[1] : 0; oy = m ? +m[2] : 0;
        win.style.zIndex = ++zTop; win.classList.add('is-dragging');
        bar.setPointerCapture(e.pointerId);
      });
      bar.addEventListener('pointermove', e => {
        if (!drag) return;
        win.style.transform = `translate(${ox + e.clientX - sx}px, ${oy + e.clientY - sy}px)`;
      });
      const end = () => { drag = false; win.classList.remove('is-dragging'); };
      bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
    });
  }

  /* ── music: tiny 4-voice chip sequencer ── */
  const audio = { ctx: null, master: null, an: null, timer: 0, track: -1, step: 0, next: 0 };
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  const SCALES = [[0, 3, 5, 7, 10], [0, 2, 4, 7, 9], [0, 2, 3, 5, 7, 8, 10], [0, 1, 5, 7, 8], [0, 2, 4, 6, 7, 9, 11]];
  const TRACKS = Array.from({ length: 9 }, (_, i) => {
    const r = rng(i * 7919 + 101), sc = SCALES[i % SCALES.length], root = 45 + (i * 5) % 12;
    const lead = Array.from({ length: 32 }, () => r() < .62 ? root + 12 + sc[Math.floor(r() * sc.length)] + (r() < .25 ? 12 : 0) : null);
    const prog = [[0, 0, 5, 7], [0, 8, 3, 7], [0, 5, 10, 7]][i % 3];
    return { bpm: 92 + (i * 11) % 54, lead, bass: prog.map(o => root - 12 + o), wave: ['square', 'sawtooth', 'triangle'][i % 3], kb: 400 + i * 63 };
  });
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function blip(t, freq, dur, type, vol) {
    const o = audio.ctx.createOscillator(), g = audio.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(audio.master); o.start(t); o.stop(t + dur + .02);
  }
  function hat(t, vol) {
    const len = audio.ctx.sampleRate * .04, b = audio.ctx.createBuffer(1, len, audio.ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = audio.ctx.createBufferSource(), f = audio.ctx.createBiquadFilter(), g = audio.ctx.createGain();
    f.type = 'highpass'; f.frequency.value = 6000; g.gain.value = vol;
    s.buffer = b; s.connect(f).connect(g).connect(audio.master); s.start(t);
  }
  function tick() {
    const tr = TRACKS[audio.track], sp = 60 / tr.bpm / 4;
    while (audio.next < audio.ctx.currentTime + .12) {
      const s = audio.step % 32, t = audio.next;
      if (tr.lead[s] != null) blip(t, hz(tr.lead[s]), sp * 1.6, tr.wave, .05);
      if (s % 4 === 0) blip(t, hz(tr.bass[Math.floor(s / 8)]), sp * 3.5, 'triangle', .16);
      if (s % 8 === 0) blip(t, 60, .12, 'sine', .35);
      if (s % 2 === 1) hat(t, .05);
      audio.next += sp; audio.step++;
    }
    const pos = (audio.step % 32) / 32;
    $$('[data-gm-music-pos]').forEach(b => b.style.width = (pos * 100) + '%');
  }
  function play(i) {
    if (!audio.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      audio.ctx = new AC(); audio.master = audio.ctx.createGain(); audio.master.gain.value = .55;
      audio.an = audio.ctx.createAnalyser(); audio.an.fftSize = 256;
      audio.master.connect(audio.an).connect(audio.ctx.destination); meter();
    }
    audio.ctx.resume(); clearInterval(audio.timer);
    audio.track = i; audio.step = 0; audio.next = audio.ctx.currentTime + .05;
    audio.timer = setInterval(tick, 25);
    $$('[data-gm-track]').forEach(b => b.classList.toggle('is-on', +b.dataset.gmTrack === i));
    $$('[data-gm-music-readout]').forEach(el => el.innerHTML =
      `Now playing<br>Track ${i + 1}<br>${TRACKS[i].bpm} bpm<br><span class="text-white">Size</span> ${TRACKS[i].kb} kb`);
    $$('[data-gm-music-led]').forEach(l => l.classList.add('is-on'));
  }
  function stop() {
    clearInterval(audio.timer); audio.track = -1;
    $$('[data-gm-track]').forEach(b => b.classList.remove('is-on'));
    $$('[data-gm-music-readout]').forEach(el => el.innerHTML = 'Music off<br>Pick a track');
    $$('[data-gm-music-pos]').forEach(b => b.style.width = '0%');
    $$('[data-gm-music-led]').forEach(l => l.classList.remove('is-on'));
  }
  function meter() {
    const buf = new Uint8Array(audio.an.fftSize);
    const loop = () => {
      audio.an.getByteTimeDomainData(buf);
      let sum = 0; for (const v of buf) sum += ((v - 128) / 128) ** 2;
      const lvl = Math.min(1, Math.sqrt(sum / buf.length) * 4.5);
      $$('.gm-vu').forEach(v => v.style.setProperty('--gm-level', lvl.toFixed(2)));
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ── wireframe monitor (canvas) ── */
  function initMonitors() {
    $$('canvas[data-gm-wire]').forEach(cv => {
      const ctx = cv.getContext('2d'); let a = 0;
      const V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
      const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      const cubes = [[.32,.24,.16,0],[.72,.5,.22,1.7],[.38,.78,.13,3.1]];
      const draw = () => {
        const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight;
        ctx.clearRect(0, 0, w, h); ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 1.5;
        cubes.forEach(([cx, cy, s, ph]) => {
          const t = a + ph, size = s * Math.min(w, h * 1.3);
          const P = V.map(([x, y, z]) => {
            let X = x * Math.cos(t) - z * Math.sin(t), Z = x * Math.sin(t) + z * Math.cos(t);
            let Y = y * Math.cos(t * .7) - Z * Math.sin(t * .7); Z = y * Math.sin(t * .7) + Z * Math.cos(t * .7);
            const p = 3 / (3 + Z); return [cx * w + X * size * p * .5, cy * h + Y * size * p * .5];
          });
          ctx.beginPath(); E.forEach(([i, j]) => { ctx.moveTo(...P[i]); ctx.lineTo(...P[j]); }); ctx.stroke();
        });
        if (!root.classList.contains('gm-fx-off') && !reduce) a += .012;
        requestAnimationFrame(draw);
      };
      draw();
    });
  }

  /* ── clock ── */
  function clock() {
    const d = new Date(), p = n => String(n).padStart(2, '0');
    $$('[data-gm-clock]').forEach(el => el.textContent = `${p(d.getHours())}:${p(d.getMinutes())}`);
  }

  /* ── wire everything ── */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-gm-accent-set],[data-gm-wall-set],[data-gm-target],[data-gm-reset],[data-gm-close],[data-gm-track],[data-gm-action]');
    if (!t) return;
    if (t.dataset.gmAccentSet) setAccent(t.dataset.gmAccentSet);
    else if (t.dataset.gmWallSet) setWall(t.dataset.gmWallSet);
    else if (t.dataset.gmTarget) showSection(t);
    else if (t.hasAttribute('data-gm-reset')) {
      const w = t.closest('.gm-window, .gm-module');
      if (w) { w.style.transform = ''; w.classList.remove('is-collapsed'); }
      if (t.dataset.gmReset === 'all') { setAccent('orange'); setWall('sunrise'); setText('normal'); setFx(true); stop();
        $$('.gm-window').forEach(x => { x.style.transform = ''; x.classList.remove('is-collapsed'); }); }
    }
    else if (t.hasAttribute('data-gm-close')) {
      const w = t.closest('.gm-window, .gm-module');
      if (w) { const c = w.classList.toggle('is-collapsed'); const x = w.querySelector('.gm-x[data-gm-close]'); if (x) x.textContent = c ? '+' : 'x'; }
    }
    else if (t.dataset.gmTrack) play(+t.dataset.gmTrack);
    else if (t.dataset.gmAction === 'music-off') stop();
    else if (t.dataset.gmAction === 'music-toggle') audio.track < 0 ? play(0) : stop();
    else if (t.dataset.gmAction === 'glow-cycle') cycleAccent();
    else if (t.dataset.gmAction === 'wall-cycle') { const k = Object.keys(WALLS), cur = k.indexOf(store.get('wall')); setWall(k[(cur + 1) % k.length]); }
    else if (t.dataset.gmAction === 'text-toggle') setText(root.dataset.gmText === 'large' ? 'normal' : 'large');
    else if (t.dataset.gmAction === 'wall-load') $('[data-gm-wall-file]')?.click();
    else if (t.dataset.gmAction === 'shutdown') { stop(); $('.gm-shutdown')?.classList.add('is-on'); }
    else if (t.dataset.gmAction === 'boot') t.closest('.gm-shutdown').classList.remove('is-on');
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('[data-gm-accent-custom]')) setAccent(t.value);
    if (t.matches('[data-gm-wall-file]')) loadWallFile(t.files[0]);
    if (t.matches('[data-gm-text-set]')) setText(t.dataset.gmTextSet);
    if (t.matches('[data-gm-fx-set]')) setFx(t.dataset.gmFxSet === 'quality');
  });
  /* drop disk here → wallpaper */
  $$('[data-gm-drop]').forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('is-hot'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('is-hot'));
    slot.addEventListener('drop', e => { e.preventDefault(); slot.classList.remove('is-hot'); loadWallFile(e.dataTransfer.files[0]); });
  });

  setAccent(store.get('accent') || root.dataset.gmAccent || 'orange');
  setWall(store.get('wall') || 'sunrise');
  setText(store.get('text') || 'normal');
  setFx(store.get('fx') !== '0' && !reduce);
  initDrag(); initMonitors(); clock(); setInterval(clock, 15000);

  if (window.bootstrap) {
    $$('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
    $$('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
    $$('[data-gm-toast-show]').forEach(b => b.addEventListener('click', () =>
      bootstrap.Toast.getOrCreateInstance($(b.dataset.gmToastShow)).show()));
  }
  window.GM = { setAccent, setWall, setText, setFx, play, stop };
})();
