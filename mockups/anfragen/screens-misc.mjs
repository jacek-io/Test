import { T, I, page, searchBox, pager, th, versionSelector, exchange } from './lib.mjs';
import { DWS_HISTORY, tableHeader, toolbar, headerRight } from './screens-list.mjs';

// ---------- Marker in Voranalyse (dense table) ----------
const VORANALYSE = [
  { isin: 'DE0009848119', wkn: '984811', name: 'DWS Top Dividende LD', cat: 'Aktien Global Dividende', rating: 'A', p1: '+9,4 %', p3: '+21,7 %', vol: '19,8 Mrd.', entry: 5 },
  { isin: 'DE0009848127', wkn: '984812', name: 'DWS Top Dividende FC', cat: 'Aktien Global Dividende', rating: 'A', p1: '+10,1 %', p3: '+23,9 %', vol: '19,8 Mrd.', entry: 5 },
  { isin: 'IE0003580214', wkn: '973270', name: 'Fidelity European Growth A', cat: 'Aktien Europa', rating: 'B', p1: '+6,2 %', p3: '+14,3 %', vol: '4,1 Mrd.', entry: 1 },
  { isin: 'LU0323578657', wkn: 'A0M430', name: 'Flossbach von Storch – Multi Asset R', cat: 'Mischfonds Ausgewogen', rating: 'A', p1: '+4,8 %', p3: '+11,0 %', vol: '3,3 Mrd.', entry: 2 },
  { isin: 'LU0552385295', wkn: 'A1C81G', name: 'Morgan Stanley Global Opportunity A', cat: 'Aktien Global Wachstum', rating: 'B', p1: '+12,6 %', p3: '+18,2 %', vol: '11,2 Mrd.', entry: 0 },
  { isin: 'IE00B4L5Y983', wkn: 'A0RPWH', name: 'iShares Core MSCI World UCITS ETF', cat: 'Aktien Global ETF', rating: 'A', p1: '+11,3 %', p3: '+27,5 %', vol: '78,4 Mrd.', entry: 0 },
  { isin: 'LU0072462426', wkn: '987062', name: 'BlackRock Global Allocation A2', cat: 'Mischfonds Flexibel', rating: 'C', p1: '+3,9 %', p3: '+8,7 %', vol: '9,6 Mrd.', entry: 0 },
];

function markerA(f) {
  if (!f.entry) return '';
  return `<span style="display: inline-flex; align-items: center; color: ${T.primary}; margin-left: 8px; vertical-align: middle;">${I.chat(18)}</span>`;
}
function markerB(f) {
  if (!f.entry) return '';
  return `<span class="chip chip-topic" style="height: 20px; font-size: 11px; margin-left: 8px; vertical-align: middle;">${I.chat(12)} ${f.entry} ${f.entry === 1 ? 'Anfrage' : 'Anfragen'}</span>`;
}

