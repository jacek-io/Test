// Generates the .dc.html artboards for the FWW × SFB widget design.
// Run: node build.mjs   → writes *.dc.html + canvas.json next to this file.
import { writeFileSync } from 'node:fs';

/* ───────────────── tokens (matched to the SFB screenshots) ───────────────── */
const T = {
  blue: '#2A6DF4', blueHover: '#1F5FE0', blueSoft: '#E8F0FE', band: '#EAF3FD',
  ink: '#1C2130', ink2: '#3F4756', muted: '#6B7280', faint: '#9AA3B2',
  line: '#E5E9F0', line2: '#D7DEE8', bg: '#F6F8FB', white: '#FFFFFF',
  gStrong: '#4CAF50', gSoft: '#E6F5E8', gText: '#2E7D32',
  graySoft: '#F1F3F6', rSoft: '#FDE7E7', rText: '#D64545',
  // validated categorical palette (dataviz validator, surface #fff)
  s1: '#2A6DF4', s2: '#EB6834', s3: '#1BAF7A', s4: '#C98500', s5: '#E87BA4', s6: '#008300', s7: '#4A3AA7', other: '#B8C0CC',
};

const FONT = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">`;

const CSS = `
  body { margin:0; font-family: Inter, "Helvetica Neue", Arial, sans-serif; color:${T.ink}; -webkit-font-smoothing:antialiased; font-size:13px; line-height:1.45; }
  a { color:${T.blue}; text-decoration:none; } a:hover { color:${T.blueHover}; }
  .num { font-variant-numeric: tabular-nums; }
  .card { background:${T.white}; border:1px solid ${T.line}; border-radius:12px; }
  .wgt { background:${T.white}; border:1px solid ${T.line}; border-radius:12px; padding:20px 24px 22px; display:flex; flex-direction:column; gap:16px; }
  .wgt-head { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .wgt-title { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:600; color:${T.ink}; }
  .wgt-meta { display:flex; align-items:center; gap:8px; }
  .stand { font-size:12px; color:${T.muted}; display:flex; align-items:center; gap:6px; padding:0 10px; height:28px; border-radius:999px; background:${T.bg}; white-space:nowrap; }
  .ibtn { width:32px; height:32px; border-radius:8px; border:1px solid ${T.line}; background:${T.white}; display:flex; align-items:center; justify-content:center; color:${T.ink2}; }
  .ibtn.off { color:${T.faint}; background:${T.bg}; }
  .pill { display:inline-flex; align-items:center; justify-content:center; height:30px; padding:0 14px; border-radius:999px; font-size:12px; font-weight:500; white-space:nowrap; }
  .pill.g-strong { background:${T.gStrong}; color:#fff; }
  .pill.g-soft { background:${T.gSoft}; color:${T.gText}; }
  .pill.gray { background:${T.graySoft}; color:${T.ink2}; }
  .pill.r-soft { background:${T.rSoft}; color:${T.rText}; }
  .seg { display:inline-flex; background:${T.bg}; border-radius:999px; padding:3px; gap:2px; }
  .seg > div { height:30px; padding:0 14px; border-radius:999px; display:flex; align-items:center; font-size:12px; font-weight:500; color:${T.ink2}; white-space:nowrap; }
  .seg > div.on { background:${T.white}; color:${T.ink}; font-weight:600; box-shadow:0 1px 2px rgba(28,33,48,.10); }
  .chip { display:inline-flex; align-items:center; gap:8px; height:32px; padding:0 12px 0 10px; border-radius:999px; border:1px solid ${T.line2}; font-size:12px; font-weight:500; color:${T.ink}; background:${T.white}; white-space:nowrap; }
  .chip.on { border-color:${T.blue}; background:${T.blueSoft}; }
  .chip.dis { color:${T.faint}; border-style:dashed; background:${T.bg}; }
  .cb { width:16px; height:16px; border-radius:4px; border:1.5px solid ${T.line2}; background:${T.white}; display:flex; align-items:center; justify-content:center; }
  .cb.on { background:${T.blue}; border-color:${T.blue}; }
  .dot { width:10px; height:10px; border-radius:999px; }
  .btn { display:inline-flex; align-items:center; gap:8px; height:36px; padding:0 18px; border-radius:999px; font-size:13px; font-weight:600; white-space:nowrap; }
  .btn.pri { background:${T.blue}; color:#fff; }
  .btn.sec { background:${T.white}; color:${T.ink}; border:1px solid ${T.line2}; }
  .btn.ghost { background:transparent; color:${T.blue}; }
  .tabs { display:flex; gap:28px; border-bottom:1px solid ${T.line}; }
  .tabs > div { padding:10px 0 12px; font-size:12px; font-weight:500; color:${T.muted}; display:flex; align-items:center; gap:6px; white-space:nowrap; }
  .tabs > div.on { color:${T.blue}; font-weight:600; box-shadow:inset 0 -2px 0 ${T.blue}; }
  .neu { font-size:10px; font-weight:600; color:${T.blue}; background:${T.blueSoft}; border-radius:4px; padding:1px 5px; letter-spacing:.02em; }
  .lbl { font-size:11px; font-weight:500; color:${T.muted}; text-transform:uppercase; letter-spacing:.04em; }
  .kv { display:grid; grid-template-columns: 1fr auto; gap:0 16px; padding:10px 0; border-bottom:1px solid ${T.line}; align-items:center; font-size:13px; }
  .kv:last-child { border-bottom:0; }
  .muted { color:${T.muted}; }
  .small { font-size:12px; }
  .callout { display:inline-flex; width:22px; height:22px; border-radius:999px; background:${T.ink}; color:#fff; font-size:11px; font-weight:700; align-items:center; justify-content:center; }
  .skel { background:linear-gradient(90deg, ${T.bg} 0%, #EEF1F6 50%, ${T.bg} 100%); border-radius:6px; }
  .th { font-size:11px; font-weight:600; color:${T.muted}; text-transform:uppercase; letter-spacing:.04em; padding:0 12px 10px; }
`;

/* ───────────────── icons (stroke, 16px grid) ───────────────── */
const ico = (d, s = 16, sw = 1.75) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  info: (s=14) => ico(`<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>`, s),
  expand: (s=16) => ico(`<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>`, s),
  download: (s=16) => ico(`<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>`, s),
  chevron: (s=14) => ico(`<path d="m6 9 6 6 6-6"/>`, s, 2),
  chevronR: (s=14) => ico(`<path d="m9 6 6 6-6 6"/>`, s, 2),
  check: (s=12) => ico(`<path d="M5 12.5l4.5 4.5L19 7"/>`, s, 3),
  file: (s=18) => ico(`<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>`, s),
  ext: (s=14) => ico(`<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`, s),
  calendar: (s=14) => ico(`<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>`, s),
  x: (s=16) => ico(`<path d="M18 6 6 18M6 6l12 12"/>`, s, 2),
  print: (s=16) => ico(`<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/>`, s),
  search: (s=16) => ico(`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`, s),
  eye: (s=14) => ico(`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`, s),
  noData: (s=40) => ico(`<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/><path d="M4 4l16 16"/>`, s, 1.5),
  spinner: (s=14) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 3a9 9 0 1 1-6.36 2.64" opacity=".9"/></svg>`,
  lock: (s=12) => ico(`<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`, s),
  menu: (s=18) => ico(`<path d="M4 7h16M4 12h16M4 17h16"/>`, s),
  user: (s=18) => ico(`<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`, s),
  plus: (s=16) => ico(`<path d="M12 5v14M5 12h14"/>`, s, 2),
  grid: (s=16) => ico(`<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`, s),
  pdf: (s=18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="${T.rText}" stroke-width="1.75" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="${T.rText}" stroke-width="1.75" stroke-linejoin="round"/><text x="12" y="17.5" text-anchor="middle" font-family="Inter, Arial" font-size="6.5" font-weight="700" fill="${T.rText}">PDF</text></svg>`,
};

/* ───────────────── shared components ───────────────── */
const widgetHead = (title, { stand = '31.07.2025', off = false, info = true } = {}) => `
  <div class="wgt-head">
    <div class="wgt-title"><span>${title}</span>${info ? `<span style="color:${T.faint}; display:flex">${I.info()}</span>` : ''}</div>
    <div class="wgt-meta">
      <div class="stand">${I.calendar(13)}<span>Datenstand ${stand}</span><span style="color:${T.line2}">·</span><span>Quelle: FWW</span></div>
      <div class="ibtn${off ? ' off' : ''}" title="Vergrößern">${I.expand()}</div>
      <div class="ibtn${off ? ' off' : ''}" title="Download">${I.download()}</div>
    </div>
  </div>`;

const page = (body, extraCss = '') => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  ${FONT}
  <style>${CSS}${extraCss}</style>
</helmet>
${body}
</x-dc>
</body>
</html>
`;

/* ───────────────── chart helpers ───────────────── */
const fmt = (n, d = 1) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const pol = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
function donut(slices, { cx = 130, cy = 130, r = 118, ri = 76, gap = 0.028 } = {}) {
  let a = -Math.PI / 2; const tot = slices.reduce((s, x) => s + x.v, 0); let out = '';
  for (const s of slices) {
    const span = (s.v / tot) * Math.PI * 2; const a0 = a + gap / 2, a1 = a + span - gap / 2;
    const [x0, y0] = pol(cx, cy, r, a0), [x1, y1] = pol(cx, cy, r, a1), [xi1, yi1] = pol(cx, cy, ri, a1), [xi0, yi0] = pol(cx, cy, ri, a0);
    const large = span > Math.PI ? 1 : 0;
    out += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L${xi1.toFixed(1)} ${yi1.toFixed(1)} A${ri} ${ri} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.c}"/>`;
    a += span;
  }
  return out;
}
// deterministic pseudo-random walk
function walk(seed, n, drift, vol, start = 0) {
  let x = seed * 9301 + 49297; const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280 - 0.5; };
  const out = [start]; for (let i = 1; i < n; i++) out.push(out[i - 1] + drift + rnd() * vol); return out;
}
function linePath(vals, x0, x1, y0, y1, vmin, vmax) {
  const n = vals.length; return vals.map((v, i) => `${i ? 'L' : 'M'}${(x0 + (i / (n - 1)) * (x1 - x0)).toFixed(1)} ${(y1 - ((v - vmin) / (vmax - vmin)) * (y1 - y0)).toFixed(1)}`).join(' ');
}
const yOf = (v, y0, y1, vmin, vmax) => y1 - ((v - vmin) / (vmax - vmin)) * (y1 - y0);

