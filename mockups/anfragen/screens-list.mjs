import { T, I, page, searchBox, pager, th, versionSelector, exchange } from './lib.mjs';

// ---------- sample data ----------
export const DWS_CLASSES = [
  { isin: 'DE0009848119', cls: 'LD', main: true },
  { isin: 'DE0009848127', cls: 'FC' },
  { isin: 'DE0009848135', cls: 'NC' },
  { isin: 'DE0009848143', cls: 'TFD' },
  { isin: 'DE0009848150', cls: 'IDQ' },
];

export const DWS_HISTORY = [
  { topic: 'Ausschüttung', date: '14.08.2026', answeredBy: 'J. Weber, FondsConsult', submittedBy: 'S. Nowak, Merkur Privatbank', q: 'Gibt es Änderungen bei der Ausschüttungspolitik für 2026?', a: 'Nein, die Ausschüttungspolitik bleibt unverändert; nächste Ausschüttung planmäßig im Dezember.' },
  { topic: 'Compliance', date: '02.05.2026', answeredBy: 'J. Weber, FondsConsult', submittedBy: 'T. Brandt, Merkur Privatbank', q: 'Ist der Fonds weiterhin Artikel-8-konform nach SFDR?', a: 'Ja, Einstufung unverändert. Aktuelle Offenlegung im Anhang.', docs: ['SFDR_Offenlegung_2026.pdf'] },
  { topic: 'Fondsmanagement', date: '19.01.2026', answeredBy: 'M. Fischer, FondsConsult', submittedBy: 'S. Nowak, Merkur Privatbank', q: 'Wer übernimmt das Fondsmanagement nach dem Wechsel im Team?', a: 'Thomas Schüßler bleibt Lead Portfolio Manager; Stephan Werner wurde zum 01.01. als Co-Manager ergänzt.', corrected: true },
  { topic: 'Kosten', date: '03.11.2025', answeredBy: 'J. Weber, FondsConsult', submittedBy: 'S. Nowak, Merkur Privatbank', q: 'Warum ist die laufende Kostenquote (TER) im letzten KID gestiegen?', a: 'Anstieg durch gestiegene Transaktionskosten im Berichtszeitraum, keine Änderung der Verwaltungsgebühr.', docs: ['KID_DWS_Top_Dividende_2025.pdf'] },
  { topic: 'Kosten', date: '12.03.2025', answeredBy: 'J. Weber, FondsConsult', submittedBy: 'T. Brandt, Merkur Privatbank', q: 'Fällt bei der Anteilklasse FC eine Performance Fee an?', a: 'Nein, für keine Anteilklasse des Fonds wird eine erfolgsabhängige Vergütung erhoben.' },
];

const FUNDS = {
  dws: { name: 'DWS Top Dividende', sub: 'Aktienfonds · Global', isin: 'DE0009848119', date: '14.08.2026', q: 'Gibt es Änderungen bei der Ausschüttungspolitik für 2026?', more: '+4 weitere Fragen', a: 'Nein, die Ausschüttungspolitik bleibt unverändert; nächste Ausschüttung planmäßig im Dezember.', docs: 2, correction: true, kostenQ: 'Warum ist die laufende Kostenquote (TER) im letzten KID gestiegen?', kostenA: 'Anstieg durch gestiegene Transaktionskosten im Berichtszeitraum, keine Änderung der Verwaltungsgebühr.', kostenDate: '03.11.2025', kostenHits: 2 },
  fidelity: { name: 'Fidelity European Growth', sub: 'Aktienfonds · Europa', isin: 'IE0003580214', date: '21.07.2026', q: 'Wurde die Benchmark des Fonds kürzlich angepasst?', more: '', a: 'Ja, Wechsel von MSCI Europe auf MSCI Europe ex UK zum 01.07.2026. Details im Anhang.', docs: 1 },
  flossbach: { name: 'Flossbach von Storch – Multi Asset', sub: 'Mischfonds · Ausgewogen', isin: 'LU0323578657', date: '05.06.2026', q: 'Wie hat sich die Aktienquote im 2. Quartal entwickelt?', more: '+1 weitere Frage', a: 'Aktienquote von 48 % auf 52 % erhöht, Details siehe Quartalsbericht.', docs: 1, kostenQ: 'Wird die Verwaltungsgebühr der Klasse R angepasst?', kostenA: 'Ja, Senkung von 1,53 % auf 1,38 % p. a. ab 01.01.2026.', kostenDate: '14.02.2026', kostenHits: 1 },
};

