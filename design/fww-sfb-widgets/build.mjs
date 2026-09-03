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
      <div class="stand">${I.calendar(13)}<span>Datenstand ${stand}</span><span style="color:${T.line2}">·</span><span>Source: FWW</span></div>
      <div class="ibtn${off ? ' off' : ''}" title="Enlarge">${I.expand()}</div>
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
const fmt = (n, d = 1) => n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
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
      <text x="${bx + 12}" y="${by + 18}" font-size="11" fill="${T.muted}" font-family="Inter, Arial">31.03.2024 · cumulative</text>
      ${rows.map((s, i) => `<circle cx="${bx + 17}" cy="${by + 36 + i * 20}" r="4" fill="${s.c}"/><text x="${bx + 28}" y="${by + 40 + i * 20}" font-size="12" fill="${T.ink}" font-family="Inter, Arial">${s.name}</text><text x="${bx + 256}" y="${by + 40 + i * 20}" font-size="12" font-weight="600" text-anchor="end" fill="${T.ink}" font-family="Inter, Arial" style="font-variant-numeric: tabular-nums">${s.v > 0 ? '+' : ''}${fmt(s.v)} ${unit}</text>`).join('')}</g>`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block; max-width:100%">${grid.join('')}${xt.join('')}${paths.join('')}${endLabels.join('')}${tip}</svg>`;
}

const N = 37; // monthly points, 3 years
const fondsVals = walk(7, N, 1.05, 6.5); const peerVals = walk(3, N, 0.68, 5.8); const benchVals = walk(11, N, 0.86, 6.0);
const rescale = (arr, end) => { const k = end / arr.at(-1); return arr.map(v => v * k); };
const S_FONDS = { name: 'JPM Europe Equity Plus', short: 'Fund', c: T.s1, w: 2.5, vals: rescale(fondsVals, 38.2) };
const S_PEER = { name: 'FondsConsult Peergroup', short: 'Peer group', c: T.s2, vals: rescale(peerVals, 24.9) };
const S_BENCH = { name: 'Benchmark (ETF)', short: 'Benchmark', c: T.s3, vals: rescale(benchVals, 31.5) };
const TICKS3J = ['08/2022', '02/2023', '08/2023', '02/2024', '08/2024', '02/2025', '07/2025'];


/* ───────────────── tab bar (Private Markets target design, FC-1004) ───────────────── */
const TAB_ICONS = {
  'Stammdaten': '<path d="M4 6h16M4 12h16M4 18h10"/>',
  'Sektoren/Regionen': '<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  'Portfoliocharakteristika': '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  'Rendite': '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  'Risiko': '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  'Aktives Management': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  'Crash Drawdowns': '<path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/>',
  'ESG': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 20 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.5 5-6.5"/>',
  'Anteilsklassen': '<path d="M12 2l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/>',
  'Peergroup': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M21.5 19a5 5 0 0 0-5-5"/>',
  'Dokumente': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
};
const TABS = ['Stammdaten', 'Sektoren/Regionen', 'Portfoliocharakteristika', 'Rendite', 'Risiko', 'Aktives Management', 'Crash Drawdowns', 'ESG', 'Anteilsklassen', 'Peergroup', 'Dokumente'];
const tabBar = (active) => `
  <div style="display:flex; align-items:center; justify-content:space-between; gap:2px; padding:4px; border-radius:999px; background:${T.band}">
    ${TABS.map(t => { const on = t === active; return `<div style="display:flex; align-items:center; gap:6px; height:30px; padding:0 ${on ? 14 : 9}px; border-radius:999px; font-size:11.5px; font-weight:${on ? 600 : 500}; color:${on ? '#fff' : T.blue}; background:${on ? T.blue : 'transparent'}; white-space:nowrap">${ico(TAB_ICONS[t], 13, 1.8)}<span>${t}</span>${t === 'Dokumente' && !on ? `<span class="neu" style="margin-left:2px">NEU</span>` : ''}${t === 'Dokumente' && on ? `<span class="neu" style="margin-left:2px; background:rgba(255,255,255,.22); color:#fff">NEU</span>` : ''}</div>`; }).join('')}
  </div>`;

/* ───────────────── the legend row for line charts ───────────────── */
const legend = (items) => `<div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap">${items.map(i => `<div style="display:flex; align-items:center; gap:8px; font-size:12px; color:${T.ink2}"><span style="width:14px; height:3px; border-radius:2px; background:${i.c}"></span>${i.name}</div>`).join('')}</div>`;

/* ───────────────── ALLOKATION widget ───────────────── */
const SEKTOREN = [
  { n: 'Financials', v: 22.4, c: T.s1 }, { n: 'Industrials', v: 16.8, c: T.s2 }, { n: 'Health Care', v: 14.1, c: T.s3 },
  { n: 'Consumer Discretionary', v: 11.2, c: T.s4 }, { n: 'Information Technology', v: 9.7, c: T.s5 }, { n: 'Consumer Staples', v: 8.3, c: T.s6 },
  { n: 'Energy', v: 6.1, c: T.s7 }, { n: 'Other (4)', v: 11.4, c: T.other },
];
function allokationWidget({ dim = 'Sektoren', slices = SEKTOREN } = {}) {
  const dims = ['Sektoren', 'Länder', 'Währungen', 'Einzeltitel', 'Asset classes'];
  return `
  <div class="wgt" style="flex:1; min-width:0">
    ${widgetHead('Allokationsdaten')}
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px">
      <div class="seg">${dims.map(d => `<div class="${d === dim ? 'on' : ''}">${d}</div>`).join('')}</div>
      <div class="small muted">Share of net fund assets</div>
    </div>
    <div style="display:flex; gap:32px; align-items:center">
      <div style="position:relative; width:260px; height:260px; flex:none">
        <svg width="260" height="260" viewBox="0 0 260 260" style="display:block">${donut(slices)}</svg>
        <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; pointer-events:none">
          <div style="font-size:11px; color:${T.muted}">Top 3</div>
          <div style="font-size:22px; font-weight:600; letter-spacing:-.01em">${fmt(slices[0].v + slices[1].v + slices[2].v)} %</div>
          <div style="font-size:11px; color:${T.muted}">${slices.length - 1} + Other</div>
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
    <div style="display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:8px; background:${T.bg}; font-size:12px; color:${T.ink2}"><span style="color:${T.faint}; display:flex">${I.info(14)}</span><span>Active-extension fund: long <strong class="num">128.4 %</strong> · short <strong class="num">−28.4 %</strong> · net <strong class="num">100.0 %</strong>. Shares refer to net exposure; short positions are shown in each segment's tooltip.</span></div>
  </div>`;
}

