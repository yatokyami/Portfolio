/**
 * footer-playground.js
 * Drop-in replacement for .footer-name — interactive playground with skate ramp,
 * swings, slide, and basketball hoop. Syncs with the existing site-pet hat state.
 *
 * USAGE: add <script defer src="js/footer-playground.js"></script>
 * just before </body>, after site-pet.js
 */
(function () {
  'use strict';

  // ─── helpers ────────────────────────────────────────────────────────────────
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ─── palette (matches site: #0a0a0a bg, #1e6bff accent) ───────────────────
  var C = {
    bg:       '#0a0a0a',
    floor:    '#101010',
    grid:     'rgba(30,107,255,0.055)',
    gridLine: 'rgba(255,255,255,0.03)',
    accent:   '#1e6bff',
    accentDim:'rgba(30,107,255,0.3)',
    amber:    '#e8a020',
    orange:   '#e85d04',
    white:    '#f0f0f0',
    dim:      'rgba(255,255,255,0.12)',
    dimmer:   'rgba(255,255,255,0.06)',
  };

  // ─── DOM bootstrap ───────────────────────────────────────────────────────────
  function init() {
    var nameEl = document.querySelector('.footer-name');
    if (!nameEl) return;

    var wrap = document.createElement('div');
    wrap.id = 'footer-playground';
    wrap.setAttribute('aria-label', 'Interactive playground — skate, swing, shoot hoops');
    wrap.setAttribute('role', 'img');

    var canvas = document.createElement('canvas');
    canvas.id = 'playground-canvas';

    var modebtn = document.createElement('button');
    modebtn.id = 'pg-modebtn';
    modebtn.textContent = 'skate mode';
    modebtn.setAttribute('aria-label', 'Switch to skate mode');

    var scoreWrap = document.createElement('div');
    scoreWrap.id = 'pg-score';
    scoreWrap.innerHTML = '<span id="pg-score-label">score</span><span id="pg-score-val">0</span>';

    var bubble = document.createElement('div');
    bubble.id = 'pg-bubble';

    var tip = document.createElement('div');
    tip.id = 'pg-tip';
    tip.textContent = 'drag swings · aim & throw · click to jump in skate mode';

    wrap.appendChild(canvas);
    wrap.appendChild(modebtn);
    wrap.appendChild(scoreWrap);
    wrap.appendChild(bubble);
    wrap.appendChild(tip);

    nameEl.replaceWith(wrap);
    injectStyles();
    run(canvas, bubble, modebtn, tip);
  }
