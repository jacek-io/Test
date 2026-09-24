// Generates the artboards + canvas.json for the Sparkasse Leipzig folder-panel design. node build.mjs
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { T, I } from '../anfragen/lib.mjs';
import { doc, page, search, quick, investGroup, iconBtn, filterBtn, pager, selectionChip, folderPanel, rail, voranalyseTable, matrixTable, printIcon, panelIcon, folderIcon, TREE, TOTAL, PEERGROUP_COUNT, de, MATRIX_TREE, MATRIX_UNASSIGNED, MATRIX_TOTAL } from './ui.mjs';

const OUT = new URL('./out/', import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
const boards = [], notes = [];
const pages = [{ id: 'uebersicht', name: 'Übersicht' }, { id: 'var-a', name: 'Variante A · Seitenleiste' }, { id: 'var-b', name: 'Variante B · Drawer' }, { id: 'var-c', name: 'Variante C · Ordnerpfad' }, { id: 'gemeinsam', name: 'Fondsmatrix · Schalter · FC-1149' }];
function add(stem, title, html, o) { writeFileSync(OUT + stem + '.dc.html', doc(title, html)); boards.push({ file: stem + '.dc.html', title, ...o }); }
function note(id, pg, x, y, w, text) { notes.push({ id, page: pg, x, y, w, text }); }

const SEL = { l1: 'Aktien', l2: 'Aktien Europa' };
const SEL_PATH = ['Aktien', 'Aktien Europa'];
const SEL_COUNT = TREE.find((r) => r.name === 'Aktien').children.find((s) => s.name === 'Aktien Europa').count;
const EXP = new Set(['Aktien', 'Aktien Europa']);
const HINT = (n, count) => `<div style="display: flex; align-items: center; gap: 10px; margin: 0 0 14px;"><span class="eyebrow">Aktuelle Auswahl</span><span style="font-weight: 700; font-size: 16px;">${n}</span><span class="label">·</span><span style="font-size: 13px; color: ${T.text2};"><b style="color: ${T.text};">${de(count)}</b> Fonds</span></div>`;
const anno = (n, x, y) => `<span class="anno" style="left: ${x}px; top: ${y}px;">${n}</span>`;

// ---------------- toolbar variants ----------------
function toolbarA({ lvs = true, ivv = false } = {}) {
  return `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px;">${search()}${quick('Fondsgesellschaft')}${investGroup({ lvs, ivv })}<div style="flex: 1;"></div>${filterBtn()}${iconBtn(printIcon(20))}</div>`;
}
function toolbarClosed({ lvs = true, ivv = false } = {}) {
  const btn = `<span class="qf" style="border-color: ${T.primary}; gap: 8px; padding-right: 10px;"><span style="color: ${T.primary}; display: inline-flex; gap: 6px; align-items: center;">${panelIcon(18)} Ordner</span><span style="width: 1px; height: 20px; background: ${T.stroke};"></span><span style="color: ${T.text2}; font-weight: 500;">Aktien ›</span><span>Aktien Europa</span><span class="chip chip-topic" style="height: 20px;">${de(SEL_COUNT)}</span><span style="display: inline-flex; color: ${T.muted};">${I.close(14)}</span></span>`;
  return `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px;">${search('Fondssuche über ISIN, WKN oder Name…', 240)}${btn}${quick('Fondsgesellschaft')}${investGroup({ lvs, ivv })}<div style="flex: 1;"></div>${filterBtn()}${iconBtn(printIcon(20))}</div>`;
}

// ---------------- Übersicht ----------------
function overview() {
  const rows = [
    ['Lage des Panels', 'Links neben der Tabelle, 300 px, im Layout. Klappt auf eine 48-px-Leiste zusammen; die Tabelle fließt nach.', 'Über der Tabelle, 360 px, von links eingeschoben mit Abdunklung. Tabelle bleibt in voller Breite darunter.', 'Kein Panel: ein Pfad-Button in der Filterleiste („Alle Fonds › Aktien › Aktien Europa“) öffnet ein Popover mit drei Spalten.'],
    ['Tabelle lesbar?', 'Tabelle 1044 px statt 1360 px: Name-Spalte kürzer, Pillen enger; alle Spalten bleiben ohne horizontales Scrollen sichtbar.', 'Ja, solange das Panel zu ist. Beim Browsen ist die Tabelle verdeckt, Auswahl und Ergebnis sieht man nicht gleichzeitig.', 'Ja, immer volle Breite. Der Baum ist nur im Popover sichtbar, kein Überblick beim Scrollen.'],
    ['Öffnen vs. Auswählen', 'Chevron öffnet den Ordner, Klick auf den Namen wählt ihn (alle Ebenen wählbar). Auswahl bleibt beim Zuklappen erhalten.', 'Gleich wie A. Auswahl schließt den Drawer nicht automatisch; „Fertig“ oder Klick außerhalb.', 'Spalte 1 → Spalte 2 → Spalte 3 (Miller-Spalten). Klick wählt und zeigt die nächste Ebene zugleich.'],
    ['Auswahl bei geschlossenem Panel', 'Pfad-Chip mit × in der Zeile „Aktuelle Auswahl“ über der Tabelle + blauer Punkt an der Leiste.', 'Der „Ordner“-Button trägt den Pfad und den Zähler; dazu die Zeile „Aktuelle Auswahl“.', 'Der Pfad-Button selbst ist die Anzeige.'],
    ['Panel-Suche', 'Suchfeld im Panel filtert den Baum, klappt Treffer auf, ↵ wählt den ersten.', 'Gleich wie A.', 'Suchfeld oben im Popover, Treffer als flache Liste.'],
    ['Fondsmatrix', 'Gleiches Panel, zwei Ebenen, „Ohne Assetklasse“ als letzter Eintrag. Tabelle hat sowieso horizontales Scrollen.', 'Gleich wie A, aber der Drawer verdeckt die Tabelle, die der Kunde ganz auf einer Seite sehen will.', 'Zwei Spalten im Popover.'],
    ['Empfehlung', '<b>Empfohlen.</b> Ordner sind laut Kunde die Hauptnavigation; sie sollten dauerhaft sichtbar sein und trotzdem weichen können.', 'Rückfalloption für schmale Bildschirme (< 1280 px): Variante A verhält sich dort wie B.', 'Nur wenn der Kunde den Baum nicht dauerhaft sehen will. Am nächsten am heutigen Quick-Filter.'],
  ];
  const cell = (h) => `<div style="padding: 14px 18px; font-size: 13px; line-height: 1.5; color: ${T.text2};">${h}</div>`;
  return `<div style="width: 1440px; min-height: 1500px; background: ${T.bg}; padding: 48px 56px; display: flex; flex-direction: column; gap: 28px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 32px;">
      <div><div class="eyebrow" style="color: ${T.primary};">Sparkasse Leipzig · Voranalyse & Fondsmatrix · Ordner-Panel</div><div class="h1" style="font-size: 40px; margin-top: 8px;">Drei Layout-Richtungen für das Ordner-Panel</div><div style="color: ${T.text2}; margin-top: 10px; max-width: 760px; line-height: 1.5;">Alle drei Varianten nutzen denselben Ordnerbaum (3 Ebenen aus dem Peergroup-Namen, ETF als eigener Top-Ordner, Suche, Zähler) und dieselben Schalter „Investierbar für LVS / IVV“. Sie unterscheiden sich nur darin, <b>wo</b> der Baum liegt und wie er weicht.</div></div>
      <div style="display: flex; gap: 12px;">${[['A', 'Seitenleiste', 'Dauerhaft sichtbar, klappt auf 48 px', T.primary], ['B', 'Drawer', 'Über der Tabelle, bei Bedarf', '#4c556b'], ['C', 'Ordnerpfad', 'Popover aus der Filterleiste', '#1c6b3a']].map(([k, n, d, c]) => `<div class="card" style="width: 200px; padding: 14px 16px; border-top: 4px solid ${c};"><div style="font-weight: 700; font-size: 16px;">Variante ${k} · ${n}</div><div class="label" style="margin-top: 4px;">${d}</div></div>`).join('')}</div>
    </div>
    <div class="card" style="overflow: hidden;">
      <div style="display: grid; grid-template-columns: 200px repeat(3, minmax(0, 1fr)); background: ${T.bg}; border-bottom: 1px solid ${T.stroke}; font-weight: 600;"><div style="padding: 14px 18px;">Frage</div><div style="padding: 14px 18px;">A · Seitenleiste</div><div style="padding: 14px 18px;">B · Drawer</div><div style="padding: 14px 18px;">C · Ordnerpfad</div></div>
      ${rows.map((r, i) => `<div style="display: grid; grid-template-columns: 200px repeat(3, minmax(0, 1fr)); border-bottom: ${i === rows.length - 1 ? 'none' : `1px solid ${T.stroke}`};"><div style="padding: 14px 18px; font-weight: 600; font-size: 13px;">${r[0]}</div>${cell(r[1])}${cell(r[2])}${cell(r[3])}</div>`).join('')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px;">
      <div class="card" style="padding: 20px 22px;"><div style="font-weight: 700; margin-bottom: 10px;">Kann die Panel-Suche den Quick-Filter „FCR Peergroup“ ersetzen?</div><div style="font-size: 13px; color: ${T.text2}; line-height: 1.55;"><b style="color: ${T.greenText};">Ja.</b> Der heutige Quick-Filter ist ein flaches Dropdown mit ${PEERGROUP_COUNT} Einträgen; die Panel-Suche findet dieselben Einträge, zeigt aber zusätzlich den Ordnerpfad und den Zähler. Beides nebeneinander würde zwei Wege für dieselbe Auswahl bedeuten. Konsequenz: <b>„FCR Peergroup“ entfällt</b>, ebenso <b>„Nur ETFs“</b> (der ETF-Ordner ersetzt ihn) und „Anlageklasse“ (laut Anforderungskatalog). „Fondsgesellschaft“ und „Filter“ bleiben.<br><br>Offen mit dem Kunden: die Suche findet nur Peergroups, nicht Fonds. Fondssuche bleibt links wie heute.</div></div>
      <div class="card" style="padding: 20px 22px;"><div style="font-weight: 700; margin-bottom: 10px;">Annahmen (bitte prüfen)</div><div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: ${T.text2};">${[
        'Ordnerregel mechanisch: Ebene 1 = erstes Wort, Ebene 2 = erste zwei Wörter. Ergibt auch Ordner wie „Renten RMB“ oder „Aktien Branche“ (12 Peergroups). Falls das Analyst Tool eine kuratierte Ebene 2 hat, übernehmen wir die.',
        'ETF-Peergroups beginnen mit „ETF“; unter dem ETF-Ordner gelten Ebene 2 und 3 nach Abzug des Präfixes.',
        'Zähler folgen den LVS/IVV-Schaltern und dem Fondsgesellschaft-Filter, nicht der Textsuche. Leere Ordner bleiben sichtbar (0, ausgegraut).',
        'Klick auf einen Ordner beliebiger Ebene filtert auf alle Fonds darunter. Nur eine Auswahl gleichzeitig.',
        'Auswahl und Auf-/Zuklappen des Panels bleiben pro Nutzer und Tab gespeichert.',
        `Beispieldaten: ${de(TOTAL)} Fonds in ${PEERGROUP_COUNT} Peergroups; der Prototyp des Kunden nennt 12.029 Fonds in 206 Peergroups. Namen folgen dem Live-Produkt, Zähler sind Näherungen.`,
      ].map((c) => `<div style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: ${T.amberText}; flex: none;">${I.alert(16)}</span><span>${c}</span></div>`).join('')}</div></div>
      <div class="card" style="padding: 20px 22px;"><div style="font-weight: 700; margin-bottom: 10px;">Berührungspunkte mit FC-1149</div><div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: ${T.text2};">${[
        '<b>Neue IVV-Spalte + rote Zeilenleiste</b>: passen in die schmalere Tabelle (siehe Board G3), aber die Name-Spalte wird bei offenem Panel auf ~250 px gekürzt. Lange Fondsnamen laufen deshalb zweizeilig (gezeigt in A1/G3).',
        '<b>Fondsmatrix ganz auf einer Seite + Stammdaten immer offen</b>: die Tabelle wird breiter und höher, das Panel nimmt 300 px weg. Horizontales Scrollen (oben + unten) ist dort sowieso vorgesehen, deshalb unkritisch.',
        '<b>Export nur des offenen Ordners</b>: der Export-Button muss die Auswahl im Label zeigen („Exportieren · Aktien Europa · 14“), sonst wundert sich der Nutzer über die Dateigröße.',
        '<b>Fondsname verlinkt zur Voranalyse</b>: der Link soll dort den Ordner des Fonds öffnen, damit der Kontext erhalten bleibt.',
        '<b>„Nur investierbare Fonds“</b> wird durch zwei Schalter ersetzt; der grüne Zeilenstreifen bleibt LVS, der rote kommt für IVV.',
      ].map((c) => `<div style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: ${T.primary}; flex: none;">${I.info(16)}</span><span>${c}</span></div>`).join('')}</div></div>
    </div>
  </div>`;
}
add('Main', 'Übersicht · Entscheidungsmatrix', overview(), { page: 'uebersicht', x: 0, y: 0, w: 1440, h: 1500 });

// ---------------- Variante A ----------------
{
  const p = 'var-a';
  const content1 = `${toolbarA()}${pager({ pages: 57 })}
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      ${folderPanel({ width: 300, sel: SEL, expanded: EXP, footer: 'Klick auf den Namen wählt den Ordner, das Chevron klappt ihn nur auf. Zähler berücksichtigen die Schalter LVS/IVV.' })}
      <div style="flex: 1; min-width: 0;">${HINT('Aktien › Aktien Europa', SEL_COUNT)}${voranalyseTable({ width: 1044, compact: true })}</div>
    </div>`;
  add('A1_Voranalyse_Panel_offen', 'A1 · Voranalyse, Panel offen, „Aktien Europa“ gewählt', page({ tab: 'Voranalyse', content: content1, minHeight: 1200 }), { page: p, x: 0, y: 0, w: 1440, h: 1200 });

  const content2 = `${toolbarA()}${pager({ pages: 57 })}
    <div style="display: flex; gap: 16px; align-items: flex-start;">${rail({ hasSelection: true })}<div style="flex: 1; min-width: 0;"><div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;"><span class="eyebrow">Aktuelle Auswahl</span>${selectionChip(SEL_PATH, SEL_COUNT)}</div>${voranalyseTable({ width: 1296, compact: false })}</div></div>`;
  add('A2_Voranalyse_Panel_zu', 'A2 · Voranalyse, Panel zugeklappt (Leiste), Auswahl sichtbar', page({ tab: 'Voranalyse', content: content2, minHeight: 1200 }), { page: p, x: 1560, y: 0, w: 1440, h: 1200 });

  const content3 = `${toolbarA()}${pager({ pages: 15 })}
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      ${folderPanel({ width: 300, sel: {}, expanded: new Set(), searchQ: 'Japan' })}
      <div style="flex: 1; min-width: 0;">${HINT('Alle Fonds', TOTAL)}${voranalyseTable({ width: 1044, compact: true })}</div>
    </div>`;
  add('A3_Voranalyse_Panelsuche', 'A3 · Panel-Suche „Japan“: Treffer aufgeklappt, Rest ausgeblendet', page({ tab: 'Voranalyse', content: content3, minHeight: 1200 }), { page: p, x: 0, y: 1320, w: 1440, h: 1200 });

  // detail: open vs select anatomy
  const detail = `<div style="width: 1100px; min-height: 1120px; background: ${T.bg}; padding: 40px; display: flex; gap: 40px;">
    <div style="position: relative;">${folderPanel({ width: 340, sel: SEL, expanded: new Set(['Aktien', 'Aktien Europa']), footer: 'Klick auf den Namen wählt, Chevron klappt auf.' })}
      ${anno(1, 8, 115)}${anno(2, 8, 156)}${anno(3, 150, 156)}${anno(4, 300, 191)}${anno(5, 8, 70)}${anno(6, 8, 972)}${anno(7, 60, 224)}</div>
    <div style="flex: 1; display: flex; flex-direction: column; gap: 14px;">
      <div class="h1" style="font-size: 26px;">Panel-Anatomie: Öffnen, Auswählen, Zähler</div>
      ${[
        ['1', '„Alle Fonds“', `Erster Eintrag, immer sichtbar, mit Gesamtzahl. Hebt jede Ordnerauswahl auf. Entspricht dem heutigen Zustand ohne Peergroup-Filter.`],
        ['2', 'Chevron = öffnen', `24-px-Ziel links vom Ordner. Klappt nur auf oder zu und ändert die Auswahl <b>nicht</b>. Ebene 3 hat kein Chevron mehr (Blätter).`],
        ['3', 'Name = auswählen', `Klick auf Ordnername oder Zähler wählt den Ordner und filtert die Tabelle auf alle Fonds darunter, auf jeder Ebene. Der gewählte Ordner ist blau hinterlegt, seine Eltern fett. Nur eine Auswahl gleichzeitig; ein zweiter Klick auf den gewählten Ordner hebt die Auswahl nicht auf, dafür gibt es „Alle Fonds“ oder das × am Chip.`],
        ['4', 'Zähler', `Anzahl Fonds im Ordner inklusive Unterordner, mit Tausenderpunkt. Sie folgen den Schaltern LVS/IVV und dem Fondsgesellschaft-Filter, nicht der Textsuche, damit der Nutzer sieht, wo sich das Suchen lohnt. Leere Ordner bleiben stehen (0, ausgegraut).`],
        ['5', 'Suche', `Filtert den Baum live, klappt alle Treffer auf und markiert die Fundstelle. ↵ wählt den ersten Treffer, × leert die Suche und stellt den vorherigen Aufklappzustand wieder her.`],
        ['6', 'ETF als eigener Top-Ordner', `Peergroups mit Präfix „ETF“ erscheinen nur hier, nicht unter Aktien/Renten. Darunter dieselben zwei Ebenen. Der Quick-Filter „Nur ETFs“ entfällt.`],
        ['7', 'Ebene 3 = Peergroup', `Der Peergroup-Name in voller Länge, bei Überlänge mit Ellipse und Tooltip. Ein gewählter Blattordner entspricht genau dem heutigen Quick-Filter „FCR Peergroup“.`],
      ].map(([n, h, t]) => `<div style="display: flex; gap: 12px; align-items: flex-start;"><span class="anno" style="position: static; flex: none;">${n}</span><div><div style="font-weight: 700;">${h}</div><div style="font-size: 13px; color: ${T.text2}; line-height: 1.5; margin-top: 2px;">${t}</div></div></div>`).join('')}
    </div>
  </div>`;
  add('A4_Panel_Anatomie', 'A4 · Panel-Anatomie (gilt für alle Varianten)', detail, { page: p, x: 1560, y: 1320, w: 1100, h: 1120 });

  note('n-a-head', p, 0, -220, 1440, 'VARIANTE A · Seitenleiste (empfohlen)\nDas Panel steht dauerhaft links neben der Tabelle (300 px) und klappt per Chevron auf eine 48-px-Leiste zusammen. Die Tabelle fließt nach: bei offenem Panel sind alle Spalten ohne horizontales Scrollen sichtbar, die Name-Spalte wird kürzer. Zustand (auf/zu, Auswahl) bleibt pro Nutzer gespeichert.');
  note('n-a-1', p, 3120, 0, 360, 'Auswahl bei geschlossenem Panel (A2): der Pfad-Chip mit × in der Zeile „Aktuelle Auswahl“ über der Tabelle und der blaue Punkt an der Leiste. Die Filterleiste bleibt unverändert; der heutige Quick-Filter „FCR Peergroup“ entfällt.');
  note('n-a-2', p, 3120, 260, 360, 'Schalter: „Investierbar für LVS / IVV“ als Gruppe rechts neben „Fondsgesellschaft“. Ein Schalter aktiv = nur für diese Liste investierbare Fonds; beide aktiv = Schnittmenge. Ersetzt „Nur investierbare Fonds“.');
  note('n-a-3', p, 1560, 2320, 480, 'Öffnen vs. Auswählen ist die zentrale Regel des Panels: Chevron klappt, Name wählt. Das gilt in allen drei Varianten identisch, deshalb nur einmal gezeichnet.');
}