// column widths (inner width 1360, chevron 40)
const COLS = {
  A: { chev: 40, date: 110, isin: 160, fund: 210, q: 300, a: 330, docs: 0, act: 200 },
  B: { chev: 40, date: 110, isin: 0, fund: 260, q: 300, a: 340, docs: 110, act: 200 },
  C: { chev: 40, date: 105, isin: 150, fund: 185, q: 270, a: 290, docs: 110, act: 140 },
};

export function tableHeader(variant, role, { topicCol = false } = {}) {
  const c = COLS[variant];
  return `
  <div style="display: flex; align-items: center; padding: 0 20px 12px; gap: 0;">
    <div style="width: ${c.chev}px; flex: none;"></div>
    ${th('Datum', c.date)}
    ${c.isin ? (variant === 'C' ? `<div style="width: ${c.isin}px; flex: none;"><span class="th">ISIN ${I.sort(16)}</span><div class="label" style="margin-top: 2px;">Haupttranche</div></div>` : th('ISIN', c.isin)) : ''}
    ${th(variant === 'B' ? 'Fonds' : 'Fondsname', c.fund)}
    ${th('Fragestellung', c.q)}
    ${th('Feedback FondsConsult', c.a)}
    ${c.docs ? th('Dokumente', c.docs) : ''}
    ${role === 'user' ? `<div style="flex: 1;"></div>` : ''}
  </div>`;
}

const actions = () => `<div style="display: flex; flex-direction: column; gap: 8px; align-items: stretch; margin-left: auto;"><span class="btn btn-outline" style="height: 36px;">Update anfordern</span><span class="btn btn-primary" style="height: 36px;">Rückfrage stellen</span></div>`;

// ISIN cell per variant
function isinCell(variant, f, multi) {
  if (variant === 'A') {
    return `<div><div style="font-size: 14px;">${f.isin}</div>${multi ? `<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;"><span class="chip chip-neutral" style="height: 20px; font-size: 11px;">+4 Klassen</span></div><div class="label" style="margin-top: 4px;">Bezugs-ISIN der letzten Frage</div>` : ''}</div>`;
  }
  if (variant === 'C') {
    return `<div><div style="font-size: 14px;">${f.isin}</div>${multi ? `<div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;"><span class="chip chip-neutral" style="height: 20px; font-size: 11px;">Haupttranche LD</span></div><div class="label" style="margin-top: 4px;">+4 weitere Klassen</div>` : ''}</div>`;
  }
  return '';
}

function fundCell(variant, f, multi) {
  const classes = multi
    ? (variant === 'B'
        ? `<div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;"><span class="chip chip-neutral" style="height: 20px; font-size: 11px;">5 Anteilsklassen</span><span class="label">DE0009848119 …</span></div>`
        : '')
    : (variant === 'B' ? `<div class="label" style="margin-top: 6px;">${f.isin}</div>` : '');
  return `<div><a href="#" style="font-weight: 600; font-size: 14px;">${f.name}</a><div class="label" style="margin-top: 2px;">${f.sub}</div>${classes}</div>`;
}

function docsCell(variant, f) {
  if (!f.docs) return `<span class="label">–</span>`;
  return `<a href="#" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500;">${I.clip(16)} ${f.docs} ${f.docs === 1 ? 'Dokument' : 'Dokumente'}</a>`;
}