/* ───────────────── Rendite chart (3 series, 3 Jahre) ───────────────── */
function renditeChart({ w = 1240, h = 340, series, ticksX, unit = '%', vmin = -15, vmax = 45, tooltip = true, tipAt = 0.62 } = {}) {
  const padL = 44, padR = 150, padT = 16, padB = 34; const x0 = padL, x1 = w - padR, y0 = padT, y1 = h - padB;
  const grid = []; for (let v = vmin; v <= vmax; v += 15) { const y = yOf(v, y0, y1, vmin, vmax); grid.push(`<line x1="${x0}" x2="${x1}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${v === 0 ? T.line2 : T.line}" stroke-width="1"/><text x="${x0 - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="${T.faint}" font-family="Inter, Arial">${v > 0 ? '+' : ''}${v} ${unit}</text>`); }
  const xt = ticksX.map((t, i) => { const x = x0 + (i / (ticksX.length - 1)) * (x1 - x0); return `<text x="${x.toFixed(1)}" y="${h - 10}" text-anchor="${i === 0 ? 'start' : i === ticksX.length - 1 ? 'end' : 'middle'}" font-size="11" fill="${T.faint}" font-family="Inter, Arial">${t}</text>`; });
  const paths = series.map(s => `<path d="${linePath(s.vals, x0, x1, y0, y1, vmin, vmax)}" fill="none" stroke="${s.c}" stroke-width="${s.w || 2}" stroke-linejoin="round" stroke-linecap="round"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''}/>`);
  // end labels, collision-avoided
  const ends = series.map(s => ({ ...s, y: yOf(s.vals.at(-1), y0, y1, vmin, vmax) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 20) ends[i].y = ends[i - 1].y + 20;
  const endLabels = ends.map(s => `<circle cx="${x1}" cy="${yOf(s.vals.at(-1), y0, y1, vmin, vmax).toFixed(1)}" r="4.5" fill="${s.c}" stroke="#fff" stroke-width="2"/><text x="${x1 + 12}" y="${(s.y + 4).toFixed(1)}" font-size="12" font-family="Inter, Arial" fill="${T.ink}"><tspan font-weight="600">${s.vals.at(-1) > 0 ? '+' : ''}${fmt(s.vals.at(-1))} ${unit}</tspan><tspan fill="${T.muted}" dx="6">${s.short}</tspan></text>`);
  let tip = '';
  if (tooltip) {
    const idx = Math.floor(series[0].vals.length * tipAt); const tx = x0 + (idx / (series[0].vals.length - 1)) * (x1 - x0);
    const rows = series.map(s => ({ ...s, v: s.vals[idx] })).sort((a, b) => b.v - a.v);
    const bx = tx + 14, by = y0 + 8, bh = 28 + rows.length * 20;
    tip = `<line x1="${tx.toFixed(1)}" x2="${tx.toFixed(1)}" y1="${y0}" y2="${y1}" stroke="${T.ink2}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>
      ${rows.map(s => `<circle cx="${tx.toFixed(1)}" cy="${yOf(s.v, y0, y1, vmin, vmax).toFixed(1)}" r="4.5" fill="${s.c}" stroke="#fff" stroke-width="2"/>`).join('')}
      <g><rect x="${bx}" y="${by}" width="268" height="${bh}" rx="8" fill="#fff" stroke="${T.line2}" filter="drop-shadow(0 4px 12px rgba(28,33,48,.10))"/>
      <text x="${bx + 12}" y="${by + 18}" font-size="11" fill="${T.muted}" font-family="Inter, Arial">31.03.2024 · kumuliert</text>
      ${rows.map((s, i) => `<circle cx="${bx + 17}" cy="${by + 36 + i * 20}" r="4" fill="${s.c}"/><text x="${bx + 28}" y="${by + 40 + i * 20}" font-size="12" fill="${T.ink}" font-family="Inter, Arial">${s.name}</text><text x="${bx + 256}" y="${by + 40 + i * 20}" font-size="12" font-weight="600" text-anchor="end" fill="${T.ink}" font-family="Inter, Arial" style="font-variant-numeric: tabular-nums">${s.v > 0 ? '+' : ''}${fmt(s.v)} ${unit}</text>`).join('')}</g>`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block; max-width:100%">${grid.join('')}${xt.join('')}${paths.join('')}${endLabels.join('')}${tip}</svg>`;
}

const N = 37; // monthly points, 3 years
const fondsVals = walk(7, N, 1.05, 6.5); const peerVals = walk(3, N, 0.68, 5.8); const benchVals = walk(11, N, 0.86, 6.0);
const rescale = (arr, end) => { const k = end / arr.at(-1); return arr.map(v => v * k); };
const S_FONDS = { name: 'JPM Europe Equity Plus', short: 'Fonds', c: T.s1, w: 2.5, vals: rescale(fondsVals, 38.2) };
const S_PEER = { name: 'FondsConsult Peergroup', short: 'Peergroup', c: T.s2, vals: rescale(peerVals, 24.9) };
const S_BENCH = { name: 'Benchmark (ETF)', short: 'Benchmark', c: T.s3, vals: rescale(benchVals, 31.5) };
const TICKS3J = ['08/2022', '02/2023', '08/2023', '02/2024', '08/2024', '02/2025', '07/2025'];

/* ───────────────── the legend row for line charts ───────────────── */
const legend = (items) => `<div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap">${items.map(i => `<div style="display:flex; align-items:center; gap:8px; font-size:12px; color:${T.ink2}"><span style="width:14px; height:3px; border-radius:2px; background:${i.c}"></span>${i.name}</div>`).join('')}</div>`;

/* ───────────────── ALLOKATION widget ───────────────── */
const SEKTOREN = [
  { n: 'Finanzen', v: 22.4, c: T.s1 }, { n: 'Industrie', v: 16.8, c: T.s2 }, { n: 'Gesundheit', v: 14.1, c: T.s3 },
  { n: 'Zyklischer Konsum', v: 11.2, c: T.s4 }, { n: 'Informationstechnologie', v: 9.7, c: T.s5 }, { n: 'Basiskonsumgüter', v: 8.3, c: T.s6 },
  { n: 'Energie', v: 6.1, c: T.s7 }, { n: 'Sonstige (4)', v: 11.4, c: T.other },
];
function allokationWidget({ dim = 'Sektoren', slices = SEKTOREN } = {}) {
  const dims = ['Sektoren', 'Länder', 'Währungen', 'Einzeltitel', 'Assetklassen'];
  return `
  <div class="wgt" style="flex:1; min-width:0">
    ${widgetHead('Allokationsdaten')}
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px">
      <div class="seg">${dims.map(d => `<div class="${d === dim ? 'on' : ''}">${d}</div>`).join('')}</div>
      <div class="small muted">Anteil am Nettofondsvermögen</div>
    </div>
    <div style="display:flex; gap:32px; align-items:center">
      <div style="position:relative; width:260px; height:260px; flex:none">
        <svg width="260" height="260" viewBox="0 0 260 260" style="display:block">${donut(slices)}</svg>
        <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; pointer-events:none">
          <div style="font-size:11px; color:${T.muted}">Top 3</div>
          <div style="font-size:22px; font-weight:600; letter-spacing:-.01em">${fmt(slices[0].v + slices[1].v + slices[2].v)} %</div>
          <div style="font-size:11px; color:${T.muted}">${slices.length - 1} + Sonstige</div>
        </div>
      </div>
      <div style="flex:1; display:flex; flex-direction:column; min-width:0">
        ${slices.map((s, i) => `<div style="display:grid; grid-template-columns: 14px 1fr 64px; gap:12px; align-items:center; padding:7px 0; border-bottom:1px solid ${i === slices.length - 1 ? 'transparent' : T.line}">
          <span class="dot" style="background:${s.c}"></span>
          <span style="font-size:13px; color:${s.c === T.other ? T.muted : T.ink}">${s.n}</span>
          <span class="num" style="font-size:13px; font-weight:600; text-align:right">${fmt(s.v)} %</span>
        </div>`).join('')}
      </div>
    </div>
    <div style="display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:8px; background:${T.bg}; font-size:12px; color:${T.ink2}"><span style="color:${T.faint}; display:flex">${I.info(14)}</span><span>Active-Extension-Fonds: Long <strong class="num">128,4 %</strong> · Short <strong class="num">−28,4 %</strong> · Netto <strong class="num">100,0 %</strong>. Anteile beziehen sich auf das Netto-Exposure; Short-Positionen im Tooltip je Segment.</span></div>
  </div>`;
}

/* ───────────────── Über-/Untergewichtung (existing SFB panel, redrawn from the deck) ───────────────── */
function gewichtung() {
  const block = (dir, arrow, laender, regionen, sektoren) => `
    <div style="display:flex; flex-direction:column; gap:12px">
      <div style="display:flex; align-items:center; gap:10px; height:38px; padding:0 12px; border:1px solid ${T.line}; border-radius:999px; font-size:13px; font-weight:500"><span style="width:22px; height:22px; border-radius:999px; background:${T.blue}; color:#fff; display:flex; align-items:center; justify-content:center">${arrow}</span>${dir}</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px 16px; padding:0 4px">
        <div><div class="lbl">Länder</div><div style="font-size:13px; font-weight:600; margin-top:3px">${laender}</div></div>
        <div style="text-align:right"><div class="lbl">Regionen</div><div style="font-size:13px; font-weight:600; margin-top:3px">${regionen}</div></div>
        <div style="grid-column:1 / -1"><div class="lbl">Sektoren</div><div style="font-size:13px; font-weight:600; margin-top:3px">${sektoren}</div></div>
      </div>
    </div>`;
  return `
  <div class="card" style="flex:0 0 440px; border:1.5px solid ${T.blue}; padding:26px 18px 18px; position:relative; display:flex; flex-direction:column; gap:20px; align-self:flex-start">
    <div style="position:absolute; left:16px; top:-14px; background:${T.blue}; color:#fff; font-size:11px; font-weight:600; padding:6px 12px; border-radius:999px; display:flex; align-items:center; gap:6px">Smart Fund Benchmarking ${I.info(12)}</div>
    ${block('Übergewichtung', ico('<path d="M12 19V5M5 12l7-7 7 7"/>', 12, 2.5), 'Frankreich, Niederlande', 'Euroraum', 'Finanzen, Industrie, Zyklischer Konsum')}
    ${block('Untergewichtung', ico('<path d="M12 5v14M5 12l7 7 7-7"/>', 12, 2.5), 'Vereinigtes Königreich, Schweiz', 'Europa ex Euro', 'Basiskonsumgüter, Versorger')}
    <div class="small muted" style="padding:0 4px">Signifikant ab ± 5 %-Punkten zum Peergroup-Durchschnitt · Datenstand 30.06.2025</div>
  </div>`;
}


/* ───────────────── existing SFB Rendite panel (redrawn from the deck) ───────────────── */
function sfbRenditePanel() {
  const th = (t) => `<div class="th" style="text-align:right; padding-right:0">${t}</div>`;
  const cell = (v, b = false) => `<div class="num" style="text-align:right; font-size:13px; font-weight:${b ? 600 : 400}; padding:10px 0; border-top:1px solid ${T.line}">${v}</div>`;
  return `
  <div style="display:flex; flex-direction:column; gap:16px">
    <div class="card" style="border:1.5px solid ${T.blue}; padding:22px 18px 16px; position:relative">
      <div style="position:absolute; left:16px; top:-14px; background:${T.blue}; color:#fff; font-size:11px; font-weight:600; padding:6px 12px; border-radius:999px; display:flex; align-items:center; gap:6px">Smart Fund Benchmarking ${I.info(12)}</div>
      <div style="display:grid; grid-template-columns: 1fr 74px 82px 78px 48px; gap:0 6px; align-items:center; --th: 10px">
        <div class="th" style="padding-left:0; font-size:10px; letter-spacing:.02em">Zeiträume</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Kurzfristig</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Mittelfristig</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Langfristig</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Trend</div>
        <div style="font-size:13px; font-weight:600; padding:8px 0; border-top:1px solid ${T.line}">Rendite</div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span class="pill g-soft" style="height:26px; padding:0 12px">Gut</span></div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span class="pill g-strong" style="height:26px; padding:0 12px">Sehr Gut</span></div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span class="pill g-strong" style="height:26px; padding:0 12px">Sehr Gut</span></div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span style="width:24px; height:24px; border-radius:999px; background:${T.gSoft}; color:${T.gText}; display:flex; align-items:center; justify-content:center">${ico('<path d="M4 17l6-6 4 4 6-8"/>', 14, 2.2)}</span></div>
      </div>
    </div>
    <div class="wgt" style="gap:12px; padding:18px 18px 14px">
      <div class="wgt-head"><div class="wgt-title" style="font-size:14px">Rendite (annualisiert)</div><div class="stand" style="height:26px">Datenstand 31.07.2025</div></div>
      <div style="display:grid; grid-template-columns: 1fr 70px 70px 70px; gap:0 12px; align-items:center">
        <div></div>${th('1 J.')}${th('3 J. p.a.')}${th('5 J. p.a.')}
        <div style="font-size:13px; font-weight:600; padding:10px 0; border-top:1px solid ${T.line}">Rendite</div>${cell('12,04 %', true)}${cell('11,26 %', true)}${cell('9,81 %', true)}
        <div style="font-size:13px; color:${T.muted}; padding:10px 0; border-top:1px solid ${T.line}">Peergroupdurchschnitt</div>${cell('9,12 %')}${cell('7,71 %')}${cell('6,90 %')}
      </div>
    </div>
  </div>`;
}

/* ───────────────── RENDITE widget ───────────────── */
const windows = ['1 Monat', '6 Monate', '1 Jahr', '3 Jahre', '5 Jahre', '10 Jahre', 'Individuell'];
const compareChips = (state = { peer: true, bench: true, sektor: false }, { sektorDisabled = false } = {}) => `
  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
    <span class="small muted" style="margin-right:2px">Vergleich mit</span>
    <div class="chip ${state.peer ? 'on' : ''}"><span class="cb ${state.peer ? 'on' : ''}" style="color:#fff">${state.peer ? I.check() : ''}</span><span class="dot" style="background:${T.s2}"></span>FondsConsult Peergroup</div>
    <div class="chip ${state.bench ? 'on' : ''}"><span class="cb ${state.bench ? 'on' : ''}" style="color:#fff">${state.bench ? I.check() : ''}</span><span class="dot" style="background:${T.s3}"></span>Benchmark (ETF)</div>
    ${sektorDisabled
      ? `<div class="chip dis" title="Kein FWW-Sektor zugeordnet"><span class="cb" style="border-style:dashed"></span><span class="dot" style="background:${T.line2}"></span>FWW Sektordurchschnitt<span style="display:flex; color:${T.faint}">${I.lock()}</span></div>`
      : `<div class="chip ${state.sektor ? 'on' : ''}"><span class="cb ${state.sektor ? 'on' : ''}" style="color:#fff">${state.sektor ? I.check() : ''}</span><span class="dot" style="background:${T.s7}"></span>FWW Sektordurchschnitt</div>`}
  </div>`;
const windowSeg = (on = '3 Jahre') => `<div class="seg">${windows.map(w => `<div class="${w === on ? 'on' : ''}">${w}</div>`).join('')}</div>`;

function renditeControls({ on = '3 Jahre', trigger = 'loaded', state, sektorDisabled } = {}) {
  const btn = {
    idle: `<div class="btn pri">${I.download(15)}Rendite laden</div>`,
    loading: `<div class="btn pri" style="opacity:.85">${I.spinner()}Wird geladen …</div>`,
    loaded: `<div style="display:flex; align-items:center; gap:12px"><span class="small muted">Geladen: 3 Jahre · 3 Reihen</span><div class="btn sec">Aktualisieren</div></div>`,
    stale: `<div style="display:flex; align-items:center; gap:12px"><span class="small" style="color:${T.s4}; display:flex; align-items:center; gap:6px">${I.info(13)}Auswahl geändert</span><div class="btn pri">${I.download(15)}Rendite laden</div></div>`,
  }[trigger];
  return `
  <div style="display:flex; align-items:center; justify-content:space-between; gap:12px 16px; flex-wrap:wrap">
    <div style="display:flex; align-items:center; gap:10px"><span class="small muted">Zeitraum</span>${windowSeg(on)}</div>
    <div style="margin-left:auto; display:flex">${btn}</div>
  </div>
  ${compareChips(state, { sektorDisabled })}`;
}

function renditeWidget({ w = 1240, tipAt = 0.62 } = {}) {
  return `
  <div class="wgt">
    ${widgetHead('Renditeentwicklung')}
    ${renditeControls({ trigger: 'loaded' })}
    <div style="display:flex; flex-direction:column; gap:12px">
      ${renditeChart({ w, tipAt, series: [S_FONDS, S_PEER, S_BENCH], ticksX: TICKS3J })}
      <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap">
        ${legend([S_FONDS, S_PEER, S_BENCH])}
        <div class="small muted">Kumulierte Wertentwicklung in EUR, indexiert auf 0 % zum 01.08.2022 · Angaben nach BVI-Methode</div>
      </div>
    </div>
  </div>`;
}

/* ───────────────── RENDITE states ───────────────── */
function renditeStates() {
  const frame = (label, note, inner) => `
    <div style="display:flex; flex-direction:column; gap:10px">
      <div style="display:flex; align-items:baseline; gap:12px"><span class="lbl" style="color:${T.blue}">${label}</span><span class="small muted">${note}</span></div>
      ${inner}
    </div>`;
  const prefetch = `
    <div class="wgt">
      ${widgetHead('Renditeentwicklung')}
      ${renditeControls({ trigger: 'idle' })}
      <div style="height:300px; border:1px dashed ${T.line2}; border-radius:10px; background:${T.bg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center">
        <div style="color:${T.faint}; opacity:.9">${ico(`<path d="M3 3v18h18"/><path d="M7 16l4-6 4 3 5-8"/>`, 40, 1.5)}</div>
        <div style="font-size:14px; font-weight:600">Zeitraum und Vergleich wählen, dann Rendite laden</div>
        <div class="small muted" style="max-width:460px">Die Wertentwicklung wird erst auf Ihren Klick abgerufen – so bleibt jede Abfrage gezielt und schnell. Voreingestellt: 3 Jahre, Peergroup und Benchmark.</div>
        <div class="btn pri" style="margin-top:6px">${I.download(15)}Rendite laden</div>
      </div>
    </div>`;
  const loading = `
    <div class="wgt">
      ${widgetHead('Renditeentwicklung')}
      ${renditeControls({ trigger: 'loading' })}
      <div style="height:300px; position:relative; border-radius:10px; overflow:hidden">
        <svg width="1240" height="300" viewBox="0 0 1240 300" style="display:block; max-width:100%">
          ${[0, 1, 2, 3, 4].map(i => `<line x1="44" x2="1090" y1="${20 + i * 62}" y2="${20 + i * 62}" stroke="${T.line}"/>`).join('')}
          ${[0, 1, 2, 3, 4].map(i => `<rect x="4" y="${14 + i * 62}" width="30" height="10" rx="4" fill="${T.bg}"/>`).join('')}
          <path d="M44 220 C 200 200, 320 240, 480 180 S 760 120, 900 150 S 1040 90, 1090 100" fill="none" stroke="${T.line2}" stroke-width="2.5" stroke-dasharray="6 6" opacity=".8"/>
        </svg>
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center">
          <div style="background:#fff; border:1px solid ${T.line}; border-radius:999px; padding:8px 16px 8px 12px; display:flex; align-items:center; gap:10px; box-shadow:0 4px 16px rgba(28,33,48,.08); font-size:12px; color:${T.ink2}"><span style="color:${T.blue}; display:flex">${I.spinner(16)}</span>Rendite für 3 Jahre wird von FWW abgerufen …</div>
        </div>
      </div>
    </div>`;
  const stale = `
    <div class="wgt">
      ${widgetHead('Renditeentwicklung')}
      ${renditeControls({ trigger: 'stale', on: 'Individuell', state: { peer: true, bench: true, sektor: true } })}
      <div style="display:flex; align-items:center; gap:10px; padding:12px 14px; border:1px solid ${T.line}; border-radius:10px; background:${T.bg}">
        <span class="small muted">Individueller Zeitraum</span>
        <div style="display:flex; align-items:center; gap:8px; height:34px; padding:0 12px; border:1px solid ${T.line2}; border-radius:8px; background:#fff; font-size:13px">${I.calendar(14)}<span class="num">01.01.2020</span></div>
        <span class="muted">bis</span>
        <div style="display:flex; align-items:center; gap:8px; height:34px; padding:0 12px; border:1.5px solid ${T.blue}; border-radius:8px; background:#fff; font-size:13px; box-shadow:0 0 0 3px ${T.blueSoft}">${I.calendar(14)}<span class="num">31.07.2025</span></div>
        <span class="small muted">Max. 15 Jahre · frühester Datenpunkt 25.06.2007</span>
      </div>
      <div style="position:relative; border-radius:10px; overflow:hidden">
        <div style="opacity:.35; filter:saturate(.4)">${renditeChart({ series: [S_FONDS, S_PEER, S_BENCH], ticksX: TICKS3J, h: 260, tooltip: false })}</div>
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center">
          <div style="background:#fff; border:1px solid ${T.line}; border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:16px; box-shadow:0 8px 24px rgba(28,33,48,.10)">
            <div><div style="font-size:13px; font-weight:600">Die Anzeige entspricht noch der letzten Abfrage (3 Jahre)</div><div class="small muted">Laden Sie die Rendite neu, um 01.01.2020 – 31.07.2025 mit 4 Reihen zu sehen.</div></div>
            <div class="btn pri">${I.download(15)}Rendite laden</div>
          </div>
        </div>
      </div>
    </div>`;
  return page(`
  <div style="width:1296px; padding:24px; background:${T.bg}; display:flex; flex-direction:column; gap:36px; box-sizing:border-box">
    <div style="display:flex; flex-direction:column; gap:4px"><div style="font-size:18px; font-weight:600">Renditeentwicklung – Zustände des Trigger-Controls</div><div class="muted">Die Daten werden nie automatisch beim Öffnen des Tabs geladen. Der Nutzer wählt Zeitraum und Vergleichsreihen und löst den Abruf bewusst aus.</div></div>
    ${frame('A · Vor dem Abruf (Pre-fetch)', 'Tab geöffnet, noch keine Anfrage an FWW. Primärbutton doppelt vorhanden: in der Kontrollzeile und im Leerbereich.', prefetch)}
    ${frame('B · Wird geladen', 'Button gesperrt mit Spinner, Skelett-Chart bleibt maßstäblich, Steuerelemente bleiben lesbar.', loading)}
    ${frame('C · Auswahl geändert / Individueller Zeitraum', 'Alter Chart bleibt abgedimmt sichtbar (kein Sprung), Hinweis nennt die neue Auswahl. Datumsfelder mit Grenzen.', stale)}
  </div>`);
}

/* ───────────────── CRASH DRAWDOWNS ───────────────── */
function crashWidget() {
  const events = [['Globale Finanz- und Bankenkrise', '2007 – 2009'], ['Eurokrise', '2011'], ['China Crash', '2015 – 2016'], ['Handelskrieg US-China', '2018'], ['Corona-Krise', '2020'], ['Russland-Ukraine Krieg', '2022']];
  const active = 'Corona-Krise';
  // event window: 6 weeks daily-ish, 30 points
  const n = 31; const fonds = []; const peer = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1); const down = t <= 0.72; const dip = Math.pow(Math.sin((Math.PI / 2) * Math.min(t / 0.72, 1)), 1.15);
    fonds.push((down ? -33.8 * dip : -33.8 + ((t - 0.72) / 0.28) * 19.5) + Math.sin(i * 1.7) * 1.1);
    peer.push((down ? -35.6 * Math.pow(dip, 0.96) : -35.6 + ((t - 0.72) / 0.28) * 17.2) + Math.cos(i * 1.3) * 1.0); }
  fonds[0] = 0; peer[0] = 0; fonds[22] = -33.8; peer[22] = -35.6; const iMin = fonds.indexOf(Math.min(...fonds));
  const w = 640, h = 300, x0 = 48, x1 = w - 20, y0 = 16, y1 = h - 34, vmin = -40, vmax = 5;
  const grid = [-40, -30, -20, -10, 0].map(v => { const y = yOf(v, y0, y1, vmin, vmax); return `<line x1="${x0}" x2="${x1}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${v === 0 ? T.line2 : T.line}"/><text x="${x0 - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="${T.faint}" font-family="Inter, Arial">${v > 0 ? '+' : ''}${v} %</text>`; }).join('');
  const xt = ['19.02.', '04.03.', '18.03.', '23.03.', '08.04.', '30.04.2020'].map((t, i, a) => `<text x="${(x0 + (i / (a.length - 1)) * (x1 - x0)).toFixed(1)}" y="${h - 10}" text-anchor="${i === 0 ? 'start' : i === a.length - 1 ? 'end' : 'middle'}" font-size="11" fill="${T.faint}" font-family="Inter, Arial">${t}</text>`).join('');
  const xMin = x0 + (iMin / (n - 1)) * (x1 - x0); const yMin = yOf(fonds[iMin], y0, y1, vmin, vmax);
  const area = `<path d="${linePath(fonds, x0, x1, y0, y1, vmin, vmax)} L${x1} ${yOf(0, y0, y1, vmin, vmax)} L${x0} ${yOf(0, y0, y1, vmin, vmax)} Z" fill="${T.s1}" opacity=".08"/>`;
  const chart = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block; max-width:100%">${grid}${xt}
    <rect x="${x0}" y="${y0}" width="${(xMin - x0).toFixed(1)}" height="${y1 - y0}" fill="${T.rSoft}" opacity=".45"/>
    <text x="${(x0 + 8)}" y="${y0 + 14}" font-size="11" fill="${T.rText}" font-family="Inter, Arial" font-weight="600">Drawdown-Phase · 24 Handelstage</text>
    ${area}
    <path d="${linePath(peer, x0, x1, y0, y1, vmin, vmax)}" fill="none" stroke="${T.s2}" stroke-width="2" stroke-linejoin="round"/>
    <path d="${linePath(fonds, x0, x1, y0, y1, vmin, vmax)}" fill="none" stroke="${T.s1}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${xMin.toFixed(1)}" cy="${yMin.toFixed(1)}" r="5" fill="${T.s1}" stroke="#fff" stroke-width="2"/>
    <text x="${(xMin + 10).toFixed(1)}" y="${(yMin + 14).toFixed(1)}" font-size="12" font-weight="600" fill="${T.ink}" font-family="Inter, Arial">−33,8 % Fonds</text>
    <text x="${(xMin + 10).toFixed(1)}" y="${(yMin + 28).toFixed(1)}" font-size="11" fill="${T.muted}" font-family="Inter, Arial">Tiefpunkt 23.03.2020</text>
  </svg>`;
  return `
  <div class="wgt">
    ${widgetHead('Crash Drawdowns', { stand: '31.07.2025' })}
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
      ${events.map(([e, y]) => `<div class="chip ${e === active ? 'on' : ''}" style="padding:0 12px; gap:6px; height:34px; ${e === active ? `font-weight:600; color:${T.blue}` : ''}">${e}<span style="font-weight:400; color:${e === active ? T.blue : T.muted}">${y}</span></div>`).join('')}
    </div>
    <div style="display:grid; grid-template-columns: 1fr 640px; gap:32px; align-items:start">
      <div style="display:flex; flex-direction:column; gap:20px; min-width:0">
        <div class="card" style="padding:4px 18px">
          <div class="kv"><span class="muted">Zeitraum</span><span class="num" style="font-weight:600">19.02.2020 – 23.03.2020</span></div>
          <div class="kv"><span class="muted">Drawdown Fonds</span><span class="num" style="font-weight:600; color:${T.rText}">−33,8 %</span></div>
          <div class="kv"><span class="muted">Drawdown Peergroup</span><span class="num" style="font-weight:600">−35,6 %</span></div>
          <div class="kv"><span class="muted">Relativ zur Peergroup</span><span class="num" style="font-weight:600; color:${T.gText}">+1,8 Pp</span></div>
          <div class="kv"><span class="muted">Erholung bis Vorkrisenniveau</span><span class="num" style="font-weight:600">142 Tage</span></div>
          <div class="kv"><span class="muted">Smart Fund Benchmarking</span><span class="pill g-soft" style="height:26px">Gut</span></div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
          <div style="display:flex; flex-direction:column; gap:6px"><div class="lbl">Ereignisse</div><div style="font-size:13px; color:${T.ink2}; line-height:1.55">Die globale Ausbreitung von COVID-19 führte ab dem 19.02.2020 zum schnellsten Bärenmarkt der Geschichte. Lockdowns, ein Ölpreis-Kollaps und Liquiditätsengpässe belasteten europäische Aktien binnen 24 Handelstagen um über ein Drittel.</div></div>
          <div style="display:flex; flex-direction:column; gap:6px"><div class="lbl">Folgen für den Fonds</div><div style="font-size:13px; color:${T.ink2}; line-height:1.55">Die Netto-Long-Position von rund 100 % ließ den Fonds den Markt weitgehend nachvollziehen; die Short-Buch-Erträge dämpften den Rückgang gegenüber der Peergroup um 1,8 Pp. Die Erholung verlief durch das Übergewicht in Qualitätszyklikern schneller als im Durchschnitt.</div></div>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px; min-width:0">
        <div style="display:flex; justify-content:space-between; align-items:center"><div style="font-size:13px; font-weight:600">Wertentwicklung im Ereignisfenster</div><div class="small muted">indexiert auf 0 % zum 19.02.2020</div></div>
        ${chart}
        ${legend([{ name: 'JPM Europe Equity Plus', c: T.s1 }, { name: 'FondsConsult Peergroup', c: T.s2 }])}
      </div>
    </div>
  </div>`;
}

/* ───────────────── DOKUMENTE tab ───────────────── */
function dokumenteTab({ sponsored = true } = {}) {
  const scope = (kind) => kind === 'fund'
    ? `<span style="display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 10px; border-radius:999px; background:${T.graySoft}; color:${T.ink2}; font-size:11px; font-weight:600">${I.grid(12)}Fondsebene</span>`
    : `<span style="display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 10px; border-radius:999px; background:${T.blueSoft}; color:${T.blue}; font-size:11px; font-weight:600">${I.file(12)}Anteilsklasse · LU0289214628</span>`;
  const row = (title, sub, kind, stand, lang, extra = '') => `
    <div style="display:grid; grid-template-columns: 40px 1fr 240px 120px 80px 180px; gap:12px; align-items:center; padding:14px 12px; border-top:1px solid ${T.line}">
      <div style="display:flex">${I.pdf(26)}</div>
      <div style="min-width:0"><div style="font-size:13px; font-weight:600">${title}</div><div class="small muted">${sub}</div>${extra}</div>
      <div>${scope(kind)}</div>
      <div class="num" style="font-size:13px">${stand}</div>
      <div style="font-size:13px">${lang}</div>
      <div style="display:flex; justify-content:flex-end; gap:8px"><div class="btn sec" style="height:32px; padding:0 12px; font-size:12px">${I.eye(14)}Ansehen</div><div class="btn pri" style="height:32px; padding:0 12px; font-size:12px">${I.download(14)}PDF</div></div>
    </div>`;
  const header = `<div style="display:grid; grid-template-columns: 40px 1fr 240px 120px 80px 180px; gap:12px; padding:0 12px 8px"><div></div><div class="th" style="padding:0">Dokument</div><div class="th" style="padding:0">Ebene</div><div class="th" style="padding:0">Stand</div><div class="th" style="padding:0">Sprache</div><div></div></div>`;
  return `
  <div style="display:flex; flex-direction:column; gap:20px">
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:24px">
      <div style="max-width:720px; color:${T.ink2}">Alle Unterlagen zu diesem Fonds an einem Ort: Research von FondsConsult und die gesetzlichen Dokumente des Asset Managers. Dokumente auf <strong>Fondsebene</strong> gelten für alle Anteilsklassen, Dokumente auf <strong>Anteilsklassen-Ebene</strong> beziehen sich auf die gewählte ISIN.</div>
      <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end">
        <span class="lbl">Anteilsklasse</span>
        <div style="display:flex; align-items:center; gap:10px; height:36px; padding:0 8px 0 14px; border:1px solid ${T.line2}; border-radius:8px; background:#fff; font-size:13px"><span class="num" style="font-weight:600">LU0289214628</span><span class="muted">A0MNZ2 · EUR · A (acc)</span>${I.chevron()}</div>
        <span class="small muted">5 Anteilsklassen · Sie sehen die ISIN aus Ihrer Fondsliste</span>
      </div>
    </div>

    <div class="wgt" style="gap:0; padding:20px 12px 4px">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0 12px 14px">
        <div class="wgt-title"><span>Research von FondsConsult</span><span class="pill" style="height:22px; padding:0 8px; font-size:11px; background:${T.band}; color:${T.blue}">Sponsored Fund</span></div>
        <div class="small muted">Nur für Fonds mit FondsConsult-Sponsoring</div>
      </div>
      ${header}
      ${sponsored
        ? row('Fondsportrait JPMorgan Funds – Europe Equity Plus Fund', 'Einschätzung, Investmentansatz und Management-Profil auf 4 Seiten · 2,4 MB', 'fund', '07/2025', 'DE')
        : `<div style="display:flex; align-items:center; gap:12px; padding:18px 12px; border-top:1px solid ${T.line}; color:${T.muted}">${I.info(16)}<span>Für diesen Fonds liegt kein FondsConsult-Fondsportrait vor. Die Einschätzung finden Sie im Tab <a href="#">Einschätzung</a>.</span></div>`}
    </div>

    <div class="wgt" style="gap:0; padding:20px 12px 4px">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0 12px 14px">
        <div class="wgt-title"><span>Allgemeine Dokumente des Asset Managers</span><span style="color:${T.faint}; display:flex">${I.info()}</span></div>
        <div class="stand">${I.calendar(13)}<span>Abgerufen 31.07.2025</span><span style="color:${T.line2}">·</span><span>Quelle: FWW</span></div>
      </div>
      ${header}
      ${row('PRIIPS-KID', 'Basisinformationsblatt · 3 Seiten · 180 KB', 'isin', '15.02.2025', 'DE', `<div style="margin-top:6px"><a href="#" style="font-size:12px; font-weight:500; display:inline-flex; align-items:center; gap:4px">Für 4 weitere Anteilsklassen anzeigen ${I.chevron(12)}</a></div>`)}
      ${row('Jahresbericht', 'Geprüfter Jahresbericht des Umbrellas · 312 Seiten · 6,8 MB', 'fund', '31.12.2024', 'DE / EN')}
      ${row('Halbjahresbericht', 'Ungeprüfter Halbjahresbericht · 188 Seiten · 4,1 MB', 'fund', '30.06.2025', 'DE / EN')}
      ${row('Verkaufsprospekt', 'Inkl. Besonderer Teil des Teilfonds · 402 Seiten · 5,2 MB', 'fund', '03/2025', 'DE')}
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 12px 10px; border-top:1px solid ${T.line}"><div class="small muted">Dokumente werden vom Asset Manager bereitgestellt und täglich über FWW aktualisiert.</div><div class="btn ghost" style="height:32px; padding:0 8px; font-size:12px">${I.download(14)}Alle 5 Dokumente als ZIP</div></div>
    </div>
  </div>`;
}

/* ───────────────── MAIN: fund detail panel in context ───────────────── */
function main() {
  const nav = `
  <div style="height:56px; background:${T.blue}; display:flex; align-items:center; padding:0 24px; gap:28px; color:#fff">
    <div style="display:flex; align-items:center; gap:14px">${I.menu()}<div style="font-size:19px; font-weight:700; letter-spacing:-.02em">fonds<span style="font-weight:400">consult</span>.</div></div>
    <div style="display:flex; gap:22px; font-size:13px; font-weight:500; opacity:.95">${['Meine Fondsliste', 'Mein Fondsvergleich', 'Analyst Tool', 'Modul-Builder', 'Kundenmodule'].map(n => `<span>${n}</span>`).join('')}</div>
    <div style="margin-left:auto; display:flex; align-items:center; gap:16px">${I.user()}<div style="height:32px; padding:0 6px 0 14px; border:1px solid rgba(255,255,255,.7); border-radius:999px; display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500">Einladen <span style="width:22px; height:22px; border-radius:999px; background:#fff; color:${T.blue}; display:flex; align-items:center; justify-content:center">${I.plus(14)}</span></div></div>
  </div>`;
  const fundRow = `
  <div style="display:grid; grid-template-columns: 24px 24px 1fr 84px 76px 96px 96px 96px 96px 110px 84px 118px; align-items:center; gap:8px; padding:0 20px; height:76px">
    <div style="color:${T.blue}; display:flex; transform:rotate(90deg)">${I.chevronR(14)}</div>
    <div style="width:16px; height:16px; border:1.5px solid ${T.line2}; border-radius:4px"></div>
    <div><div style="font-size:15px; font-weight:600">JPMorgan Funds – Europe Equity Plus Fund</div><div class="small muted">Aktien Europa Large Cap Blend</div></div>
    <div style="display:flex; justify-content:center"><span style="background:${T.gStrong}; color:#fff; font-size:11px; font-weight:700; padding:6px 12px; clip-path:polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)">BUY</span></div>
    <div class="num" style="text-align:center; font-weight:700; font-size:14px">1 <span style="font-weight:400; font-size:11px; color:${T.muted}">/214</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-soft">Hoch</span></div>
    <div style="display:flex; justify-content:center"><span class="pill gray">Mittel</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-strong" style="line-height:1.1; text-align:center">Sehr<br>Gut</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-soft">Gut</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-strong">Sehr Gut</span></div>
    <div style="display:flex; justify-content:center"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="${T.line}" stroke-width="3"/><circle cx="20" cy="20" r="16" fill="none" stroke="${T.ink}" stroke-width="3" stroke-dasharray="${(0.43 * 100.5).toFixed(1)} 200" transform="rotate(-90 20 20)" stroke-linecap="round"/><text x="20" y="24" text-anchor="middle" font-size="11" fill="${T.ink}" font-family="Inter, Arial">43</text></svg></div>
    <div style="display:flex; justify-content:flex-end"><div class="btn pri" style="height:34px; padding:0 10px 0 16px; gap:10px">Aktionen ${I.grid(14)}</div></div>
  </div>`;
  const colHead = `
  <div style="display:grid; grid-template-columns: 24px 24px 1fr 84px 76px 96px 96px 96px 96px 110px 84px 118px; align-items:end; gap:8px; padding:0 20px 8px; font-size:11px; font-weight:600; color:${T.ink2}">
    <div></div><div style="width:16px; height:16px; border:1.5px solid ${T.line2}; border-radius:4px"></div><div>Name</div>
    <div style="text-align:center; line-height:1.2">Handlungs-<br>empfehlung</div><div style="text-align:center">Rang</div>
    <div style="text-align:center; color:${T.blue}; line-height:1.2">Fonds-<br>volumen</div><div style="text-align:center; color:${T.blue}; line-height:1.2">Track<br>Record</div><div style="text-align:center; color:${T.blue}">Rendite</div><div style="text-align:center; color:${T.blue}">Risiko</div><div style="text-align:center; color:${T.blue}; line-height:1.2">Aktives<br>Management</div><div style="text-align:center; line-height:1.2">ESG<br>Credibility</div><div></div>
  </div>`;
  const einschaetzung = `
  <div style="padding:0 20px 20px; display:flex; flex-direction:column; gap:14px">
    <div style="display:flex; justify-content:space-between; align-items:center">
      <div class="tabs" style="border-bottom:0; gap:0"><div class="on" style="padding:6px 16px 6px 0; box-shadow:none">Einschätzung</div><div style="padding:6px 16px; border-left:1px solid ${T.line}">Investmentansatz</div><div style="padding:6px 16px; border-left:1px solid ${T.line}">Management Profil</div></div>
      <div class="ibtn">${I.print()}</div>
    </div>
    <div style="background:${T.bg}; border-radius:10px; padding:16px 20px 16px 52px; position:relative; font-size:12.5px; line-height:1.6; color:${T.ink2}">
      <div style="position:absolute; left:18px; top:18px; width:20px; height:20px; border-radius:5px; background:${T.blue}; color:#fff; display:flex; align-items:center; justify-content:center">${I.user(12)}</div>
      Der JPM Europe Equity Plus verfolgt einen „Active-Extension-Ansatz“, was bedeutet, dass das Portfolio eine Long-Position von 120 % – 140 % in europäische Aktien und eine Short-Position von 20 % – 40 % hat. Entscheidend ist, dass das Nettoengagement in der Regel 100 % beträgt. Durch das Short-Book besteht zusätzliches Potenzial, Mehrwert zu generieren. Trotzdem gelang es dem Management, aufgrund einer regelmäßig hervorragenden Titelselektion langfristig eine Outperformance gegenüber dem MSCI Europe zu generieren. Wir vergeben daher das Rating „Buy“.
    </div>
  </div>`;
  const sectionTabs = `
  <div class="tabs" style="padding:0 20px">
    ${['Stammdaten', 'Sektoren/Regionen', 'Portfoliocharakteristika', 'Rendite', 'Risiko', 'Aktives Management', 'Crash Drawdowns', 'ESG', 'Anteilsklassen', 'Peergroup'].map(t => `<div class="${t === 'Sektoren/Regionen' ? 'on' : ''}">${t}</div>`).join('')}
    <div>Dokumente <span class="neu">NEU</span></div>
  </div>`;
  const content = `
  <div style="padding:20px 20px 24px; display:flex; flex-direction:column; gap:16px">
    <div style="color:${T.ink2}; max-width:1100px">In diesem Abschnitt erhalten Sie eine übersichtliche Darstellung der sektoralen und regionalen Über-/Untergewichtungen des Fonds im Vergleich zum Durchschnitt seiner Peergruppe. Die Allokationsdaten von FWW ergänzen diese Einordnung um die vollständige Aufschlüsselung nach Sektoren, Ländern, Währungen und Einzeltiteln.</div>
    <div style="display:flex; gap:20px; align-items:flex-start; padding-top:14px">
      ${gewichtung()}
      ${allokationWidget()}
    </div>
  </div>`;
  return page(`
  <div style="width:1440px; background:${T.bg}; min-height:1260px; padding-bottom:24px; box-sizing:border-box">
    ${nav}
    <div style="padding:20px 20px 0">
      <div style="background:#fff; border-radius:12px; padding:20px 20px 0; border:1px solid ${T.line}">
        <div style="display:flex; gap:6px; margin-bottom:18px">
          <div style="display:flex; align-items:center; gap:8px; padding:10px 16px; background:${T.bg}; border-radius:8px 8px 0 0; font-size:13px; font-weight:600">${I.grid(15)} Fonds</div>
          <div style="display:flex; align-items:center; gap:8px; padding:10px 16px; font-size:13px; font-weight:500; color:${T.muted}">Peergroups</div>
          <div style="display:flex; align-items:center; gap:8px; padding:10px 16px; font-size:13px; font-weight:500; color:${T.blue}">Aktive ETFs <span class="neu">Neu</span></div>
        </div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:22px">
          <div style="flex:0 0 560px; height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:10px; padding:0 16px; color:${T.faint}; font-size:13px">${I.search(16)} Fondssuche über ISIN, WKN oder Name…</div>
          ${['Anlageklasse', 'Handlungsempfehlung', 'Fondsgesellschaft'].map(f => `<div style="height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:8px; padding:0 18px; font-size:13px; font-weight:500">${f} ${I.chevron()}</div>`).join('')}
          <div style="height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:8px; padding:0 18px; font-size:13px; font-weight:500"><span style="width:14px; height:14px; border-radius:999px; border:1.5px solid ${T.line2}"></span> Nur ETFs</div>
          <div style="margin-left:auto; height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:10px; padding:0 18px; font-size:13px; font-weight:500">Filter ${I.menu(16)}</div>
        </div>
        ${colHead}
        <div class="card" style="border:1.5px solid ${T.blue}; border-radius:12px; margin-bottom:16px; overflow:hidden">
          ${fundRow}
          <div style="height:1px; background:${T.line}; margin:0 20px 18px"></div>
          ${einschaetzung}
          ${sectionTabs}
          ${content}
        </div>
        <div style="display:grid; grid-template-columns: 24px 24px 1fr 84px 76px 96px 96px 96px 96px 110px 84px 118px; align-items:center; gap:8px; padding:0 20px; height:72px; border:1px solid ${T.line}; border-radius:12px; margin-bottom:20px; opacity:.9">
          <div style="color:${T.ink2}; display:flex">${I.chevronR(14)}</div><div style="width:16px; height:16px; border:1.5px solid ${T.line2}; border-radius:4px"></div>
          <div><div style="font-size:15px; font-weight:600">Templeton Emerging Markets Dynamic Income Fund</div><div class="small muted">Mischfonds Emerging Markets</div></div>
          <div style="display:flex; justify-content:center"><span style="background:${T.gStrong}; color:#fff; font-size:11px; font-weight:700; padding:6px 12px; clip-path:polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)">BUY</span></div>
          <div class="num" style="text-align:center; font-weight:700; font-size:14px">1 <span style="font-weight:400; font-size:11px; color:${T.muted}">/17</span></div>
          <div style="display:flex; justify-content:center"><span class="pill gray">Mittel</span></div><div style="display:flex; justify-content:center"><span class="pill g-soft">Lang</span></div><div style="display:flex; justify-content:center"><span class="pill g-strong" style="line-height:1.1; text-align:center">Sehr<br>Gut</span></div><div style="display:flex; justify-content:center"><span class="pill gray">Mittel</span></div><div style="display:flex; justify-content:center; color:${T.muted}">–</div><div style="display:flex; justify-content:center; color:${T.muted}">36</div>
          <div style="display:flex; justify-content:flex-end"><div class="btn pri" style="height:34px; padding:0 10px 0 16px; gap:10px">Aktionen ${I.grid(14)}</div></div>
        </div>
      </div>
    </div>
  </div>`);
}

/* ───────────────── Tab artboards ───────────────── */
const tabShell = (activeTab, inner, w = 1296) => page(`
  <div style="width:${w}px; background:#fff; padding:0 0 24px; box-sizing:border-box; border:1px solid ${T.line}; border-radius:12px; overflow:hidden">
    <div class="tabs" style="padding:0 20px">
      ${['Stammdaten', 'Sektoren/Regionen', 'Portfoliocharakteristika', 'Rendite', 'Risiko', 'Aktives Management', 'Crash Drawdowns', 'ESG', 'Anteilsklassen', 'Peergroup'].map(t => `<div class="${t === activeTab ? 'on' : ''}">${t}</div>`).join('')}
      <div class="${activeTab === 'Dokumente' ? 'on' : ''}">Dokumente <span class="neu">NEU</span></div>
    </div>
    <div style="padding:20px 20px 0">${inner}</div>
  </div>`);

/* ───────────────── Widget pattern + download menu ───────────────── */
function patternBoard() {
  const menu = `
    <div style="width:236px; background:#fff; border:1px solid ${T.line}; border-radius:10px; box-shadow:0 12px 32px rgba(28,33,48,.14); padding:6px; display:flex; flex-direction:column">
      <div class="lbl" style="padding:8px 10px 6px">Grafik</div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px; background:${T.bg}"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.file(16)}Als Bild (JPEG)</span><span class="small muted">1600 px</span></div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.file(16)}Als Folie (PPTX)</span><span class="small muted">16:9</span></div>
      <div style="height:1px; background:${T.line}; margin:6px 4px"></div>
      <div class="lbl" style="padding:8px 10px 6px">Daten</div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.grid(16)}Tabelle (XLSX)</span></div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.grid(16)}Rohdaten (CSV)</span></div>
      <div style="height:1px; background:${T.line}; margin:6px 4px"></div>
      <div class="small muted" style="padding:6px 10px 8px; line-height:1.45">Export enthält Fondsname, ISIN, Datenstand und Quelle FWW.</div>
    </div>`;
  const note = (n, title, text) => `<div style="display:flex; gap:12px; align-items:flex-start"><span class="callout">${n}</span><div><div style="font-size:13px; font-weight:600">${title}</div><div class="small" style="color:${T.ink2}; line-height:1.5">${text}</div></div></div>`;
  return page(`
  <div style="width:1296px; padding:24px; background:${T.bg}; box-sizing:border-box; display:flex; flex-direction:column; gap:24px">
    <div style="display:flex; flex-direction:column; gap:4px"><div style="font-size:18px; font-weight:600">Wiederverwendbares Widget-Muster</div><div class="muted">Jedes FWW-Widget nutzt denselben Rahmen: Titel mit Erklärung, Datenstand und Quelle, Vergrößern, Download. Steuerelemente stehen immer in der Zeile darunter, der Inhalt beginnt erst danach.</div></div>
    <div style="display:grid; grid-template-columns: 1fr 380px; gap:24px; align-items:start">
      <div style="position:relative">
        <div class="wgt" style="min-height:300px">
          <div class="wgt-head">
            <div class="wgt-title" style="position:relative"><span>Titel des Widgets</span><span style="color:${T.faint}; display:flex">${I.info()}</span><span class="callout" style="position:absolute; left:-34px; top:-1px">1</span></div>
            <div class="wgt-meta" style="position:relative">
              <div class="stand">${I.calendar(13)}<span>Datenstand 31.07.2025</span><span style="color:${T.line2}">·</span><span>Quelle: FWW</span></div>
              <div class="ibtn">${I.expand()}</div>
              <div class="ibtn" style="border-color:${T.blue}; color:${T.blue}; background:${T.blueSoft}">${I.download()}</div>
              <span class="callout" style="position:absolute; left:-4px; top:-30px">2</span>
              <span class="callout" style="position:absolute; right:44px; top:-30px">3</span>
              <span class="callout" style="position:absolute; right:4px; top:-30px">4</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px; position:relative"><span class="callout" style="position:absolute; left:-34px">5</span><div class="seg"><div class="on">Option A</div><div>Option B</div><div>Option C</div></div><span class="small muted">Steuerzeile: Dimension, Zeitraum, Vergleich oder Ereignis</span></div>
          <div style="height:150px; border:1px dashed ${T.line2}; border-radius:10px; background:${T.bg}; display:flex; align-items:center; justify-content:center; color:${T.faint}; font-size:12px; position:relative"><span class="callout" style="position:absolute; left:-34px; top:0">6</span>Inhalt: Chart, Legende, Tabelle</div>
        </div>
        <div style="position:absolute; right:24px; top:66px">${menu}</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px; padding-top:6px">
        ${note(1, 'Titel + Erklärung', 'Ein Info-Icon öffnet einen kurzen Tooltip, was die Kennzahl misst und wie FWW sie berechnet.')}
        ${note(2, 'Datenstand + Quelle', 'Immer sichtbar, immer an derselben Stelle. Format TT.MM.JJJJ. Bei Rendite entspricht er dem letzten geladenen Datenpunkt. Überschreitet das Alter den Schwellwert, wird der Chip zum Frische-Hinweis:')}
        <div style="margin-left:34px; display:flex; flex-direction:column; align-items:flex-start; gap:6px"><div class="stand" style="background:#FEF3C7; color:#92400E">${ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 13)}<span>Datenstand 28.02.2025</span><span style="opacity:.5">·</span><span>älter als 90 Tage</span></div><span class="small muted">FWW-Badge nur auf Chart-Widgets, nicht in Standardansichten</span></div>
        ${note(3, 'Vergrößern', 'Öffnet das Widget als Pop-up (siehe Artboard „Pop-up“) mit identischen Steuerelementen und mehr Platz für Chart und Legende.')}
        ${note(4, 'Download', 'Ein Menü, zwei Gruppen: Grafik (JPEG, PPTX) und Daten (XLSX, CSV). Der Export übernimmt die aktuelle Auswahl des Widgets.')}
        ${note(5, 'Steuerzeile', 'Segment-Control für exklusive Auswahl (Dimension, Zeitraum, Ereignis), Chips mit Checkbox für Mehrfachauswahl (Vergleichsreihen).')}
        ${note(6, 'Inhalt', 'Linien 2 px, Raster als Haarlinie, Legende bei ≥ 2 Reihen, Endwerte direkt beschriftet. Farben folgen der Reihe, nie der Reihenfolge.')}
      </div>
    </div>
  </div>`);
}

/* ───────────────── Pop-up (enlarged widget) ───────────────── */
function popupBoard() {
  return page(`
  <div style="width:1440px; height:900px; position:relative; background:${T.bg}; overflow:hidden">
    <div style="position:absolute; inset:0; opacity:.5; filter:blur(1px)"><div style="height:56px; background:${T.blue}"></div><div style="margin:20px; height:800px; background:#fff; border-radius:12px; border:1px solid ${T.line}"></div></div>
    <div style="position:absolute; inset:0; background:rgba(28,33,48,.45)"></div>
    <div style="position:absolute; left:80px; top:60px; width:1280px; background:#fff; border-radius:16px; box-shadow:0 24px 64px rgba(28,33,48,.30); display:flex; flex-direction:column; box-sizing:border-box">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 28px 0">
        <div style="display:flex; flex-direction:column; gap:2px"><div style="font-size:12px; color:${T.muted}">JPMorgan Funds – Europe Equity Plus Fund · LU0289214628</div><div style="font-size:18px; font-weight:600">Renditeentwicklung</div></div>
        <div style="display:flex; align-items:center; gap:8px">
          <div class="stand">${I.calendar(13)}<span>Datenstand 31.07.2025</span><span style="color:${T.line2}">·</span><span>Quelle: FWW</span></div>
          <div class="btn sec" style="height:32px; padding:0 12px; font-size:12px">${I.download(14)}Download</div>
          <div class="ibtn" style="margin-left:8px">${I.x()}</div>
        </div>
      </div>
      <div style="padding:20px 28px 28px; display:flex; flex-direction:column; gap:16px">
        ${renditeControls({ trigger: 'loaded' })}
        ${renditeChart({ w: 1224, h: 520, series: [S_FONDS, S_PEER, S_BENCH], ticksX: TICKS3J })}
        <div style="display:flex; justify-content:space-between; align-items:center">${legend([S_FONDS, S_PEER, S_BENCH])}<div class="small muted">Kumulierte Wertentwicklung in EUR, indexiert auf 0 % zum 01.08.2022 · BVI-Methode</div></div>
      </div>
    </div>
  </div>`);
}

/* ───────────────── Empty states ───────────────── */
function emptyBoard() {
  const emptyWidget = (title, msg, sub) => `
    <div class="wgt" style="flex:1">
      ${widgetHead(title, { stand: '–', off: true })}
      <div style="min-height:260px; border-radius:10px; background:${T.bg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center; padding:24px">
        <div style="color:${T.faint}">${I.noData(40)}</div>
        <div style="font-size:14px; font-weight:600">${msg}</div>
        <div class="small muted" style="max-width:420px; line-height:1.5">${sub}</div>
      </div>
    </div>`;
  return page(`
  <div style="width:1296px; padding:24px; background:${T.bg}; box-sizing:border-box; display:flex; flex-direction:column; gap:24px">
    <div style="display:flex; flex-direction:column; gap:4px"><div style="font-size:18px; font-weight:600">Leerzustände – Fonds ohne FWW-Daten</div><div class="muted">Das Widget bleibt an seinem Platz, damit sich das Layout des Tabs nicht verschiebt. Vergrößern und Download sind deaktiviert, der Datenstand zeigt „–“. Der Text nennt, was stattdessen verfügbar ist.</div></div>
    <div style="display:flex; gap:20px">
      ${emptyWidget('Allokationsdaten', 'Keine FWW-Allokationsdaten für diesen Fonds', 'FWW liefert für diesen Fonds derzeit keine Aufschlüsselung nach Sektoren, Ländern oder Währungen. Die Über-/Untergewichtung links basiert auf FondsConsult-Daten und bleibt verfügbar.')}
      ${emptyWidget('Crash Drawdowns', 'Keine FWW-Kurshistorie für Krisenzeiträume', 'Der Fonds wurde nach dem letzten der sechs Ereignisse aufgelegt (Auflagedatum 14.03.2023). Krisenkennzahlen werden angezeigt, sobald ein Ereignis im Track Record liegt.')}
    </div>
    <div class="wgt">
      ${widgetHead('Renditeentwicklung')}
      ${renditeControls({ trigger: 'idle', sektorDisabled: true })}
      <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; background:${T.band}; color:${T.ink2}; font-size:12px">${I.info(14)}<span><strong>FWW Sektordurchschnitt nicht verfügbar:</strong> FWW ordnet diesem Fonds keinen Sektor zu. Peergroup und Benchmark können weiterhin geladen werden.</span></div>
      <div style="height:200px; border:1px dashed ${T.line2}; border-radius:10px; background:${T.bg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center">
        <div style="font-size:14px; font-weight:600">Zeitraum und Vergleich wählen, dann Rendite laden</div>
        <div class="btn pri">${I.download(15)}Rendite laden</div>
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:10px">
      <div style="display:flex; align-items:baseline; gap:12px"><span class="lbl" style="color:${T.blue}">Dokumente · Fonds ohne Sponsoring</span><span class="small muted">Die Research-Sektion bleibt sichtbar und erklärt sich, statt zu verschwinden.</span></div>
      <div class="wgt" style="gap:0; padding:20px 12px 4px">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0 12px 14px"><div class="wgt-title"><span>Research von FondsConsult</span></div><div class="small muted">Nur für Fonds mit FondsConsult-Sponsoring</div></div>
        <div style="display:flex; align-items:center; gap:12px; padding:18px 12px; border-top:1px solid ${T.line}; color:${T.muted}">${I.info(16)}<span>Für diesen Fonds liegt kein FondsConsult-Fondsportrait vor. Die Einschätzung finden Sie im Tab <a href="#">Einschätzung</a>.</span></div>
      </div>
    </div>
  </div>`);
}

/* ───────────────── write files ───────────────── */
const files = {
  'Main.dc.html': main(),
  'Rendite.dc.html': tabShell('Rendite', `<div style="display:flex; flex-direction:column; gap:16px"><div style="color:${T.ink2}; max-width:980px">In diesem Abschnitt erhalten Sie eine schnelle Einschätzung der historisch erzielten Rendite des Fonds über kurz-, mittel- und langfristige Zeiträume. Die Renditeentwicklung von FWW ergänzt diese Sicht um den zeitlichen Verlauf – Zeitraum und Vergleichsreihen wählen, dann gezielt laden.</div><div style="display:grid; grid-template-columns: 400px 1fr; gap:20px; align-items:start">${sfbRenditePanel()}${renditeWidget({ w: 786, tipAt: 0.4 })}</div></div>`),
  'RenditeStates.dc.html': renditeStates(),
  'CrashDrawdowns.dc.html': tabShell('Crash Drawdowns', `<div style="display:flex; flex-direction:column; gap:16px"><div style="color:${T.ink2}; max-width:980px">Wie hat sich der Fonds in den großen Marktkrisen verhalten? Wählen Sie eines der sechs Ereignisse, um Drawdown, Erholung und die SFB-Bewertung des Krisenverhaltens zu sehen.</div>${crashWidget()}</div>`),
  'Dokumente.dc.html': tabShell('Dokumente', dokumenteTab()),
  'WidgetPattern.dc.html': patternBoard(),
  'Popup.dc.html': popupBoard(),
  'EmptyState.dc.html': emptyBoard(),
};
for (const [f, html] of Object.entries(files)) writeFileSync(new URL(f, import.meta.url), html);

const canvas = {
  artboards: [
    { file: 'Main.dc.html', title: 'SFB Fund Detail · Sektoren/Regionen mit Allokationsdaten', x: 0, y: 0, w: 1440, h: 1300 },
    { file: 'WidgetPattern.dc.html', title: 'Wiederverwendbares Widget-Muster + Download', x: 1560, y: 0, w: 1296, h: 740 },
    { file: 'EmptyState.dc.html', title: 'Leerzustände ohne FWW-Daten', x: 1560, y: 880, w: 1296, h: 1180 },
    { file: 'Rendite.dc.html', title: 'Rendite · Renditeentwicklung (geladen)', x: 0, y: 1440, w: 1296, h: 820 },
    { file: 'RenditeStates.dc.html', title: 'Rendite · Trigger-Zustände A/B/C', x: 0, y: 2320, w: 1296, h: 1840 },
    { file: 'CrashDrawdowns.dc.html', title: 'Crash Drawdowns', x: 1560, y: 2140, w: 1296, h: 760 },
    { file: 'Dokumente.dc.html', title: 'Dokumente · neuer Tab', x: 1560, y: 3040, w: 1296, h: 810 },
    { file: 'Popup.dc.html', title: 'Pop-up · vergrößertes Widget', x: 1560, y: 3990, w: 1440, h: 900 },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -260, w: 520, text: 'FC-1012 · FWW-Integration SFB\nWidgets: Allokationsdaten, Renditeentwicklung, Crash Drawdowns, Dokumente-Tab.\nGestaltet auf Basis des Client-Decks „FWW Integration SFB V1“ und der aktuellen SFB-Screens. Tab-Leiste und Panel-Rahmen übernehmen später 1:1 das Private-Markets-Design (FC-1004) – die Widgets sind davon unabhängig. Alle Zahlen sind Beispieldaten.' },
    { id: 'pie-rule', x: 560, y: -260, w: 420, text: 'Allokationsdaten: maximal 7 Segmente + „Sonstige (n)“, damit das Kreisdiagramm lesbar bleibt. Für „Einzeltitel“ (Top 10) empfehlen wir dieselbe Legendenliste mit Balken statt Kreis – Werte liegen zu nah beieinander.' },
    { id: 'trigger', x: 0, y: 4200, w: 620, text: 'Trigger-Control (Rendite): Kein Auto-Load beim Öffnen des Tabs. Zustände: A Pre-fetch → B Laden → geladen. Jede Änderung von Zeitraum oder Vergleich setzt den Button wieder auf „Rendite laden“ und dimmt den alten Chart (C). Ein Abruf = ein cachebarer Key aus ISIN + Zeitraum + Reihen.' },
    { id: 'docs', x: 1560, y: 3880, w: 640, text: 'Vorschlag Fonds- vs. ISIN-Ebene: Ein Anteilsklassen-Selector oben im Tab, vorbelegt mit der ISIN aus der Fondsliste. Jede Zeile trägt ein Ebene-Tag. Fondsebene (Jahres-/Halbjahresbericht, Verkaufsprospekt, Fondsportrait) gilt für alle Klassen und wechselt nicht mit. Anteilsklassen-Ebene (PRIIPS-KID) wechselt mit der ISIN; „weitere Anteilsklassen“ klappt die übrigen KIDs inline auf.' },
    { id: 'pattern', x: 2900, y: 0, w: 380, text: 'Ein Muster für alle FWW-Widgets: Kopfzeile (Titel · Datenstand+Quelle · Vergrößern · Download) → Steuerzeile → Inhalt. Download-Menü in zwei Gruppen: Grafik (JPEG, PPTX) und Daten (XLSX, CSV).' },
  ],
  launch: { view: 'canvas' },
};
writeFileSync(new URL('canvas.json', import.meta.url), JSON.stringify(canvas, null, 2));
console.log('wrote', Object.keys(files).length, 'artboards + canvas.json');
