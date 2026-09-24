// Folder-path button + Miller-column popover (chosen direction, formerly "Variante C").
import { T, I } from '../anfragen/lib.mjs';
import { folderIcon, de } from './ui.mjs';

const chev = (open) => I.chevD(16);

// Breadcrumb button in the filter bar. path = [] means "All funds".
export function crumbBtn({ path = [], count, open = false, total, maxW = 420 } = {}) {
  const shown = path.length > 2 ? [path[0], '…', path[path.length - 1]] : path;
  const crumbs = path.length
    ? shown.map((p, i) => `<span style="${i === shown.length - 1 ? 'font-weight: 600; overflow: hidden; text-overflow: ellipsis; max-width: 260px;' : `color: ${T.text2}; font-weight: 500;`} white-space: nowrap;" ${p === '…' ? `title="${path.slice(1, -1).join(' › ')}"` : ''}>${p}</span>`).join(`<span style="color: ${T.muted}; margin: 0 2px;">›</span>`)
    : `<span style="font-weight: 600;">All funds</span>`;
  return `<span class="qf" style="gap: 8px; padding: 0 12px 0 14px; max-width: ${maxW}px; ${open ? `border-color: ${T.primary}; box-shadow: 0 0 0 3px ${T.chipBg};` : path.length ? `border-color: ${T.primary};` : ''}">
    <span style="display: inline-flex; align-items: center; gap: 6px; color: ${T.primary}; flex: none;">${folderIcon(true, 16)}<span style="font-weight: 600;">Folders</span></span>
    <span style="width: 1px; height: 20px; background: ${T.stroke}; flex: none;"></span>
    <span style="display: inline-flex; align-items: center; gap: 2px; overflow: hidden; min-width: 0; white-space: nowrap;">${crumbs}</span>
    <span class="chip chip-topic" style="height: 20px; flex: none;">${de(count ?? total)}</span>
    ${path.length ? `<span style="display: inline-flex; color: ${T.muted}; flex: none;">${I.close(14)}</span>` : ''}
    <span style="display: inline-flex; color: ${T.text2}; flex: none;">${chev(open)}</span>
  </span>`;
}

// Column of folders. items: [{name, count, hasKids, dim, kind}], sel = selected name, hover = hovered name
function column({ title, items, sel, hover, width, leaf = false, last = false, empty = '' }) {
  const row = (it) => {
    const isSel = it.name === sel; const isHover = it.name === hover;
    const icon = it.kind === 'all' ? `<span style="display: inline-flex; color: ${isSel ? T.chipText : T.text2};">${I.grid(16)}</span>` : it.kind === 'none' ? `<span style="display: inline-flex; color: ${T.amberText};">${I.alert(16)}</span>` : leaf ? `<span style="width: 8px; height: 8px; border-radius: 100px; border: 1.5px solid ${isSel ? T.chipText : T.muted}; flex: none; margin: 0 4px; background: ${isSel ? T.chipText : 'transparent'};"></span>` : folderIcon(isSel, 16);
    return `<div class="tree-row ${isSel ? 'sel' : ''} ${it.dim ? 'dim' : ''}" style="height: 34px; ${isHover && !isSel ? `background: ${T.bg};` : ''}">${icon}<span style="overflow: hidden; text-overflow: ellipsis;">${it.label || it.name}</span>${it.tag ? `<span class="chip chip-topic" style="height: 18px; font-size: 10px; padding: 0 6px;">${it.tag}</span>` : ''}<span class="cnt">${de(it.count)}</span>${it.hasKids ? `<span style="color: ${isSel ? T.chipText : T.muted}; display: inline-flex; margin-left: 2px; flex: none;">${I.chevR(14)}</span>` : `<span style="width: 16px; flex: none;"></span>`}</div>`;
  };
  return `<div style="width: ${width}px; flex: none; ${last ? '' : `border-right: 1px solid ${T.stroke};`} display: flex; flex-direction: column; padding: 8px 6px; min-height: 100%;">
    <div class="eyebrow" style="padding: 6px 8px 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</div>
    ${items.length ? items.map(row).join('') : `<div class="label" style="padding: 40px 12px; text-align: center; line-height: 1.5;">${empty}</div>`}
  </div>`;
}