// collapsed row
export function row(variant, key, { role = 'user', open = false, multi = false, filter = null, hidden = false, highlight = false } = {}) {
  const f = FUNDS[key];
  const c = COLS[variant];
  const filtered = filter && f.kostenQ;
  // Variant A: collapsed row shows the newest exchange MATCHING the active filter.
  // Variant B/C: collapsed row always shows the newest exchange overall; B adds a hit badge.
  const showMatch = variant === 'A' && filtered;
  const q = showMatch ? f.kostenQ : f.q;
  const a = showMatch ? f.kostenA : f.a;
  const qLabel = showMatch ? `Neueste Frage zum Thema <b style="color:${T.chipText}">${filter}</b> · ${f.kostenDate}` : 'Neueste Frage';
  const aLabel = showMatch ? 'Antwort dazu' : 'Neueste Antwort';
  const border = open || highlight ? `border: 1px solid ${T.primary}; box-shadow: 0 0 0 1px ${T.primary} inset;` : `border: 1px solid ${T.stroke};`;
  const topicChip = variant === 'C' ? `<span class="chip chip-topic" style="height: 20px; font-size: 11px;">${showMatch || (filter && f.kostenQ) ? filter : (key === 'dws' ? 'Ausschüttung' : key === 'fidelity' ? 'Fondsmanagement' : 'Allokation')}</span>` : '';
  const hitBadge = variant === 'B' && filtered ? `<span class="chip chip-topic" style="height: 20px; font-size: 11px;">${f.kostenHits} ${f.kostenHits === 1 ? 'Treffer' : 'Treffer'} zu ${filter}</span>` : '';
  const moreChip = f.more ? `<span class="chip chip-topic" style="height: 22px;">${f.more}</span>` : '';
  const inlineDocs = variant === 'A' && f.docs ? `<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${T.text2};">${I.clip(14)} ${f.docs} ${f.docs === 1 ? 'Dokument' : 'Dokumente'}</span>` : '';
  const corrChip = f.correction ? `<span class="chip chip-amber" style="height: 22px;">${I.alert(14)} 1 Korrektur vorhanden</span>` : '';
  return `
  <div class="card" style="display: flex; align-items: center; padding: 18px 20px; gap: 0; ${border} ${open ? 'border-radius: 8px 8px 0 0; border-bottom: none;' : ''} ${hidden ? 'opacity: 0.35;' : ''}">
    <div style="width: ${c.chev}px; flex: none; color: ${open ? T.primary : T.text2};">${open ? I.chevD(20) : I.chevR(20)}</div>
    <div style="width: ${c.date}px; flex: none;"><div style="font-size: 14px;">${f.date}</div>${variant !== 'A' ? `<div class="label" style="margin-top: 2px;">letzte Aktivität</div>` : ''}</div>
    ${c.isin ? `<div style="width: ${c.isin}px; flex: none; padding-right: 16px;">${isinCell(variant, f, multi)}</div>` : ''}
    <div style="width: ${c.fund}px; flex: none; padding-right: 16px;">${fundCell(variant, f, multi)}</div>
    <div style="width: ${c.q}px; flex: none; padding-right: 20px; display: flex; flex-direction: column; gap: 4px;">
      <div class="label">${qLabel}</div>
      <div style="font-size: 14px;">${q}</div>
      <div style="display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap;">${topicChip}${moreChip}${hitBadge}</div>
    </div>
    <div style="width: ${c.a}px; flex: none; padding-right: 20px; display: flex; flex-direction: column; gap: 4px;">
      <div class="label">${aLabel}</div>
      <div style="font-size: 14px;">${a}</div>
      <div style="display: flex; gap: 10px; margin-top: 4px; align-items: center; flex-wrap: wrap;">${inlineDocs}${corrChip}</div>
    </div>
    ${c.docs ? `<div style="width: ${c.docs}px; flex: none;">${docsCell(variant, f)}</div>` : ''}
    ${role === 'user' ? actions() : ''}
  </div>`;
}