/* ───────────────── Über-/Untergewichtung (existing SFB panel, redrawn from the deck) ───────────────── */
function gewichtung() {
  const block = (dir, arrow, laender, regionen, sektoren) => `
    <div style="display:flex; flex-direction:column; gap:12px">
      <div style="display:flex; align-items:center; gap:10px; height:38px; padding:0 12px; border:1px solid ${T.line}; border-radius:999px; font-size:13px; font-weight:500"><span style="width:22px; height:22px; border-radius:999px; background:${T.blue}; color:#fff; display:flex; align-items:center; justify-content:center">${arrow}</span>${dir}</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px 16px; padding:0 4px">
        <div><div class="lbl">Countries</div><div style="font-size:13px; font-weight:600; margin-top:3px">${laender}</div></div>
        <div style="text-align:right"><div class="lbl">Regions</div><div style="font-size:13px; font-weight:600; margin-top:3px">${regionen}</div></div>
        <div style="grid-column:1 / -1"><div class="lbl">Sectors</div><div style="font-size:13px; font-weight:600; margin-top:3px">${sektoren}</div></div>
      </div>
    </div>`;
  return `
  <div class="card" style="flex:0 0 440px; border:1.5px solid ${T.blue}; padding:26px 18px 18px; position:relative; display:flex; flex-direction:column; gap:20px; align-self:flex-start">
    <div style="position:absolute; left:16px; top:-14px; background:${T.blue}; color:#fff; font-size:11px; font-weight:600; padding:6px 12px; border-radius:999px; display:flex; align-items:center; gap:6px">Smart Fund Benchmarking ${I.info(12)}</div>
    ${block('Overweight', ico('<path d="M12 19V5M5 12l7-7 7 7"/>', 12, 2.5), 'France, Netherlands', 'Euro area', 'Financials, Industrials, Consumer Discretionary')}
    ${block('Underweight', ico('<path d="M12 5v14M5 12l7 7 7-7"/>', 12, 2.5), 'United Kingdom, Switzerland', 'Europe ex Euro', 'Consumer Staples, Utilities')}
    <div class="small muted" style="padding:0 4px">Significant from ± 5 pp vs. peer group average · Datenstand 30.06.2025</div>
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
        <div class="th" style="padding-left:0; font-size:10px; letter-spacing:.02em">Horizon</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Short-term</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Mid-term</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Long-term</div><div class="th" style="text-align:center; padding:0 0 10px; font-size:10px; letter-spacing:.02em">Trend</div>
        <div style="font-size:13px; font-weight:600; padding:8px 0; border-top:1px solid ${T.line}">Return</div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span class="pill g-soft" style="height:26px; padding:0 12px">Gut</span></div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span class="pill g-strong" style="height:26px; padding:0 12px">Sehr Gut</span></div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span class="pill g-strong" style="height:26px; padding:0 12px">Sehr Gut</span></div>
        <div style="display:flex; justify-content:center; padding:8px 0; border-top:1px solid ${T.line}"><span style="width:24px; height:24px; border-radius:999px; background:${T.gSoft}; color:${T.gText}; display:flex; align-items:center; justify-content:center">${ico('<path d="M4 17l6-6 4 4 6-8"/>', 14, 2.2)}</span></div>
      </div>
    </div>
    <div class="wgt" style="gap:12px; padding:18px 18px 14px">
      <div class="wgt-head"><div class="wgt-title" style="font-size:14px">Return (annualised)</div><div class="stand" style="height:26px">Datenstand 31.07.2025</div></div>
      <div style="display:grid; grid-template-columns: 1fr 70px 70px 70px; gap:0 12px; align-items:center">
        <div></div>${th('1 Y')}${th('3 Y p.a.')}${th('5 Y p.a.')}
        <div style="font-size:13px; font-weight:600; padding:10px 0; border-top:1px solid ${T.line}">Fund</div>${cell('12.04 %', true)}${cell('11.26 %', true)}${cell('9.81 %', true)}
        <div style="font-size:13px; color:${T.muted}; padding:10px 0; border-top:1px solid ${T.line}">Peer group average</div>${cell('9.12 %')}${cell('7.71 %')}${cell('6.90 %')}
      </div>
    </div>
  </div>`;
}

/* ───────────────── RENDITE widget ───────────────── */
const windows = ['1 month', '6 months', '1 year', '3 years', '5 years', '10 years', 'Custom'];
const compareChips = (state = { peer: true, bench: true, sektor: false }, { sektorDisabled = false } = {}) => `
  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
    <span class="small muted" style="margin-right:2px">Compare with</span>
    <div class="chip ${state.peer ? 'on' : ''}"><span class="cb ${state.peer ? 'on' : ''}" style="color:#fff">${state.peer ? I.check() : ''}</span><span class="dot" style="background:${T.s2}"></span>FondsConsult Peergroup</div>
    <div class="chip ${state.bench ? 'on' : ''}"><span class="cb ${state.bench ? 'on' : ''}" style="color:#fff">${state.bench ? I.check() : ''}</span><span class="dot" style="background:${T.s3}"></span>Benchmark (ETF)</div>
    ${sektorDisabled
      ? `<div class="chip dis" title="No FWW sector assigned"><span class="cb" style="border-style:dashed"></span><span class="dot" style="background:${T.line2}"></span>FWW Sektordurchschnitt<span style="display:flex; color:${T.faint}">${I.lock()}</span></div>`
      : `<div class="chip ${state.sektor ? 'on' : ''}"><span class="cb ${state.sektor ? 'on' : ''}" style="color:#fff">${state.sektor ? I.check() : ''}</span><span class="dot" style="background:${T.s7}"></span>FWW Sektordurchschnitt</div>`}
  </div>`;