export function markerScreen(variant) {
  const cols = variant === 'C'
    ? [['', 44], ['ISIN', 150], ['WKN', 90], ['Fondsname', 330], ['Kategorie', 210], ['FC-Rating', 100], ['Perf. 1 J.', 100], ['Perf. 3 J.', 100], ['Volumen', 110], ['', 60]]
    : [['ISIN', 150], ['WKN', 90], ['Fondsname', 380], ['Kategorie', 220], ['FC-Rating', 100], ['Perf. 1 J.', 100], ['Perf. 3 J.', 100], ['Volumen', 110], ['', 60]];
  const cell = (w, html, extra = '') => `<div style="width: ${w}px; flex: none; ${extra}">${html}</div>`;
  const ratingChip = (r) => `<span class="chip" style="height: 22px; background: ${r === 'A' ? T.greenBg : r === 'B' ? T.chipBg : T.amberBg}; color: ${r === 'A' ? T.greenText : r === 'B' ? T.chipText : T.amberText}; font-weight: 600;">${r}</span>`;
  const rows = VORANALYSE.map((f, idx) => {
    const isFirst = idx === 0;
    const tooltip = isFirst && variant === 'A' ? `<div class="tt" style="left: 300px; top: 44px;">5 Anfragen zu DWS Top Dividende (alle Anteilsklassen) · zuletzt 14.08.2026<br><span style="opacity: 0.75;">Klick öffnet den Eintrag im Tab Anfragen</span></div>` : '';
    const name = variant === 'A' ? `<a href="#" style="font-weight: 600;">${f.name}</a>${markerA(f)}` : variant === 'B' ? `<a href="#" style="font-weight: 600;">${f.name}</a>${markerB(f)}` : `<a href="#" style="font-weight: 600;">${f.name}</a>`;
    const lead = variant === 'C' ? cell(44, f.entry ? `<span style="display: inline-flex; width: 28px; height: 28px; border-radius: 100px; background: ${isFirst ? T.primary : T.chipBg}; color: ${isFirst ? '#fff' : T.chipText}; align-items: center; justify-content: center;">${I.chat(16)}</span>` : `<span style="display: inline-block; width: 28px;"></span>`) : '';
    return `<div class="card" style="position: relative; display: flex; align-items: center; padding: 14px 20px; ${isFirst && variant !== 'C' ? `border-color: ${T.primary};` : ''} ${isFirst && variant === 'C' ? `background: ${T.infoBg};` : ''}">
      ${lead}
      ${cell(150, f.isin)}${cell(90, `<span style="color: ${T.text2};">${f.wkn}</span>`)}
      ${cell(variant === 'C' ? 330 : 380, name)}
      ${cell(variant === 'C' ? 210 : 220, `<span style="color: ${T.text2};">${f.cat}</span>`)}
      ${cell(100, ratingChip(f.rating))}${cell(100, f.p1)}${cell(100, f.p3)}${cell(110, f.vol)}
      ${cell(60, `<span style="color: ${T.text2}; display: inline-flex; gap: 10px;">${I.bookmark(18)}</span>`)}
      ${tooltip}
    </div>`;
  }).join('');

  const legend = variant === 'A'
    ? `<b>Marker:</b> Sprechblasen-Icon direkt hinter dem Fondsnamen – kein zusätzlicher Platzbedarf in der Tabelle. Jede Anteilsklasse des Fonds trägt den gleichen Marker. <b>Klick:</b> wechselt zum Tab Anfragen, Suche vorbelegt mit dem Fonds, Eintrag <b>aufgeklappt</b> und kurz hervorgehoben.`
    : variant === 'B'
      ? `<b>Marker:</b> Zähler-Chip „n Anfragen“ hinter dem Fondsnamen – zeigt zusätzlich, wie viel Historie existiert. <b>Klick:</b> wechselt zum Tab Anfragen mit der Liste gefiltert auf den Fonds (ein Treffer, <b>zugeklappt</b>); der Nutzer klappt selbst auf. Im Tab Anfragen bleibt die Themen-Leiste bedienbar.`
      : `<b>Marker:</b> eigene schmale Icon-Spalte am Zeilenanfang, in allen drei Tabellen an derselben Stelle. <b>Klick:</b> öffnet ein <b>Seitenpanel</b> mit der Historie des Fonds, ohne den Tab zu verlassen; „Im Tab Anfragen öffnen“ führt bei Bedarf weiter.`;

  const drawer = variant === 'C' ? `
    <div style="position: absolute; top: 0; right: 0; bottom: 0; width: 520px; background: #fff; border-left: 1px solid ${T.stroke}; box-shadow: -16px 0 40px rgba(20,24,58,0.12); display: flex; flex-direction: column;">
      <div style="padding: 20px 24px 12px; border-bottom: 1px solid ${T.stroke}; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;"><div class="eyebrow">Anfragen · Fondsebene</div><span style="color: ${T.text2};">${I.close(20)}</span></div>
        <div style="font-weight: 700; font-size: 18px;">DWS Top Dividende</div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;"><span class="chip chip-neutral">DE0009848119 · LD</span><span class="chip chip-neutral">+4 Klassen</span><span class="label" style="align-self: center;">5 Austausche · zuletzt 14.08.2026</span></div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">${['Alle 5', 'Kosten 2', 'Ausschüttung 1', 'Compliance 1', 'Fondsmanagement 1'].map((t, i) => `<span class="chip ${i === 0 ? 'chip-topic-active' : 'chip-outline'}">${t}</span>`).join('')}</div>
      </div>
      <div style="padding: 16px 24px; display: flex; flex-direction: column; gap: 12px; overflow: hidden; flex: 1;">
        ${DWS_HISTORY.slice(0, 3).map((e) => `<div class="card" style="padding: 12px 14px; display: flex; flex-direction: column; gap: 6px;"><div style="display: flex; gap: 10px; align-items: center;"><span class="chip chip-topic" style="height: 20px; font-size: 11px;">${e.topic}</span><span class="label">${e.date} · ${e.answeredBy}</span></div><div style="font-weight: 500;">${e.q}</div><div style="color: ${T.text2}; font-size: 13px;">${e.a}</div></div>`).join('')}
        <div class="label" style="text-align: center;">… 2 weitere Austausche</div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid ${T.stroke}; display: flex; justify-content: space-between; align-items: center;"><span class="btn btn-outline">Rückfrage stellen</span><a href="#" style="display: inline-flex; gap: 6px; align-items: center; font-weight: 600;">Im Tab Anfragen öffnen ${I.external(16)}</a></div>
    </div>` : '';

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;"><div style="display: flex; gap: 16px;">${searchBox()}<div class="select-sm" style="height: 48px; padding: 0 18px; border-radius: 100px; font-size: 14px;">Alle Kategorien ${I.chevD(16)}</div><div class="select-sm" style="height: 48px; padding: 0 18px; border-radius: 100px; font-size: 14px;">FC-Rating ${I.chevD(16)}</div></div><span class="btn btn-primary" style="height: 44px;">Export ${I.download(18)}</span></div>
    ${pager()}
    <div style="display: flex; align-items: center; padding: 0 20px 12px;">${cols.map(([l, w]) => th(l, w)).join('')}</div>
    <div style="display: flex; flex-direction: column; gap: 10px;">${rows}</div>
    <div class="note note-info" style="margin-top: 24px; display: flex; gap: 10px;">${I.info(18)}<div>${legend}</div></div>`;
  const pageHtml = page({ role: 'user', headerRight: variant === 'C' ? versionSelector : (variant === 'B' ? versionSelector : versionSelector), content, activeTab: 'Voranalyse' });
  return variant === 'C' ? `<div style="position: relative; width: 1440px;">${pageHtml}${drawer}</div>` : pageHtml;
}

// ---------- Empty state ----------
export function emptyScreen(role) {
  const cta = role === 'analyst'
    ? `<span class="btn btn-primary" style="margin-top: 8px;">${I.plus(18)} Erste Anfrage erfassen</span>`
    : `<div class="label" style="margin-top: 6px;">Fragen zu einem Fonds stellen Sie wie bisher über die Anfrage-Buttons in Voranalyse, Watchlist und Empfehlungsliste.</div>`;
  const content = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">${searchBox()}<div style="display: flex; gap: 12px;">${role === 'analyst' ? `<span class="btn btn-outline" style="height: 44px; color: ${T.primary};">Export ${I.download(18)}</span><span class="btn btn-primary" style="height: 44px;">${I.plus(18)} Neue Anfrage erfassen</span>` : `<span class="btn btn-primary" style="height: 44px;">Export ${I.download(18)}</span>`}</div></div>
    ${pager()}
    <div style="display: flex; align-items: center; padding: 0 20px 12px;">${[['Datum', 150], ['ISIN', 220], ['Fondsname', 260], ['Fragestellung', 260], ['Feedback FondsConsult', 260], ['Dokumente', 150]].map(([l, w]) => th(l, w)).join('')}</div>
    <div class="card" style="min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; gap: 10px;">
      <span style="color: ${T.primary}; opacity: 0.6;">${I.chat(56)}</span>
      <div style="font-weight: 700; font-size: 18px; margin-top: 6px;">Hier stehen noch keine Anfragen</div>
      <div style="color: ${T.text2}; max-width: 520px; line-height: 1.5;">In diesem Tab dokumentiert FondsConsult die Fragen, die Merkur-Nutzer zu Fonds stellen, zusammen mit den Antworten – für alle im Team lesbar. Ein Eintrag entsteht, sobald FondsConsult eine per E-Mail eingegangene Frage beantwortet und hier erfasst.</div>
      ${cta}
    </div>
    ${pager()}`;
  return page({ role, headerRight: `<div style="height: 20px;"></div>`, content });
}