// ---------- filter controls per variant ----------
export function filterControl(variant, active = 'Kosten') {
  if (variant === 'A') {
    return `<div style="display: flex; align-items: center; gap: 10px; height: 48px; padding: 0 18px; border: 1px solid ${T.primary}; border-radius: 100px; background: ${T.chipBg}; color: ${T.chipText}; font-weight: 600; font-size: 14px;">${I.filter(18)} Thema: ${active} ${I.chevD(16)}</div>
    <a href="#" style="font-size: 13px; font-weight: 500;">Filter zurücksetzen</a>`;
  }
  // B and C: chip row with counts
  const topics = [['Alle', 9], ['Ausschüttung', 1], ['Compliance', 1], ['Fondsmanagement', 2], ['Kosten', 3], ['Allokation', 2]];
  return `<div style="display: flex; align-items: center; gap: 8px;">${topics.map(([t, n]) => `<span class="chip ${t === active ? 'chip-topic-active' : 'chip-outline'}" style="height: 32px; padding: 0 12px; font-size: 13px;">${t}<span style="opacity: 0.7; font-weight: 400;">${n}</span></span>`).join('')}</div>`;
}

export function toolbar(variant, role, { filter = 'Kosten' } = {}) {
  const right = role === 'analyst'
    ? `<span class="btn btn-outline" style="height: 44px; color: ${T.primary};">Export ${I.download(18)}</span><span class="btn btn-primary" style="height: 44px;">${I.plus(18)} Neue Anfrage erfassen</span>`
    : `<span class="btn btn-primary" style="height: 44px;">Export ${I.download(18)}</span>`;
  if (variant === 'A') {
    return `<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;"><div style="display: flex; align-items: center; gap: 16px;">${searchBox()}${filterControl('A', filter)}</div><div style="display: flex; gap: 12px;">${right}</div></div>`;
  }
  return `<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;"><div style="display: flex; align-items: center; gap: 16px;">${searchBox()}</div><div style="display: flex; gap: 12px;">${right}</div></div>
  <div style="display: flex; align-items: center; gap: 14px; margin-top: 16px;"><span style="font-size: 13px; color: ${T.text2}; font-weight: 500;">Thema</span>${filterControl(variant, filter)}<a href="#" style="font-size: 13px; font-weight: 500; margin-left: 6px;">Zurücksetzen</a></div>`;
}

export function headerRight(variant) {
  if (variant === 'A') return `<div style="height: 20px;"></div>`;
  if (variant === 'B') return `<div style="display: flex; align-items: center; gap: 8px; color: ${T.text2}; font-size: 13px;">${I.chat(16)} 3 Fonds mit Anfragen · zuletzt aktualisiert 14.08.2026</div>`;
  return `<div style="display: flex; align-items: center; gap: 8px;">${versionSelector}<span style="color: ${T.muted};" title="Die Versionsauswahl betrifft Voranalyse, Watchlist und Empfehlungsliste. Anfragen sind versionsunabhängig.">${I.info(16)}</span></div>`;
}

