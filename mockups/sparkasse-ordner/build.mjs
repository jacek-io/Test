// Sparkasse Leipzig folder panel – chosen direction: folder-path button + Miller-column popover.
// node build.mjs  -> out/*.dc.html + out/canvas.json
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { T, I } from '../anfragen/lib.mjs';
import { doc, page, search, quick, investGroup, iconBtn, filterBtn, pager, selectionChip, folderPanel, rail, voranalyseTable, matrixTable, printIcon, panelIcon, folderIcon, TREE, TOTAL, PEERGROUP_COUNT, de, MATRIX_TREE, MATRIX_UNASSIGNED, MATRIX_TOTAL } from './ui.mjs';
import { crumbBtn, folderPopover } from './popover.mjs';

const OUT = new URL('./out/', import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
const boards = [], notes = [];
const pages = [
  { id: 'overview', name: 'Overview' },
  { id: 'voranalyse', name: 'Voranalyse · folder popover' },
  { id: 'fondsmatrix', name: 'Fondsmatrix' },
  { id: 'switches', name: 'Switches · FC-1149' },
  { id: 'archive', name: 'Archive · sidebar & drawer (not chosen)' },
];
function add(stem, title, html, o) { writeFileSync(OUT + stem + '.dc.html', doc(title, html)); boards.push({ file: stem + '.dc.html', title, ...o }); }
function note(id, pg, x, y, w, text) { notes.push({ id, page: pg, x, y, w, text }); }

const AKTIEN = TREE.find((r) => r.name === 'Aktien');
const EUROPA = AKTIEN.children.find((s) => s.name === 'Aktien Europa');
const ETF = TREE.find((r) => r.name === 'ETF');
const ETF_EU = ETF.children.find((s) => s.name === 'Aktien Europa');
const LEAF = EUROPA.children[0];
const HINT = (label, count) => `<div style="display: flex; align-items: center; gap: 10px; margin: 0 0 14px;"><span class="eyebrow">Current selection</span><span style="font-weight: 700; font-size: 16px;">${label}</span><span class="label">·</span><span style="font-size: 13px; color: ${T.text2};"><b style="color: ${T.text};">${de(count)}</b> funds</span></div>`;
const anno = (n, x, y) => `<span class="anno" style="left: ${x}px; top: ${y}px;">${n}</span>`;

// Voranalyse toolbar with the folder-path button
function toolbar({ path = [], count = TOTAL, open = false, lvs = true, ivv = false } = {}) {
  return `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px; position: relative;">${search('Search by ISIN, WKN or name…', 200)}${crumbBtn({ path, count, open, total: TOTAL })}${quick('Fund company')}${investGroup({ lvs, ivv })}<div style="flex: 1;"></div>${filterBtn()}${iconBtn(printIcon(20))}</div>`;
}
function voranalyse({ path, count, popover = null, label, lvs = true, ivv = false, table = {} }) {
  const body = `<div style="position: relative;">${toolbar({ path, count, open: !!popover, lvs, ivv })}${popover || ''}${pager({ pages: Math.max(1, Math.ceil(count / 10)) })}${HINT(label, count)}${voranalyseTable({ width: 1360, compact: false, ...table })}</div>`;
  return page({ tab: 'Voranalyse', content: body, minHeight: 1200 });
}
const pop = (o) => folderPopover({ tree: TREE, total: TOTAL, peergroups: PEERGROUP_COUNT, left: 212, ...o });

// ---------------- Overview ----------------
function overview() {
  const cards = (title, items, icon, color) => `<div class="card" style="padding: 20px 22px;"><div style="font-weight: 700; margin-bottom: 10px;">${title}</div><div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: ${T.text2};">${items.map((c) => `<div style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: ${color}; flex: none;">${icon}</span><span>${c}</span></div>`).join('')}</div></div>`;
  const alt = [
    ['Where the tree lives', 'Breadcrumb button in the filter bar, where “FCR Peergroup” sits today. Opens a popover with three columns.', '300 px panel left of the table, collapsing to a 48 px rail.', '380 px drawer sliding over the table.'],
    ['Table readability', 'Always full width. IVV column and red stripe from FC-1149 fit without shrinking the name column.', 'Table narrows to 1044 px; name column wraps.', 'Full width, but hidden while browsing.'],
    ['Why / why not', '<b>Chosen.</b> Smallest change to the current layout and to the client’s habit of using quick filters. Tree is one click away, selection stays readable in the bar.', 'Client’s prototype shows this. Permanent, but costs table width the client wants for FC-1149.', 'Fallback for narrow screens only.'],
  ];
  return `<div style="width: 1440px; min-height: 1100px; background: ${T.bg}; padding: 48px 56px; display: flex; flex-direction: column; gap: 28px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 32px;">
      <div><div class="eyebrow" style="color: ${T.primary};">Sparkasse Leipzig · Voranalyse & Fondsmatrix · folder panel · feeds FC-1149</div><div class="h1" style="font-size: 40px; margin-top: 8px;">Folder navigation as a path button with a popover</div><div style="color: ${T.text2}; margin-top: 10px; max-width: 800px; line-height: 1.5;">Decision after internal review: the folder tree lives behind a <b>breadcrumb button</b> in the filter bar and opens as a <b>three-column popover</b> (level 1 › level 2 › peer group). The table keeps its full width in both tabs. The sidebar and drawer directions are kept on the Archive page for reference.</div></div>
      <div class="card" style="width: 300px; padding: 16px 18px; border-top: 4px solid ${T.primary};"><div class="eyebrow">Boards</div><div style="font-size: 13px; line-height: 1.7; margin-top: 6px;">V1 closed, selection visible<br>V2 open, three columns<br>V3 peer group (level 3) selected<br>V4 search inside the popover<br>V5 ETF top folder<br>V6 “All funds”, nothing selected<br>V7 anatomy and rules<br>F1–F3 Fondsmatrix<br>S1 switches · S2 FC-1149 check</div></div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px;">
      ${cards('Can the popover search replace the “FCR Peergroup” quick filter?', [
        '<b style="color: ' + T.greenText + ';">Yes.</b> The button takes the quick filter’s place. Its search finds the same ' + PEERGROUP_COUNT + ' peer groups and additionally shows the path and the fund count. Two ways to the same selection would only confuse.',
        '“Nur ETFs” goes as well: ETF is a top folder. “Anlageklasse” goes per the requirements catalogue.',
        '“Fund company” and “Filter” stay. Fund search stays on the left as today.',
        'Open with the client: the popover search finds peer groups, not funds.',
      ], I.check(16), T.greenText)}
      ${cards('Assumptions to confirm', [
        'Folder rule applied mechanically: level 1 = first word, level 2 = first two words of the peer group name. This also yields folders like “Renten RMB” and “Aktien Branche” (12 peer groups). If the Analyst Tool has a curated level 2, we take that.',
        'ETF peer groups carry the prefix “ETF”; under the ETF folder, levels 2 and 3 ignore the prefix.',
        'Counts follow the LVS/IVV switches and the fund-company filter, not the text search. Empty folders stay visible (0, dimmed).',
        'One selection at a time. Selecting a folder filters immediately; “Done”, Esc or a click outside closes the popover. Selection persists per user and tab.',
        `Sample data: ${de(TOTAL)} funds in ${PEERGROUP_COUNT} peer groups. The client’s prototype states 12,029 in 206.`,
      ], I.alert(16), T.amberText)}
      ${cards('FC-1149 touchpoints', [
        '<b>IVV column + red row stripe</b>: fit into the full-width table without changes (board S2). The name-column concern from the sidebar direction no longer applies.',
        '<b>Fondsmatrix on one page + Stammdaten always open</b>: no interaction with the popover; the horizontal scrollbar at the top stays as planned.',
        '<b>Export only the open folder</b>: the export button carries the selection in its label (“Export · Aktien › Europa · 14”).',
        '<b>Fund name links to the Voranalyse</b>: the link should land with the fund’s folder pre-selected in the path button.',
        '<b>“Nur investierbare Fonds”</b> is replaced by the two switches; green stripe stays LVS, red comes for IVV.',
      ], I.info(16), T.primary)}
    </div>
    <div class="card" style="overflow: hidden;">
      <div style="display: grid; grid-template-columns: 200px repeat(3, minmax(0, 1fr)); background: ${T.bg}; border-bottom: 1px solid ${T.stroke}; font-weight: 600;"><div style="padding: 14px 18px;">Directions compared</div><div style="padding: 14px 18px; color: ${T.primary};">Path button + popover (chosen)</div><div style="padding: 14px 18px;">Sidebar (archive)</div><div style="padding: 14px 18px;">Drawer (archive)</div></div>
      ${alt.map((r, i) => `<div style="display: grid; grid-template-columns: 200px repeat(3, minmax(0, 1fr)); border-bottom: ${i === alt.length - 1 ? 'none' : `1px solid ${T.stroke}`}; font-size: 13px; line-height: 1.5;"><div style="padding: 14px 18px; font-weight: 600;">${r[0]}</div>${r.slice(1).map((c) => `<div style="padding: 14px 18px; color: ${T.text2};">${c}</div>`).join('')}</div>`).join('')}
    </div>
  </div>`;
}
add('Main', 'Overview · decision and open points', overview(), { page: 'overview', x: 0, y: 0, w: 1440, h: 1100 });

// ---------------- Voranalyse ----------------
{
  const p = 'voranalyse';
  const P2 = ['Aktien', 'Aktien Europa'];
  add('V1_closed_selection', 'V1 · Popover closed, “Aktien › Aktien Europa” selected', voranalyse({ path: P2, count: EUROPA.count, label: 'Aktien › Aktien Europa' }), { page: p, x: 0, y: 0, w: 1440, h: 1200 });
  add('V2_open_level2', 'V2 · Popover open, level 2 selected, three columns', voranalyse({ path: P2, count: EUROPA.count, label: 'Aktien › Aktien Europa', popover: pop({ path: P2 }) }), { page: p, x: 1560, y: 0, w: 1440, h: 1200 });
  const P3 = ['Aktien', 'Aktien Europa', LEAF.name];
  add('V3_open_level3', 'V3 · Peer group selected (= today’s FCR Peergroup filter)', voranalyse({ path: P3, count: LEAF.count, label: `Aktien › Aktien Europa › ${LEAF.name}`, popover: pop({ path: P3 }) }), { page: p, x: 0, y: 1320, w: 1440, h: 1200 });
  add('V4_search', 'V4 · Search “Japan” inside the popover: flat hit list with paths', voranalyse({ path: [], count: TOTAL, label: 'All funds', popover: pop({ path: [], searchQ: 'Japan' }) }), { page: p, x: 1560, y: 1320, w: 1440, h: 1200 });
  const PE = ['ETF', 'Aktien Europa'];
  add('V5_etf_folder', 'V5 · ETF top folder: same two levels below, prefix stripped', voranalyse({ path: PE, count: ETF_EU.count, label: 'ETF › Aktien Europa', popover: pop({ path: PE }) }), { page: p, x: 0, y: 2640, w: 1440, h: 1200 });
  add('V6_all_funds', 'V6 · “All funds”: nothing selected, button and popover state', voranalyse({ path: [], count: TOTAL, label: 'All funds', popover: pop({ path: [] }) }), { page: p, x: 1560, y: 2640, w: 1440, h: 1200 });

  // anatomy
  const anatomy = `<div style="width: 1300px; min-height: 1300px; background: ${T.bg}; padding: 40px; display: flex; flex-direction: column; gap: 28px;">
    <div class="h1" style="font-size: 26px;">Anatomy: path button, popover, open vs. select</div>
    <div style="position: relative; height: 660px;">
      <div style="position: relative; display: flex; gap: 12px;">${search('Search by ISIN, WKN or name…', 200)}${crumbBtn({ path: P2, count: EUROPA.count, open: true, total: TOTAL })}</div>
      ${pop({ path: P2, left: 0, top: 64 })}
      ${anno(1, 222, 12)}${anno(2, 548, 12)}${anno(3, 8, 152)}${anno(4, 250, 152)}${anno(5, 530, 152)}${anno(6, 12, 70)}${anno(7, 8, 385)}${anno(8, 580, 575)}
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 28px;">
      ${[
        ['1', 'Path button', 'Sits where “FCR Peergroup” sits today. Shows “Folders”, the selected path as a breadcrumb, the fund count and × to clear. With nothing selected it reads “Folders · All funds · 10,553”. Clicking opens the popover; the button stays highlighted while open.'],
        ['2', 'Count', 'Number of funds in the selected folder including subfolders. Follows the LVS/IVV switches and the fund-company filter, not the text search.'],
        ['3', '“All funds”', 'First entry in column 1. Clears any folder selection. Equivalent to today’s state without a peer group filter.'],
        ['4', 'Select = click the name', 'Clicking a folder selects it, filters the table immediately and opens the next column to the right. Any level can be selected; the table then shows all funds below it. Selected folder is blue, its ancestors stay highlighted in their columns.'],
        ['5', 'Open = the columns', 'There is no separate “open” gesture: the next column is the opened folder. Chevrons mark folders with children. Level 3 has no chevron (leaves).'],
        ['6', 'Search', 'Filters across all levels and switches the columns to a flat hit list with the path under each hit. ↵ selects the first hit; × returns to the columns.'],
        ['7', 'ETF as its own top folder', 'Peer groups starting with “ETF” appear only here. Below it the same two levels apply with the prefix stripped. The “Nur ETFs” quick filter goes.'],
        ['8', 'Footer', 'Repeats the selection and count in words, offers “Clear selection” and “Done”. Esc or a click outside also closes; the selection stays.'],
      ].map(([n, h, t]) => `<div style="display: flex; gap: 12px; align-items: flex-start;"><span class="anno" style="position: static; flex: none;">${n}</span><div><div style="font-weight: 700;">${h}</div><div style="font-size: 13px; color: ${T.text2}; line-height: 1.5; margin-top: 2px;">${t}</div></div></div>`).join('')}
    </div>
  </div>`;
  add('V7_anatomy', 'V7 · Anatomy and interaction rules', anatomy, { page: p, x: 0, y: 3960, w: 1300, h: 1300 });

  note('n-v-head', p, 0, -220, 1440, 'VORANALYSE · folder popover\nThe path button replaces the “FCR Peergroup” quick filter in the same spot. Boards V1–V6 are the states the ticket asks for: selection visible when closed (V1), three levels (V2, V3), search (V4), ETF top folder (V5), “All funds” (V6). V7 explains the rules. The table stays at its current width in every state; the popover floats above it while open.');
  note('n-v-1', p, 3120, 0, 360, 'Selection when closed: the button itself is the display (path + count + ×), and the “Current selection” line above the table repeats it next to the table it applies to.');
  note('n-v-2', p, 3120, 1320, 360, 'Search finds peer groups and level-2 folders, not funds. Hits show their path so “Japan” under Aktien and under ETF are told apart.');
}

// ---------------- Fondsmatrix ----------------
{
  const p = 'fondsmatrix';
  const mTree = MATRIX_TREE.map((r) => ({ name: r.name, count: r.count, children: r.children.map(([n, c]) => ({ name: n, count: c, children: [] })) }));
  const mpop = (o) => folderPopover({ tree: mTree, total: MATRIX_TOTAL, levels: 2, unassigned: MATRIX_UNASSIGNED, left: 262, ...o });
  const mtoolbar = ({ path, count, open }) => `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px; position: relative;">${search('Search by ISIN or name…', 250)}${crumbBtn({ path, count, open, total: MATRIX_TOTAL })}${investGroup({ lvs: false, ivv: false })}<div style="flex: 1;"></div>${filterBtn()}<span class="btn btn-primary" style="height: 48px; padding: 0 20px;">Export · ${path.length ? path.join(' › ') : 'All funds'} · ${count} ${I.download(18)}</span></div>`;
  const matrix = ({ path, count, label, popover = null, rows }) => page({ tab: 'Fondsmatrix', minHeight: 1200, content: `<div style="position: relative;">${mtoolbar({ path, count, open: !!popover })}${popover || ''}
    <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0 16px;"><span style="font-size: 13px; color: ${T.text2};"><b style="color: ${T.text};">${count} of ${MATRIX_TOTAL}</b> funds · all on one page</span><span class="label">No pagination (FC-1149)</span></div>
    ${HINT(label, count)}${matrixTable({ width: 1360, rows })}</div>` });
  const PM = ['Aktien', 'Europa'];
  add('F1_closed', 'F1 · Fondsmatrix, popover closed, “Aktien › Europa” selected, export shows the folder', matrix({ path: PM, count: 14, label: 'Aktien › Europa' }), { page: p, x: 0, y: 0, w: 1440, h: 1200 });
  add('F2_open', 'F2 · Fondsmatrix popover: Assetklasse › Sub-Assetklasse, “No asset class” at the bottom', matrix({ path: PM, count: 14, label: 'Aktien › Europa', popover: mpop({ path: PM }) }), { page: p, x: 1560, y: 0, w: 1440, h: 1200 });
  const { MATRIX_ROWS } = await import('./data.mjs');
  add('F3_unassigned', 'F3 · “No asset class” selected: funds without an assignment', matrix({ path: ['No asset class'], count: MATRIX_UNASSIGNED, label: 'No asset class', rows: MATRIX_ROWS.filter((r) => !r.ak) }), { page: p, x: 0, y: 1320, w: 1440, h: 1200 });
  note('n-f-head', p, 0, -220, 1440, 'FONDSMATRIX\nSame button and popover with two levels (Assetklasse › Sub-Assetklasse). Funds without an Assetklasse in the import sheet sit in a “No asset class” entry at the bottom of column 1, dimmed, so no fund drops out of the tree (F2, F3). The export button carries the folder in its label because FC-1149 exports only the open folder. The Fondsmatrix has no quick filters today, so the switches sit directly after the button.');
}

// ---------------- Switches & FC-1149 ----------------
{
  const p = 'switches';
  const states = [[false, false, 'All funds', `${de(TOTAL)} funds`], [true, false, 'Only funds investable for LVS', '8,412 funds'], [false, true, 'Only funds investable for IVV', '10,934 funds'], [true, true, 'Intersection LVS ∩ IVV', '7,905 funds']];
  const sw = `<div style="width: 1100px; min-height: 760px; background: ${T.bg}; padding: 40px; display: flex; flex-direction: column; gap: 24px;">
    <div><div class="h1" style="font-size: 26px;">Switches “Investable for LVS / IVV”</div><div style="color: ${T.text2}; margin-top: 8px; line-height: 1.5; max-width: 900px;">One group with the prefix “Investable for” and two switches, in the same spot in both tabs: after the fund-company filter (Voranalyse) or directly after the folder button (Fondsmatrix). Replaces “Nur investierbare Fonds”. The result line above the table spells out the state so the intersection stays understandable.</div></div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">${states.map(([l, v, t, c]) => `<div class="card" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px;">${investGroup({ lvs: l, ivv: v })}<div style="display: flex; align-items: center; gap: 10px;"><span class="eyebrow">Result</span><b>${t}</b><span class="label">· ${c}</span></div></div>`).join('')}</div>
    <div class="callout"><b>Row stripes (FC-1149):</b> green = investable for LVS (today), red = not investable for IVV (new). If both apply, red wins. The switches hide rows; the stripes stay on the remaining rows, so with “LVS only” red stripes can still appear.</div>
    <div class="callout" style="background: ${T.infoBg}; border-color: ${T.infoBorder}; color: #1a3d80;"><b>Alternative labels</b>, if “LVS”/“IVV” is too terse for advisors: “LVS (PAB)” and “IVV” as in the Fondsmatrix columns, with a tooltip “Investable per positive/negative list”.</div>
  </div>`;
  add('S1_switches', 'S1 · Switch states and labels', sw, { page: p, x: 0, y: 0, w: 1100, h: 780 });
  const clash = `<div style="position: relative;">${toolbar({ path: ['Aktien', 'Aktien Europa'], count: EUROPA.count, lvs: false, ivv: false })}${pager({ pages: 57 })}${HINT('Aktien › Aktien Europa', EUROPA.count)}${voranalyseTable({ width: 1360, compact: false, nameW: 300, stripes: 'red', showIvvCol: true })}
    <div class="callout" style="margin-top: 8px;"><b>FC-1149 check:</b> the new IVV column (96 px) and the red stripe fit into the full-width table; the name column shrinks from 330 to 300 px. No interaction with the folder button.</div></div>`;
  add('S2_fc1149', 'S2 · FC-1149 in the chosen layout: IVV column and red stripe', page({ tab: 'Voranalyse', content: clash, minHeight: 1200 }), { page: p, x: 1220, y: 0, w: 1440, h: 1200 });
  note('n-s-head', p, 0, -200, 1440, 'SWITCHES · FC-1149\nS1 shows the four switch states and the result line. S2 places the IVV column and the red stripe from FC-1149 into the chosen layout; because the table keeps its full width, the earlier concern about the name column falls away.');
}

// ---------------- Archive: sidebar & drawer ----------------
{
  const p = 'archive';
  const SEL = { l1: 'Aktien', l2: 'Aktien Europa' }; const EXP = new Set(['Aktien', 'Aktien Europa']);
  const tbA = `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px;">${search('Search by ISIN, WKN or name…')}${quick('Fund company')}${investGroup({ lvs: true })}<div style="flex: 1;"></div>${filterBtn()}${iconBtn(printIcon(20))}</div>`;
  const a1 = `${tbA}${pager({ pages: 57 })}<div style="display: flex; gap: 16px; align-items: flex-start;">${folderPanel({ width: 300, sel: SEL, expanded: EXP })}<div style="flex: 1; min-width: 0;">${HINT('Aktien › Aktien Europa', EUROPA.count)}${voranalyseTable({ width: 1044, compact: true })}</div></div>`;
  add('X1_sidebar_open', 'X1 · Sidebar direction (not chosen): panel open', page({ tab: 'Voranalyse', content: a1, minHeight: 1200 }), { page: p, x: 0, y: 0, w: 1440, h: 1200 });
  const a2 = `${tbA}${pager({ pages: 57 })}<div style="display: flex; gap: 16px; align-items: flex-start;">${rail({ hasSelection: true })}<div style="flex: 1; min-width: 0;"><div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;"><span class="eyebrow">Current selection</span>${selectionChip(['Aktien', 'Aktien Europa'], EUROPA.count)}</div>${voranalyseTable({ width: 1296, compact: false })}</div></div>`;
  add('X2_sidebar_rail', 'X2 · Sidebar direction (not chosen): collapsed rail', page({ tab: 'Voranalyse', content: a2, minHeight: 1200 }), { page: p, x: 1560, y: 0, w: 1440, h: 1200 });
  const drawer = `${tbA}${pager({ pages: 57 })}${HINT('Aktien › Aktien Europa', EUROPA.count)}${voranalyseTable({ width: 1360, compact: false })}
    <div style="position: absolute; inset: 0; background: rgba(20,24,58,.28); border-radius: 16px;"></div>
    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 380px; background: #fff; border-radius: 16px 0 0 16px; box-shadow: 16px 0 40px rgba(20,24,58,.18); padding: 20px 16px; display: flex; flex-direction: column; gap: 12px;">${folderPanel({ width: 348, sel: SEL, expanded: EXP, collapsible: false }).replace('border: 1px solid ' + T.stroke + '; border-radius: 12px;', 'border: none;')}<div style="display: flex; justify-content: space-between; align-items: center; padding: 0 4px;"><a href="#" style="font-weight: 600; font-size: 13px;">Clear selection</a><span class="btn btn-primary" style="height: 40px;">Done</span></div></div>`;
  add('X3_drawer', 'X3 · Drawer direction (not chosen)', page({ tab: 'Voranalyse', content: drawer, minHeight: 1200 }), { page: p, x: 0, y: 1320, w: 1440, h: 1200 });
  note('n-x-head', p, 0, -200, 1440, 'ARCHIVE – directions reviewed and not chosen\nKept for the record: the sidebar (X1, X2) narrows the table to 1044 px and mirrors the client’s prototype; the drawer (X3) hides the table while browsing. The chosen path-button popover is on the Voranalyse page.');
}

writeFileSync(OUT + 'canvas.json', JSON.stringify({ pages, artboards: boards, annotations: notes, launch: { view: 'canvas', page: 'overview' } }, null, 2));
console.log(`wrote ${boards.length} artboards, ${notes.length} notes -> ${OUT}`);
