/* ============================================================
   Renderer + interactions. Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- minimal Java syntax highlighter ---------- */
  var KEYWORDS = new Set([
    'abstract','assert','boolean','break','byte','case','catch','char','class','const',
    'continue','default','do','double','else','enum','extends','final','finally','float',
    'for','goto','if','implements','import','instanceof','int','interface','long','native',
    'new','package','private','protected','public','return','short','static','strictfp',
    'super','switch','synchronized','this','throw','throws','transient','try','void',
    'volatile','while','var','record','sealed','yield','true','false','null'
  ]);

  // Highlight a chunk that contains no comments/strings.
  function highlightSegment(text) {
    var html = '';
    var re = /(\d[\d_]*\.?\d*[LlFfDd]?)|(@\w+)|([A-Za-z_$][A-Za-z0-9_$]*)|([\s\S])/g;
    var m;
    while ((m = re.exec(text))) {
      if (m[1]) {
        html += '<span class="tok-number">' + m[1] + '</span>';
      } else if (m[2]) {
        html += '<span class="tok-annot">' + escapeHtml(m[2]) + '</span>';
      } else if (m[3]) {
        var w = m[3];
        if (KEYWORDS.has(w)) {
          html += '<span class="tok-keyword">' + w + '</span>';
        } else {
          var i = re.lastIndex;
          while (i < text.length && /\s/.test(text[i])) i++;
          if (text[i] === '(') html += '<span class="tok-method">' + w + '</span>';
          else if (/^[A-Z]/.test(w)) html += '<span class="tok-type">' + w + '</span>';
          else html += w;
        }
      } else {
        html += escapeHtml(m[4]);
      }
    }
    return html;
  }

  function highlightJava(code) {
    var html = '';
    var re = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')/g;
    var last = 0, m;
    while ((m = re.exec(code))) {
      html += highlightSegment(code.slice(last, m.index));
      if (m[1] || m[2]) html += '<span class="tok-comment">' + escapeHtml(m[0]) + '</span>';
      else html += '<span class="tok-string">' + escapeHtml(m[0]) + '</span>';
      last = re.lastIndex;
    }
    html += highlightSegment(code.slice(last));
    return html;
  }

  /* ---------- block renderers ---------- */
  var CALLOUT_ICON = { tip: '✅', warning: '⚠️', danger: '🛑', note: 'ℹ️', key: '🔑' };

  function renderBlock(b) {
    switch (b.t) {
      case 'sub':
        return '<h3 class="h-sub block">' + b.text + '</h3>';
      case 'prose':
        return '<div class="prose block">' + b.html + '</div>';
      case 'list':
        return '<ul class="list block">' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      case 'steps':
        return '<ol class="steps block">' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol>';
      case 'analogy':
        return '<div class="analogy block">' + b.html + '</div>';
      case 'tags':
        return '<div class="tag-row block">' + b.items.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>';
      case 'callout':
        return '<div class="callout callout--' + b.kind + ' block">' +
          '<span class="callout__icon">' + (CALLOUT_ICON[b.kind] || '') + '</span>' +
          '<div class="callout__body">' + b.html + '</div></div>';
      case 'diagram':
        return '<figure class="diagram block">' + (window.DIAGRAMS[b.name] || '') +
          (b.cap ? '<figcaption class="diagram__cap">' + b.cap + '</figcaption>' : '') + '</figure>';
      case 'code':
        return '<div class="code block">' +
          '<div class="code__bar"><span class="code__title">' + (b.title || 'Java') + '</span>' +
          '<button class="code__copy" type="button">Copy</button></div>' +
          '<pre><code>' + highlightJava(b.code) + '</code></pre></div>';
      case 'cards':
        return '<div class="grid grid--' + (b.cols || 3) + ' block">' +
          b.items.map(function (c) {
            return '<div class="card"><div class="card__title">' + c.title + '</div>' +
              '<div class="card__body">' + c.body + '</div></div>';
          }).join('') + '</div>';
      case 'table':
        return '<div class="table-wrap block"><table class="tbl"><thead><tr>' +
          b.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
          b.rows.map(function (r) {
            return '<tr>' + r.map(function (cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>';
      default:
        return '';
    }
  }

  // Collect a level's subtopics (its 'sub' blocks), with stable ids.
  function getSubs(lv) {
    var out = [], i = 0;
    lv.blocks.forEach(function (b) {
      if (b.t === 'sub') out.push({ id: lv.id + '-s' + (i++), text: b.text });
    });
    return out;
  }

  function renderLevel(lv) {
    var subIdx = 0;
    var blocksHtml = lv.blocks.map(function (b) {
      if (b.t === 'sub') {
        return '<h3 class="h-sub block" id="' + lv.id + '-s' + (subIdx++) + '">' + b.text + '</h3>';
      }
      return renderBlock(b);
    }).join('');
    return '<section class="level" id="' + lv.id + '" style="--accent: var(--' + lv.accent + ')">' +
      '<div class="level__head">' +
        '<div class="level__num">' + lv.num + '</div>' +
        '<div><div class="level__eyebrow">' + lv.eyebrow + '</div>' +
        '<h2 class="level__title">' + lv.title + '</h2></div>' +
      '</div>' +
      '<p class="level__intro">' + lv.intro + '</p>' +
      blocksHtml +
    '</section>';
  }

  function renderHero(h) {
    return '<header class="page-hero">' +
      '<div class="page-hero__eyebrow">' + h.eyebrow + '</div>' +
      '<h1 class="page-hero__title">' + h.title + '</h1>' +
      '<p class="page-hero__sub">' + h.sub + '</p>' +
      '<div class="hero-stats">' + h.stats.map(function (s) {
        return '<div><div class="hero-stat__num">' + s.num + '</div>' +
          '<div class="hero-stat__label">' + s.label + '</div></div>';
      }).join('') + '</div></header>';
  }

  function renderSidebar(levels) {
    var html = '', lastPart = null;
    levels.forEach(function (lv) {
      if (lv.part !== lastPart) {
        html += '<div class="nav-part">' + lv.part + '</div>';
        lastPart = lv.part;
      }
      html += '<button class="nav-btn" data-target="' + lv.id + '" title="' + lv.title + '" style="--accent: var(--' + lv.accent + ')">' +
        '<span class="nav-btn__num">' + lv.num + '</span>' +
        '<span class="nav-btn__label">' + lv.title + '</span></button>';
      var subs = getSubs(lv);
      if (subs.length) {
        html += '<div class="nav-subs" data-level="' + lv.id + '" style="--accent: var(--' + lv.accent + ')">' +
          subs.map(function (s) {
            return '<button class="nav-sub" data-target="' + s.id + '" title="' +
              s.text.replace(/"/g, '&quot;') + '">' + s.text + '</button>';
          }).join('') + '</div>';
      }
    });
    return html;
  }

  /* ---------- build the page ---------- */
  var C = window.CONTENT;
  var content = document.getElementById('content');
  content.innerHTML = renderHero(C.hero) + C.levels.map(renderLevel).join('');
  document.getElementById('nav').innerHTML = renderSidebar(C.levels);

  /* ---------- interactions ---------- */
  var sidebar = document.getElementById('sidebar');
  var navBtns = Array.prototype.slice.call(document.querySelectorAll('.nav-btn'));
  var sections = C.levels.map(function (lv) { return document.getElementById(lv.id); });
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');

  // copy buttons (event delegation)
  content.addEventListener('click', function (e) {
    var btn = e.target.closest('.code__copy');
    if (!btn) return;
    var code = btn.closest('.code').querySelector('pre').textContent;
    navigator.clipboard.writeText(code).then(function () {
      btn.textContent = 'Copied'; btn.classList.add('copied');
      setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1400);
    });
  });

  var navSubsEls = Array.prototype.slice.call(document.querySelectorAll('.nav-subs'));
  var navSubBtns = Array.prototype.slice.call(document.querySelectorAll('.nav-sub'));
  var subEls = Array.prototype.slice.call(document.querySelectorAll('.h-sub[id]'));

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // level click -> scroll to level + reveal its subtopics
  navBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.target;
      navSubsEls.forEach(function (g) { g.classList.toggle('show', g.dataset.level === id); });
      scrollToId(id);
      closeSidebar();
    });
  });

  // subtopic click -> scroll to that subsection
  navSubBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      scrollToId(btn.dataset.target);
      closeSidebar();
    });
  });

  // scroll-spy + progress + back-to-top
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    // progress
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

    // active section
    var active = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= 140) active = sections[i];
    }
    navBtns.forEach(function (b) { b.classList.toggle('is-active', b.dataset.target === active.id); });

    // reveal only the active level's subtopics (accordion)
    navSubsEls.forEach(function (g) { g.classList.toggle('show', g.dataset.level === active.id); });

    // highlight the active subtopic within the active level
    var curSub = null;
    for (var j = 0; j < subEls.length; j++) {
      var s = subEls[j];
      if (s.id.replace(/-s\d+$/, '') === active.id && s.getBoundingClientRect().top <= 160) curSub = s.id;
    }
    navSubBtns.forEach(function (b) { b.classList.toggle('is-active', b.dataset.target === curSub); });

    // back-to-top
    toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var scrim = document.getElementById('scrim');
  function closeSidebar() { sidebar.classList.remove('open'); }
  menuBtn.addEventListener('click', function () { sidebar.classList.toggle('open'); });
  scrim.addEventListener('click', closeSidebar);

  // collapsible (icon-only) sidebar — persisted
  var collapseBtn = document.getElementById('collapseBtn');
  function applyCollapsed(on) {
    sidebar.classList.toggle('collapsed', on);
    collapseBtn.textContent = on ? '»' : '«';
    collapseBtn.title = on ? 'Expand' : 'Collapse';
    collapseBtn.setAttribute('aria-label', on ? 'Expand sidebar' : 'Collapse sidebar');
  }
  applyCollapsed(localStorage.getItem('mt-sidebar-collapsed') === '1');
  collapseBtn.addEventListener('click', function () {
    var on = !sidebar.classList.contains('collapsed');
    applyCollapsed(on);
    localStorage.setItem('mt-sidebar-collapsed', on ? '1' : '0');
  });
})();