// ---------- LIST screen (user view, filter active) ----------
export function listScreen(variant) {
  const rows = variant === 'A'
    ? [row('A', 'dws', { multi: true, filter: 'Kosten' }), row('A', 'flossbach', { filter: 'Kosten' })]
    : [row(variant, 'dws', { multi: true, filter: 'Kosten' }), row(variant, 'flossbach', { filter: 'Kosten' })];
  const hint = variant === 'A'
    ? `2 von 3 Fonds haben Austausche zum Thema <b>Kosten</b>. Die Zeile zeigt jeweils den neuesten Austausch zu diesem Thema.`
    : variant === 'B'
      ? `2 von 3 Fonds haben Austausche zum Thema <b>Kosten</b>. Die Zeile zeigt weiterhin den neuesten Austausch des Fonds; die Treffer sind markiert und beim Aufklappen hervorgehoben.`
      : `2 von 3 Fonds haben Austausche zum Thema <b>Kosten</b>. Die Spalte Thema und der Filter greifen auf dieselben Themen zu; beim Aufklappen springt die Historie zur Themen-Gruppe.`;
  const content = `
    ${toolbar(variant, 'user')}
    ${pager()}
    <div class="label" style="margin: -6px 0 12px 0; display: flex; align-items: center; gap: 8px; color: ${T.text2};">${I.info(16)} <span>${hint}</span></div>
    ${tableHeader(variant, 'user')}
    <div style="display: flex; flex-direction: column; gap: 12px;">${rows.join('')}</div>
    ${pager()}`;
  return page({ role: 'user', headerRight: headerRight(variant), content });
}

// ---------- EXPANDED entry (analyst view) ----------
function correctionBanner(variant) {
  if (variant === 'A') {
    return `<div class="note note-amber" style="display: flex; gap: 10px; align-items: flex-start;">${I.pencil(18)}<div><b>Korrigiert am 24.01.2026 von M. Fischer</b> · Korrekturhinweis: Name des Co-Managers wurde berichtigt (vorher „Stefan Werner“).</div></div>`;
  }
  if (variant === 'B') {
    return `<div class="note note-amber" style="display: flex; gap: 10px; align-items: center; justify-content: space-between;"><div style="display: flex; gap: 10px; align-items: center;">${I.pencil(18)}<div><b>Korrigiert am 24.01.2026 von M. Fischer</b> · Name des Co-Managers berichtigt</div></div><a href="#" style="font-weight: 600; white-space: nowrap;">Vorherige Version anzeigen</a></div>`;
  }
  return `<div class="note note-amber" style="display: flex; gap: 10px; align-items: flex-start;">${I.pencil(18)}<div style="display: flex; flex-direction: column; gap: 6px;"><div style="display: flex; gap: 8px; align-items: center;"><span class="chip chip-amber" style="height: 20px; font-size: 11px; background: #fff;">Sachliche Korrektur</span><b>24.01.2026 · M. Fischer</b></div><div>Name des Co-Managers berichtigt. <span style="text-decoration: line-through; opacity: 0.7;">Stefan Werner</span> → Stephan Werner</div></div></div>`;
}

