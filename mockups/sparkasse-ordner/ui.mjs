// Shell + components for the Sparkasse Leipzig module (Voranalyse / Fondsmatrix) with a folder panel.
import { T, I, doc as baseDoc } from '../anfragen/lib.mjs';
import { TREE, TOTAL, PEERGROUP_COUNT, de, VORANALYSE_ROWS, MATRIX_ROWS, MATRIX_TREE, MATRIX_UNASSIGNED, MATRIX_TOTAL } from './data.mjs';

export const SPK = '#e30613';
const G = { bg: '#e6f6ec', text: '#1c6b3a' }, GG = { bg: '#22b14c', text: '#fff' }, R = { bg: '#fde8e8', text: '#c62828' }, N = { bg: '#eef1f6', text: '#4c556b' };
const pillStyle = (k) => k === 'g' ? G : k === 'gg' ? GG : k === 'r' ? R : N;

const extraCss = `
  .pill { display: inline-flex; align-items: center; justify-content: center; min-width: 72px; height: 30px; padding: 0 12px; border-radius: 100px; font-size: 13px; font-weight: 600; }
  .qf { display: inline-flex; align-items: center; gap: 8px; height: 48px; padding: 0 18px; border: 1px solid ${T.stroke}; border-radius: 100px; background: #fff; font-weight: 600; font-size: 14px; white-space: nowrap; }
  .sw { display: inline-flex; align-items: center; width: 44px; height: 24px; border-radius: 100px; padding: 2px; background: #c4c9d4; }
  .sw i { display: block; width: 20px; height: 20px; border-radius: 100px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); }
  .sw.on { background: ${T.primary}; justify-content: flex-end; }
  .th { font-weight: 600; font-size: 13px; color: ${T.text2}; }
  .tree-row { display: flex; align-items: center; gap: 6px; height: 34px; padding: 0 8px 0 6px; border-radius: 6px; font-size: 13px; color: ${T.text}; white-space: nowrap; }
  .tree-row .cnt { margin-left: auto; flex: none; font-size: 12px; color: ${T.muted}; font-variant-numeric: tabular-nums; }
  .tree-row.sel { background: ${T.chipBg}; color: ${T.chipText}; font-weight: 600; }
  .tree-row.sel .cnt { color: ${T.chipText}; }
  .tree-row.anc { font-weight: 600; }
  .tree-row.dim { color: ${T.muted}; }
  .chev { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 6px; color: ${T.text2}; flex: none; }
  .fold { color: #e0a400; flex: none; }
  .anno { position: absolute; z-index: 9; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 100px; background: #f59e0b; color: #fff; font-size: 12px; font-weight: 700; box-shadow: 0 0 0 4px rgba(245,158,11,.25); }
  .callout { background: #fff8e6; border: 1px solid #f5d78a; border-radius: 8px; padding: 12px 14px; font-size: 13px; line-height: 1.5; color: #5c3d00; }
  .callout b { color: #3d2800; }
  .kbd { display: inline-block; border: 1px solid ${T.stroke}; border-bottom-width: 2px; border-radius: 4px; padding: 0 6px; font-size: 11px; background: #fff; }
`;
export const doc = (title, body, css = '') => baseDoc(title, body, extraCss + css);

