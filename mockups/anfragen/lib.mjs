// Shared building blocks for the Anfragen-tab mockups (fondsconsult / Merkur module).
// Tokens lifted from the Figma file EUROMAR-SKETCHES: primary #1167fe, stroke #e4e6eb,
// gray background #f3f5f9, text secondary #4c556b, placeholder #828897, Inter 14px,
// inputs radius 4px, pills radius 100px, modal radius 16px.

export const T = {
  primary: '#1167fe',
  primaryDark: '#0d4fc4',
  stroke: '#e4e6eb',
  bg: '#f3f5f9',
  text: '#0f1424',
  text2: '#4c556b',
  muted: '#828897',
  chipBg: '#e8f0fe',
  chipText: '#1a56c9',
  amberBg: '#fff6dc',
  amberText: '#8a5a00',
  amberBorder: '#f5d78a',
  greenBg: '#e6f6ec',
  greenText: '#1c6b3a',
  infoBg: '#eaf2ff',
  infoBorder: '#c9dcff',
  redText: '#d02b2b',
};

// ---------- icons (stroke based, 24 grid) ----------
const svg = (body, size = 24, extra = '') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;
export const I = {
  menu: (s) => svg('<path d="M4 7h16M4 12h16M4 17h16"/>', s),
  grid: (s) => svg('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>', s),
  bookmark: (s) => svg('<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/>', s),
  arrange: (s) => svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 9h8l-2-2M16 15H8l2 2"/>', s),
  doc: (s) => svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>', s),
  modules: (s) => svg('<circle cx="8" cy="8" r="3.5"/><circle cx="16" cy="8" r="3.5"/><circle cx="8" cy="16" r="3.5"/><circle cx="16" cy="16" r="3.5"/>', s),
  user: (s) => svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5c1.5-2 3.3-3 5.5-3s4 1 5.5 3"/>', s),
  chevD: (s) => svg('<path d="M6 9l6 6 6-6"/>', s),
  chevR: (s) => svg('<path d="M9 6l6 6-6 6"/>', s),
  chevL: (s) => svg('<path d="M15 6l-6 6 6 6"/>', s),
  chevU: (s) => svg('<path d="M6 15l6-6 6 6"/>', s),
  search: (s) => svg('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>', s),
  download: (s) => svg('<path d="M12 4v11M7 10l5 5 5-5M4 19h16"/>', s),
  plus: (s) => svg('<path d="M12 5v14M5 12h14"/>', s),
  close: (s) => svg('<path d="M6 6l12 12M18 6L6 18"/>', s),
  clip: (s) => svg('<path d="M20 11.5l-7.6 7.6a5 5 0 0 1-7.1-7.1l8.3-8.3a3.3 3.3 0 0 1 4.7 4.7L10 16.7a1.6 1.6 0 0 1-2.3-2.3l7.2-7.2"/>', s),
  pencil: (s) => svg('<path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M13 7l4 4"/>', s),
  alert: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>', s),
  info: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', s),
  check: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>', s),
  upload: (s) => svg('<path d="M7 17a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8a4 4 0 0 1 1 8.9"/><path d="M12 12v8M9 15l3-3 3 3"/>', s),
  sort: (s) => svg('<path d="M8 4v16M8 20l-3-3M8 20l3-3M16 20V4M16 4l-3 3M16 4l3 3"/>', s),
  chat: (s) => svg('<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6z"/>', s),
  refresh: (s) => svg('<path d="M20 12a8 8 0 0 1-14.5 4.6M4 12A8 8 0 0 1 18.5 7.4"/><path d="M18 3v5h-5M6 21v-5h5"/>', s),
  filter: (s) => svg('<path d="M4 5h16l-6 8v5l-4 2v-7z"/>', s),
  eye: (s) => svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>', s),
  star: (s) => svg('<path d="M12 3.5l2.7 5.6 6.1.8-4.5 4.3 1.2 6.1L12 17.4l-5.5 2.9 1.2-6.1L3.2 9.9l6.1-.8z"/>', s),
  arrowR: (s) => svg('<path d="M4 12h16M14 6l6 6-6 6"/>', s),
  external: (s) => svg('<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>', s),
};