export function expandedScreen(variant) {
  const c = COLS[variant];
  const analyst = true;
  const filter = 'Kosten';
  const classesLine = `<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;"><span style="font-size: 13px; color: ${T.text2}; font-weight: 500;">Gilt für alle 5 Anteilsklassen:</span>${DWS_CLASSES.map((k) => `<span class="chip chip-neutral" style="height: 24px; ${k.main ? `border-color: ${T.primary}; color: ${T.primary};` : ''}">${k.isin} · ${k.cls}${k.main ? ' · Haupttranche' : ''}</span>`).join('')}</div>`;
  const addBtn = `<span class="btn btn-ghost" style="height: 36px; background: ${T.chipBg}; border-radius: 100px;">${I.plus(16)} Frage &amp; Antwort hinzufügen</span>`;

  let historyBlock = '';
  if (variant === 'A') {
    // filter above table only -> expanded row shows full history, matching exchanges first? No: chronological, non-matching visible.
    const items = DWS_HISTORY.map((e) => exchange({ ...e, analyst, correction: e.corrected ? correctionBanner('A') : '' }));
    historyBlock = `
      <div style="display: flex; justify-content: space-between; align-items: center;">${classesLine}${addBtn}</div>
      <div class="label" style="display: flex; align-items: center; gap: 8px; color: ${T.text2};">${I.info(16)} Filter „Kosten“ aktiv: 2 von 5 Austauschen passen. Die vollständige Historie bleibt sichtbar, Treffer stehen zuerst.</div>
      <div style="display: flex; flex-direction: column; gap: 12px;">${[items[3], items[4], items[0], items[1], items[2]].join('')}</div>`;
  } else if (variant === 'B') {
    const items = DWS_HISTORY.map((e) => exchange({ ...e, analyst, dim: e.topic !== filter, highlight: e.topic === filter, correction: e.corrected ? correctionBanner('B') : '' }));
    historyBlock = `
      <div style="display: flex; justify-content: space-between; align-items: center;">${classesLine}${addBtn}</div>
      <div style="display: flex; align-items: center; gap: 10px;"><span class="chip chip-topic-active" style="height: 28px; padding: 0 12px;">Kosten · 2 Treffer</span><span class="label">Historie chronologisch, nicht passende Austausche abgeblendet.</span><a href="#" style="font-size: 13px; font-weight: 500;">Alle anzeigen</a></div>
      <div style="display: flex; flex-direction: column; gap: 12px;">${items.join('')}</div>`;
  } else {
    // C: grouped by topic, chronological inside groups; topic nav on the left
    const groups = ['Kosten', 'Ausschüttung', 'Compliance', 'Fondsmanagement'];
    const groupHtml = groups.map((g) => {
      const items = DWS_HISTORY.filter((e) => e.topic === g);
      return `<div id="g-${g}" style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; padding-top: 4px;"><span class="chip ${g === filter ? 'chip-topic-active' : 'chip-topic'}" style="height: 26px; padding: 0 12px; font-size: 13px;">${g}</span><span class="label">${items.length} ${items.length === 1 ? 'Austausch' : 'Austausche'} · zuletzt ${items[0].date}</span><div style="flex: 1; height: 1px; background: ${T.stroke};"></div></div>
        ${items.map((e) => exchange({ ...e, analyst, topicChipClass: 'chip chip-neutral', correction: e.corrected ? correctionBanner('C') : '' })).join('')}
      </div>`;
    }).join('');
    const nav = `<div style="width: 200px; flex: none; position: sticky; top: 16px; display: flex; flex-direction: column; gap: 4px; align-self: flex-start;">
      <div class="eyebrow" style="margin-bottom: 6px;">Themen in dieser Historie</div>
      ${groups.map((g) => `<a href="#g-${g}" style="display: flex; justify-content: space-between; padding: 8px 10px; border-radius: 6px; font-size: 13px; font-weight: 500; ${g === filter ? `background: ${T.chipBg}; color: ${T.chipText};` : `color: ${T.text2};`}">${g}<span style="opacity: 0.7;">${DWS_HISTORY.filter((e) => e.topic === g).length}</span></a>`).join('')}
      <div style="height: 1px; background: ${T.stroke}; margin: 8px 0;"></div>
      <a href="#" style="padding: 8px 10px; font-size: 13px; font-weight: 500; color: ${T.text2};">Chronologisch anzeigen</a>
    </div>`;
    historyBlock = `
      <div style="display: flex; justify-content: space-between; align-items: center;">${classesLine}${addBtn}</div>
      <div style="display: flex; gap: 24px; align-items: flex-start;">${nav}<div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">${groupHtml}</div></div>`;
  }

  const content = `
    ${toolbar(variant, 'analyst')}
    ${pager()}
    ${tableHeader(variant, 'analyst')}
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div>
        ${row(variant, 'dws', { role: 'analyst', open: true, multi: true, filter })}
        <div style="border: 1px solid ${T.primary}; border-top: none; border-radius: 0 0 8px 8px; background: #fbfcfe; padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 16px;">${historyBlock}</div>
      </div>
      ${row(variant, 'flossbach', { role: 'analyst', filter })}
    </div>
    ${pager()}`;
  return page({ role: 'analyst', headerRight: headerRight(variant), content, minHeight: 1024 });
}