// The popover. tree = TREE-like ({name,count,children:[{name,count,children:[{name,count}]}]}), levels 2|3,
// path = selected names per level, searchQ = string, unassigned = number|null, left/top = position in the toolbar's parent
export function folderPopover({ tree, total, peergroups, path = [], levels = 3, searchQ = '', unassigned = null, left = 242, top = 76, hover = null, footerNote = '' }) {
  const widths = levels === 3 ? [240, 280, 330] : [260, 300];
  const width = widths.reduce((a, b) => a + b, 0);
  const l1 = tree.find((r) => r.name === path[0]);
  const l2 = l1 && l1.children.find((s) => s.name === path[1]);
  const q = searchQ.toLowerCase();
  let body;
  if (q) {
    const hits = [];
    for (const r of tree) for (const s of r.children) {
      if (s.name.toLowerCase().includes(q)) hits.push({ path: [r.name, s.name], count: s.count, kids: (s.children || []).length });
      for (const l of s.children || []) if (l.name.toLowerCase().includes(q)) hits.push({ path: [r.name, s.name, l.name], count: l.count, leaf: true });
    }
    const hl = (n) => n.replace(new RegExp(`(${searchQ})`, 'i'), '<mark style="background: #fff3a8; color: inherit; border-radius: 2px;">$1</mark>');
    body = `<div style="padding: 8px 6px; min-height: 380px;">
      <div class="eyebrow" style="padding: 6px 8px 8px;">${hits.length} results for „${searchQ}“</div>
      ${hits.map((h, i) => `<div class="tree-row ${i === 0 ? 'sel' : ''}" style="height: 40px; gap: 10px;">${h.leaf ? `<span style="width: 8px; height: 8px; border-radius: 100px; border: 1.5px solid ${i === 0 ? T.chipText : T.muted}; flex: none; margin: 0 4px; background: ${i === 0 ? T.chipText : 'transparent'};"></span>` : folderIcon(false, 16)}<div style="display: flex; flex-direction: column; overflow: hidden; line-height: 1.2;"><span style="overflow: hidden; text-overflow: ellipsis;">${hl(h.path[h.path.length - 1])}</span><span class="label" style="font-weight: 400; font-size: 11px;">${h.path.slice(0, -1).join(' › ')}${h.kids ? `  · ${h.kids} peer groups` : ''}</span></div><span class="cnt">${de(h.count)}</span>${i === 0 ? `<span class="kbd" style="margin-left: 6px;">↵</span>` : ''}</div>`).join('')}
    </div>`;
  } else {
    const col1 = [{ name: 'All funds', count: total, kind: 'all' }, ...tree.map((r) => ({ name: r.name, count: r.count, hasKids: true, tag: r.name === 'ETF' ? 'own top folder' : '' }))];
    if (unassigned) col1.push({ name: 'No asset class', count: unassigned, kind: 'none', dim: true });
    const sel1 = path[0] || 'All funds';
    const cols = [column({ title: 'Level 1', items: col1, sel: sel1, width: widths[0] })];
    const col2 = l1 ? l1.children.map((s) => ({ name: s.name, count: s.count, hasKids: levels === 3 && s.children && s.children.length > 0 })) : [];
    cols.push(column({ title: l1 ? l1.name : 'Level 2', items: col2, sel: path[1], hover, width: widths[1], last: levels === 2, empty: path.length ? '' : 'Pick a folder on the left to see its subfolders.' }));
    if (levels === 3) {
      const col3 = l2 ? (l2.children || []).map((l) => ({ name: l.name, count: l.count })) : [];
      cols.push(column({ title: l2 ? l2.name : 'Peer group', items: col3, sel: path[2], width: widths[2], leaf: true, last: true, empty: l1 && !l2 ? `„${l1.name}“ is selected.<br>Subfolders on the right narrow it down.` : '' }));
    }
    body = `<div style="display: flex; min-height: 400px;">${cols.join('')}</div>`;
  }
  const selLabel = path.length ? path.join(' › ') : 'All funds';
  const selCount = path.length ? (path[2] ? l2.children.find((l) => l.name === path[2]).count : l2 ? l2.count : l1.count) : total;
  return `<div style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; background: #fff; border: 1px solid ${T.stroke}; border-radius: 12px; box-shadow: 0 16px 40px rgba(20,24,58,.16); z-index: 5; overflow: hidden;">
    <div style="display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 14px; border-bottom: 1px solid ${T.stroke}; font-size: 13px; color: ${q ? T.text : T.muted};">${I.search(16)}<span style="flex: 1;">${searchQ || (levels === 3 ? 'Search peer group…' : 'Search asset class…')}</span>${q ? `<span style="display: inline-flex; color: ${T.muted};">${I.close(14)}</span>` : `<span class="label">${peergroups ? `${peergroups} peer groups · ` : ''}${de(total)} funds</span>`}</div>
    ${body}
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 14px; border-top: 1px solid ${T.stroke}; background: #fbfcfe;">
      <span style="font-size: 13px; color: ${T.text2}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="eyebrow" style="margin-right: 8px;">Selection</span><b style="color: ${T.text};">${selLabel}</b> · ${de(selCount)} funds${footerNote ? ` <span class="label">· ${footerNote}</span>` : ''}</span>
      <span style="display: inline-flex; gap: 8px; flex: none;">${path.length ? `<span class="btn btn-outline" style="height: 36px;">Clear selection</span>` : ''}<span class="btn btn-primary" style="height: 36px;">Done</span></span>
    </div>
  </div>`;
}