// ---------- base document ----------
export const baseCss = `
  body { margin: 0; font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif; color: ${T.text}; background: ${T.bg}; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; }
  a { color: ${T.primary}; text-decoration: none; } a:hover { color: ${T.primaryDark}; }
  * { box-sizing: border-box; }
  .h1 { font-family: "Random Grotesque Standard", Inter, system-ui, sans-serif; font-weight: 700; font-size: 36px; line-height: 1.1; letter-spacing: -0.01em; color: #14183a; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 100px; font-weight: 600; font-size: 14px; white-space: nowrap; border: 1px solid transparent; }
  .btn-primary { background: ${T.primary}; color: #fff; }
  .btn-outline { background: #fff; color: ${T.text2}; border-color: ${T.stroke}; }
  .btn-ghost { background: transparent; color: ${T.primary}; }
  .btn-disabled { background: #e2e5ea; color: #9aa0ad; }
  .btn-sm { height: 32px; padding: 0 14px; font-size: 13px; }
  .chip { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 8px; border-radius: 100px; font-size: 12px; font-weight: 500; white-space: nowrap; }
  .chip-topic { background: ${T.chipBg}; color: ${T.chipText}; }
  .chip-topic-active { background: ${T.primary}; color: #fff; }
  .chip-neutral { background: ${T.bg}; color: ${T.text2}; border: 1px solid ${T.stroke}; }
  .chip-amber { background: ${T.amberBg}; color: ${T.amberText}; border: 1px solid ${T.amberBorder}; }
  .chip-green { background: ${T.greenBg}; color: ${T.greenText}; }
  .chip-outline { background: #fff; color: ${T.text2}; border: 1px solid ${T.stroke}; }
  .label { font-size: 12px; color: ${T.muted}; }
  .eyebrow { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.text2}; font-weight: 500; }
  .card { background: #fff; border: 1px solid ${T.stroke}; border-radius: 8px; }
  .input { display: flex; align-items: center; gap: 8px; height: 48px; padding: 0 16px; border: 1px solid ${T.stroke}; border-radius: 4px; background: #fff; color: ${T.muted}; font-size: 14px; }
  .input-value { color: ${T.text}; }
  .textarea { display: block; min-height: 96px; padding: 14px 16px; border: 1px solid ${T.stroke}; border-radius: 4px; background: #fff; font-size: 14px; color: ${T.text}; line-height: 1.5; }
  .field-label { font-size: 14px; color: ${T.text}; margin-bottom: 8px; display: flex; gap: 4px; align-items: baseline; }
  .field-label .req { color: ${T.text2}; }
  .help { font-size: 12px; color: ${T.muted}; line-height: 1.5; margin-top: 6px; }
  .th { font-weight: 600; font-size: 14px; color: ${T.text}; display: inline-flex; align-items: center; gap: 6px; }
  .th svg { color: ${T.muted}; }
  .pill-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid ${T.stroke}; border-radius: 100px; background: #fff; color: ${T.text2}; }
  .select-sm { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 1px solid ${T.stroke}; border-radius: 6px; background: #fff; font-size: 13px; color: ${T.text}; }
  .note { border-radius: 6px; padding: 12px 14px; font-size: 13px; line-height: 1.5; }
  .note-amber { background: ${T.amberBg}; border: 1px solid ${T.amberBorder}; color: ${T.amberText}; }
  .note-info { background: ${T.infoBg}; border: 1px solid ${T.infoBorder}; color: #1a3d80; }
  .note-green { background: ${T.greenBg}; border: 1px solid #b9e2c7; color: ${T.greenText}; }
  .tt { position: absolute; z-index: 5; background: #14183a; color: #fff; font-size: 12px; line-height: 1.4; padding: 8px 10px; border-radius: 6px; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.18); }
  .tt::after { content: ""; position: absolute; left: 16px; top: -5px; border: 5px solid transparent; border-bottom-color: #14183a; border-top: 0; }
`;