// ---------------- Variante B ----------------
{
  const p = 'var-b';
  const base = (drawer) => `${toolbarClosed()}${pager({ pages: 57 })}
    ${HINT('Aktien › Aktien Europa', SEL_COUNT)}${voranalyseTable({ width: 1360, compact: false })}
    ${drawer ? `<div style="position: absolute; inset: 0; background: rgba(20,24,58,.28); border-radius: 16px;"></div>
      <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 380px; background: #fff; border-radius: 16px 0 0 16px; box-shadow: 16px 0 40px rgba(20,24,58,.18); padding: 20px 16px; display: flex; flex-direction: column; gap: 12px;">
        ${folderPanel({ width: 348, sel: SEL, expanded: EXP, collapsible: false, title: 'Ordner', footer: 'Auswahl wirkt sofort auf die Tabelle im Hintergrund.' }).replace('border: 1px solid ' + T.stroke + '; border-radius: 12px;', 'border: none;')}
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 4px;"><a href="#" style="font-weight: 600; font-size: 13px;">Auswahl aufheben</a><span class="btn btn-primary" style="height: 40px;">Fertig</span></div>
      </div>` : ''}`;
  add('B1_Voranalyse_Drawer_offen', 'B1 · Voranalyse, Drawer offen über der Tabelle', page({ tab: 'Voranalyse', content: base(true), minHeight: 1200 }), { page: p, x: 0, y: 0, w: 1440, h: 1200 });
  add('B2_Voranalyse_Drawer_zu', 'B2 · Voranalyse, Drawer zu: „Ordner“-Button + Pfad-Chip', page({ tab: 'Voranalyse', content: base(false), minHeight: 1200 }), { page: p, x: 1560, y: 0, w: 1440, h: 1200 });
  note('n-b-head', p, 0, -220, 1440, 'VARIANTE B · Drawer\nDie Tabelle behält immer die volle Breite. Der Baum kommt auf Knopfdruck („Ordner“) von links über die Tabelle, mit Abdunklung. Auswahl wirkt sofort im Hintergrund; „Fertig“, Klick außerhalb oder Esc schließt. Vorteil: nichts wird schmaler. Nachteil: Auswahl und Ergebnis sieht man nicht gleichzeitig, und der Kunde wollte den Baum als dauerhafte Navigation.');
  note('n-b-1', p, 3120, 0, 360, 'Geschlossener Zustand (B2): der „Ordner“-Button sitzt direkt hinter der Suche und trägt Pfad, Zähler und × selbst. Diese Variante ist gleichzeitig das Verhalten von A unterhalb ~1280 px Breite.');
}