const windowSeg = (on = '3 years') => `<div class="seg">${windows.map(w => `<div class="${w === on ? 'on' : ''}">${w}</div>`).join('')}</div>`;

function renditeControls({ on = '3 years', trigger = 'loaded', state, sektorDisabled } = {}) {
  const btn = {
    idle: `<div class="btn pri">${I.download(15)}Load returns</div>`,
    loading: `<div class="btn pri" style="opacity:.85">${I.spinner()}Loading …</div>`,
    loaded: `<div style="display:flex; align-items:center; gap:12px"><span class="small muted">Loaded: 3 years · 3 series</span><div class="btn sec">Refresh</div></div>`,
    stale: `<div style="display:flex; align-items:center; gap:12px"><span class="small" style="color:${T.s4}; display:flex; align-items:center; gap:6px">${I.info(13)}Selection changed</span><div class="btn pri">${I.download(15)}Load returns</div></div>`,
  }[trigger];
  return `
  <div style="display:flex; align-items:center; justify-content:space-between; gap:12px 16px; flex-wrap:wrap">
    <div style="display:flex; align-items:center; gap:10px"><span class="small muted">Period</span>${windowSeg(on)}</div>
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
        <div class="small muted">Cumulative performance in EUR, indexed to 0 % on 01.08.2022 · BVI method</div>
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
        <div style="font-size:14px; font-weight:600">Choose a period and comparison, then load returns</div>
        <div class="small muted" style="max-width:460px">Performance data is fetched only when you click – every request stays deliberate and fast. Preset: 3 years, peer group and benchmark.</div>
        <div class="btn pri" style="margin-top:6px">${I.download(15)}Load returns</div>
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
          <div style="background:#fff; border:1px solid ${T.line}; border-radius:999px; padding:8px 16px 8px 12px; display:flex; align-items:center; gap:10px; box-shadow:0 4px 16px rgba(28,33,48,.08); font-size:12px; color:${T.ink2}"><span style="color:${T.blue}; display:flex">${I.spinner(16)}</span>Fetching 3-year returns from FWW …</div>
        </div>
      </div>
    </div>`;
  const stale = `
    <div class="wgt">
      ${widgetHead('Renditeentwicklung')}
      ${renditeControls({ trigger: 'stale', on: 'Custom', state: { peer: true, bench: true, sektor: true } })}
      <div style="display:flex; align-items:center; gap:10px; padding:12px 14px; border:1px solid ${T.line}; border-radius:10px; background:${T.bg}">
        <span class="small muted">Custom period</span>
        <div style="display:flex; align-items:center; gap:8px; height:34px; padding:0 12px; border:1px solid ${T.line2}; border-radius:8px; background:#fff; font-size:13px">${I.calendar(14)}<span class="num">01.01.2020</span></div>
        <span class="muted">to</span>
        <div style="display:flex; align-items:center; gap:8px; height:34px; padding:0 12px; border:1.5px solid ${T.blue}; border-radius:8px; background:#fff; font-size:13px; box-shadow:0 0 0 3px ${T.blueSoft}">${I.calendar(14)}<span class="num">31.07.2025</span></div>
        <span class="small muted">Max. 15 years · earliest data point 25.06.2007</span>
      </div>
      <div style="position:relative; border-radius:10px; overflow:hidden">
        <div style="opacity:.35; filter:saturate(.4)">${renditeChart({ series: [S_FONDS, S_PEER, S_BENCH], ticksX: TICKS3J, h: 260, tooltip: false })}</div>
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center">
          <div style="background:#fff; border:1px solid ${T.line}; border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:16px; box-shadow:0 8px 24px rgba(28,33,48,.10)">
            <div><div style="font-size:13px; font-weight:600">The chart still shows the last request (3 years)</div><div class="small muted">Load returns again to see 01.01.2020 – 31.07.2025 with 4 series.</div></div>
            <div class="btn pri">${I.download(15)}Load returns</div>
          </div>
        </div>
      </div>
    </div>`;
  return page(`
  <div style="width:1296px; padding:24px; background:${T.bg}; display:flex; flex-direction:column; gap:36px; box-sizing:border-box">
    <div style="display:flex; flex-direction:column; gap:4px"><div style="font-size:18px; font-weight:600">Renditeentwicklung – states of the trigger control</div><div class="muted">Data is never fetched automatically when the tab opens. The user picks a period and comparison series, then triggers the request deliberately.</div></div>
    ${frame('A · Pre-fetch', 'Tab opened, no request sent to FWW yet. The primary button appears twice: in the control row and in the empty chart area.', prefetch)}
    ${frame('B · Loading', 'Button locked with a spinner, skeleton chart keeps the final proportions, controls stay readable.', loading)}
    ${frame('C · Selection changed / custom period', 'The previous chart stays visible but dimmed (no layout jump); the prompt names the new selection. Date fields show their limits.', stale)}
  </div>`);
}

