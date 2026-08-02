/* Astro Dash — runner mobile en un tap.
   Tape pour sauter, re-tape en l'air pour un double saut. */
(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const scoreEl = document.getElementById('score');
  const menuEl = document.getElementById('menu');
  const gameoverEl = document.getElementById('gameover');
  const menuBestEl = document.getElementById('menu-best');
  const finalScoreEl = document.getElementById('final-score');
  const finalBestEl = document.getElementById('final-best');
  const newRecordEl = document.getElementById('new-record');
  const muteBtn = document.getElementById('mute');

  // ---- Dimensions / DPI ----
  let W = 0, H = 0, DPR = 1, groundY = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    groundY = H - Math.max(70, H * 0.16);
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Audio (WebAudio, généré, aucun fichier) ----
  let audioCtx = null;
  let muted = localStorage.getItem('astrodash.muted') === '1';

  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* pas de son */ }
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function beep(freq, dur, type, vol, slide) {
    if (muted || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  const sfx = {
    jump: () => beep(320, 0.18, 'square', 0.12, 260),
    doubleJump: () => beep(430, 0.16, 'square', 0.12, 320),
    orb: () => beep(880, 0.12, 'sine', 0.16, 340),
    death: () => beep(180, 0.5, 'sawtooth', 0.2, -140),
  };

  function updateMuteBtn() { muteBtn.textContent = muted ? '🔇' : '🔊'; }
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    muted = !muted;
    localStorage.setItem('astrodash.muted', muted ? '1' : '0');
    updateMuteBtn();
  });
  updateMuteBtn();

  // ---- État du jeu ----
  const STATE = { MENU: 0, PLAYING: 1, DEAD: 2 };
  let state = STATE.MENU;

  let best = parseInt(localStorage.getItem('astrodash.best') || '0', 10);
  menuBestEl.textContent = best;

  let score = 0;
  let speed = 0;
  let distance = 0;
  let shakeTime = 0;

  const player = {
    x: 0, y: 0, vy: 0,
    r: 20,
    jumpsLeft: 2,
    onGround: false,
    coyote: 0,        // petit délai de grâce après avoir quitté le sol
    runPhase: 0,
  };

  let obstacles = [];   // {x, w, h, type}
  let orbs = [];        // {x, y, r, taken, phase}
  let particles = [];   // {x, y, vx, vy, life, maxLife, color, size}
  let stars = [];
  let hills = [];       // parallaxe

  const BASE_SPEED = 330;      // px/s
  const MAX_SPEED = 780;
  const GRAVITY = 2600;
  const JUMP_VEL = -880;

  function initBackground() {
    stars = [];
    const n = Math.floor((W * H) / 9000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * groundY,
        size: Math.random() * 1.8 + 0.4,
        depth: Math.random() * 0.6 + 0.15,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    hills = [];
    for (let layer = 0; layer < 2; layer++) {
      const pts = [];
      const seg = 90 + layer * 60;
      for (let x = -seg; x < W + seg * 2; x += seg) {
        pts.push({ x, h: 30 + Math.random() * (70 - layer * 25) });
      }
      hills.push({ pts, seg, depth: layer === 0 ? 0.25 : 0.45, color: layer === 0 ? '#141b3d' : '#1d2752' });
    }
  }
  initBackground();

  function reset() {
    score = 0;
    distance = 0;
    speed = BASE_SPEED;
    obstacles = [];
    orbs = [];
    particles = [];
    shakeTime = 0;
    player.x = Math.max(70, W * 0.18);
    player.y = groundY - player.r;
    player.vy = 0;
    player.jumpsLeft = 2;
    player.onGround = true;
    player.coyote = 0;
    nextSpawn = 0.9;
    scoreEl.textContent = '0';
  }

  // ---- Spawning ----
  let nextSpawn = 0;

  function spawn() {
    const roll = Math.random();
    const sp = speed / MAX_SPEED; // 0..1 difficulté

    if (roll < 0.6) {
      // Caisse / rocher au sol (parfois double)
      const h = 34 + Math.random() * 44;
      const w = 30 + Math.random() * 30;
      obstacles.push({ x: W + 60, w, h, type: 'box' });
      if (Math.random() < 0.25 + sp * 0.3) {
        obstacles.push({ x: W + 60 + w + 70 + Math.random() * 90, w: 28 + Math.random() * 22, h: 30 + Math.random() * 36, type: 'box' });
      }
    } else if (roll < 0.85) {
      // Pics
      const count = 2 + Math.floor(Math.random() * 3);
      obstacles.push({ x: W + 60, w: count * 24, h: 36, type: 'spikes', count });
    } else {
      // Drone volant : passe en dessous ou saute par-dessus selon la hauteur
      const fly = Math.random() < 0.5 ? 120 : 66;
      obstacles.push({ x: W + 60, w: 46, h: 30, type: 'drone', flyH: fly, phase: Math.random() * Math.PI * 2 });
    }

    // Orbes d'énergie en arc
    if (Math.random() < 0.55) {
      const baseX = W + 260 + Math.random() * 240;
      const arcUp = Math.random() < 0.5;
      const n = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const yOff = arcUp ? Math.sin(t * Math.PI) * 120 + 40 : 40;
        orbs.push({ x: baseX + i * 42, y: groundY - yOff - 14, r: 11, taken: false, phase: Math.random() * Math.PI * 2 });
      }
    }

    // Prochain spawn : se resserre avec la vitesse
    const gap = 1.15 - sp * 0.55;
    nextSpawn = gap + Math.random() * gap * 0.7;
  }

  // ---- Particules ----
  function burst(x, y, color, count, force) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (0.3 + Math.random() * 0.7) * force;
      particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - force * 0.3,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function runDust() {
    particles.push({
      x: player.x - player.r * 0.6,
      y: groundY - 3,
      vx: -speed * 0.25 * (0.6 + Math.random() * 0.5),
      vy: -30 - Math.random() * 50,
      life: 0.35, maxLife: 0.35,
      color: '#3b4a8c',
      size: 2 + Math.random() * 2.5,
    });
  }

  // ---- Contrôles ----
  function jump() {
    if (state !== STATE.PLAYING) return;
    const canGroundJump = player.onGround || player.coyote > 0;
    if (canGroundJump) {
      player.vy = JUMP_VEL;
      player.onGround = false;
      player.coyote = 0;
      player.jumpsLeft = 1;
      sfx.jump();
      burst(player.x, groundY - 4, '#5eeaff', 8, 160);
    } else if (player.jumpsLeft > 0) {
      player.vy = JUMP_VEL * 0.92;
      player.jumpsLeft--;
      sfx.doubleJump();
      burst(player.x, player.y + player.r, '#ffd166', 10, 190);
    }
  }

  function onTap(e) {
    if (e.target.closest('button')) return;
    e.preventDefault();
    ensureAudio();
    if (state === STATE.PLAYING) jump();
  }

  window.addEventListener('touchstart', onTap, { passive: false });
  window.addEventListener('mousedown', onTap);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      ensureAudio();
      if (state === STATE.MENU) startGame();
      else if (state === STATE.PLAYING) jump();
      else if (state === STATE.DEAD && gameoverShown) startGame();
    }
  });

  document.getElementById('play').addEventListener('click', () => { ensureAudio(); startGame(); });
  document.getElementById('retry').addEventListener('click', () => { ensureAudio(); startGame(); });

  let gameoverShown = false;

  function startGame() {
    reset();
    state = STATE.PLAYING;
    gameoverShown = false;
    menuEl.classList.add('hidden');
    gameoverEl.classList.add('hidden');
  }

  function die() {
    state = STATE.DEAD;
    sfx.death();
    shakeTime = 0.45;
    burst(player.x, player.y, '#ff5e7a', 26, 320);
    burst(player.x, player.y, '#ffd166', 14, 220);
    if (navigator.vibrate) navigator.vibrate(120);

    const isRecord = score > best;
    if (isRecord) {
      best = score;
      localStorage.setItem('astrodash.best', String(best));
    }
    setTimeout(() => {
      finalScoreEl.textContent = score;
      finalBestEl.textContent = best;
      newRecordEl.classList.toggle('hidden', !isRecord);
      gameoverEl.classList.remove('hidden');
      gameoverShown = true;
    }, 650);
  }

  // ---- Collisions (cercle joueur vs rectangles) ----
  function circleRect(cx, cy, cr, rx, ry, rw, rh) {
    const nx = Math.max(rx, Math.min(cx, rx + rw));
    const ny = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nx, dy = cy - ny;
    return dx * dx + dy * dy < cr * cr;
  }

  // ---- Update ----
  function update(dt) {
    if (state === STATE.PLAYING) {
      speed = Math.min(MAX_SPEED, speed + dt * 9);
      distance += speed * dt;
      const newScore = Math.floor(distance / 12);
      if (newScore !== score) {
        score = newScore;
        scoreEl.textContent = score;
      }

      // Joueur
      player.vy += GRAVITY * dt;
      player.y += player.vy * dt;
      player.runPhase += dt * speed * 0.045;

      if (player.y >= groundY - player.r) {
        if (!player.onGround && player.vy > 300) {
          burst(player.x, groundY - 3, '#3b4a8c', 6, 120);
        }
        player.y = groundY - player.r;
        player.vy = 0;
        player.onGround = true;
        player.jumpsLeft = 2;
        player.coyote = 0.09;
      } else if (player.onGround) {
        player.onGround = false;
      }
      if (!player.onGround) player.coyote = Math.max(0, player.coyote - dt);
      if (player.onGround && Math.random() < dt * 30) runDust();

      // Spawns
      nextSpawn -= dt * (speed / BASE_SPEED);
      if (nextSpawn <= 0) spawn();

      // Obstacles
      for (const o of obstacles) {
        o.x -= speed * dt;
        if (o.type === 'drone') o.phase += dt * 6;
      }
      obstacles = obstacles.filter((o) => o.x + o.w > -80);

      for (const o of obstacles) {
        let oy, oh;
        if (o.type === 'drone') {
          oy = groundY - o.flyH + Math.sin(o.phase) * 8;
          oh = o.h;
        } else {
          oy = groundY - o.h;
          oh = o.h;
        }
        const shrink = o.type === 'spikes' ? 6 : 3; // hitbox un peu permissive
        if (circleRect(player.x, player.y, player.r - 3, o.x + shrink, oy + shrink, o.w - shrink * 2, oh - shrink)) {
          die();
          break;
        }
      }

      // Orbes
      for (const orb of orbs) {
        orb.x -= speed * dt;
        orb.phase += dt * 5;
        if (!orb.taken) {
          const dx = orb.x - player.x, dy = orb.y - player.y;
          if (dx * dx + dy * dy < (orb.r + player.r) * (orb.r + player.r)) {
            orb.taken = true;
            distance += 12 * 25; // +25 points
            sfx.orb();
            burst(orb.x, orb.y, '#5eeaff', 10, 200);
          }
        }
      }
      orbs = orbs.filter((o) => o.x > -40 && !o.taken);
    }

    // Particules (tournent aussi sur l'écran de mort)
    for (const p of particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 900 * dt;
      if (p.y > groundY - 1) { p.y = groundY - 1; p.vy *= -0.4; }
    }
    particles = particles.filter((p) => p.life > 0);

    // Fond
    const bgSpeed = state === STATE.PLAYING ? speed : BASE_SPEED * 0.4;
    for (const s of stars) {
      s.x -= bgSpeed * s.depth * 0.12 * dt;
      s.twinkle += dt * 3;
      if (s.x < -4) { s.x = W + 4; s.y = Math.random() * groundY; }
    }
    for (const layer of hills) {
      for (const p of layer.pts) p.x -= bgSpeed * layer.depth * dt;
      while (layer.pts.length && layer.pts[0].x < -layer.seg * 2) {
        const last = layer.pts[layer.pts.length - 1];
        const first = layer.pts.shift();
        first.x = last.x + layer.seg;
        first.h = 30 + Math.random() * 70;
        layer.pts.push(first);
      }
    }

    if (shakeTime > 0) shakeTime -= dt;
  }

  // ---- Rendu ----
  function draw() {
    ctx.save();
    if (shakeTime > 0) {
      const s = shakeTime * 18;
      ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }

    // Ciel
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0b1026');
    sky.addColorStop(0.7, '#141b3d');
    sky.addColorStop(1, '#1a2350');
    ctx.fillStyle = sky;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // Étoiles
    for (const s of stars) {
      const a = 0.4 + Math.abs(Math.sin(s.twinkle)) * 0.6;
      ctx.globalAlpha = a * s.depth * 1.6;
      ctx.fillStyle = '#cfe9ff';
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    ctx.globalAlpha = 1;

    // Planète décor
    const px = W * 0.78, py = H * 0.2, pr = Math.min(W, H) * 0.09;
    const pg = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.2, px, py, pr);
    pg.addColorStop(0, '#ffd166');
    pg.addColorStop(1, '#b3671f');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(px, py, pr * 1.6, pr * 0.4, -0.3, 0, Math.PI * 2);
    ctx.stroke();

    // Collines en parallaxe
    for (const layer of hills) {
      ctx.fillStyle = layer.color;
      ctx.beginPath();
      ctx.moveTo(-20, groundY);
      for (const p of layer.pts) ctx.lineTo(p.x, groundY - p.h);
      ctx.lineTo(W + 20, groundY);
      ctx.closePath();
      ctx.fill();
    }

    // Sol
    const gg = ctx.createLinearGradient(0, groundY, 0, H);
    gg.addColorStop(0, '#2a3670');
    gg.addColorStop(1, '#141b3d');
    ctx.fillStyle = gg;
    ctx.fillRect(-20, groundY, W + 40, H - groundY + 20);
    ctx.strokeStyle = '#5eeaff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#5eeaff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-20, groundY);
    ctx.lineTo(W + 20, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Lignes de vitesse au sol
    ctx.strokeStyle = 'rgba(94, 234, 255, 0.18)';
    ctx.lineWidth = 2;
    const dashOff = (distance * 0.9) % 80;
    for (let x = -dashOff; x < W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 16);
      ctx.lineTo(x + 34, groundY + 16);
      ctx.stroke();
    }

    // Orbes
    for (const orb of orbs) {
      const bob = Math.sin(orb.phase) * 4;
      ctx.shadowColor = '#5eeaff';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#5eeaff';
      ctx.beginPath();
      ctx.arc(orb.x, orb.y + bob, orb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#e6ffff';
      ctx.beginPath();
      ctx.arc(orb.x - 3, orb.y + bob - 3, orb.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Obstacles
    for (const o of obstacles) {
      if (o.type === 'box') {
        const y = groundY - o.h;
        ctx.fillStyle = '#7c4d2b';
        ctx.fillRect(o.x, y, o.w, o.h);
        ctx.fillStyle = '#9c6a3f';
        ctx.fillRect(o.x + 3, y + 3, o.w - 6, o.h - 6);
        ctx.strokeStyle = '#5a3418';
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x + 1, y + 1, o.w - 2, o.h - 2);
        ctx.beginPath();
        ctx.moveTo(o.x, y);
        ctx.lineTo(o.x + o.w, y + o.h);
        ctx.moveTo(o.x + o.w, y);
        ctx.lineTo(o.x, y + o.h);
        ctx.stroke();
      } else if (o.type === 'spikes') {
        ctx.fillStyle = '#ff5e7a';
        ctx.shadowColor = '#ff5e7a';
        ctx.shadowBlur = 8;
        const sw = o.w / o.count;
        for (let i = 0; i < o.count; i++) {
          ctx.beginPath();
          ctx.moveTo(o.x + i * sw, groundY);
          ctx.lineTo(o.x + i * sw + sw / 2, groundY - o.h);
          ctx.lineTo(o.x + (i + 1) * sw, groundY);
          ctx.closePath();
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      } else if (o.type === 'drone') {
        const y = groundY - o.flyH + Math.sin(o.phase) * 8;
        ctx.fillStyle = '#8892c8';
        ctx.beginPath();
        ctx.ellipse(o.x + o.w / 2, y + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff5e7a';
        ctx.shadowColor = '#ff5e7a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(o.x + o.w / 2, y + o.h / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // hélices
        ctx.strokeStyle = '#c3cbf5';
        ctx.lineWidth = 2;
        const spin = Math.sin(o.phase * 4) * 10;
        ctx.beginPath();
        ctx.moveTo(o.x + 6 - spin, y - 4);
        ctx.lineTo(o.x + 6 + spin, y - 4);
        ctx.moveTo(o.x + o.w - 6 - spin, y - 4);
        ctx.lineTo(o.x + o.w - 6 + spin, y - 4);
        ctx.stroke();
      }
    }

    // Particules
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;

    // Joueur (astronaute)
    if (state !== STATE.DEAD) {
      const bob = player.onGround ? Math.abs(Math.sin(player.runPhase)) * 3 : 0;
      const py2 = player.y - bob;
      const r = player.r;

      // réacteur dorsal
      ctx.fillStyle = '#38b6ff';
      ctx.fillRect(player.x - r - 6, py2 - 8, 8, 16);
      if (!player.onGround) {
        ctx.fillStyle = '#ffd166';
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 12;
        const flame = 6 + Math.random() * 8;
        ctx.beginPath();
        ctx.moveTo(player.x - r - 6, py2 + 8);
        ctx.lineTo(player.x - r - 2, py2 + 8 + flame);
        ctx.lineTo(player.x - r + 2, py2 + 8);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // corps
      const bodyG = ctx.createRadialGradient(player.x - r * 0.3, py2 - r * 0.3, r * 0.2, player.x, py2, r);
      bodyG.addColorStop(0, '#ffffff');
      bodyG.addColorStop(1, '#b8c4e8');
      ctx.fillStyle = bodyG;
      ctx.beginPath();
      ctx.arc(player.x, py2, r, 0, Math.PI * 2);
      ctx.fill();

      // visière
      ctx.fillStyle = '#0b1026';
      ctx.beginPath();
      ctx.ellipse(player.x + r * 0.3, py2 - r * 0.15, r * 0.52, r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5eeaff';
      ctx.beginPath();
      ctx.ellipse(player.x + r * 0.18, py2 - r * 0.28, r * 0.16, r * 0.1, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // jambes qui courent
      if (player.onGround) {
        ctx.strokeStyle = '#b8c4e8';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        const l1 = Math.sin(player.runPhase) * 10;
        const l2 = Math.sin(player.runPhase + Math.PI) * 10;
        ctx.beginPath();
        ctx.moveTo(player.x - 5, py2 + r - 4);
        ctx.lineTo(player.x - 5 + l1, groundY);
        ctx.moveTo(player.x + 5, py2 + r - 4);
        ctx.lineTo(player.x + 5 + l2, groundY);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ---- Boucle ----
  let lastT = performance.now();
  function loop(now) {
    let dt = (now - lastT) / 1000;
    lastT = now;
    if (dt > 0.05) dt = 0.05; // évite les sauts après un onglet en pause
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Recalcule le fond quand l'orientation change
  window.addEventListener('resize', () => {
    initBackground();
    if (state !== STATE.PLAYING) return;
    player.x = Math.max(70, W * 0.18);
    if (player.y > groundY - player.r) player.y = groundY - player.r;
  });
})();