// ---------------- Variante C ----------------
{
  const p = 'var-c';
  const crumbBtn = (open) => `<span class="qf" style="gap: 6px; ${open ? `border-color: ${T.primary}; box-shadow: 0 0 0 3px ${T.chipBg};` : ''}">${folderIcon(true, 16)}<span style="color: ${T.text2};">Alle Fonds</span><span style="color: ${T.muted};">›</span><span style="color: ${T.text2};">Aktien</span><span style="color: ${T.muted};">›</span><span>Aktien Europa</span><span class="chip chip-topic" style="height: 20px; margin-left: 4px;">${de(SEL_COUNT)}</span>${I.chevD(16)}</span>`;
  const col = (title, items, selName, w = 250, leaf = false) => `<div style="width: ${w}px; border-right: 1px solid ${T.stroke}; display: flex; flex-direction: column; padding: 8px 6px;"><div class="eyebrow" style="padding: 6px 8px 8px;">${title}</div>${items.map(([n, c, hasKids]) => `<div class="tree-row ${n === selName ? 'sel' : ''}" style="height: 32px;">${leaf ? '' : folderIcon(false, 16)}<span style="overflow: hidden; text-overflow: ellipsis;">${n}</span><span class="cnt">${de(c)}</span>${hasKids ? `<span style="color: ${T.muted}; display: inline-flex; margin-left: 4px;">${I.chevR(14)}</span>` : ''}</div>`).join('')}</div>`;
  const aktien = TREE.find((r) => r.name === 'Aktien'); const europa = aktien.children.find((s) => s.name === 'Aktien Europa');
  const popover = `<div style="position: absolute; left: 392px; top: 76px; width: 800px; background: #fff; border: 1px solid ${T.stroke}; border-radius: 12px; box-shadow: 0 16px 40px rgba(20,24,58,.16); z-index: 5; overflow: hidden;">
    <div style="display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 14px; border-bottom: 1px solid ${T.stroke}; color: ${T.muted}; font-size: 13px;">${I.search(16)} Peergroup suchen…<span style="margin-left: auto;" class="label">${PEERGROUP_COUNT} Peergroups · ${de(TOTAL)} Fonds</span></div>
    <div style="display: flex; min-height: 420px;">
      ${col('Ebene 1', [['Alle Fonds', TOTAL, false], ...TREE.map((r) => [r.name, r.count, true])], 'Aktien', 240)}
      ${col('Aktien', aktien.children.map((s) => [s.name, s.count, true]), 'Aktien Europa', 260)}
      ${col('Aktien Europa', europa.children.map((l) => [l.name, l.count, false]), null, 300, true).replace('border-right: 1px solid ' + T.stroke + ';', '')}
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-top: 1px solid ${T.stroke}; background: #fbfcfe;"><span class="label">Klick auf einen Ordner wählt ihn und öffnet die nächste Spalte. „Alle Fonds“ hebt die Auswahl auf.</span><span class="btn btn-primary" style="height: 36px;">Übernehmen</span></div>
  </div>`;
  const tb = (open) => `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px; position: relative;">${search('Fondssuche über ISIN, WKN oder Name…', 230)}${crumbBtn(open)}${quick('Fondsgesellschaft')}${investGroup({ lvs: true })}<div style="flex: 1;"></div>${filterBtn()}${iconBtn(printIcon(20))}</div>`;
  const body = (open) => `<div style="position: relative;">${tb(open)}${open ? popover : ''}${pager({ pages: 57 })}${HINT('Aktien › Aktien Europa', SEL_COUNT)}${voranalyseTable({ width: 1360, compact: false })}</div>`;
  add('C1_Voranalyse_Popover_offen', 'C1 · Voranalyse, Ordnerpfad-Popover offen (3 Spalten)', page({ tab: 'Voranalyse', content: body(true), minHeight: 1200 }), { page: p, x: 0, y: 0, w: 1440, h: 1200 });
  add('C2_Voranalyse_Popover_zu', 'C2 · Voranalyse, Pfad-Button zeigt die Auswahl', page({ tab: 'Voranalyse', content: body(false), minHeight: 1200 }), { page: p, x: 1560, y: 0, w: 1440, h: 1200 });
  note('n-c-head', p, 0, -220, 1440, 'VARIANTE C · Ordnerpfad\nKein Panel neben der Tabelle. Der Pfad-Button in der Filterleiste (an der Stelle des heutigen Quick-Filters „FCR Peergroup“) zeigt die Auswahl als Breadcrumb und öffnet ein Popover mit drei Spalten (Miller-Spalten). Kleinster Eingriff ins heutige Layout, aber der Baum ist nie dauerhaft sichtbar, was dem Wunsch des Kunden („Ordnerstruktur links neben der Tabelle“) widerspricht.');
}