/* ───────────────── CRASH DRAWDOWNS ───────────────── */
function crashWidget() {
  const events = [['Global financial crisis', '2007 – 2009'], ['Euro crisis', '2011'], ['China Crash', '2015 – 2016'], ['US–China trade war', '2018'], ['Corona crisis', '2020'], ['Russia–Ukraine war', '2022']];
  const active = 'Corona crisis';
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
    <text x="${(x0 + 8)}" y="${y0 + 14}" font-size="11" fill="${T.rText}" font-family="Inter, Arial" font-weight="600">Drawdown phase · 24 trading days</text>
    ${area}
    <path d="${linePath(peer, x0, x1, y0, y1, vmin, vmax)}" fill="none" stroke="${T.s2}" stroke-width="2" stroke-linejoin="round"/>
    <path d="${linePath(fonds, x0, x1, y0, y1, vmin, vmax)}" fill="none" stroke="${T.s1}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${xMin.toFixed(1)}" cy="${yMin.toFixed(1)}" r="5" fill="${T.s1}" stroke="#fff" stroke-width="2"/>
    <text x="${(xMin + 10).toFixed(1)}" y="${(yMin + 14).toFixed(1)}" font-size="12" font-weight="600" fill="${T.ink}" font-family="Inter, Arial">−33.8 % fund</text>
    <text x="${(xMin + 10).toFixed(1)}" y="${(yMin + 28).toFixed(1)}" font-size="11" fill="${T.muted}" font-family="Inter, Arial">Trough 23.03.2020</text>
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
          <div class="kv"><span class="muted">Period</span><span class="num" style="font-weight:600">19.02.2020 – 23.03.2020</span></div>
          <div class="kv"><span class="muted">Drawdown fund</span><span class="num" style="font-weight:600; color:${T.rText}">−33.8 %</span></div>
          <div class="kv"><span class="muted">Drawdown peer group</span><span class="num" style="font-weight:600">−35.6 %</span></div>
          <div class="kv"><span class="muted">Relative to peer group</span><span class="num" style="font-weight:600; color:${T.gText}">+1.8 pp</span></div>
          <div class="kv"><span class="muted">Recovery to pre-crisis level</span><span class="num" style="font-weight:600">142 days</span></div>
          <div class="kv"><span class="muted">Smart Fund Benchmarking</span><span class="pill g-soft" style="height:26px">Gut</span></div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
          <div style="display:flex; flex-direction:column; gap:6px"><div class="lbl">Ereignisse · Events</div><div style="font-size:13px; color:${T.ink2}; line-height:1.55">The global spread of COVID-19 triggered the fastest bear market in history from 19.02.2020. Lockdowns, an oil price collapse and liquidity squeezes cut European equities by more than a third within 24 trading days.</div></div>
          <div style="display:flex; flex-direction:column; gap:6px"><div class="lbl">Folgen · Consequences for the fund</div><div style="font-size:13px; color:${T.ink2}; line-height:1.55">With a net long position of about 100 % the fund largely tracked the market; gains from the short book cushioned the decline by 1.8 pp versus the peer group. Thanks to the overweight in quality cyclicals the recovery was faster than average.</div></div>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px; min-width:0">
        <div style="display:flex; justify-content:space-between; align-items:center"><div style="font-size:13px; font-weight:600">Performance over the event window</div><div class="small muted">indexed to 0 % on 19.02.2020</div></div>
        ${chart}
        ${legend([{ name: 'JPM Europe Equity Plus', c: T.s1 }, { name: 'FondsConsult Peergroup', c: T.s2 }])}
      </div>
    </div>
  </div>`;
}

/* ───────────────── DOKUMENTE tab ───────────────── */
function dokumenteTab({ sponsored = true } = {}) {
  const scope = (kind) => kind === 'fund'
    ? `<span style="display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 10px; border-radius:999px; background:${T.graySoft}; color:${T.ink2}; font-size:11px; font-weight:600">${I.grid(12)}Fund level</span>`
    : `<span style="display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 10px; border-radius:999px; background:${T.blueSoft}; color:${T.blue}; font-size:11px; font-weight:600">${I.file(12)}Share class · LU0289214628</span>`;
  const row = (title, sub, kind, stand, lang, extra = '') => `
    <div style="display:grid; grid-template-columns: 40px 1fr 240px 120px 80px 180px; gap:12px; align-items:center; padding:14px 12px; border-top:1px solid ${T.line}">
      <div style="display:flex">${I.pdf(26)}</div>
      <div style="min-width:0"><div style="font-size:13px; font-weight:600">${title}</div><div class="small muted">${sub}</div>${extra}</div>
      <div>${scope(kind)}</div>
      <div class="num" style="font-size:13px">${stand}</div>
      <div style="font-size:13px">${lang}</div>
      <div style="display:flex; justify-content:flex-end; gap:8px"><div class="btn sec" style="height:32px; padding:0 12px; font-size:12px">${I.eye(14)}View</div><div class="btn pri" style="height:32px; padding:0 12px; font-size:12px">${I.download(14)}PDF</div></div>
    </div>`;
  const header = `<div style="display:grid; grid-template-columns: 40px 1fr 240px 120px 80px 180px; gap:12px; padding:0 12px 8px"><div></div><div class="th" style="padding:0">Document</div><div class="th" style="padding:0">Level</div><div class="th" style="padding:0">As of</div><div class="th" style="padding:0">Language</div><div></div></div>`;
  return `
  <div style="display:flex; flex-direction:column; gap:20px">
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:24px">
      <div style="max-width:720px; color:${T.ink2}">All documents for this fund in one place: FondsConsult research and the asset manager's regulatory documents. <strong>Fund-level</strong> documents apply to every share class; <strong>share-class-level</strong> documents refer to the selected ISIN.</div>
      <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end">
        <span class="lbl">Share class (ISIN)</span>
        <div style="display:flex; align-items:center; gap:10px; height:36px; padding:0 8px 0 14px; border:1px solid ${T.line2}; border-radius:8px; background:#fff; font-size:13px"><span class="num" style="font-weight:600">LU0289214628</span><span class="muted">A0MNZ2 · EUR · A (acc)</span>${I.chevron()}</div>
        <span class="small muted">5 share classes · preset to the ISIN from your fund list</span>
      </div>
    </div>

    <div class="wgt" style="gap:0; padding:20px 12px 4px">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0 12px 14px">
        <div class="wgt-title"><span>Research von FondsConsult</span><span class="pill" style="height:22px; padding:0 8px; font-size:11px; background:${T.band}; color:${T.blue}">Sponsored fund</span></div>
        <div class="small muted">Sponsored funds only</div>
      </div>
      ${header}
      ${sponsored
        ? row('Fondsportrait JPMorgan Funds – Europe Equity Plus Fund', 'Assessment, investment approach and management profile on 4 pages · 2.4 MB', 'fund', '07/2025', 'DE')
        : `<div style="display:flex; align-items:center; gap:12px; padding:18px 12px; border-top:1px solid ${T.line}; color:${T.muted}">${I.info(16)}<span>No FondsConsult Fondsportrait is available for this fund. The analyst assessment is in the <a href="#">Einschätzung</a> tab.</span></div>`}
    </div>

    <div class="wgt" style="gap:0; padding:20px 12px 4px">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0 12px 14px">
        <div class="wgt-title"><span>Allgemeine Dokumente des Asset Managers</span><span style="color:${T.faint}; display:flex">${I.info()}</span></div>
        <div class="stand">${I.calendar(13)}<span>Fetched 31.07.2025</span><span style="color:${T.line2}">·</span><span>Source: FWW</span></div>
      </div>
      ${header}
      ${row('PRIIPS-KID', 'Key information document · 3 pages · 180 KB', 'isin', '15.02.2025', 'DE', `<div style="margin-top:6px"><a href="#" style="font-size:12px; font-weight:500; display:inline-flex; align-items:center; gap:4px">Show for 4 other share classes ${I.chevron(12)}</a></div>`)}
      ${row('Jahresbericht', 'Audited annual report of the umbrella · 312 pages · 6.8 MB', 'fund', '31.12.2024', 'DE / EN')}
      ${row('Halbjahresbericht', 'Unaudited semi-annual report · 188 pages · 4.1 MB', 'fund', '30.06.2025', 'DE / EN')}
      ${row('Verkaufsprospekt', 'Incl. sub-fund specific section · 402 pages · 5.2 MB', 'fund', '03/2025', 'DE')}
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 12px 10px; border-top:1px solid ${T.line}"><div class="small muted">Documents are provided by the asset manager and refreshed daily via FWW.</div><div class="btn ghost" style="height:32px; padding:0 8px; font-size:12px">${I.download(14)}Download all 5 as ZIP</div></div>
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
    <div><div style="font-size:15px; font-weight:600">JPMorgan Funds – Europe Equity Plus Fund</div><div class="small muted">Equity Europe Large Cap Blend</div></div>
    <div style="display:flex; justify-content:center"><span style="background:${T.gStrong}; color:#fff; font-size:11px; font-weight:700; padding:6px 12px; clip-path:polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)">BUY</span></div>
    <div class="num" style="text-align:center; font-weight:700; font-size:14px">1 <span style="font-weight:400; font-size:11px; color:${T.muted}">/214</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-soft">Hoch</span></div>
    <div style="display:flex; justify-content:center"><span class="pill gray">Mittel</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-strong" style="line-height:1.1; text-align:center">Sehr<br>Gut</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-soft">Gut</span></div>
    <div style="display:flex; justify-content:center"><span class="pill g-strong">Sehr Gut</span></div>
    <div style="display:flex; justify-content:center"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="${T.line}" stroke-width="3"/><circle cx="20" cy="20" r="16" fill="none" stroke="${T.ink}" stroke-width="3" stroke-dasharray="${(0.43 * 100.5).toFixed(1)} 200" transform="rotate(-90 20 20)" stroke-linecap="round"/><text x="20" y="24" text-anchor="middle" font-size="11" fill="${T.ink}" font-family="Inter, Arial">43</text></svg></div>
    <div style="display:flex; justify-content:flex-end"><div class="btn pri" style="height:34px; padding:0 10px 0 16px; gap:10px">Actions ${I.grid(14)}</div></div>
  </div>`;
  const colHead = `
  <div style="display:grid; grid-template-columns: 24px 24px 1fr 84px 76px 96px 96px 96px 96px 110px 84px 118px; align-items:end; gap:8px; padding:0 20px 8px; font-size:11px; font-weight:600; color:${T.ink2}">
    <div></div><div style="width:16px; height:16px; border:1.5px solid ${T.line2}; border-radius:4px"></div><div>Name</div>
    <div style="text-align:center; line-height:1.2">Recommen-<br>dation</div><div style="text-align:center">Rank</div>
    <div style="text-align:center; color:${T.blue}; line-height:1.2">Fund<br>volume</div><div style="text-align:center; color:${T.blue}; line-height:1.2">Track<br>Record</div><div style="text-align:center; color:${T.blue}">Return</div><div style="text-align:center; color:${T.blue}">Risk</div><div style="text-align:center; color:${T.blue}; line-height:1.2">Active<br>management</div><div style="text-align:center; line-height:1.2">ESG<br>Credibility</div><div></div>
  </div>`;
  const einschaetzung = `
  <div style="padding:0 20px 20px; display:flex; flex-direction:column; gap:14px">
    <div style="display:flex; justify-content:space-between; align-items:center">
      <div class="tabs" style="border-bottom:0; gap:0"><div class="on" style="padding:6px 16px 6px 0; box-shadow:none">Einschätzung</div><div style="padding:6px 16px; border-left:1px solid ${T.line}">Investmentansatz</div><div style="padding:6px 16px; border-left:1px solid ${T.line}">Management Profil</div></div>
      <div class="ibtn">${I.print()}</div>
    </div>
    <div style="background:${T.bg}; border-radius:10px; padding:16px 20px 16px 52px; position:relative; font-size:12.5px; line-height:1.6; color:${T.ink2}">
      <div style="position:absolute; left:18px; top:18px; width:20px; height:20px; border-radius:5px; background:${T.blue}; color:#fff; display:flex; align-items:center; justify-content:center">${I.user(12)}</div>
      JPM Europe Equity Plus follows an “active extension” approach: the portfolio holds a 120 % – 140 % long position in European equities and a 20 % – 40 % short position, with net exposure normally at 100 %. The short book adds potential to generate alpha. Thanks to consistently excellent stock selection the management has delivered long-term outperformance against the MSCI Europe. We therefore assign a “Buy” rating.
    </div>
  </div>`;
  const sectionTabs = `<div style="padding:0 20px">${tabBar('Sektoren/Regionen')}</div>`;
  const content = `
  <div style="padding:20px 20px 24px; display:flex; flex-direction:column; gap:16px">
    <div style="color:${T.ink2}; max-width:1100px">This section shows the fund's sector and regional over-/underweights against its peer group average. The FWW Allokationsdaten widget adds the full breakdown by sector, country, currency and single holdings.</div>
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
          <div style="flex:0 0 560px; height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:10px; padding:0 16px; color:${T.faint}; font-size:13px">${I.search(16)} Search funds by ISIN, WKN or name…</div>
          ${['Asset class', 'Recommendation', 'Fund company'].map(f => `<div style="height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:8px; padding:0 18px; font-size:13px; font-weight:500">${f} ${I.chevron()}</div>`).join('')}
          <div style="height:44px; border:1px solid ${T.line2}; border-radius:999px; display:flex; align-items:center; gap:8px; padding:0 18px; font-size:13px; font-weight:500"><span style="width:14px; height:14px; border-radius:999px; border:1.5px solid ${T.line2}"></span> ETFs only</div>
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
          <div><div style="font-size:15px; font-weight:600">Templeton Emerging Markets Dynamic Income Fund</div><div class="small muted">Mixed fund Emerging Markets</div></div>
          <div style="display:flex; justify-content:center"><span style="background:${T.gStrong}; color:#fff; font-size:11px; font-weight:700; padding:6px 12px; clip-path:polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)">BUY</span></div>
          <div class="num" style="text-align:center; font-weight:700; font-size:14px">1 <span style="font-weight:400; font-size:11px; color:${T.muted}">/17</span></div>
          <div style="display:flex; justify-content:center"><span class="pill gray">Mittel</span></div><div style="display:flex; justify-content:center"><span class="pill g-soft">Lang</span></div><div style="display:flex; justify-content:center"><span class="pill g-strong" style="line-height:1.1; text-align:center">Sehr<br>Gut</span></div><div style="display:flex; justify-content:center"><span class="pill gray">Mittel</span></div><div style="display:flex; justify-content:center; color:${T.muted}">–</div><div style="display:flex; justify-content:center; color:${T.muted}">36</div>
          <div style="display:flex; justify-content:flex-end"><div class="btn pri" style="height:34px; padding:0 10px 0 16px; gap:10px">Actions ${I.grid(14)}</div></div>
        </div>
      </div>
    </div>
  </div>`);
}

/* ───────────────── Tab artboards ───────────────── */
const tabShell = (activeTab, inner, w = 1296) => page(`
  <div style="width:${w}px; background:#fff; padding:20px 20px 24px; box-sizing:border-box; border:1px solid ${T.line}; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; gap:20px">
    ${tabBar(activeTab)}
    <div>${inner}</div>
  </div>`);

/* ───────────────── Widget pattern + download menu ───────────────── */
function patternBoard() {
  const menu = `
    <div style="width:236px; background:#fff; border:1px solid ${T.line}; border-radius:10px; box-shadow:0 12px 32px rgba(28,33,48,.14); padding:6px; display:flex; flex-direction:column">
      <div class="lbl" style="padding:8px 10px 6px">Chart</div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px; background:${T.bg}"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.file(16)}Image (JPEG)</span><span class="small muted">1600 px</span></div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.file(16)}Slide (PPTX)</span><span class="small muted">16:9</span></div>
      <div style="height:1px; background:${T.line}; margin:6px 4px"></div>
      <div class="lbl" style="padding:8px 10px 6px">Data</div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.grid(16)}Table (XLSX)</span></div>
      <div style="display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:6px"><span style="display:flex; align-items:center; gap:10px; font-size:13px">${I.grid(16)}Raw data (CSV)</span></div>
      <div style="height:1px; background:${T.line}; margin:6px 4px"></div>
      <div class="small muted" style="padding:6px 10px 8px; line-height:1.45">Exports include fund name, ISIN, Datenstand and source FWW.</div>
    </div>`;
  const note = (n, title, text) => `<div style="display:flex; gap:12px; align-items:flex-start"><span class="callout">${n}</span><div><div style="font-size:13px; font-weight:600">${title}</div><div class="small" style="color:${T.ink2}; line-height:1.5">${text}</div></div></div>`;
  return page(`
  <div style="width:1296px; padding:24px; background:${T.bg}; box-sizing:border-box; display:flex; flex-direction:column; gap:24px">
    <div style="display:flex; flex-direction:column; gap:4px"><div style="font-size:18px; font-weight:600">Reusable widget pattern</div><div class="muted">Every FWW widget shares one frame: title with explanation, Datenstand and source, enlarge, download. Controls always sit in the row below; content starts after that.</div></div>
    <div style="display:grid; grid-template-columns: 1fr 380px; gap:24px; align-items:start">
      <div style="position:relative">
        <div class="wgt" style="min-height:300px">
          <div class="wgt-head">
            <div class="wgt-title" style="position:relative"><span>Widget title</span><span style="color:${T.faint}; display:flex">${I.info()}</span><span class="callout" style="position:absolute; left:-34px; top:-1px">1</span></div>
            <div class="wgt-meta" style="position:relative">
              <div class="stand">${I.calendar(13)}<span>Datenstand 31.07.2025</span><span style="color:${T.line2}">·</span><span>Source: FWW</span></div>
              <div class="ibtn">${I.expand()}</div>
              <div class="ibtn" style="border-color:${T.blue}; color:${T.blue}; background:${T.blueSoft}">${I.download()}</div>
              <span class="callout" style="position:absolute; left:-4px; top:-30px">2</span>
              <span class="callout" style="position:absolute; right:44px; top:-30px">3</span>
              <span class="callout" style="position:absolute; right:4px; top:-30px">4</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px; position:relative"><span class="callout" style="position:absolute; left:-34px">5</span><div class="seg"><div class="on">Option A</div><div>Option B</div><div>Option C</div></div><span class="small muted">Control row: dimension, period, comparison or event</span></div>
          <div style="height:150px; border:1px dashed ${T.line2}; border-radius:10px; background:${T.bg}; display:flex; align-items:center; justify-content:center; color:${T.faint}; font-size:12px; position:relative"><span class="callout" style="position:absolute; left:-34px; top:0">6</span>Content: chart, legend, table</div>
        </div>
        <div style="position:absolute; right:24px; top:66px">${menu}</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px; padding-top:6px">
        ${note(1, 'Title + explanation', 'An info icon opens a short tooltip on what the metric measures and how FWW calculates it.')}
        ${note(2, 'Datenstand + source', 'Always visible, always in the same spot. Format DD.MM.YYYY. For returns it equals the last loaded data point. Once the age exceeds the threshold the chip turns into a freshness warning:')}
        <div style="margin-left:34px; display:flex; flex-direction:column; align-items:flex-start; gap:6px"><div class="stand" style="background:#FEF3C7; color:#92400E">${ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 13)}<span>Datenstand 28.02.2025</span><span style="opacity:.5">·</span><span>older than 90 days</span></div><span class="small muted">FWW badge only on chart widgets, never in standard views</span></div>
        ${note(3, 'Enlarge', 'Opens the widget as a pop-up (see the Pop-up artboard) with identical controls and more room for chart and legend.')}
        ${note(4, 'Download', 'One menu, two groups: chart (JPEG, PPTX) and data (XLSX, CSV). The export uses the widget\'s current selection.')}
        ${note(5, 'Control row', 'Segmented control for exclusive choices (dimension, period, event); checkbox chips for multi-select (comparison series).')}
        ${note(6, 'Content', 'Lines 2 px, hairline grid, legend whenever ≥ 2 series, end values labelled directly. Colours belong to a series, never to its position.')}
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
          <div class="stand">${I.calendar(13)}<span>Datenstand 31.07.2025</span><span style="color:${T.line2}">·</span><span>Source: FWW</span></div>
          <div class="btn sec" style="height:32px; padding:0 12px; font-size:12px">${I.download(14)}Download</div>
          <div class="ibtn" style="margin-left:8px">${I.x()}</div>
        </div>
      </div>
      <div style="padding:20px 28px 28px; display:flex; flex-direction:column; gap:16px">
        ${renditeControls({ trigger: 'loaded' })}
        ${renditeChart({ w: 1224, h: 520, series: [S_FONDS, S_PEER, S_BENCH], ticksX: TICKS3J })}
        <div style="display:flex; justify-content:space-between; align-items:center">${legend([S_FONDS, S_PEER, S_BENCH])}<div class="small muted">Cumulative performance in EUR, indexed to 0 % on 01.08.2022 · BVI method</div></div>
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
    <div style="display:flex; flex-direction:column; gap:4px"><div style="font-size:18px; font-weight:600">Empty states – funds without FWW data</div><div class="muted">The widget keeps its place so the tab layout does not shift. Enlarge and download are disabled and the Datenstand shows “–”. The copy says what is available instead.</div></div>
    <div style="display:flex; gap:20px">
      ${emptyWidget('Allokationsdaten', 'No FWW allocation data for this fund', 'FWW currently provides no breakdown by sector, country or currency for this fund. The over-/underweight panel on the left is based on FondsConsult data and remains available.')}
      ${emptyWidget('Crash Drawdowns', 'No FWW price history for crisis periods', 'The fund was launched after the last of the six events (launch date 14.03.2023). Crisis metrics appear as soon as an event falls within the track record.')}
    </div>
    <div class="wgt">
      ${widgetHead('Renditeentwicklung')}
      ${renditeControls({ trigger: 'idle', sektorDisabled: true })}
      <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; background:${T.band}; color:${T.ink2}; font-size:12px">${I.info(14)}<span><strong>FWW Sektordurchschnitt unavailable:</strong> FWW assigns no sector to this fund. Peer group and benchmark can still be loaded.</span></div>
      <div style="height:200px; border:1px dashed ${T.line2}; border-radius:10px; background:${T.bg}; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center">
        <div style="font-size:14px; font-weight:600">Choose a period and comparison, then load returns</div>
        <div class="btn pri">${I.download(15)}Load returns</div>
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:10px">
      <div style="display:flex; align-items:baseline; gap:12px"><span class="lbl" style="color:${T.blue}">Dokumente · non-sponsored fund</span><span class="small muted">The research section stays visible and explains itself instead of disappearing.</span></div>
      <div class="wgt" style="gap:0; padding:20px 12px 4px">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0 12px 14px"><div class="wgt-title"><span>Research von FondsConsult</span></div><div class="small muted">Sponsored funds only</div></div>
        <div style="display:flex; align-items:center; gap:12px; padding:18px 12px; border-top:1px solid ${T.line}; color:${T.muted}">${I.info(16)}<span>No FondsConsult Fondsportrait is available for this fund. The analyst assessment is in the <a href="#">Einschätzung</a> tab.</span></div>
      </div>
    </div>
  </div>`);
}

/* ───────────────── write files ───────────────── */
const files = {
  'Main.dc.html': main(),
  'Rendite.dc.html': tabShell('Rendite', `<div style="display:flex; flex-direction:column; gap:16px"><div style="color:${T.ink2}; max-width:980px">This section gives a quick assessment of the fund's historical returns over short, medium and long horizons. The FWW Renditeentwicklung adds the time series view – pick a period and comparison series, then load on demand.</div><div style="display:grid; grid-template-columns: 400px 1fr; gap:20px; align-items:start">${sfbRenditePanel()}${renditeWidget({ w: 786, tipAt: 0.4 })}</div></div>`),
  'RenditeStates.dc.html': renditeStates(),
  'CrashDrawdowns.dc.html': tabShell('Crash Drawdowns', `<div style="display:flex; flex-direction:column; gap:16px"><div style="color:${T.ink2}; max-width:980px">How did the fund behave in the major market crises? Select one of the six events to see drawdown, recovery and the SFB rating for that event.</div>${crashWidget()}</div>`),
  'Dokumente.dc.html': tabShell('Dokumente', dokumenteTab()),
  'WidgetPattern.dc.html': patternBoard(),
  'Popup.dc.html': popupBoard(),
  'EmptyState.dc.html': emptyBoard(),
};
for (const [f, html] of Object.entries(files)) writeFileSync(new URL(f, import.meta.url), html);