// ---------- icons ----------
const folderIcon = (open, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" class="fold"><path d="M3 6a2 2 0 0 1 2-2h4.6a2 2 0 0 1 1.4.6L12.4 6H19a2 2 0 0 1 2 2v${open ? 1 : 10}a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" opacity="${open ? .55 : 1}"/>${open ? '<path d="M2.4 11.5A2 2 0 0 1 4.4 10h15.8a1.5 1.5 0 0 1 1.45 1.9l-1.6 6A2 2 0 0 1 18.1 19.4H4.9a2 2 0 0 1-1.95-1.55L2.4 11.5z"/>' : ''}</svg>`;
const printIcon = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8V4h10v4M5 8h14a2 2 0 0 1 2 2v6h-4M3 16v-6a2 2 0 0 1 2-2M7 14h10v6H7z"/></svg>`;
const panelIcon = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M9 4v16M5.5 8h1M5.5 11h1M5.5 14h1"/></svg>`;
const checkIcon = (s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const crossIcon = (s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;

// ---------- shell ----------
export function nav() {
  const item = (icon, label, active, caret) => `<div style="position: relative; display: flex; align-items: center; gap: 8px; height: 69px; color: #fff; font-size: 12px; font-weight: ${active ? 600 : 400}; white-space: nowrap;">${icon}${label}${caret ? I.chevD(14) : ''}${active ? `<div style="position: absolute; left: -12px; right: -12px; bottom: 0; height: 4px; background: #fff; border-radius: 2px 2px 0 0;"></div>` : ''}</div>`;
  return `<div style="height: 69px; background: ${T.primary}; display: flex; align-items: center; padding: 0 40px; gap: 64px;">
    <div style="display: flex; align-items: center; gap: 16px; color: #fff;">${I.menu(24)}<div style="font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1;">fonds<span style="font-weight: 400;">consult</span>.</div></div>
    <div style="display: flex; align-items: center; gap: 32px; flex: 1;">${item(I.bookmark(22), 'Meine Fondsliste')}${item(I.arrange(22), 'Mein Fondsvergleich')}${item(I.modules(22), 'Modul-Builder')}${item(I.grid(22), 'Sparkasse Leipzig', true, true)}</div>
    <div style="display: flex; align-items: center; gap: 24px; color: #fff;"><div style="display: flex; gap: 4px; align-items: center;">${I.user(24)}${I.chevD(12)}</div><div class="btn" style="height: 40px; border: 1.5px solid #fff; color: #fff; background: transparent;">Einladen ${I.plus(18)}</div></div>
  </div>`;
}

export function moduleHeader(activeTab) {
  const tabs = ['Dashboard', 'Voranalyse', 'Fondsmatrix'];
  return `<div style="display: flex; justify-content: space-between; align-items: flex-start;">
    <div style="display: flex; align-items: center; gap: 10px; color: ${SPK}; font-weight: 700; font-size: 18px; line-height: 1.1;">
      <svg width="30" height="34" viewBox="0 0 30 34" fill="${SPK}"><circle cx="15" cy="5" r="4"/><path d="M6 12h18v6H12v2h12v12H6v-6h12v-2H6z"/></svg><div>Sparkasse<br>Leipzig</div></div>
    <div style="display: flex; align-items: center; gap: 8px; color: ${T.text2}; font-size: 14px; margin-top: 60px;">${I.refresh(18)} Letzte Aktualisierung <b style="color: ${T.text};">22.09.2026</b></div>
  </div>
  <div style="display: flex; margin-top: 14px;">${tabs.map((t, i) => `<div style="position: relative; padding: 6px 16px 10px ${i === 0 ? 0 : 16}px; font-weight: 600; font-size: 14px; color: ${t === activeTab ? T.primary : T.text2}; border-left: ${i === 0 ? 'none' : `1px solid ${T.stroke}`};">${t}${t === activeTab ? `<div style="position: absolute; left: ${i === 0 ? 0 : 16}px; right: 16px; bottom: 0; height: 2px; background: ${T.primary};"></div>` : ''}</div>`).join('')}</div>`;
}

export function page({ tab, content, minHeight = 1024, width = 1440 }) {
  return `<div style="width: ${width}px; min-height: ${minHeight}px; background: ${T.bg}; display: flex; flex-direction: column;">
    ${nav()}
    <div style="margin: 20px; flex: 1; background: #fff; border-radius: 16px; padding: 24px 20px 32px; position: relative;">${moduleHeader(tab)}${content}</div>
  </div>`;
}

// ---------- toolbar pieces ----------
export const search = (ph = 'Fondssuche über ISIN, WKN oder Name…', w = 420) => `<div style="display: flex; align-items: center; gap: 10px; width: ${w}px; height: 48px; padding: 0 20px; border: 1px solid ${T.stroke}; border-radius: 100px; background: #fff; color: ${T.muted}; font-size: 14px; flex: none;">${I.search(20)}${ph}</div>`;
export const quick = (label, { caret = true, radio = false } = {}) => `<span class="qf">${radio ? `<span style="width: 16px; height: 16px; border-radius: 100px; border: 1.5px solid ${T.muted}; display: inline-block;"></span>` : ''}${label}${caret ? I.chevD(16) : ''}</span>`;
export const swtch = (label, on, { short } = {}) => `<span class="qf" style="gap: 10px; ${on ? `border-color: ${T.primary}; background: ${T.chipBg}; color: ${T.chipText};` : ''}">${short ? `<span>${label}</span>` : `<span>${label}</span>`}<span class="sw ${on ? 'on' : ''}"><i></i></span></span>`;

// Investability switch group (both tabs)
export function investGroup({ lvs = false, ivv = false, compact = false } = {}) {
  const one = (label, on) => `<span style="display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border-radius: 100px; font-weight: 600; font-size: 14px; ${on ? `background: ${T.chipBg}; color: ${T.chipText};` : ''}">${label}<span class="sw ${on ? 'on' : ''}"><i></i></span></span>`;
  return `<div style="display: inline-flex; align-items: center; gap: 4px; height: 48px; padding: 0 4px 0 14px; border: 1px dashed #c4c9d4; border-radius: 100px; flex: none;">
    <span style="font-size: 12px; font-weight: 600; color: ${T.text2}; white-space: nowrap; margin-right: 6px;">Investierbar für</span>
    ${one('LVS', lvs)}${one('IVV', ivv)}
  </div>`;
}

export const iconBtn = (icon) => `<span class="pill-icon" style="width: 48px; height: 48px;">${icon}</span>`;
export const filterBtn = () => `<span class="qf">Filter ${I.filter(18)}</span>`;

export function pager({ page = 1, pages, perPage = 10, right = true } = {}) {
  return `<div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0 16px;">
    <div style="display: flex; align-items: center; gap: 10px; font-size: 12px; color: ${T.text2};"><span class="select-sm" style="height: 32px; width: 56px; justify-content: center;">${page}</span><span>/ ${pages}</span><div style="display: flex; gap: 8px; margin-left: 24px;"><span class="pill-icon">${I.chevL(16)}</span><span class="pill-icon">${I.chevR(16)}</span></div></div>
    ${right ? `<div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: ${T.text2};">Fonds pro Seite: <span class="select-sm" style="height: 32px;">${perPage} ${I.chevD(12)}</span></div>` : ''}
  </div>`;
}

// Selected folder chip shown in the toolbar / above the table
export function selectionChip(path, count, { compact = false } = {}) {
  const crumbs = path.map((p, i) => `<span style="${i === path.length - 1 ? 'font-weight: 600;' : ''}">${p}</span>`).join(`<span style="color: ${T.muted}; margin: 0 6px;">›</span>`);
  return `<span style="display: inline-flex; align-items: center; gap: 8px; height: ${compact ? 32 : 40}px; padding: 0 12px 0 10px; border: 1px solid ${T.primary}; border-radius: 100px; background: ${T.chipBg}; color: ${T.chipText}; font-size: 13px; white-space: nowrap;">${folderIcon(true, 16)}${crumbs}<span style="color: ${T.muted};">·</span><span>${de(count)} Fonds</span><span style="color: ${T.chipText}; display: inline-flex;">${I.close(14)}</span></span>`;
}

// ---------- folder tree panel ----------
// sel: { l1, l2, l3 } names; expanded: Set of names; searchQ: string
export function folderPanel({ width = 300, sel = {}, expanded = new Set(), searchQ = '', height, title = 'Ordner', subtitle = `${PEERGROUP_COUNT} Peergroups`, tree = TREE, total = TOTAL, allLabel = 'Alle Fonds', levels = 3, unassigned = null, collapsible = true, annotate = false, footer = '', searchPh = 'Peergroup suchen…' } = {}) {
  const q = searchQ.toLowerCase();
  const match = (n) => !q || n.toLowerCase().includes(q);
  const hl = (n) => q && n.toLowerCase().includes(q) ? n.replace(new RegExp(`(${searchQ})`, 'i'), '<mark style="background: #fff3a8; color: inherit; border-radius: 2px;">$1</mark>') : n;
  const rows = [];
  const allSel = !sel.l1;
  rows.push(`<div class="tree-row ${allSel ? 'sel' : ''}" style="height: 38px; margin-bottom: 4px;"><span class="chev"></span>${I.grid(18)}<span>${allLabel}</span><span class="cnt">${de(total)}</span></div>`);
  for (const r of tree) {
    const leaves2 = r.children;
    const anyMatch = match(r.name) || leaves2.some((s) => match(s.name) || (s.children || []).some((l) => match(l.name)));
    if (q && !anyMatch) continue;
    const open = q ? true : expanded.has(r.name);
    const isSel = sel.l1 === r.name && !sel.l2;
    const isAnc = sel.l1 === r.name && !!sel.l2;
    rows.push(`<div class="tree-row ${isSel ? 'sel' : isAnc ? 'anc' : ''}"><span class="chev">${open ? I.chevD(16) : I.chevR(16)}</span>${folderIcon(open)}<span>${hl(r.name)}</span>${r.name === 'ETF' ? `<span class="chip chip-topic" style="height: 18px; font-size: 10px; padding: 0 6px;">eigener Ordner</span>` : ''}<span class="cnt">${de(r.count)}</span></div>`);
    if (!open) continue;
    for (const s of leaves2) {
      const sMatch = match(s.name) || (s.children || []).some((l) => match(l.name)) || match(r.name);
      if (q && !sMatch) continue;
      const sOpen = q ? true : expanded.has(s.name);
      const sSel = sel.l2 === s.name && !sel.l3;
      const sAnc = sel.l2 === s.name && !!sel.l3;
      const hasKids = levels >= 3 && s.children && s.children.length;
      rows.push(`<div class="tree-row ${sSel ? 'sel' : sAnc ? 'anc' : ''}" style="padding-left: 26px;"><span class="chev">${hasKids ? (sOpen ? I.chevD(16) : I.chevR(16)) : ''}</span>${folderIcon(sOpen && hasKids)}<span style="overflow: hidden; text-overflow: ellipsis;">${hl(s.name)}</span><span class="cnt">${de(s.count)}</span></div>`);
      if (!hasKids || !sOpen) continue;
      for (const l of s.children) {
        if (q && !(match(l.name) || match(s.name) || match(r.name))) continue;
        const lSel = sel.l3 === l.name;
        rows.push(`<div class="tree-row ${lSel ? 'sel' : ''}" style="padding-left: 58px; height: 30px; font-size: 12.5px;"><span style="width: 8px; height: 8px; border-radius: 100px; border: 1.5px solid ${lSel ? T.chipText : T.muted}; flex: none; background: ${lSel ? T.chipText : 'transparent'};"></span><span style="overflow: hidden; text-overflow: ellipsis;">${hl(l.name)}</span><span class="cnt">${de(l.count)}</span></div>`);
      }
    }
  }
  if (unassigned) rows.push(`<div style="height: 1px; background: ${T.stroke}; margin: 8px 4px;"></div><div class="tree-row dim ${sel.l1 === '__none' ? 'sel' : ''}"><span class="chev"></span>${I.alert(18)}<span>Ohne Assetklasse</span><span class="cnt">${de(unassigned)}</span></div>`);
  const noHit = q && rows.length === 1;
  return `<div style="width: ${width}px; flex: none; ${height ? `height: ${height}px;` : ''} background: #fff; border: 1px solid ${T.stroke}; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; position: relative;">
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 10px;"><div><div style="font-weight: 700; font-size: 15px;">${title}</div><div class="label" style="margin-top: 2px;">${subtitle}</div></div>${collapsible ? `<span class="pill-icon" title="Ordner ausblenden">${I.chevL(16)}</span>` : ''}</div>
    <div style="margin: 0 10px 8px; display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border: 1px solid ${searchQ ? T.primary : T.stroke}; border-radius: 8px; font-size: 13px; color: ${searchQ ? T.text : T.muted};">${I.search(16)}<span style="flex: 1;">${searchQ || searchPh}</span>${searchQ ? `<span style="color: ${T.muted}; display: inline-flex;">${I.close(14)}</span>` : ''}</div>
    <div style="padding: 0 6px 10px; display: flex; flex-direction: column; gap: 1px; overflow: hidden; flex: 1;">${rows.join('')}${noHit ? `<div class="label" style="padding: 12px 10px;">Keine passende Peergroup.</div>` : ''}${q && !noHit ? `<div class="label" style="padding: 8px 10px 0;">${rows.length - 1} Treffer · <span class="kbd">↵</span> wählt den ersten</div>` : ''}</div>
    ${footer ? `<div style="border-top: 1px solid ${T.stroke}; padding: 10px 14px; font-size: 12px; color: ${T.text2}; line-height: 1.45; background: #fbfcfe;">${footer}</div>` : ''}
  </div>`;
}

// Collapsed rail (variant A)
export function rail({ hasSelection = true, height }) {
  return `<div style="width: 48px; flex: none; ${height ? `height: ${height}px;` : ''} background: #fff; border: 1px solid ${T.stroke}; border-radius: 12px; display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 10px; position: relative;">
    <span class="pill-icon" style="border-color: ${T.primary}; color: ${T.primary}; position: relative;">${I.chevR(16)}${hasSelection ? `<span style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; border-radius: 100px; background: ${T.primary}; border: 2px solid #fff;"></span>` : ''}</span>
    <span style="color: #e0a400;">${folderIcon(false, 20)}</span>
    <div style="writing-mode: vertical-rl; transform: rotate(180deg); font-size: 12px; font-weight: 600; color: ${T.text2}; letter-spacing: .04em; margin-top: 8px;">Ordner</div>
  </div>`;
}

// ---------- Voranalyse table ----------
export function voranalyseTable({ width, rows = VORANALYSE_ROWS, stripes = 'green', showIvvCol = false, compact = false } = {}) {
  const name = compact ? 240 : 330;
  const small = compact ? 72 : 96;
  const pillW = compact ? 88 : 104;
  const groupsW = pillW * 5;
  const head = `
    <div style="display: flex; align-items: flex-end; padding: 0 0 8px 0;">
      <div style="width: ${name + 24}px; flex: none; padding-left: 40px;"><span class="th">Name ${I.sort(14)}</span></div>
      <div style="width: ${small}px; flex: none; text-align: center; line-height: 1.2;"><span class="th" style="font-size: 12px;">Handlungs-<br>empfehlung</span></div>
      <div style="width: ${small}px; flex: none; text-align: center;"><span class="th" style="font-size: 12px;">Rang</span></div>
      <div style="width: ${small}px; flex: none; text-align: center; line-height: 1.2;"><span class="th" style="font-size: 12px;">Investierbar<br>LVS</span></div>
      ${showIvvCol ? `<div style="width: ${small}px; flex: none; text-align: center; line-height: 1.2;"><span class="th" style="color: ${T.primary};">Investierbar<br>IVV</span><div class="chip chip-topic" style="height: 16px; font-size: 9px; padding: 0 5px; margin: 2px auto 0;">FC-1149</div></div>` : ''}
      <div style="width: ${groupsW}px; flex: none; margin-left: 8px;">
        <div style="display: flex; background: ${T.chipBg}; border-radius: 100px; padding: 3px; margin-bottom: 8px; font-size: 12px; font-weight: 600;"><span style="flex: 1.3; text-align: center; padding: 6px 0; background: ${T.primary}; color: #fff; border-radius: 100px;">Smart Fund Benchmarking ⓘ</span><span style="flex: 1; text-align: center; padding: 6px 0; color: ${T.chipText};">Rendite</span><span style="flex: 1; text-align: center; padding: 6px 0; color: ${T.chipText};">Volatilität</span></div>
        <div style="display: flex; text-align: center; color: ${T.primary};">${['Fonds-<br>volumen', 'Track<br>Record', 'Rendite', 'Risiko', 'Aktives<br>Management'].map((h) => `<div style="width: ${pillW}px; line-height: 1.2;"><span class="th" style="color: ${T.primary}; font-size: 12px;">ⓘ ${h}</span></div>`).join('')}</div>
      </div>
      <div style="width: ${pillW + 20}px; flex: none; text-align: center; line-height: 1.2;"><span class="th" style="font-size: 12px;">Fondsvol.<br>(absolut) €</span></div>
    </div>`;
  const pill = ([t, k]) => { const s = pillStyle(k); return `<span class="pill" style="background: ${s.bg}; color: ${s.text}; min-width: ${pillW - 16}px;">${t}</span>`; };
  const body = rows.map((r) => {
    const stripe = stripes === 'red' && !r.ivv ? '#e53935' : r.lvs ? '#22b14c' : T.stroke;
    return `<div style="display: flex; align-items: center; height: ${compact ? 92 : 108}px; background: #fff; border: 1px solid ${T.stroke}; border-left: 4px solid ${stripe}; border-radius: 4px; margin-bottom: 10px;">
      <div style="width: ${name + 24}px; flex: none; display: flex; align-items: center; gap: 14px; padding-left: 14px;"><span style="color: ${T.text2};">${I.chevR(18)}</span><div style="min-width: 0;"><div style="font-weight: 600; font-size: ${compact ? 14 : 15}px; max-width: ${name - 30}px; line-height: 1.25; ${compact ? 'display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;' : 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'}">${r.name}</div><div class="label" style="margin-top: 4px; color: ${T.text2};">${r.pg}</div></div></div>
      <div style="width: ${small}px; flex: none; text-align: center;">–</div>
      <div style="width: ${small}px; flex: none; text-align: center;"><b>${r.rank}</b><span class="label"> /${r.of}</span></div>
      <div style="width: ${small}px; flex: none; text-align: center;"><span style="display: inline-flex; width: 26px; height: 26px; border-radius: 6px; background: ${r.lvs ? G.bg : N.bg}; align-items: center; justify-content: center;">${r.lvs ? checkIcon(16, G.text) : `<span style="color:${T.muted};">–</span>`}</span></div>
      ${showIvvCol ? `<div style="width: ${small}px; flex: none; text-align: center;"><span style="display: inline-flex; width: 26px; height: 26px; border-radius: 6px; background: ${r.ivv ? G.bg : R.bg}; align-items: center; justify-content: center;">${r.ivv ? checkIcon(16, G.text) : crossIcon(14, R.text)}</span></div>` : ''}
      <div style="width: ${groupsW}px; flex: none; margin-left: 8px; display: flex; text-align: center;">${[r.vol, r.tr, r.ret, r.risk, r.am].map((p) => `<div style="width: ${pillW}px;">${pill(p)}</div>`).join('')}</div>
      <div style="width: ${pillW + 20}px; flex: none; text-align: center;">${pill(r.size)}</div>
    </div>`;
  }).join('');
  return `<div style="width: ${width}px; min-width: 0; overflow: hidden;">${head}${body}</div>`;
}

// ---------- Fondsmatrix table ----------
export function matrixTable({ width, rows = MATRIX_ROWS, compact = true } = {}) {
  const cols = [['Name', 300], ['Assetklasse', 100], ['Sub-Assetklasse', 150], ['Index / Anlageschwerpunkt', 190], ['Währung', 80], ['Hedging', 80], ['Ertragsverwendung', 110], ['lfd. Kosten', 90], ['LVS (PAB)', 150], ['IVV', 90], ['', 100]];
  const total = cols.reduce((a, [, w]) => a + w, 0);
  const groups = `<div style="display: flex; height: 40px; align-items: center; background: ${T.bg}; border-radius: 8px 8px 0 0; font-size: 13px; color: ${T.text2}; font-weight: 500;">
    <div style="width: 300px; flex: none;"></div>
    <div style="width: ${100 + 150 + 190 + 80 + 80}px; flex: none; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">${I.chevD(14)} Stammdaten <span class="chip chip-neutral" style="height: 18px; font-size: 10px;">immer offen · FC-1149</span></div>
    <div style="width: ${110 + 90}px; flex: none; text-align: center;">Ausschüttung / Kosten</div>
    <div style="width: 240px; flex: none; text-align: center;">Status</div>
  </div>`;
  const head = `<div style="display: flex; height: 52px; align-items: center; border-bottom: 1px solid ${T.stroke};">${cols.map(([c, w]) => `<div style="width: ${w}px; flex: none; padding: 0 10px; text-align: ${c === 'Name' ? 'left' : 'center'};"><span class="th" style="color: ${T.text};">${c}${c ? ' ' + I.sort(13) : ''}</span></div>`).join('')}</div>`;
  const status = (v) => v === 'erwerbbar' ? `<span class="chip chip-green" style="height: 24px;">${checkIcon(12, G.text)} erwerbbar</span>` : v === '–' ? `<span class="chip" style="height: 24px; background: ${R.bg}; color: ${R.text};">${crossIcon(11, R.text)} –</span>` : `<span class="chip chip-neutral" style="height: 24px;">${v}</span>`;
  const body = rows.map((r) => `<div style="display: flex; height: 72px; align-items: center; border-bottom: 1px solid ${T.stroke}; font-size: 13px; text-align: center;">
    <div style="width: 300px; flex: none; padding: 0 10px; text-align: left;"><a href="#" style="font-weight: 600; font-size: 14px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px;">${r.name}</a><div class="label" style="margin-top: 2px;">${r.isin} <span style="color: ${T.muted}; margin-left: 4px;">↗ Voranalyse</span></div></div>
    <div style="width: 100px; flex: none;">${r.ak || `<span class="chip chip-amber" style="height: 22px;">–</span>`}</div>
    <div style="width: 150px; flex: none;">${r.sub || `<span class="label">ohne Zuordnung</span>`}</div>
    <div style="width: 190px; flex: none; padding: 0 8px;">${r.idx}</div>
    <div style="width: 80px; flex: none;">${r.cur}</div><div style="width: 80px; flex: none;">${r.hedge}</div>
    <div style="width: 110px; flex: none;">${r.use}</div><div style="width: 90px; flex: none;">${r.ter}</div>
    <div style="width: 150px; flex: none;">${status(r.lvs)}</div><div style="width: 90px; flex: none;">${status(r.ivv)}</div>
    <div style="width: 100px; flex: none;"><span class="btn btn-primary" style="height: 34px; padding: 0 12px; font-size: 13px;">Aktionen ${I.modules(16)}</span></div>
  </div>`).join('');
  const scrollbar = `<div style="height: 14px; background: ${T.bg}; border-radius: 8px; margin: 0 0 10px; position: relative;"><div style="position: absolute; left: 0; top: 2px; height: 10px; width: ${Math.round((width / total) * 100)}%; background: #9aa3b5; border-radius: 6px;"></div></div>`;
  return `<div style="width: ${width}px; min-width: 0; overflow: hidden; position: relative;">${scrollbar}<div class="card" style="border-radius: 8px; overflow: hidden;">${groups}${head}${body}</div>${scrollbar.replace('margin: 0 0 10px', 'margin: 10px 0 0')}</div>`;
}

export { folderIcon, checkIcon, crossIcon, printIcon, panelIcon };
export { TREE, TOTAL, PEERGROUP_COUNT, de, MATRIX_TREE, MATRIX_UNASSIGNED, MATRIX_TOTAL };