export function doc(title, body, extraCss = '') {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <style>${baseCss}${extraCss}</style>
</helmet>
${body}
</x-dc>
</body>
</html>
`;
}

// ---------- top navigation ----------
export function nav(role) {
  const item = (icon, label, active = false, caret = false) => `
    <div style="position: relative; display: flex; align-items: center; gap: 8px; height: 69px; padding: 0 4px; color: #fff; font-size: 12px; font-weight: ${active ? 600 : 400};">
      ${icon}<span style="white-space: nowrap;">${label}</span>${caret ? I.chevD(14) : ''}
      ${active ? `<div style="position: absolute; left: -12px; right: -12px; bottom: 0; height: 4px; background: #fff; border-radius: 2px 2px 0 0;"></div>` : ''}
    </div>`;
  const items = role === 'analyst'
    ? [item(I.bookmark(22), 'Meine Fondsliste'), item(I.arrange(22), 'Meine Fondsvergleich'), item(I.doc(22), 'Analyst Tool'), item(I.modules(22), 'Module Builder'), item(I.grid(22), 'Merkur Privatbank', true, true)]
    : [item(I.grid(22), 'Merkur Privatbank', true), item(I.bookmark(22), 'Meine Fondsliste'), item(I.arrange(22), 'Meine Fondsvergleich')];
  return `
  <div style="height: 69px; background: ${T.primary}; display: flex; align-items: center; padding: 0 40px; gap: 64px;">
    <div style="display: flex; align-items: center; gap: 16px; color: #fff;">
      ${I.menu(24)}
      <div style="font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1;">fonds<span style="font-weight: 400;">consult</span>.</div>
    </div>
    <div style="display: flex; align-items: center; gap: 32px; flex: 1;">${items.join('')}</div>
    <div style="display: flex; align-items: center; gap: 24px; color: #fff;">
      <div style="display: flex; align-items: center; gap: 4px;">${I.user(24)}${I.chevD(12)}</div>
      ${role === 'analyst' ? `<div class="btn" style="height: 40px; border: 1.5px solid #fff; color: #fff; background: transparent;">Einladen ${I.plus(18)}</div>` : ''}
    </div>
  </div>`;
}

// ---------- module header (title, logo, tabs) ----------
export function moduleHeader({ headerRight = '', activeTab = 'Anfragen' } = {}) {
  const tabs = ['Dashboard', 'Voranalyse', 'Watchlist', 'Empfehlungsliste', 'Anfragen'];
  return `
  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
    <div class="h1">Merkur Privatbank</div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 10px; color: #6b7280;">
        <div style="text-align: right; line-height: 1;"><div style="font-weight: 800; font-size: 18px; letter-spacing: 0.08em;">MERKUR</div><div style="font-size: 9px; letter-spacing: 0.22em; margin-top: 3px;">PRIVATBANK</div></div>
        ${svg('<path d="M12 3v18M6 21h12M5 8h14M7 8l-3 6h6l-3-6zM17 8l-3 6h6l-3-6z"/>', 34, 'style="color:#6b7280"')}
      </div>
      ${headerRight}
    </div>
  </div>
  <div style="display: flex; gap: 0; margin-top: 10px; border-bottom: 1px solid transparent;">
    ${tabs.map((t, i) => `<div style="position: relative; padding: 6px 16px 10px ${i === 0 ? 0 : 16}px; font-weight: 600; font-size: 14px; color: ${t === activeTab ? T.primary : T.text2}; border-left: ${i === 0 ? 'none' : `1px solid ${T.stroke}`};">${t}${t === activeTab ? `<div style="position: absolute; left: ${i === 0 ? 0 : 16}px; right: 16px; bottom: 0; height: 2px; background: ${T.primary};"></div>` : ''}</div>`).join('')}
  </div>`;
}

export const versionSelector = `<div style="display: flex; align-items: center; gap: 8px; color: ${T.text2}; font-size: 14px;">${I.refresh(18)}<span>Version <b style="color: ${T.text}; font-weight: 600;">25.02.2025</b></span>${I.chevD(16)}</div>`;

// ---------- toolbar / pagination ----------
export function searchBox(value = '', width = 360) {
  return `<div style="display: flex; align-items: center; gap: 10px; width: ${width}px; height: 48px; padding: 0 20px; border: 1px solid ${T.stroke}; border-radius: 100px; background: #fff; color: ${value ? T.text : T.muted}; font-size: 14px;">${I.search(20)}<span>${value || 'Fondssuche über ISIN, WKN oder Name…'}</span>${value ? `<span style="margin-left: auto; color: ${T.muted};">${I.close(16)}</span>` : ''}</div>`;
}

export function pager() {
  return `
  <div style="display: flex; justify-content: space-between; align-items: center; margin: 22px 0 18px;">
    <div style="display: flex; align-items: center; gap: 10px; font-size: 12px; color: ${T.text2};">
      <div class="select-sm" style="height: 30px;">1 ${I.chevD(12)}</div><span>Seiten 1</span>
      <div style="display: flex; gap: 8px; margin-left: 24px;"><span class="pill-icon">${I.chevL(16)}</span><span class="pill-icon">${I.chevR(16)}</span></div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: ${T.text2};">Rows per page: <div class="select-sm" style="height: 30px;">10 ${I.chevD(12)}</div></div>
  </div>`;
}

export function th(label, w, extra = '') {
  return `<div style="width: ${w}px; flex: none; ${extra}"><span class="th">${label} ${label ? I.sort(16) : ''}</span></div>`;
}

// ---------- page shell ----------
export function page({ role, headerRight, content, minHeight = 1024, activeTab }) {
  return `
  <div style="width: 1440px; min-height: ${minHeight}px; background: ${T.bg}; display: flex; flex-direction: column;">
    ${nav(role)}
    <div style="margin: 20px; flex: 1; background: #fff; border-radius: 16px; padding: 24px 20px 40px; box-shadow: 0 1px 2px rgba(20,24,58,0.04);">
      ${moduleHeader({ headerRight, activeTab })}
      ${content}
    </div>
  </div>`;
}

// ---------- modal shell (standalone artboard) ----------
export function modalArtboard({ title, width = 560, body, footer, height, intro = '' }) {
  return `
  <div style="width: ${width + 160}px; min-height: max(${height}px, 100vh); background: #6f7380; display: flex; align-items: flex-start; justify-content: center; padding: 60px 0;">
    <div style="width: ${width}px; background: #fff; border-radius: 16px; border: 1px solid ${T.stroke}; box-shadow: 0 12px 32px rgba(0,0,0,0.25); display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 8px;">
        <div style="font-family: 'Random Grotesque Standard', Inter, sans-serif; font-weight: 700; font-size: 22px; color: #14183a;">${title}</div>
        <span style="color: ${T.text2};">${I.close(22)}</span>
      </div>
      <div style="padding: 0 20px 20px; display: flex; flex-direction: column; gap: 16px;">
        ${intro ? `<div style="font-size: 14px; color: ${T.text2}; line-height: 1.5;">${intro}</div>` : ''}
        ${body}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-top: 1px solid ${T.stroke};">${footer}</div>
    </div>
  </div>`;
}

export function field(label, control, { required, optional, help } = {}) {
  return `<div style="display: flex; flex-direction: column;">
    <div class="field-label">${label}${required ? '<span class="req">(Pflichtfeld)</span>' : ''}${optional ? '<span class="req">(optional)</span>' : ''}</div>
    ${control}
    ${help ? `<div class="help">${help}</div>` : ''}
  </div>`;
}

export const selectedFund = (name, isin, extra = '') => `<div style="display: flex; justify-content: space-between; align-items: center; height: 40px; padding: 0 16px; background: ${T.bg}; border-radius: 4px; font-weight: 500;"><span>${name} · ${isin}${extra}</span><a href="#" style="font-weight: 600;">Ändern</a></div>`;

export const dropzone = `<div style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 56px; border: 1px dashed #c6c9cc; border-radius: 4px; font-weight: 600; color: ${T.text};">${I.upload(20)} Datei auswählen oder hierher ziehen</div>`;

// ---------- history exchange card ----------
export function exchange({ topic, date, answeredBy, submittedBy, q, a, docs = [], correction = '', analyst = false, dim = false, highlight = false, topicChipClass = 'chip chip-topic' }) {
  return `
  <div class="card" style="padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 12px; ${dim ? 'opacity: 0.45;' : ''} ${highlight ? `border-color: ${T.primary}; box-shadow: 0 0 0 2px ${T.chipBg};` : ''}">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 12px;"><span class="${topicChipClass}">${topic}</span><span style="font-size: 13px; color: ${T.text2};">${date}</span></div>
      ${analyst ? `<a href="#" style="font-weight: 600; font-size: 14px;">Korrigieren</a>` : ''}
    </div>
    <div style="display: flex; gap: 20px; align-items: center; font-size: 12px; color: ${T.text2};">
      <div style="display: flex; align-items: center; gap: 8px;">Beantwortet von <span class="chip chip-outline" style="font-weight: 500; color: ${T.text};">${answeredBy}</span></div>
      <div style="display: flex; align-items: center; gap: 8px;">Eingereicht von <span class="chip chip-outline" style="font-weight: 500; color: ${T.text};">${submittedBy}</span></div>
    </div>
    <div><div class="eyebrow" style="margin-bottom: 4px;">Frage</div><div style="font-size: 14px;">${q}</div></div>
    <div><div class="eyebrow" style="margin-bottom: 6px;">Antwort</div><div style="background: ${T.bg}; border-radius: 4px; padding: 10px 12px; font-size: 14px; line-height: 1.5;">${a}</div></div>
    ${docs.length ? `<div style="display: flex; gap: 16px;">${docs.map((d) => `<a href="#" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 500;">${I.clip(18)} ${d}</a>`).join('')}</div>` : ''}
    ${correction}
  </div>`;
}

export const merkurLogoSmall = '';