const canvas = {
  artboards: [
    { file: 'Main.dc.html', title: 'SFB fund detail · Sektoren/Regionen with Allokationsdaten', x: 0, y: 0, w: 1440, h: 1300 },
    { file: 'WidgetPattern.dc.html', title: 'Reusable widget pattern + Download', x: 1560, y: 0, w: 1296, h: 740 },
    { file: 'EmptyState.dc.html', title: 'Empty states without FWW data', x: 1560, y: 880, w: 1296, h: 1180 },
    { file: 'Rendite.dc.html', title: 'Rendite · Renditeentwicklung (loaded)', x: 0, y: 1440, w: 1296, h: 820 },
    { file: 'RenditeStates.dc.html', title: 'Rendite · trigger states A/B/C', x: 0, y: 2320, w: 1296, h: 1840 },
    { file: 'CrashDrawdowns.dc.html', title: 'Crash Drawdowns', x: 1560, y: 2140, w: 1296, h: 760 },
    { file: 'Dokumente.dc.html', title: 'Dokumente · new tab', x: 1560, y: 3040, w: 1296, h: 830 },
    { file: 'Popup.dc.html', title: 'Pop-up · enlarged widget', x: 1560, y: 3990, w: 1440, h: 900 },
  ],
  annotations: [
    { id: 'brief', x: 0, y: -260, w: 520, text: 'FC-1012 · FWW integration in SFB\nWidgets: Allokationsdaten, Renditeentwicklung, Crash Drawdowns, Dokumente tab.\nBased on the client deck “FWW Integration SFB V1” and the current SFB screens. Tab strip and panel frame will later adopt the Private Markets design (FC-1004) 1:1 – the widgets are independent of it. All figures are sample data. Product terms (tab names, widget titles, Datenstand, document names) are kept in German as the client uses them; final UI copy will be German.' },
    { id: 'pie-rule', x: 560, y: -260, w: 420, text: 'Allokationsdaten: at most 7 segments + “Other (n)” so the pie stays readable. For “Einzeltitel” (top 10 holdings) we recommend the same legend list with bars instead of a pie – the values sit too close together.' },
    { id: 'trigger', x: 0, y: 4200, w: 620, text: 'Trigger control (Rendite): no auto-load on tab open. States: A pre-fetch → B loading → loaded. Any change of period or comparison resets the button to “Load returns” and dims the old chart (C). One request = one cacheable key of ISIN + period + series.' },
    { id: 'docs', x: 1560, y: 3880, w: 640, text: 'Proposal fund level vs. ISIN level: one share-class selector at the top of the tab, preset to the ISIN from the fund list. Every row carries a level tag. Fund level (annual/semi-annual report, prospectus, Fondsportrait) applies to all classes and does not change with the selector. Share-class level (PRIIPS-KID) follows the ISIN; “other share classes” expands the remaining KIDs inline. This keeps the Anteilsklassen tab untouched.' },
    { id: 'pattern', x: 2900, y: 0, w: 380, text: 'One pattern for every FWW widget: header (title · Datenstand + source · enlarge · download) → control row → content. Download menu in two groups: chart (JPEG, PPTX) and data (XLSX, CSV).' },
  ],
  launch: { view: 'canvas' },
};
writeFileSync(new URL('canvas.json', import.meta.url), JSON.stringify(canvas, null, 2));
console.log('wrote', Object.keys(files).length, 'artboards + canvas.json');

