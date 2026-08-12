/**
 * skate-game.js  —  Chrome-dino-style skate runner living in the footer.
 * The canvas is position:fixed at the viewport bottom. The site-pet rides
 * on top of it — no separate game screen, no overlay, fully integrated.
 *
 * Controls: Space / ArrowUp / tap anywhere on page while footer visible
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ─────────────────────────────────────────────────────────────────────────
     Boot: wait for site-pet to exist (it's added by site-pet.js dynamically)
  ───────────────────────────────────────────────────────────────────────── */
  function waitForPet(cb, attempts) {
    attempts = attempts || 0;
    var pet = document.querySelector('.site-pet');
    if (pet) { cb(pet); return; }
    if (attempts > 80) return; // give up after ~4s
    setTimeout(function () { waitForPet(cb, attempts + 1); }, 50);
  }

  function boot() {
    waitForPet(function (petEl) {
      init(petEl);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Main
  ───────────────────────────────────────────────────────────────────────── */
  function init(petEl) {

    var zone     = document.getElementById('skate-game-zone');
    var canvas   = document.getElementById('skate-canvas');
    var scoreEl  = document.getElementById('skate-score');
    var promptEl = document.getElementById('skate-prompt');

    if (!zone || !canvas) return;

    var ctx = canvas.getContext('2d');
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 110, GROUND_Y = 88;

    /* ── resize ──────────────────────────────────────────────────────── */
    function resize() {
      W = window.innerWidth;
      H = 110;
      GROUND_Y = H - 22;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── palette ─────────────────────────────────────────────────────── */
    var C = {
      groundLine: 'rgba(30,107,255,0.55)',
      groundFill: 'rgba(10,14,30,0.65)',
      obstacle:   'rgba(255,255,255,0.72)',
      obstLow:    'rgba(255,255,255,0.3)',
      accent:     '#1e6bff',
      accentDim:  'rgba(30,107,255,0.45)',
      particle:   '#1e6bff',
      trail:      'rgba(201,101,54,0.4)',
      flash:      'rgba(255,255,255,0.1)',
    };

    /* ── state ───────────────────────────────────────────────────────── */
    var state    = 'idle';  // idle | playing | dead
    var score    = 0;
    var hiScore  = 0;
    var scoreTick = 0;
    var speed    = 0;
    var BASE_SPD = 270;
    var MAX_SPD  = 600;
    var promptHidden = false;

    /* ── pet jump ────────────────────────────────────────────────────── */
    var JUMP_V  = -500;   // px/s
    var GRAV    = 1350;   // px/s²
    var petLift = 0;
    var petVelY = 0;
    var jumps   = 0;
    var MAX_J   = 2;

    var PET_W  = 44;
    var PET_H  = 62;
    var PET_FOOT = 6;

    function getPetX() {
      var v = getComputedStyle(petEl).getPropertyValue('--pet-x');
      return parseFloat(v) || 40;
    }
    function setLift(v) {
      petLift = Math.max(0, v);
      petEl.style.setProperty('--pet-lift', petLift + 'px');
    }

    /* ── obstacles ───────────────────────────────────────────────────── */
    var obs      = [];
    var obsTimer = 0;
    var OBS_TYPES = [
      { type:'rail',    w:80,  h:12, pts:1 },
      { type:'ramp',    w:52,  h:36, pts:2 },
      { type:'cone',    w:20,  h:32, pts:1 },
      { type:'barrier', w:16,  h:56, pts:2 },
      { type:'rail',    w:124, h:12, pts:2 },
    ];

    function spawnObs() {
      var def = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
      obs.push({ type:def.type, w:def.w, h:def.h, sx:W+40, pts:def.pts, passed:false });
    }

    /* ── particles ───────────────────────────────────────────────────── */
    var parts = [];
    function burst(x, y, n, col) {
      for (var i=0;i<n;i++) {
        parts.push({
          x:x, y:y,
          vx:(Math.random()-0.5)*200,
          vy:-Math.random()*240-40,
          life:1, dec:Math.random()*1.1+0.7,
          r:Math.random()*3+1.5,
          col:col||C.particle
        });
      }
    }

    /* ── bg speed-lines ──────────────────────────────────────────────── */
    var lines = [];
    function initLines() {
      lines = [];
      for (var i=0;i<16;i++) {
        lines.push({
          x: Math.random()*W,
          w: Math.random()*50+8,
          spd: Math.random()*0.18+0.04,
          a: Math.random()*0.055+0.01
        });
      }
    }
    initLines();

    /* ── score pop ───────────────────────────────────────────────────── */
    var popT = null;
    function addScore(n) {
      score += n;
      scoreEl.textContent = score;
      scoreEl.classList.add('skate-score--pop');
      clearTimeout(popT);
      popT = setTimeout(function(){scoreEl.classList.remove('skate-score--pop');},280);
    }

    /* ── collision ───────────────────────────────────────────────────── */
    function hit(o) {
      var px=getPetX();
      var M=9; // forgiveness margin
      return (
        px + PET_W*0.28 > o.sx + M &&
        px - PET_W*0.28 < o.sx + o.w - M &&
        GROUND_Y - petLift + PET_FOOT > GROUND_Y - o.h + M &&
        GROUND_Y - petLift - PET_H + PET_FOOT < GROUND_Y - M
      );
    }

    /* ── draw helpers ────────────────────────────────────────────────── */
    function drawGround() {
      ctx.fillStyle = C.groundFill;
      ctx.fillRect(0, GROUND_Y, W, H-GROUND_Y);
      ctx.beginPath();
      ctx.moveTo(0,GROUND_Y); ctx.lineTo(W,GROUND_Y);
      ctx.strokeStyle = C.groundLine; ctx.lineWidth=1.5; ctx.stroke();
      // scrolling speed-lines
      if (state === 'playing') {
        lines.forEach(function(l){
          ctx.globalAlpha=l.a;
          ctx.beginPath();
          ctx.moveTo(l.x, GROUND_Y+4); ctx.lineTo(l.x+l.w, GROUND_Y+4);
          ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1; ctx.stroke();
        });
        ctx.globalAlpha=1;
      }
    }

    function drawRail(o) {
      ctx.fillStyle=C.obstLow;
      ctx.fillRect(o.sx+5,      GROUND_Y-o.h-5, 3, o.h+5);
      ctx.fillRect(o.sx+o.w-8,  GROUND_Y-o.h-5, 3, o.h+5);
      ctx.fillStyle=C.obstacle;
      ctx.beginPath(); ctx.roundRect(o.sx, GROUND_Y-o.h-4, o.w, 8, 4); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.18)';
      ctx.beginPath(); ctx.roundRect(o.sx+4, GROUND_Y-o.h-2, o.w-8, 2, 1); ctx.fill();
    }
    function drawRamp(o) {
      ctx.beginPath();
      ctx.moveTo(o.sx, GROUND_Y);
      ctx.lineTo(o.sx, GROUND_Y-o.h);
      ctx.quadraticCurveTo(o.sx+o.w*0.38, GROUND_Y-o.h, o.sx+o.w, GROUND_Y);
      ctx.closePath();
      ctx.fillStyle=C.accentDim; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(o.sx, GROUND_Y-o.h);
      ctx.quadraticCurveTo(o.sx+o.w*0.38, GROUND_Y-o.h, o.sx+o.w, GROUND_Y);
      ctx.strokeStyle=C.accent; ctx.lineWidth=2; ctx.stroke();
    }
    function drawCone(o) {
      var cx=o.sx+o.w/2;
      ctx.beginPath();
      ctx.moveTo(cx, GROUND_Y-o.h);
      ctx.lineTo(cx-o.w/2, GROUND_Y);
      ctx.lineTo(cx+o.w/2, GROUND_Y);
      ctx.closePath();
      ctx.fillStyle='rgba(232,120,0,0.9)'; ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.moveTo(cx-o.w*0.14, GROUND_Y-o.h*0.46);
      ctx.lineTo(cx+o.w*0.14, GROUND_Y-o.h*0.46);
      ctx.lineTo(cx+o.w*0.31, GROUND_Y-o.h*0.26);
      ctx.lineTo(cx-o.w*0.31, GROUND_Y-o.h*0.26);
      ctx.closePath(); ctx.fill();
    }
    function drawBarrier(o) {
      ctx.fillStyle=C.obstacle;
      ctx.beginPath(); ctx.roundRect(o.sx, GROUND_Y-o.h, o.w, o.h, 3); ctx.fill();
      ctx.fillStyle='rgba(255,60,0,0.3)';
      for(var i=0;i<3;i++) ctx.fillRect(o.sx+1, GROUND_Y-o.h+i*(o.h/3), o.w-2, o.h/3-2);
    }

    function drawObs() {
      obs.forEach(function(o){
        if(o.type==='rail')    drawRail(o);
        else if(o.type==='ramp')    drawRamp(o);
        else if(o.type==='cone')    drawCone(o);
        else if(o.type==='barrier') drawBarrier(o);
      });
    }

    var trailPts = [];
    function drawTrail() {
      for(var i=1;i<trailPts.length;i++){
        var a=(i/trailPts.length)*0.45;
        var r=(i/trailPts.length)*3;
        ctx.beginPath();
        ctx.arc(trailPts[i].x, trailPts[i].y, r, 0, Math.PI*2);
        ctx.fillStyle='rgba(201,101,54,'+a+')'; ctx.fill();
      }
    }

    function drawParts() {
      parts.forEach(function(p){
        ctx.globalAlpha=Math.max(0,p.life);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.col; ctx.fill();
      });
      ctx.globalAlpha=1;
    }

    function drawHint() {
      // idle: gentle pulsing dots along ground to hint there's something here
      var t=Date.now()/1000;
      for(var i=0;i<7;i++){
        var dx=W*0.12+i*(W*0.115)+Math.sin(t*1.1+i)*5;
        ctx.globalAlpha=0.04+0.03*Math.sin(t*1.8+i);
        ctx.beginPath(); ctx.arc(dx, GROUND_Y-5, 2.5, 0, Math.PI*2);
        ctx.fillStyle=C.accent; ctx.fill();
      }
      ctx.globalAlpha=1;
    }

    function drawBest() {
      if(!hiScore) return;
      ctx.fillStyle='rgba(255,255,255,0.14)';
      ctx.font='600 9px Inter,sans-serif';
      ctx.textAlign='right';
      ctx.fillText('BEST '+hiScore, W-58, 18);
      ctx.textAlign='left';
    }

    /* ── game loop ───────────────────────────────────────────────────── */
    var lastT=0;

    function loop(now) {
      requestAnimationFrame(loop);
      var dt=Math.min((now-(lastT||now))/1000, 0.05);
      lastT=now;

      ctx.clearRect(0,0,W,H);
      drawGround();

      if(state==='idle') { drawHint(); return; }

      // ── physics ──
      if(state==='playing') {
        speed = Math.min(BASE_SPD + score*2.6, MAX_SPD);

        // speed lines
        lines.forEach(function(l){
          l.x -= speed*l.spd*dt;
          if(l.x+l.w<0) l.x=W+l.w;
        });

        // obstacles
        obsTimer+=dt;
        var intv=Math.max(0.65, 1.55 - score*0.011);
        if(obsTimer>=intv){ obsTimer=0; spawnObs(); }

        var px=getPetX();
        for(var i=obs.length-1;i>=0;i--){
          obs[i].sx -= speed*dt;
          if(obs[i].sx+obs[i].w < 0){ obs.splice(i,1); continue; }
          if(!obs[i].passed && obs[i].sx+obs[i].w < px-PET_W*0.3){
            obs[i].passed=true;
            addScore(obs[i].pts);
            burst(px-8, GROUND_Y-petLift-18, 5, C.particle);
          }
          if(hit(obs[i])){ die(); return; }
        }

        // jump physics
        if(petLift>0||petVelY<0){
          petVelY+=GRAV*dt;
          setLift(petLift - petVelY*dt);
          if(petLift<=0){ petVelY=0; jumps=0; }
        }

        // distance score
        scoreTick+=speed*dt*0.038;
        if(Math.floor(scoreTick)>score){
          score=Math.floor(scoreTick);
          scoreEl.textContent=score;
        }

        // trail
        trailPts.push({x:px, y:GROUND_Y-petLift-10});
        if(trailPts.length>20) trailPts.shift();

        // particles
        for(var j=parts.length-1;j>=0;j--){
          var p=parts[j];
          p.vy+=580*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=p.dec*dt;
          if(p.life<=0) parts.splice(j,1);
        }
      }

      // ── draw ──
      drawTrail();
      drawObs();
      drawParts();
      drawBest();

      if(state==='dead'){
        ctx.fillStyle=C.flash; ctx.fillRect(0,0,W,H);
      }
    }

    requestAnimationFrame(loop);

    /* ── start / die / jump ──────────────────────────────────────────── */
    function start() {
      state='playing'; score=0; scoreTick=0;
      speed=BASE_SPD; obs=[]; parts=[]; trailPts=[];
      obsTimer=0; jumps=0;
      setLift(0); petVelY=0;
      scoreEl.textContent='0';
      initLines();

      if(!promptHidden){
        promptHidden=true;
        if(promptEl) promptEl.classList.add('skate-prompt--hide');
      }

      // Auto-equip skateboard
      if(petEl.dataset.hat!=='skateboard'){
        var btn=document.querySelector('.site-pet__hat-option--skateboard');
        if(btn) btn.click();
      }
    }

    function die() {
      if(state!=='playing') return;
      state='dead';
      if(score>hiScore) hiScore=score;
      setLift(0); petVelY=0; jumps=0;
      burst(getPetX(), GROUND_Y-20, 14, C.particle);
      burst(getPetX(), GROUND_Y-20,  8, 'rgba(255,90,0,0.8)');
      petEl.dataset.mode='bump';
      setTimeout(function(){
        petEl.dataset.mode = petEl.dataset.hat==='skateboard' ? 'skating' : 'walking';
      }, 500);
      setTimeout(function(){ if(state==='dead') start(); }, 1500);
    }

    function jump() {
      if(state==='idle'||state==='dead'){ start(); return; }
      if(jumps<MAX_J){
        petVelY=JUMP_V; jumps++;
        burst(getPetX(), GROUND_Y-petLift-8, 4, C.trail);
      }
    }

    /* ── input: global keydown + canvas tap ──────────────────────────── */
    document.addEventListener('keydown', function(e){
      if(e.code==='Space'||e.code==='ArrowUp'){
        // only intercept when footer is near the bottom of viewport
        var footer=document.getElementById('footer');
        if(!footer) return;
        var r=footer.getBoundingClientRect();
        // footer must be at least partially visible
        if(r.bottom > window.innerHeight - 200 && r.top < window.innerHeight + 100){
          e.preventDefault();
          jump();
        }
      }
    });

    // Tap on the canvas itself always works
    canvas.addEventListener('pointerdown', function(e){
      e.preventDefault();
      jump();
    }, {passive:false});

    // Also tap on the footer-name zone
    var zone2=document.getElementById('skate-game-zone');
    if(zone2){
      zone2.addEventListener('pointerdown', function(e){
        e.stopPropagation();
        jump();
      }, {passive:true});
    }
  }

}());