// ---------------- Gemeinsam: Fondsmatrix, Schalter, FC-1149 ----------------
{
  const p = 'gemeinsam';
  const mSel = { l1: 'Aktien', l2: 'Europa' };
  const mTree = MATRIX_TREE.map((r) => ({ name: r.name, count: r.count, children: r.children.map(([n, c]) => ({ name: n, count: c, children: [] })) }));
  const mtoolbar = `<div style="display: flex; align-items: center; gap: 12px; margin-top: 24px;">${search('Fondssuche über ISIN oder Name…', 380)}${investGroup({ lvs: false, ivv: false })}<div style="flex: 1;"></div>${filterBtn()}<span class="btn btn-primary" style="height: 48px; padding: 0 20px;">Exportieren · Aktien › Europa · 14 ${I.download(18)}</span></div>`;
  const mcontent = `${mtoolbar}
    <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0 16px;"><span style="font-size: 13px; color: ${T.text2};"><b style="color: ${T.text};">14 von ${MATRIX_TOTAL}</b> Fonds · alle auf einer Seite</span><span class="label">Kein Blättern (FC-1149)</span></div>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      ${folderPanel({ width: 300, title: 'Ordner', subtitle: 'Assetklasse › Sub-Assetklasse', tree: mTree, total: MATRIX_TOTAL, sel: mSel, expanded: new Set(['Aktien', 'Renten']), levels: 2, unassigned: MATRIX_UNASSIGNED, searchPh: 'Assetklasse suchen…', footer: `„Ohne Assetklasse“ sammelt Fonds ohne Zuordnung im Import-Sheet, damit kein Fonds aus dem Baum fällt. Zähler folgen den Schaltern LVS/IVV.` })}
      <div style="flex: 1; min-width: 0;">${HINT('Aktien › Europa', 14)}${matrixTable({ width: 1044 })}</div>
    </div>`;
  add('G1_Fondsmatrix_Panel', 'G1 · Fondsmatrix mit Panel (Assetklasse › Sub-Assetklasse, „Ohne Assetklasse“)', page({ tab: 'Fondsmatrix', content: mcontent, minHeight: 1260 }), { page: p, x: 0, y: 0, w: 1440, h: 1260 });

  // switches board
  const states = [[false, false, 'Alle Fonds', `${de(TOTAL)} Fonds`], [true, false, 'Nur für LVS investierbare Fonds', '8.412 Fonds'], [false, true, 'Nur für IVV investierbare Fonds', '10.934 Fonds'], [true, true, 'Schnittmenge LVS ∩ IVV', '7.905 Fonds']];
  const sw = `<div style="width: 1100px; min-height: 760px; background: ${T.bg}; padding: 40px; display: flex; flex-direction: column; gap: 24px;">
    <div><div class="h1" style="font-size: 26px;">Schalter „Investierbar für LVS / IVV“</div><div style="color: ${T.text2}; margin-top: 8px; line-height: 1.5; max-width: 900px;">Eine Gruppe mit Vorsatz „Investierbar für“ und zwei Schaltern, in beiden Tabs an derselben Stelle: rechts neben „Fondsgesellschaft“ (Voranalyse) bzw. direkt neben der Suche (Fondsmatrix). Ersetzt „Nur investierbare Fonds“. Die Ergebniszeile über der Tabelle nennt den Zustand im Klartext, damit die Schnittmenge verständlich bleibt.</div></div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">${states.map(([l, v, t, c]) => `<div class="card" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px;">${investGroup({ lvs: l, ivv: v })}<div style="display: flex; align-items: center; gap: 10px;"><span class="eyebrow">Ergebnis</span><b>${t}</b><span class="label">· ${c}</span></div></div>`).join('')}</div>
    <div class="callout"><b>Zeilenstreifen (FC-1149):</b> grün = investierbar für LVS (heute), rot = nicht investierbar für IVV (neu). Trifft beides zu, gewinnt rot. Die Schalter blenden Zeilen aus, die Streifen bleiben für die verbleibenden Zeilen sichtbar, sodass bei „nur LVS“ noch rote Streifen auftauchen können.</div>
    <div class="callout" style="background: ${T.infoBg}; border-color: ${T.infoBorder}; color: #1a3d80;"><b>Alternative Beschriftung</b>, falls „LVS“/„IVV“ den Beratern zu knapp ist: „LVS (PAB)“ und „IVV“ wie in den Fondsmatrix-Spalten, mit Tooltip „Investierbar laut Positiv-/Negativliste“.</div>
  </div>`;
  add('G2_Schalter', 'G2 · Schalterzustände und Beschriftung', sw, { page: p, x: 1560, y: 0, w: 1100, h: 780 });

  // FC-1149 clash check
  const clash = `${toolbarA({ lvs: false, ivv: false })}${pager({ pages: 57 })}
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      ${folderPanel({ width: 300, sel: SEL, expanded: EXP })}
      <div style="flex: 1; min-width: 0;">${HINT('Aktien › Aktien Europa', SEL_COUNT)}${voranalyseTable({ width: 1044, compact: true, stripes: 'red', showIvvCol: true })}
      <div class="callout" style="margin-top: 8px;"><b>Prüfung FC-1149 bei offenem Panel:</b> IVV-Spalte (78 px) und roter Streifen passen in die 1044 px; dafür schrumpft die Name-Spalte auf ~240 px; lange Fondsnamen laufen zweizeilig, die Zeilenhöhe bleibt bei 92 px. Alternative, falls das zu eng wird: „Handlungsempfehlung“ ins Aufklapp-Detail verschieben.</div></div>
    </div>`;
  add('G3_FC1149_Konflikte', 'G3 · FC-1149 im Panel-Layout: IVV-Spalte, roter Streifen, Namensbreite', page({ tab: 'Voranalyse', content: clash, minHeight: 1200 }), { page: p, x: 0, y: 1400, w: 1440, h: 1200 });

  note('n-g-head', p, 0, -200, 1440, 'GEMEINSAM – gilt für alle Varianten\nG1 Fondsmatrix: dasselbe Panel mit zwei Ebenen (Assetklasse › Sub-Assetklasse); Fonds ohne Assetklasse landen im letzten Eintrag „Ohne Assetklasse“. Export-Button trägt die Ordnerauswahl im Label, weil laut FC-1149 nur der offene Ordner exportiert wird. G2 Schalter in vier Zuständen. G3 FC-1149-Check mit IVV-Spalte und rotem Streifen in der schmaleren Tabelle.');
  note('n-g-1', p, 1560, 900, 480, 'Fondsmatrix hat heute keine Schalter. Die Gruppe „Investierbar für LVS / IVV“ steht dort direkt neben der Suche, weil es keine weiteren Quick-Filter gibt; die Zähler im Panel reagieren wie in der Voranalyse.');
}

writeFileSync(OUT + 'canvas.json', JSON.stringify({ pages, artboards: boards, annotations: notes, launch: { view: 'canvas', page: 'uebersicht' } }, null, 2));
console.log(`wrote ${boards.length} artboards, ${notes.length} notes -> ${OUT}`);