/* ───────────────── browser preview page (open via any static server) ───────────────── */
const preview = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>FWW Widgets in the SFB Fund Detail · preview</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
<style>
  body { margin:0; font-family: Inter, Arial, sans-serif; background:#EEF1F6; color:#1C2130; display:grid; grid-template-columns: 260px 1fr; min-height:100vh; }
  nav { background:#fff; border-right:1px solid #E5E9F0; padding:20px 16px; position:sticky; top:0; height:100vh; box-sizing:border-box; overflow:auto; }
  nav h1 { font-size:14px; margin:0 0 4px; } nav p { font-size:12px; color:#6B7280; margin:0 0 16px; line-height:1.5; }
  nav a { display:block; padding:8px 10px; border-radius:8px; font-size:13px; color:#1C2130; text-decoration:none; } nav a:hover { background:#F6F8FB; } nav a.on { background:#E8F0FE; color:#2A6DF4; font-weight:600; }
  main { padding:24px 32px 64px; display:flex; flex-direction:column; gap:40px; min-width:0; }
  section h2 { font-size:15px; margin:0 0 4px; } section .sub { font-size:12px; color:#6B7280; margin:0 0 12px; }
  .frame { background:#fff; border:1px solid #E5E9F0; border-radius:12px; overflow:hidden; box-shadow:0 1px 2px rgba(28,33,48,.06); }
  .frame iframe { border:0; display:block; transform-origin: 0 0; }
  .note { background:#FFF8DC; border:1px solid #F3E4A4; border-radius:8px; padding:10px 14px; font-size:12px; line-height:1.5; margin:0 0 12px; white-space:pre-line; }
</style></head><body>
<nav><h1>FWW Widgets in the SFB Fund Detail</h1><p>FC-1012 · design preview. Each artboard is rendered live from its <code>.dc.html</code> file and scaled to fit.</p>
${canvas.artboards.map(a => `<a href="#${a.file.replace('.dc.html', '')}">${a.title}</a>`).join('')}
</nav>
<main>
${canvas.annotations.filter(n => n.id === 'brief').map(n => `<div class="note">${n.text}</div>`).join('')}
${canvas.artboards.map(a => `<section id="${a.file.replace('.dc.html', '')}"><h2>${a.title}</h2><p class="sub">${a.file} · ${a.w} × ${a.h}</p><div class="frame" data-w="${a.w}" data-h="${a.h}"><iframe src="${a.file}" width="${a.w}" height="${a.h}" loading="lazy" title="${a.title}"></iframe></div></section>`).join('')}
</main>
<script>
  function fit() { document.querySelectorAll('.frame').forEach(f => { const w = +f.dataset.w, h = +f.dataset.h, avail = f.parentElement.clientWidth; const k = Math.min(1, avail / w); f.style.width = Math.round(w * k) + 'px'; f.style.height = Math.round(h * k) + 'px'; f.firstElementChild.style.transform = 'scale(' + k + ')'; }); }
  window.addEventListener('resize', fit); fit();
  const links = [...document.querySelectorAll('nav a')]; const secs = [...document.querySelectorAll('main section')];
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' }).observe && secs.forEach(s => new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' }).observe(s));
</script>
</body></html>`;
writeFileSync(new URL('index.html', import.meta.url), preview);
console.log('wrote index.html (browser preview)');