// ---------- Main: cover & decision matrix ----------
export function coverBoard() {
  const rows = [
    ['3 · Themenfilter', 'Dropdown „Thema“ neben der Suche. Zugeklappte Zeile zeigt den neuesten Austausch <b>zum gefilterten Thema</b>.', 'Chip-Leiste mit Zählern über der Tabelle. Zeile zeigt weiterhin den neuesten Austausch überhaupt + Badge „n Treffer“; beim Aufklappen sind Treffer hervorgehoben.', 'Chip-Leiste + eigene Spalte <b>Thema</b>. Historie beim Aufklappen nach Thema gruppiert, Themen-Navigation links.'],
    ['4 · ISIN bei mehreren Klassen', 'Bezugs-ISIN der letzten Frage + Chip „+4 Klassen“; alle Klassen im aufgeklappten Kopf.', 'ISIN-Spalte entfällt; Fonds-Zelle zeigt „5 Anteilsklassen“, Suche findet weiterhin jede ISIN/WKN.', 'ISIN der Haupttranche, so beschriftet, + Chip „+4“.'],
    ['7 · Versionsselektor', 'Auf dem Tab Anfragen ausgeblendet (Relikt).', 'Ersetzt durch Status „3 Fonds mit Anfragen · zuletzt aktualisiert …“.', 'Bleibt wie in den anderen Tabs, mit Info-Icon „Anfragen sind versionsunabhängig“.'],
    ['8 · Korrektur-Modal', 'Zwei Felder: <b>Korrigierte Antwort</b> + <b>Korrekturhinweis</b> (Pflicht). Datum/Name generiert das System.', 'Ein Feld + optionaler Grund; vorherige Version bleibt über Link einsehbar.', 'Art der Korrektur (Tippfehler / Sachlich / Ergänzung) steuert den Hinweis; Vorher/Nachher automatisch.'],
    ['9 · Marker aus anderen Tabs', 'Sprechblasen-Icon hinter dem Namen → Tab Anfragen, Eintrag <b>aufgeklappt</b>.', 'Chip „n Anfragen“ → Tab Anfragen, gefiltert auf den Fonds, <b>zugeklappt</b>.', 'Icon-Spalte → <b>Seitenpanel</b> mit Historie, ohne Tab-Wechsel.'],
    ['C · Fonds hat schon Eintrag', 'Info-Hinweis, automatisches Anhängen an die Historie.', 'Warnung mit Wahl: „Zur Historie hinzufügen“ / „Eintrag öffnen“.', 'Schon im Fonds-Picker markiert; Dialog wechselt zu „Frage &amp; Antwort hinzufügen“.'],
    ['Dokumente (zugeklappt)', 'Inline unter der Antwort („2 Dokumente“), wie in der Figma-Makiete.', 'Eigene Spalte Dokumente mit Zähler.', 'Eigene Spalte Dokumente mit Zähler.'],
  ];
  const common = ['1 · Feld „Eingereicht von“ im Erfassen-Modal', '2 · Editierbares Feld Analyst/in (Standard: angemeldet)', '5 · Eigener Empty-State-Text (User + Analyst)', '6 · Tippfehler „speichern“, „Merkur Privatbank“; getrennte Placeholder; echte Frage im Feld Frage', 'Bestätigung „Nachricht gesendet“ für Rückfrage / Update', 'Modal „Frage &amp; Antwort hinzufügen“ (Flow D)', 'Analyst-Link „+ Neue Anfrage erfassen“ aus der User-Ansicht entfernt', 'Interne Notiz „Entwurf – offene Entscheidung“ aus der Makiete entfernt'];
  return `
  <div style="width: 1440px; min-height: 1180px; background: ${T.bg}; padding: 48px 56px; display: flex; flex-direction: column; gap: 28px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <div><div class="eyebrow" style="color: ${T.primary};">Merkur-Modul · Tab Anfragen · Design-Review</div><div class="h1" style="font-size: 40px; margin-top: 8px;">Drei Varianten zu den offenen Fragen</div><div style="color: ${T.text2}; margin-top: 10px; max-width: 760px; line-height: 1.5;">Alle drei Varianten enthalten die eindeutigen Korrekturen aus dem Review (Seite „Gemeinsame Fixes“). Sie unterscheiden sich nur dort, wo das Review eine Entscheidung offen gelassen hat. Empfehlung zur Diskussion: <b>Variante B</b> für Fondsebene und Marker, <b>Variante A</b> für das Korrektur-Modal.</div></div>
      <div style="display: flex; gap: 12px;">
        ${[['A', 'Minimal', 'Kleinster Abstand zur aktuellen Makiete'], ['B', 'Fondsebene', 'Ein Fonds = eine Historie, konsequent'], ['C', 'Thema-first', 'Thema als Spalte, Gruppe und Panel']].map(([k, n, d]) => `<div class="card" style="width: 200px; padding: 14px 16px; border-top: 4px solid ${k === 'A' ? '#4c556b' : k === 'B' ? T.primary : '#1c6b3a'};"><div style="font-weight: 700; font-size: 16px;">Variante ${k} · ${n}</div><div class="label" style="margin-top: 4px;">${d}</div></div>`).join('')}
      </div>
    </div>
    <div class="card" style="overflow: hidden;">
      <div style="display: grid; grid-template-columns: 200px repeat(3, minmax(0, 1fr)); background: ${T.bg}; border-bottom: 1px solid ${T.stroke}; font-weight: 600;">
        <div style="padding: 14px 18px;">Offene Frage (Nr. im Review)</div><div style="padding: 14px 18px;">Variante A · Minimal</div><div style="padding: 14px 18px;">Variante B · Fondsebene</div><div style="padding: 14px 18px;">Variante C · Thema-first</div>
      </div>
      ${rows.map((r, i) => `<div style="display: grid; grid-template-columns: 200px repeat(3, minmax(0, 1fr)); border-bottom: ${i === rows.length - 1 ? 'none' : `1px solid ${T.stroke}`}; font-size: 13px; line-height: 1.5;"><div style="padding: 14px 18px; font-weight: 600;">${r[0]}</div><div style="padding: 14px 18px; color: ${T.text2};">${r[1]}</div><div style="padding: 14px 18px; color: ${T.text2};">${r[2]}</div><div style="padding: 14px 18px; color: ${T.text2};">${r[3]}</div></div>`).join('')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px;">
      <div class="card" style="padding: 20px 22px;"><div style="font-weight: 700; margin-bottom: 10px;">In allen Varianten korrigiert</div><div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: ${T.text2};">${common.map((c) => `<div style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: ${T.greenText}; flex: none;">${I.check(16)}</span><span>${c}</span></div>`).join('')}</div></div>
      <div class="card" style="padding: 20px 22px;"><div style="font-weight: 700; margin-bottom: 10px;">Zusätzlich beim Review aufgefallen</div><div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: ${T.text2};">${[
        'Spalte „Dokumente“ fehlt in der gefüllten Tabelle, ist aber im leeren Zustand und im Ticket (6 Datenpunkte) vorhanden.',
        'Bedeutung von „Datum“ unklar (Erstellung vs. letzte Aktivität). Vorschlag: „letzte Aktivität“, passend zur Standardsortierung.',
        'Nicht gezeichnet, aber Akzeptanzkriterium: Bestätigung nach Senden, Umgang mit bereits vorhandenem Eintrag, Modal zum Ergänzen der Historie, Marker in den drei Tabellen.',
        'Drei Zeilen in der Beispieltabelle reichen nicht, um Standardsortierung und Paginierung zu zeigen.',
        'Beim Klienten offen: bleibt ein Button „Anfrage stellen“ im Tab? Layout lässt Platz neben Export.',
      ].map((c) => `<div style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: ${T.amberText}; flex: none;">${I.alert(16)}</span><span>${c}</span></div>`).join('')}</div></div>
    </div>
  </div>`;
}
