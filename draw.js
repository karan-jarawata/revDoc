/* ============================================================
   draw.js — Feature-rich annotation overlay for revDoc pages.
   Self-contained: injects its own CSS, canvas, and toolbar.
   No persistence — drawings clear on window resize.
   ============================================================ */
(function () {
  'use strict';

  /* ── Injected CSS ─────────────────────────────────────────── */
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
.drw-colors {\
  display: grid; grid-template-columns: repeat(8,1fr); gap: 5px;\
}\
.drw-swatch {\
  width: 100%; aspect-ratio: 1;\
  border-radius: 50%; border: 2px solid transparent;\
  cursor: pointer;\
  transition: transform .15s, border-color .15s, box-shadow .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.drw-swatch:hover  { transform: scale(1.18); }\
.drw-swatch.on { border-color: #fff; transform: scale(1.22); box-shadow: 0 0 0 2px rgba(255,255,255,.25); }\
.drw-sizes { display: flex; gap: 5px; }\
.drw-sz {\
  flex: 1; padding: 6px 0; border-radius: 9px;\
  border: 1.5px solid rgba(255,255,255,.1);\
  background: rgba(255,255,255,.05); color: rgba(255,255,255,.65);\
  font-size: 11px; font-weight: 700; text-align: center; cursor: pointer;\
  font-family: system-ui,sans-serif;\
  transition: background .15s, border-color .15s;\
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
  font-family: system-ui,sans-serif;\
  transition: background .15s, border-color .15s, color .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.drw-btn:hover { background: rgba(255,255,255,.11); }\
.drw-btn.clear:hover { background: rgba(239,68,68,.2); border-color: rgba(239,68,68,.45); color: #fca5a5; }\
.drw-btn:disabled { opacity: .3; cursor: default; pointer-events: none; }\
#draw-canvas {\
  position: absolute; top: 0; left: 0;\
  z-index: 90; pointer-events: none; touch-action: none;\
}\
#draw-canvas.active { pointer-events: all; cursor: crosshair; }\
#draw-live {\
  position: fixed; top: 0; left: 0;\
  width: 100%; height: 100%;\
  z-index: 91; pointer-events: none; touch-action: none;\
  display: none;\
}\
body.drw-active { overflow: hidden; touch-action: none; }\
.sidebar__home {\
  position: absolute; top: 16px; left: 14px;\
  width: 30px; height: 30px; border-radius: 8px;\
  display: flex; align-items: center; justify-content: center;\
  background: transparent; border: 1.5px solid rgba(255,255,255,.08);\
  color: rgba(255,255,255,.45); text-decoration: none;\
  cursor: pointer; z-index: 2;\
  transition: background .15s, color .15s;\
  -webkit-tap-highlight-color: transparent;\
}\
.sidebar__home:hover { color: #fff; background: #1c2434; }\
.sidebar.collapsed .sidebar__home { position: static; }\
.sidebar__title { margin-top: 28px; }\
.sidebar.collapsed .sidebar__title { margin-top: 0; }\
';
  document.head.appendChild(style);

  /* ── Main canvas (absolute, full document) ────────────────── */
  var canvas = document.createElement('canvas');
  canvas.id = 'draw-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  /* ── Live canvas (fixed, viewport only — highlighter strokes) */
  var liveCanvas = document.createElement('canvas');
  liveCanvas.id = 'draw-live';
  document.body.appendChild(liveCanvas);
  var liveCtx = liveCanvas.getContext('2d');

  /* ── Toolbar ──────────────────────────────────────────────── */
  var toolbar = document.createElement('div');
  toolbar.id = 'draw-toolbar';
  toolbar.innerHTML =
    '<div class="drw-label">Tool</div>' +
    '<div class="drw-row">' +
      '<button class="drw-tool on" data-tool="pencil" title="Pencil (thin stroke)">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>' +
      '</button>' +
      '<button class="drw-tool" data-tool="highlighter" title="Highlighter (semi-transparent)">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l4 4L21 5"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/></svg>' +
      '</button>' +
      '<button class="drw-tool" data-tool="eraser" title="Eraser">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16l10-10 7 7-2.5 2.5"/><path d="M6.0001 20l4-4"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="drw-sep"></div>' +
    '<div class="drw-label">Color</div>' +
    '<div class="drw-colors">' +
      '<div class="drw-swatch on"  data-color="#ffffff" style="background:#ffffff" title="White"></div>' +
      '<div class="drw-swatch"     data-color="#f87171" style="background:#f87171" title="Red"></div>' +
      '<div class="drw-swatch"     data-color="#fb923c" style="background:#fb923c" title="Orange"></div>' +
      '<div class="drw-swatch"     data-color="#facc15" style="background:#facc15" title="Yellow"></div>' +
      '<div class="drw-swatch"     data-color="#4ade80" style="background:#4ade80" title="Green"></div>' +
      '<div class="drw-swatch"     data-color="#60a5fa" style="background:#60a5fa" title="Blue"></div>' +
      '<div class="drw-swatch"     data-color="#c084fc" style="background:#c084fc" title="Purple"></div>' +
      '<div class="drw-swatch"     data-color="#f472b6" style="background:#f472b6" title="Pink"></div>' +
    '</div>' +
    '<div class="drw-sep"></div>' +
    '<div class="drw-label">Size</div>' +
    '<div class="drw-sizes">' +
      '<button class="drw-sz" data-sz="s">S</button>' +
      '<button class="drw-sz on" data-sz="m">M</button>' +
      '<button class="drw-sz" data-sz="l">L</button>' +
    '</div>' +
    '<div class="drw-sep"></div>' +
    '<div class="drw-row">' +
      '<button class="drw-btn" id="drw-undo" disabled>' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>' +
        'Undo' +
      '</button>' +
      '<button class="drw-btn clear" id="drw-clear">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
        'Clear' +
      '</button>' +
    '</div>';
  document.body.appendChild(toolbar);

  /* ── Toggle button ────────────────────────────────────────── */
  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'draw-toggle';
  toggleBtn.title = 'Toggle drawing mode';
  toggleBtn.innerHTML =
    '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 20h9"/>' +
      '<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' +
    '</svg>';
  document.body.appendChild(toggleBtn);

  /* ── Home button in sidebar ───────────────────────────────── */
  var sidebarHead = document.querySelector('.sidebar__head');
  if (sidebarHead) {
    var homeBtn = document.createElement('a');
    homeBtn.href = '../index.html';
    homeBtn.className = 'sidebar__home';
    homeBtn.title = 'Back to home';
    homeBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
        '<polyline points="9 22 9 12 15 12 15 22"/>' +
      '</svg>';
    sidebarHead.appendChild(homeBtn);
  }

  /* ── State ────────────────────────────────────────────────── */
  var S = {
    active: false,
    tool: 'pencil',
    color: '#ffffff',
    size: 'm',
    drawing: false,
    lx: 0, ly: 0,       // last doc-coords (pencil/eraser)
    hlPts: [],           // viewport-coord points for current highlighter stroke
    stack: []            // ImageData undo snapshots (main canvas only)
  };

  /* px per tool × size */
  var PX = {
    pencil:      { s: 2,  m: 4,  l: 9  },
    highlighter: { s: 14, m: 24, l: 40 },
    eraser:      { s: 18, m: 34, l: 60 }
  };

  /* ── Canvas sizing ────────────────────────────────────────── */
  function resizeCanvas() {
    var el = document.documentElement;
    var w = Math.max(el.scrollWidth,  el.clientWidth);
    var h = Math.max(el.scrollHeight, el.clientHeight);
    if (canvas.width === w && canvas.height === h) return; // unchanged — keep drawings
    canvas.width  = w;
    canvas.height = h;
    S.stack = [];
    syncUndoBtn();
  }

  function resizeLive() {
    liveCanvas.width  = window.innerWidth;
    liveCanvas.height = window.innerHeight;
  }

  // Size once after layout, then track resizes
  if (document.readyState === 'complete') { resizeCanvas(); resizeLive(); }
  else { window.addEventListener('load', function () { resizeCanvas(); resizeLive(); }); }
  window.addEventListener('resize', function () { resizeLive(); resizeCanvas(); });

  /* ── Coordinate helpers ───────────────────────────────────── */
  // Document coords — used for pencil/eraser on the absolute main canvas
  function docPos(e) {
    var t = e.touches ? e.touches[0] : e;
    return { x: t.clientX + window.scrollX, y: t.clientY + window.scrollY };
  }

  // Viewport coords — used for highlighter on the fixed live canvas
  function vpPos(e) {
    var t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }

  /* ── Highlighter live-canvas helpers ─────────────────────── */
  function hlRedraw() {
    liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
    if (S.hlPts.length < 1) return;
    liveCtx.save();
    liveCtx.globalAlpha   = 0.4;
    liveCtx.globalCompositeOperation = 'source-over';
    liveCtx.strokeStyle   = S.color;
    liveCtx.lineWidth     = PX.highlighter[S.size];
    liveCtx.lineCap       = 'round';
    liveCtx.lineJoin      = 'round';
    liveCtx.beginPath();
    liveCtx.moveTo(S.hlPts[0].x, S.hlPts[0].y);
    for (var i = 1; i < S.hlPts.length; i++) {
      liveCtx.lineTo(S.hlPts[i].x, S.hlPts[i].y);
    }
    liveCtx.stroke();
    liveCtx.restore();
  }

  function hlCommit() {
    // Bake the live canvas into the main canvas at the correct scroll offset
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(liveCanvas, window.scrollX, window.scrollY);
    ctx.restore();
    liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
    liveCanvas.style.display = 'none';
    S.hlPts = [];
  }

  /* ── Draw helpers ─────────────────────────────────────────── */
  function applyStyle() {
    var lw = PX[S.tool][S.size];
    ctx.lineWidth  = lw;
    ctx.lineCap    = 'round';
    ctx.lineJoin   = 'round';
    if (S.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha  = 1;
      ctx.strokeStyle  = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha  = 1;
      ctx.strokeStyle  = S.color;
      ctx.fillStyle    = S.color;
    }
  }

  function snapshot() {
    var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (S.stack.length >= 25) S.stack.shift();
    S.stack.push(img);
    syncUndoBtn();
  }

  function onDown(e) {
    if (!S.active) return;
    if (e.touches && e.touches.length > 1) return;
    e.preventDefault();

    if (S.tool === 'highlighter') {
      snapshot();
      S.drawing = true;
      S.hlPts   = [vpPos(e)];
      liveCanvas.style.display = 'block';
      hlRedraw();
      return;
    }

    snapshot();
    var p = docPos(e);
    S.drawing = true;
    S.lx = p.x; S.ly = p.y;
    applyStyle();
    if (S.tool === 'eraser') {
      var hw = PX.eraser[S.size] / 2;
      ctx.clearRect(p.x - hw, p.y - hw, hw * 2, hw * 2);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, PX.pencil[S.size] / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function onMove(e) {
    if (!S.drawing) return;
    if (e.touches && e.touches.length > 1) return;
    e.preventDefault();

    if (S.tool === 'highlighter') {
      S.hlPts.push(vpPos(e));
      hlRedraw();
      return;
    }

    var p = docPos(e);
    applyStyle();
    if (S.tool === 'eraser') {
      var hw = PX.eraser[S.size] / 2;
      ctx.clearRect(p.x - hw, p.y - hw, hw * 2, hw * 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(S.lx, S.ly);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    S.lx = p.x; S.ly = p.y;
  }

  function onUp() {
    if (!S.drawing) return;
    S.drawing = false;
    if (S.tool === 'highlighter') {
      hlCommit();
    } else {
      ctx.beginPath();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  /* ── Canvas events ────────────────────────────────────────── */
  canvas.addEventListener('mousedown',  onDown);
  canvas.addEventListener('mousemove',  onMove);
  canvas.addEventListener('mouseup',    onUp);
  canvas.addEventListener('mouseleave', onUp);
  canvas.addEventListener('touchstart', onDown,  { passive: false });
  canvas.addEventListener('touchmove',  onMove,  { passive: false });
  canvas.addEventListener('touchend',   onUp);
  canvas.addEventListener('touchcancel',onUp);

  /* ── Undo / Clear ─────────────────────────────────────────── */
  function undo() {
    if (!S.stack.length) return;
    ctx.putImageData(S.stack.pop(), 0, 0);
    syncUndoBtn();
  }

  function clearAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
    S.stack = [];
    syncUndoBtn();
  }

  function syncUndoBtn() {
    var btn = document.getElementById('drw-undo');
    if (btn) btn.disabled = S.stack.length === 0;
  }

  /* ── Mode toggle ──────────────────────────────────────────── */
  function enter() {
    resizeCanvas();
    S.active = true;
    canvas.classList.add('active');
    toolbar.classList.add('visible');
    toggleBtn.classList.add('active');
    document.body.classList.add('drw-active');
  }

  function exit() {
    S.active  = false;
    S.drawing = false;
    hlCommit(); // commit any in-progress highlighter stroke
    canvas.classList.remove('active');
    toolbar.classList.remove('visible');
    toggleBtn.classList.remove('active');
    document.body.classList.remove('drw-active');
  }

  toggleBtn.addEventListener('click', function () {
    if (S.active) exit(); else enter();
  });

  /* ── Toolbar wiring ───────────────────────────────────────── */
  var toolBtns = toolbar.querySelectorAll('.drw-tool');
  var swatches = toolbar.querySelectorAll('.drw-swatch');
  var sizeBtns = toolbar.querySelectorAll('.drw-sz');

  toolBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      S.tool = btn.dataset.tool;
      toolBtns.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
    });
  });

  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () {
      S.color = sw.dataset.color;
      swatches.forEach(function (s) { s.classList.remove('on'); });
      sw.classList.add('on');
    });
  });

  sizeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      S.size = btn.dataset.sz;
      sizeBtns.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
    });
  });

  document.getElementById('drw-undo').addEventListener('click', undo);
  document.getElementById('drw-clear').addEventListener('click', clearAll);

  /* ── Keyboard shortcuts ───────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (S.active) exit(); return; }
    if (!S.active) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (e.key === 'p') { toolBtns[0].click(); }
    if (e.key === 'h') { toolBtns[1].click(); }
    if (e.key === 'e') { toolBtns[2].click(); }
    if (e.key === 'Delete' || e.key === 'Backspace') { clearAll(); }
  });
})();
