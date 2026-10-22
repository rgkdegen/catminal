// Draws the CATMINAL repo banner (1280x640) on the page canvas, reusing the terminal's drawing helpers.
// Loaded by scripts/render.py banner after index.html.
window.drawBanner = function (opts) {
  const BW = 1280, BH = 640;
  cv.width = BW; cv.height = BH; cv.style.aspectRatio = BW + '/' + BH;
  X.setTransform(1, 0, 0, 1, 0, 0);
  const t = opts && opts.t || 2.9;

  // background + perspective grid
  X.fillStyle = C.bg; X.fillRect(0, 0, BW, BH);
  X.strokeStyle = 'rgba(255,138,31,0.06)'; X.lineWidth = 1;
  for (let i = 0; i <= 22; i++) { const y = 360 + Math.pow(i / 22, 1.8) * 300; X.beginPath(); X.moveTo(0, y); X.lineTo(BW, y); X.stroke(); }
  for (let i = -16; i <= 16; i++) { X.beginPath(); X.moveTo(900 + i * 26, 360); X.lineTo(900 + i * 150, BH); X.stroke(); }
  for (let i = 0; i < 26; i++) { X.strokeStyle = 'rgba(255,138,31,0.03)'; X.beginPath(); X.moveTo(0, i * 24); X.lineTo(BW, i * 24); X.stroke(); }
  let g = X.createRadialGradient(930, 330, 20, 930, 330, 520); g.addColorStop(0, 'rgba(255,110,30,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  X.fillStyle = g; X.fillRect(0, 0, BW, BH);
  g = X.createRadialGradient(240, 250, 10, 240, 250, 420); g.addColorStop(0, 'rgba(169,139,255,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  X.fillStyle = g; X.fillRect(0, 0, BW, BH);

  // ghost pipeline cards on the right
  const ghost = [['Score · rug_risk', '0.91', C.or], ['paw head', 'swipe', C.vio], ['dev wallet', '34%', C.amb], ['ape 0.5 SOL', '+1.94', C.grn], ['blacklist dev', '1,284', C.red], ['bundle check', '61%', C.amb]];
  const gp = [[560, 52], [1100, 70], [1120, 430], [1110, 250], [1110, 150], [1000, 540]];
  ghost.forEach((c, k) => {
    const [x, y] = gp[k]; X.save(); X.globalAlpha = 0.5;
    rr(x, y, 150, 58, 6); X.fillStyle = 'rgba(20,18,25,0.9)'; X.fill(); X.strokeStyle = hexA(c[2], 0.45); X.stroke();
    X.fillStyle = c[2]; X.fillRect(x + 10, y + 12, 6, 6);
    txt(c[0], x + 22, y + 19, `700 10px ${MONO}`, C.txt); txt('value', x + 10, y + 42, `500 10px ${MONO}`, C.mut);
    txt(c[1], x + 140, y + 42, `700 10px ${MONO}`, c[2], 'right'); X.restore();
  });
  // threads into the gate
  X.lineWidth = 1.2;
  [[710, 81], [1100, 100], [1110, 280], [1110, 180], [1120, 460]].forEach(([x, y], k) => {
    X.strokeStyle = k % 2 ? 'rgba(169,139,255,0.22)' : 'rgba(255,138,31,0.25)';
    X.beginPath(); X.moveTo(x, y); X.bezierCurveTo(x - 40, y, 820, 395, 790, 418); X.stroke();
  });

  // table ledge
  const ty = 470;
  X.save(); X.shadowColor = C.or; X.shadowBlur = 22; X.fillStyle = C.or; X.fillRect(720, ty, 420, 4); X.restore();
  X.fillStyle = 'rgba(255,138,31,0.12)'; X.fillRect(720, ty + 4, 420, 12);
  txt('THE TABLE · gate 0.85', 724, ty + 30, `700 11px ${MONO}`, C.or);

  // flying rug chip with trail
  const fc = { tk: '$RUG', mc: '12K' };
  for (let k = 5; k >= 1; k--) { X.save(); X.globalAlpha = 0.09 * (6 - k); chip(700 - k * 14, 345 + k * 9, fc, 1.5, -0.42 + k * 0.05, 'rug', ''); X.restore(); }
  chip(680, 370, fc, 1.5, -0.5, 'rug', '0.04 < .85');
  for (let k = 0; k < 14; k++) { const a = k * 0.45, d = 40 + (k * 17) % 46; X.fillStyle = k % 2 ? C.or : C.red; X.fillRect(752 + Math.cos(a) * d * 0.6, 410 + Math.sin(a) * d * 0.5, 3, 3); }
  // cat mid-swipe
  drawCat(930, ty + 2, 1.82, { tail: 0.8, blink: 0, mood: 'mad', swipe: 0.45, look: -1, tap: 0 });
  bubble(870, 112, 'bundled. nope.', 1, C.red);

  // left copy
  X.save(); X.shadowColor = C.or; X.shadowBlur = 34; txt('CATMINAL', 72, 222, `900 112px ${SANS}`, C.or); X.restore();
  txt('CATMINAL', 72, 222, `900 112px ${SANS}`, C.or);
  txt('the cat that runs my pump.fun terminal', 76, 270, `600 22px ${MONO}`, C.cream);

  // pipeline pills
  const st = [['SCAN', C.amb], ['ASK', C.or], ['CAT', C.vio], ['GATE 0.85', C.red], ['ACT', C.grn]];
  let x = 76; const py = 306;
  st.forEach(([s, col], k) => {
    X.font = `800 14px ${MONO}`; const w = X.measureText(s).width + 26;
    rr(x, py, w, 34, 6); X.fillStyle = hexA(col, 0.14); X.fill(); X.strokeStyle = col; X.lineWidth = 1.4; X.stroke();
    txt(s, x + w / 2, py + 22, `800 14px ${MONO}`, col, 'center'); x += w;
    if (k < st.length - 1) { txt('→', x + 12, py + 23, `700 16px ${MONO}`, C.mut, 'center'); x += 24; }
  });

  // stats
  const sy = 410;
  [['79%', 'knocked off the table', C.hot], ['~184ms', 'per decision', C.txt], ['9/9', 'lives · 1 per trade', C.grn]].forEach(([v, l, col], k) => {
    const sx = 76 + k * 190;
    X.save(); X.shadowColor = col; X.shadowBlur = 12; txt(v, sx, sy, `900 40px ${MONO}`, col); X.restore();
    txt(l, sx, sy + 24, `500 12px ${MONO}`, C.mut);
  });
  // terminal line
  rr(76, 470, 520, 40, 6); X.fillStyle = 'rgba(18,16,22,0.95)'; X.fill(); X.strokeStyle = C.line2; X.lineWidth = 1; X.stroke();
  txt('rgk@catminal:~$', 92, 495, `600 14px ${MONO}`, C.mut);
  txt('./paw --pump --live', 232, 495, `700 14px ${MONO}`, C.amb);
  X.fillStyle = C.amb; X.fillRect(406, 484, 8, 15);

  // footer
  X.fillStyle = C.line; X.fillRect(0, BH - 56, BW, 1);
  X.save(); X.shadowColor = C.or; X.shadowBlur = 12; txt('built by RUGIKK', 76, BH - 22, `900 18px ${MONO}`, C.or); X.restore();
  paw(262, BH - 28, C.or);
  txt('@rgk_degen', 286, BH - 22, `600 14px ${MONO}`, C.cream);
  txt('github.com/rgkdegen/catminal', BW - 40, BH - 22, `600 14px ${MONO}`, C.mut, 'right');
  txt('=^.^=', BW - 330, BH - 22, `800 14px ${MONO}`, C.amb, 'right');

  // scanlines + vignette
  X.fillStyle = 'rgba(0,0,0,0.07)'; for (let y = 0; y < BH; y += 3) X.fillRect(0, y, BW, 1);
  const vg = X.createRadialGradient(BW / 2, BH / 2, 300, BW / 2, BH / 2, 820); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.45)');
  X.fillStyle = vg; X.fillRect(0, 0, BW, BH);
  return cv.toDataURL('image/png');
};
