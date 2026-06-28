/* ============================================================
   draw.js — Feature-rich annotation overlay for revDoc pages.
   Self-contained: injects CSS, canvases, toolbar, home button.
   Vector stroke storage — canvas is always viewport-sized so it
   works on tablets regardless of page length.
   ============================================================ */
(function () {
  'use strict';

  /* ── CSS ──────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = '\
#draw-toggle {\
  position: fixed; bottom: 24px; left: 24px;\
  width: 54px; height: 54px; border-radius: 50%;\
  border: none; background: #1e293b; color: #fff;\
  cursor: pointer; z-index: 92;\
  display: flex; align-items: center; justify-content: center;\
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);\
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;\
  -webkit-tap-highlight-color: transparent;\
}\
#draw-toggle:hover { background: #334155; transform: scale(1.08); }\
#draw-toggle.active {\
  background: #6366f1;\
  animation: drw-pulse 2s ease-in-out infinite;\
}\
@keyframes drw-pulse {\
  0%,100% { box-shadow: 0 0 0 4px rgba(99,102,241,.35), 0 4px 20px rgba(0,0,0,.4); }\
  50%      { box-shadow: 0 0 0 9px rgba(99,102,241,.12), 0 4px 20px rgba(0,0,0,.4); }\
}\
#draw-toolbar {\
  position: fixed; bottom: 90px; left: 14px;\
  width: 210px;\
  background: rgba(10,17,34,0.97);\
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);\
  border-radius: 18px; padding: 14px 12px;\
  z-index: 92; display: none; flex-direction: column; gap: 10px;\
  box-shadow: 0 12px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.07);\
  user-select: none; -webkit-user-select: none;\
}\
#draw-toolbar.visible { display: flex; }\
.drw-label {\
  font-size: 9.5px; font-weight: 700; letter-spacing: .1em;\
  color: rgba(255,255,255,.38); text-transform: uppercase;\
  font-family: system-ui,sans-serif;\
}\
.drw-row { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }\
.drw-tool {\
  flex: 1; padding: 8px 4px; border-radius: 11px;\
  border: 1.5px solid rgba(255,255,255,.1);\
  background: rgba(255,255,255,.05); color: rgba(255,255,255,.7);\
  font-size: 17px; cursor: pointer;\
  display: flex; align-items: center; justify-content: center;\
  transition: background .15s, border-color .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.drw-tool:hover { background: rgba(255,255,255,.12); }\
.drw-tool.on { background: rgba(99,102,241,.28); border-color: #6366f1; color: #a5b4fc; }\
.drw-colors { display: grid; grid-template-columns: repeat(8,1fr); gap: 5px; }\
.drw-swatch {\
  width: 100%; aspect-ratio: 1; border-radius: 50%; border: 2px solid transparent;\
  cursor: pointer; transition: transform .15s, border-color .15s, box-shadow .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.drw-swatch:hover { transform: scale(1.18); }\
.drw-swatch.on { border-color: #fff; transform: scale(1.22); box-shadow: 0 0 0 2px rgba(255,255,255,.25); }\
.drw-sizes { display: flex; gap: 5px; }\
.drw-sz {\
  flex: 1; padding: 6px 0; border-radius: 9px;\
  border: 1.5px solid rgba(255,255,255,.1);\
  background: rgba(255,255,255,.05); color: rgba(255,255,255,.65);\
  font-size: 11px; font-weight: 700; text-align: center; cursor: pointer;\
  font-family: system-ui,sans-serif; transition: background .15s, border-color .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.drw-sz:hover { background: rgba(255,255,255,.1); }\
.drw-sz.on { background: rgba(99,102,241,.28); border-color: #6366f1; color: #a5b4fc; }\
.drw-sep { height: 1px; background: rgba(255,255,255,.08); margin: 1px -2px; }\
.drw-btn {\
  flex: 1; padding: 8px 4px; border-radius: 11px;\
  border: 1.5px solid rgba(255,255,255,.1);\
  background: rgba(255,255,255,.05); color: rgba(255,255,255,.7);\
  font-size: 12px; cursor: pointer;\
  display: flex; align-items: center; justify-content: center; gap: 4px;\
  font-family: system-ui,sans-serif; transition: background .15s, border-color .15s, color .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.drw-btn:hover { background: rgba(255,255,255,.11); }\
.drw-btn.clear:hover { background: rgba(239,68,68,.2); border-color: rgba(239,68,68,.45); color: #fca5a5; }\
.drw-btn:disabled { opacity: .3; cursor: default; pointer-events: none; }\
#draw-canvas, #draw-live {\
  position: fixed; top: 0; left: 0;\
  width: 100%; height: 100%;\
  pointer-events: none; touch-action: none;\
}\
#draw-canvas { z-index: 90; will-change: transform; }\
#draw-canvas.active { pointer-events: all; cursor: crosshair; }\
#draw-live { z-index: 91; display: none; }\
body.drw-active { overflow: hidden; touch-action: none; }\
.sidebar__home {\
  position: absolute; top: 14px; left: 14px;\
  width: 32px; height: 32px; border-radius: 9px;\
  display: flex; align-items: center; justify-content: center;\
  background: rgba(255,255,255,.06);\
  border: 1.5px solid rgba(255,255,255,.13);\
  color: rgba(255,255,255,.6); text-decoration: none;\
  cursor: pointer; z-index: 2;\
  transition: background .15s, color .15s, border-color .15s, box-shadow .15s;\
  -webkit-tap-highlight-color: transparent;\
  box-shadow: 0 1px 4px rgba(0,0,0,.2);\
}\
.sidebar__home:hover {\
  background: rgba(99,102,241,.18);\
  border-color: rgba(99,102,241,.5);\
  color: #a5b4fc;\
  box-shadow: 0 0 0 3px rgba(99,102,241,.12);\
}\
.sidebar.collapsed .sidebar__home { position: static; width: 36px; height: 36px; border-radius: 10px; }\
.sidebar__title { margin-top: 30px; }\
.sidebar.collapsed .sidebar__title { margin-top: 0; }\
';
  document.head.appendChild(style);

  /* ── Canvases ─────────────────────────────────────────────── */
  var canvas = document.createElement('canvas');
  canvas.id = 'draw-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  /* Live canvas: fixed, viewport-sized, for highlighter preview only */
  var live = document.createElement('canvas');
  live.id = 'draw-live';
  document.body.appendChild(live);
  var lctx = live.getContext('2d');

  /* ── Toolbar ──────────────────────────────────────────────── */
  var toolbar = document.createElement('div');
  toolbar.id = 'draw-toolbar';
  toolbar.innerHTML =
    '<div class="drw-label">Tool</div>' +
    '<div class="drw-row">' +
      '<button class="drw-tool on" data-tool="pencil" title="Pencil">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>' +
      '</button>' +
      '<button class="drw-tool" data-tool="highlighter" title="Highlighter">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg>' +
      '</button>' +
      '<button class="drw-tool" data-tool="eraser" title="Eraser">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16l10-10 7 7-2.5 2.5"/><path d="M6 20l4-4"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="drw-sep"></div>' +
    '<div class="drw-label">Color</div>' +
    '<div class="drw-colors">' +
      '<div class="drw-swatch on"  data-color="#ffffff" style="background:#ffffff"></div>' +
      '<div class="drw-swatch"     data-color="#f87171" style="background:#f87171"></div>' +
      '<div class="drw-swatch"     data-color="#fb923c" style="background:#fb923c"></div>' +
      '<div class="drw-swatch"     data-color="#facc15" style="background:#facc15"></div>' +
      '<div class="drw-swatch"     data-color="#4ade80" style="background:#4ade80"></div>' +
      '<div class="drw-swatch"     data-color="#60a5fa" style="background:#60a5fa"></div>' +
      '<div class="drw-swatch"     data-color="#c084fc" style="background:#c084fc"></div>' +
      '<div class="drw-swatch"     data-color="#f472b6" style="background:#f472b6"></div>' +
    '</div>' +
    '<div class="drw-sep"></div>' +
    '<div class="drw-label">Size</div>' +
    '<div class="drw-sizes">' +
      '<button class="drw-sz on" data-sz="s">S</button>' +
      '<button class="drw-sz" data-sz="m">M</button>' +
      '<button class="drw-sz" data-sz="l">L</button>' +
    '</div>' +
    '<div class="drw-sep"></div>' +
    '<div class="drw-row">' +
      '<button class="drw-btn" id="drw-undo" disabled>' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>Undo' +
      '</button>' +
      '<button class="drw-btn clear" id="drw-clear">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>Clear' +
      '</button>' +
    '</div>';
  document.body.appendChild(toolbar);

  /* ── Toggle button ────────────────────────────────────────── */
  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'draw-toggle';
  toggleBtn.title = 'Toggle drawing mode';
  toggleBtn.innerHTML =
    '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' +
    '</svg>';
  document.body.appendChild(toggleBtn);

  /* ── Home button ──────────────────────────────────────────── */
  var sidebarHead = document.querySelector('.sidebar__head');
  if (sidebarHead) {
    var homeBtn = document.createElement('a');
    homeBtn.href = '../index.html';
    homeBtn.className = 'sidebar__home';
    homeBtn.title = 'Back to home';
    homeBtn.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
        '<polyline points="9 22 9 12 15 12 15 22"/>' +
      '</svg>';
    sidebarHead.appendChild(homeBtn);
  }

  /* ── State ────────────────────────────────────────────────── */
  var S = {
    active: false, tool: 'pencil', color: '#ffffff', size: 's',
    drawing: false, lx: 0, ly: 0,
    hlPts: []   // viewport-coord points for live highlighter preview
  };

  var PX = {
    pencil:      { s: 2,  m: 4,  l: 9  },
    highlighter: { s: 14, m: 24, l: 40 },
    eraser:      { s: 18, m: 34, l: 60 }
  };

  /* ── Stroke store (vector — works on any page length) ─────── */
  var strokes = [];       // committed: { tool, color, size, pts[] } in doc coords
  var curPts  = [];       // doc-coord points for stroke in progress

  /* ── Canvas sizing ────────────────────────────────────────── */
  function resize() {
    canvas.width = live.width  = window.innerWidth;
    canvas.height = live.height = window.innerHeight;
    redraw();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Coordinate helpers ───────────────────────────────────── */
  function docPos(e) {
    var t = e.touches ? e.touches[0] : e;
    return { x: t.clientX + window.scrollX, y: t.clientY + window.scrollY };
  }
  function vpPos(e) {
    var t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }

  /* ── Render a single stroke (doc-coord space) ─────────────── */
  function renderStroke(c, s) {
    if (!s.pts.length) return;
    var lw = PX[s.tool][s.size];
    c.lineWidth  = lw;
    c.lineCap    = 'round';
    c.lineJoin   = 'round';
    if (s.tool === 'eraser') {
      c.globalCompositeOperation = 'destination-out';
      c.globalAlpha = 1;
      c.strokeStyle = c.fillStyle = 'rgba(0,0,0,1)';
    } else if (s.tool === 'highlighter') {
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 0.4;
      c.strokeStyle = c.fillStyle = s.color;
    } else {
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.strokeStyle = c.fillStyle = s.color;
    }
    c.beginPath();
    c.moveTo(s.pts[0].x, s.pts[0].y);
    for (var i = 1; i < s.pts.length; i++) c.lineTo(s.pts[i].x, s.pts[i].y);
    c.stroke();
    if (s.pts.length === 1 && s.tool !== 'eraser') {
      c.beginPath();
      c.arc(s.pts[0].x, s.pts[0].y, lw / 2, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
  }

  /* ── Full redraw from stroke store ───────────────────────── */
  /* Track scroll position at the time of the last full pixel repaint.
     The CSS transform on the canvas compensates the delta between that
     position and the current scroll, keeping drawings glued to the page
     without waiting for a JS repaint cycle. */
  var _redrawSX = 0, _redrawSY = 0;

  function redraw() {
    canvas.style.transform = 'none';   // clear any compensation offset
    _redrawSX = window.scrollX;
    _redrawSY = window.scrollY;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!strokes.length) return;
    ctx.setTransform(1, 0, 0, 1, -_redrawSX, -_redrawSY);
    for (var i = 0; i < strokes.length; i++) renderStroke(ctx, strokes[i]);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* Two-stage scroll handler:
     1. Immediately shift the canvas element via CSS translate — the compositor
        picks this up in the same frame the scroll happened, so drawings never
        appear to float regardless of scroll speed.
     2. Schedule a rAF to do the accurate pixel repaint and clear the offset. */
  var _rafPending = false;
  function onScrollRedraw() {
    var dx = window.scrollX - _redrawSX;
    var dy = window.scrollY - _redrawSY;
    canvas.style.transform = 'translate(' + (-dx) + 'px,' + (-dy) + 'px)';
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(function () {
      _rafPending = false;
      redraw();
    });
  }
  window.addEventListener('scroll', onScrollRedraw, { passive: true });

  /* ── Highlighter live preview ─────────────────────────────── */
  function hlRedraw() {
    lctx.clearRect(0, 0, live.width, live.height);
    if (S.hlPts.length < 1) return;
    lctx.save();
    lctx.globalAlpha = 0.4;
    lctx.strokeStyle = S.color;
    lctx.lineWidth   = PX.highlighter[S.size];
    lctx.lineCap = lctx.lineJoin = 'round';
    lctx.beginPath();
    lctx.moveTo(S.hlPts[0].x, S.hlPts[0].y);
    for (var i = 1; i < S.hlPts.length; i++) lctx.lineTo(S.hlPts[i].x, S.hlPts[i].y);
    lctx.stroke();
    lctx.restore();
  }

  /* ── Drawing events ───────────────────────────────────────── */
  function onDown(e) {
    if (!S.active || (e.touches && e.touches.length > 1)) return;
    e.preventDefault();
    var p = docPos(e);
    curPts = [p];
    S.drawing = true;

    if (S.tool === 'highlighter') {
      S.hlPts = [vpPos(e)];
      live.style.display = 'block';
      hlRedraw();
      return;
    }

    /* Incremental draw for pencil / eraser */
    ctx.setTransform(1, 0, 0, 1, -window.scrollX, -window.scrollY);
    renderStroke(ctx, { tool: S.tool, color: S.color, size: S.size, pts: [p] });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    S.lx = p.x; S.ly = p.y;
  }

  function onMove(e) {
    if (!S.drawing || (e.touches && e.touches.length > 1)) return;
    e.preventDefault();
    var p = docPos(e);
    curPts.push(p);

    if (S.tool === 'highlighter') {
      S.hlPts.push(vpPos(e));
      hlRedraw();
      return;
    }

    var lw = PX[S.tool][S.size];
    ctx.setTransform(1, 0, 0, 1, -window.scrollX, -window.scrollY);
    ctx.lineWidth = lw; ctx.lineCap = ctx.lineJoin = 'round';
    if (S.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.strokeStyle = S.color;
    }
    ctx.beginPath();
    ctx.moveTo(S.lx, S.ly);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    S.lx = p.x; S.ly = p.y;
  }

  function onUp() {
    if (!S.drawing) return;
    S.drawing = false;

    if (S.tool === 'highlighter') {
      lctx.clearRect(0, 0, live.width, live.height);
      live.style.display = 'none';
      S.hlPts = [];
    }

    if (curPts.length) {
      strokes.push({ tool: S.tool, color: S.color, size: S.size, pts: curPts });
      curPts = [];
      /* For highlighter: now replay via redraw so the baked stroke is consistent */
      if (S.tool === 'highlighter') redraw();
      syncUndoBtn();
    }
  }

  canvas.addEventListener('mousedown',   onDown);
  canvas.addEventListener('mousemove',   onMove);
  canvas.addEventListener('mouseup',     onUp);
  canvas.addEventListener('mouseleave',  onUp);
  canvas.addEventListener('touchstart',  onDown,  { passive: false });
  canvas.addEventListener('touchmove',   onMove,  { passive: false });
  canvas.addEventListener('touchend',    onUp);
  canvas.addEventListener('touchcancel', onUp);

  /* ── Undo / Clear ─────────────────────────────────────────── */
  function undo() {
    if (!strokes.length) return;
    strokes.pop();
    redraw();
    syncUndoBtn();
  }
  function clearAll() {
    strokes = [];
    curPts  = [];
    lctx.clearRect(0, 0, live.width, live.height);
    redraw();
    syncUndoBtn();
  }
  function syncUndoBtn() {
    var b = document.getElementById('drw-undo');
    if (b) b.disabled = strokes.length === 0;
  }

  /* ── Mode toggle ──────────────────────────────────────────── */
  function enter() {
    S.active = true;
    canvas.classList.add('active');
    toolbar.classList.add('visible');
    toggleBtn.classList.add('active');
    document.body.classList.add('drw-active');
    redraw(); // paint stored strokes at current scroll offset
  }
  function exit() {
    S.active = S.drawing = false;
    canvas.classList.remove('active');
    toolbar.classList.remove('visible');
    toggleBtn.classList.remove('active');
    document.body.classList.remove('drw-active');
    lctx.clearRect(0, 0, live.width, live.height);
    live.style.display = 'none';
  }
  toggleBtn.addEventListener('click', function () {
    if (S.active) exit(); else enter();
  });

  /* ── Toolbar wiring ───────────────────────────────────────── */
  var toolBtns = toolbar.querySelectorAll('.drw-tool');
  var swatches = toolbar.querySelectorAll('.drw-swatch');
  var sizeBtns = toolbar.querySelectorAll('.drw-sz');

  toolBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      S.tool = b.dataset.tool;
      toolBtns.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });
  swatches.forEach(function (s) {
    s.addEventListener('click', function () {
      S.color = s.dataset.color;
      swatches.forEach(function (x) { x.classList.remove('on'); });
      s.classList.add('on');
    });
  });
  sizeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      S.size = b.dataset.sz;
      sizeBtns.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    });
  });

  document.getElementById('drw-undo').addEventListener('click', undo);
  document.getElementById('drw-clear').addEventListener('click', clearAll);

  /* ── Keyboard shortcuts ───────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (S.active) exit(); return; }
    if (!S.active) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (e.key === 'p') toolBtns[0].click();
    if (e.key === 'h') toolBtns[1].click();
    if (e.key === 'e') toolBtns[2].click();
    if (e.key === 'Delete' || e.key === 'Backspace') clearAll();
  });
})();
