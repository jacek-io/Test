import { T, I, modalArtboard, field, selectedFund, dropzone } from './lib.mjs';

const topicField = (help) => field('Thema', `
  <div class="input">Thema wählen oder neu eingeben …<span style="margin-left: auto;">${I.chevD(16)}</span></div>
  <div style="display: flex; gap: 8px; margin-top: 8px;">${['Ausschüttung', 'Compliance', 'Fondsmanagement', 'Kosten'].map((t) => `<span class="chip chip-neutral">${t}</span>`).join('')}</div>`,
  { help });

const questionField = field('Frage', `<div class="textarea">Ist der Fonds weiterhin Artikel-8-konform nach SFDR? Uns liegt ein Hinweis vor, dass die Einstufung im Zuge der SFDR-Überarbeitung geprüft wird.</div>`, { required: true, help: 'So, wie sie gestellt wurde – die Frage erscheint wörtlich in der Historie.' });
const answerField = field('Antwort', `<div class="textarea">Ja, Einstufung unverändert. Aktuelle Offenlegung im Anhang.</div>`, { required: true });
const docField = field('Dokument', dropzone, { optional: true });

const analystSelect = (value = 'J. Weber (Sie)') => `<div class="input input-value" style="justify-content: space-between;"><span style="display: inline-flex; align-items: center; gap: 10px;"><span style="width: 24px; height: 24px; border-radius: 100px; background: ${T.chipBg}; color: ${T.chipText}; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;">JW</span>${value}</span>${I.chevD(16)}</div>`;

const footer = (primary = 'Speichern', disabled = false) => `<span class="btn btn-outline">Abbrechen</span><span class="btn ${disabled ? 'btn-disabled' : 'btn-primary'}">${primary}</span>`;

const intro = 'Erfassen Sie eine Frage, die per E-Mail bei FondsConsult eingegangen ist, zusammen mit der Antwort. Der Eintrag wird für alle Merkur-Nutzer sichtbar und erscheint im Dashboard-Newsfeed.';

// ---------- Neue Anfrage erfassen ----------
export function createModal(variant) {
  let fundBlock, submittedBy, analystField, topic;

  if (variant === 'A') {
    fundBlock = field('Fonds', `
      <div class="input">Fondsname, ISIN oder WKN eingeben …</div>
      <div style="margin-top: 8px;">${selectedFund('DWS Top Dividende', 'DE0009848119', ' <span class="chip chip-neutral" style="height: 20px; font-size: 11px; margin-left: 6px;">5 Klassen</span>')}</div>
      <div class="note note-info" style="margin-top: 10px; display: flex; gap: 10px; align-items: flex-start;">${I.info(18)}<div>Für diesen Fonds existiert bereits ein Eintrag (5 Austausche, zuletzt 14.08.2026). Frage und Antwort werden dieser Historie hinzugefügt – es entsteht kein zweiter Eintrag.</div></div>`,
      { required: true });
    submittedBy = field('Eingereicht von', `<div class="input input-value" style="justify-content: space-between;"><span>S. Nowak, Merkur Privatbank</span>${I.close(16)}</div>`, { required: true, help: 'Person, die die Frage gestellt hat. Vorschläge aus bisherigen Einträgen, Freitext möglich.' });
    analystField = field('Analyst/in FondsConsult', analystSelect(), { required: true, help: 'Standard: angemeldete Person. Zum Veröffentlichen im Namen einer Kollegin oder eines Kollegen ändern.' });
    topic = topicField('Freitext – neue Themen erscheinen automatisch im Themenfilter über der Tabelle.');
  } else if (variant === 'B') {
    fundBlock = field('Fonds', `
      <div class="input">Fondsname, ISIN oder WKN eingeben …</div>
      <div style="margin-top: 8px;">${selectedFund('DWS Top Dividende', '5 Anteilsklassen')}</div>
      <div class="note note-amber" style="margin-top: 10px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; gap: 10px; align-items: flex-start;">${I.alert(18)}<div><b>Für diesen Fonds gibt es bereits einen Eintrag</b> mit 5 Austauschen (zuletzt 14.08.2026). Ein Fonds hat immer genau eine Historie.</div></div>
        <div style="display: flex; gap: 8px; padding-left: 28px;"><span class="btn btn-primary btn-sm">Zur Historie hinzufügen</span><span class="btn btn-outline btn-sm">Bestehenden Eintrag öffnen</span></div>
      </div>`,
      { required: true });
    submittedBy = field('Eingereicht von', `<div class="input input-value" style="justify-content: space-between;"><span>S. Nowak, Merkur Privatbank</span>${I.chevD(16)}</div>
      <div class="card" style="margin-top: 4px; padding: 6px; display: flex; flex-direction: column; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
        <div style="padding: 8px 10px; background: ${T.bg}; border-radius: 4px; font-weight: 500;">S. Nowak, Merkur Privatbank</div>
        <div style="padding: 8px 10px;">T. Brandt, Merkur Privatbank</div>
        <div style="padding: 8px 10px;">K. Lehmann, Merkur Privatbank</div>
        <div style="padding: 8px 10px; color: ${T.primary}; font-weight: 500;">+ Anderen Namen eingeben …</div>
      </div>`, { required: true, help: 'Liste der Merkur-Nutzer aus dem Modul; Freitext für Personen ohne Zugang.' });
    analystField = field('Veröffentlicht im Namen von', `<div style="display: flex; justify-content: space-between; align-items: center; height: 48px; padding: 0 16px; background: ${T.bg}; border-radius: 4px;"><span style="display: inline-flex; align-items: center; gap: 10px; font-weight: 500;"><span style="width: 24px; height: 24px; border-radius: 100px; background: ${T.chipBg}; color: ${T.chipText}; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;">JW</span>J. Weber, FondsConsult <span class="chip chip-neutral" style="height: 20px; font-size: 11px;">Sie</span></span><a href="#" style="font-weight: 600;">Ändern</a></div>`, { required: true, help: 'Nur bei Veröffentlichung für eine Kollegin oder einen Kollegen ändern.' });
    topic = topicField('Freitext – neue Themen erscheinen automatisch in der Themenleiste über der Tabelle.');
  } else {
    fundBlock = field('Fonds', `
      <div class="input input-value" style="border-color: ${T.primary};">${I.search(18)} DWS Top<span style="margin-left: auto; color: ${T.muted};">Fondsuniversum · 4 Treffer</span></div>
      <div class="card" style="margin-top: 4px; padding: 6px; display: flex; flex-direction: column; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
        <div style="padding: 10px; background: ${T.bg}; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;"><div><div style="font-weight: 600;">DWS Top Dividende</div><div class="label">DE0009848119 · 5 Anteilsklassen</div></div><span class="chip chip-amber">${I.chat(14)} Eintrag vorhanden · 5 Austausche</span></div>
        <div style="padding: 10px; display: flex; justify-content: space-between; align-items: center;"><div><div style="font-weight: 600;">DWS Top Europe</div><div class="label">DE0009769729</div></div></div>
        <div style="padding: 10px; display: flex; justify-content: space-between; align-items: center;"><div><div style="font-weight: 600;">DWS Top Asien</div><div class="label">DE0009769760</div></div><span class="chip chip-amber">${I.chat(14)} Eintrag vorhanden · 1 Austausch</span></div>
        <div style="padding: 10px; display: flex; justify-content: space-between; align-items: center;"><div><div style="font-weight: 600;">DWS Top World</div><div class="label">DE0009769794</div></div></div>
      </div>`,
      { required: true, help: 'Fonds mit bestehendem Eintrag sind markiert. Bei Auswahl wechselt der Dialog zu „Frage &amp; Antwort hinzufügen“ – ein zweiter Eintrag ist nicht möglich.' });
    submittedBy = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
      ${field('Eingereicht von', `<div class="input input-value">S. Nowak</div>`, { required: true })}
      ${field('Institution', `<div class="input input-value" style="justify-content: space-between;">Merkur Privatbank ${I.chevD(16)}</div>`, { required: true })}
    </div>`;
    analystField = field('Analyst/in FondsConsult', analystSelect('J. Weber (angemeldet)'), { required: true, help: 'Vorbelegt mit der angemeldeten Person; Auswahl aus dem FondsConsult-Team wie im Analyst Tool.' });
    topic = field('Thema', `
      <div class="input input-value" style="justify-content: space-between;"><span class="chip chip-topic">Compliance</span>${I.chevD(16)}</div>`,
      { required: true, help: 'Pflichtfeld in dieser Variante: das Thema ist Spalte und Filter der Tabelle. Neue Themen per Freitext.' });
  }

  return modalArtboard({
    title: 'Neue Anfrage erfassen',
    intro,
    body: [fundBlock, submittedBy, analystField, topic, questionField, answerField, docField].join(''),
    footer: footer('Speichern'),
    height: 1560,
  });
}

// ---------- Antwort korrigieren ----------
export function correctionModal(variant) {
  const fund = selectedFund('DWS Top Dividende', 'DE0009848119').replace(/<a href="#"[^<]*<\/a>/, '');
  const original = field('Ursprüngliche Antwort', `<div style="padding: 12px 16px; background: ${T.bg}; border-radius: 4px; color: ${T.text2}; line-height: 1.5;">Thomas Schüßler bleibt Lead Portfolio Manager; <span style="text-decoration: line-through;">Stefan Werner</span> wurde zum 01.01. als Co-Manager ergänzt.</div>`);
  const ctx = `<div style="font-size: 12px; color: ${T.text2}; display: flex; gap: 10px; align-items: center;"><span class="chip chip-topic" style="height: 20px; font-size: 11px;">Fondsmanagement</span> Austausch vom 19.01.2026 · beantwortet von M. Fischer</div>`;

  let body, introText;
  if (variant === 'A') {
    introText = 'Korrigiert eine bereits veröffentlichte Antwort. Die Korrektur erscheint als datierter Hinweis an dieser Antwort, nicht als neuer Austausch.';
    body = [fund, ctx, original,
      field('Korrigierte Antwort', `<div class="textarea">Thomas Schüßler bleibt Lead Portfolio Manager; Stephan Werner wurde zum 01.01. als Co-Manager ergänzt.</div>`, { required: true, help: 'Ersetzt den sichtbaren Antworttext.' }),
      field('Korrekturhinweis', `<div class="input input-value">Name des Co-Managers wurde berichtigt (vorher „Stefan Werner“).</div>`, { required: true, help: 'Ein Satz für die Leser: Was wurde geändert? Erscheint im Hinweis unter der Antwort. Datum und Name werden automatisch ergänzt.' }),
      field('Dokument', `<div style="display: flex; gap: 8px;"><span class="chip chip-neutral" style="height: 32px; padding: 0 12px;">${I.clip(14)} Teamuebersicht_2026.pdf ${I.close(14)}</span></div>`, { optional: true }),
    ].join('');
  } else if (variant === 'B') {
    introText = 'Ersetzt den Antworttext. Die vorherige Version bleibt für Leser über „Vorherige Version anzeigen“ erreichbar; der Hinweis wird automatisch erzeugt.';
    body = [fund, ctx, original,
      field('Korrigierte Antwort', `<div class="textarea">Thomas Schüßler bleibt Lead Portfolio Manager; Stephan Werner wurde zum 01.01. als Co-Manager ergänzt.</div>`, { required: true }),
      field('Grund der Korrektur', `<div class="input">z. B. Name berichtigt, Zahl aktualisiert …</div>`, { optional: true, help: 'Wenn leer, zeigt der Hinweis nur „Korrigiert am 24.01.2026 von J. Weber“.' }),
      `<div class="note note-info" style="display: flex; gap: 10px;">${I.eye(18)}<div><b>Vorschau des Hinweises:</b> Korrigiert am 24.01.2026 von J. Weber · <a href="#">Vorherige Version anzeigen</a></div></div>`,
    ].join('');
  } else {
    introText = 'Korrigiert eine veröffentlichte Antwort. Die Art der Korrektur steuert, wie auffällig der Hinweis für Leser ist.';
    const kinds = [['Tippfehler', 'Kein Hinweis für Leser, nur Protokoll'], ['Sachliche Korrektur', 'Hinweis mit Vorher/Nachher unter der Antwort', true], ['Ergänzung', 'Hinweis „Ergänzt am …“ unter der Antwort']];
    body = [fund, ctx, original,
      field('Korrigierte Antwort', `<div class="textarea">Thomas Schüßler bleibt Lead Portfolio Manager; Stephan Werner wurde zum 01.01. als Co-Manager ergänzt.</div>`, { required: true }),
      field('Art der Korrektur', `<div style="display: flex; flex-direction: column; gap: 8px;">${kinds.map(([k, d, on]) => `<div style="display: flex; gap: 12px; align-items: center; padding: 10px 12px; border: 1px solid ${on ? T.primary : T.stroke}; border-radius: 6px; background: ${on ? T.chipBg : '#fff'};"><span style="width: 18px; height: 18px; border-radius: 100px; border: ${on ? `5px solid ${T.primary}` : `1.5px solid ${T.muted}`}; display: inline-block; flex: none; background: #fff;"></span><div><div style="font-weight: 600;">${k}</div><div class="label">${d}</div></div></div>`).join('')}</div>`, { required: true }),
      field('Notiz für Leser', `<div class="input input-value">Name des Co-Managers berichtigt.</div>`, { optional: true, help: 'Vorher/Nachher wird aus der Textänderung automatisch abgeleitet.' }),
    ].join('');
  }

  return modalArtboard({ title: 'Antwort korrigieren', intro: introText, body, footer: footer('Korrektur speichern'), height: 1180 });
}

// ---------- Frage & Antwort hinzufügen (existing entry) ----------
export function addExchangeModal() {
  const body = [
    selectedFund('DWS Top Dividende', 'DE0009848119').replace(/<a href="#"[^<]*<\/a>/, `<span class="label">5 Austausche in der Historie</span>`),
    `<div class="note note-info" style="display: flex; gap: 10px;">${I.info(18)}<div>Die Rückfrage von S. Nowak (E-Mail vom 20.08.2026) bezieht sich auf die Antwort zum Thema <b>Ausschüttung</b> vom 14.08.2026. Der neue Austausch wird oben in der Historie ergänzt; die bestehende Antwort bleibt unverändert.</div></div>`,
    field('Bezieht sich auf', `<div class="input input-value" style="justify-content: space-between;"><span><span class="chip chip-topic" style="margin-right: 8px;">Ausschüttung</span>14.08.2026 · Gibt es Änderungen bei der Ausschüttungspolitik …</span>${I.chevD(16)}</div>`, { optional: true, help: 'Verknüpft die Rückfrage sichtbar mit dem ursprünglichen Austausch.' }),
    field('Eingereicht von', `<div class="input input-value">S. Nowak, Merkur Privatbank</div>`, { required: true }),
    field('Analyst/in FondsConsult', analystSelect(), { required: true }),
    field('Thema', `<div class="input input-value" style="justify-content: space-between;"><span class="chip chip-topic">Ausschüttung</span>${I.chevD(16)}</div>`, { help: 'Vorbelegt aus dem Bezugs-Austausch.' }),
    field('Frage', `<div class="textarea">Wird die Dezember-Ausschüttung in gleicher Höhe wie 2025 erwartet?</div>`, { required: true }),
    field('Antwort', `<div class="textarea">Nach aktuellem Stand ja; die endgültige Höhe wird Ende November festgelegt.</div>`, { required: true }),
    docField,
  ].join('');
  return modalArtboard({ title: 'Frage &amp; Antwort hinzufügen', intro: 'Ergänzt die Historie von DWS Top Dividende um einen weiteren Austausch – zum Beispiel die Antwort auf eine Rückfrage oder ein angefordertes Update.', body, footer: footer('Zur Historie hinzufügen'), height: 1460 });
}

// ---------- Follow-up modals (shared fixes) ----------
export function followUpModal(kind, { sent = false } = {}) {
  const isUpdate = kind === 'update';
  const title = isUpdate ? 'Update anfordern' : 'Rückfrage stellen';
  const introText = isUpdate
    ? 'Sie bitten FondsConsult, die bestehende Antwort zu prüfen und bei Bedarf zu aktualisieren – zum Beispiel, weil sie veraltet sein könnte.'
    : 'Ihre Frage bezieht sich auf die bestehende Antwort. FondsConsult meldet sich per E-Mail; der Eintrag ändert sich erst, wenn die Antwort hier veröffentlicht wird.';
  const placeholder = isUpdate
    ? 'Welche Angaben wirken veraltet oder sollten geprüft werden? z. B. „Die Ausschüttungshöhe bezieht sich noch auf 2025.“'
    : 'Was ist an der Antwort unklar, oder was möchten Sie ergänzend wissen? z. B. „Gilt das auch für die Anteilklasse FC?“';
  const ref = `<div style="display: flex; flex-direction: column; gap: 6px; padding: 12px 16px; background: ${T.bg}; border-radius: 4px;"><div style="font-weight: 500;">DWS Top Dividende · DE0009848119</div><div class="label" style="display: flex; gap: 8px; align-items: center;"><span class="chip chip-topic" style="height: 20px; font-size: 11px;">Ausschüttung</span>Antwort vom 14.08.2026 · J. Weber, FondsConsult</div></div>`;
  if (sent) {
    const body = `
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; padding: 20px 10px 8px;">
        <span style="color: ${T.greenText}; background: ${T.greenBg}; border-radius: 100px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center;">${I.check(30)}</span>
        <div style="font-weight: 700; font-size: 18px;">Nachricht an FondsConsult gesendet</div>
        <div style="color: ${T.text2}; line-height: 1.5; max-width: 420px;">Ihre ${isUpdate ? 'Update-Anfrage' : 'Rückfrage'} zu <b>DWS Top Dividende</b> ist per E-Mail bei FondsConsult eingegangen. Der Eintrag hier bleibt unverändert, bis FondsConsult die Antwort veröffentlicht – in der Regel innerhalb weniger Werktage.</div>
        <div class="note note-info" style="text-align: left; width: 100%; margin-top: 8px;"><b>Ihre Nachricht:</b> „Die Ausschüttungshöhe im Text bezieht sich noch auf 2025 – gibt es schon die Planung für Dezember 2026?“</div>
      </div>`;
    return modalArtboard({ title, body, footer: `<span></span><span class="btn btn-primary">Schließen</span>`, height: 700 });
  }
  const body = [ref,
    field('Ihre Nachricht', `<div class="textarea" style="color: ${T.muted};">${placeholder}</div>`, { required: true, help: `Die Nachricht wird nicht in der Historie angezeigt; sie geht als E-Mail an FondsConsult.` }),
  ].join('');
  return modalArtboard({ title, intro: introText, body, footer: footer('Senden', true), height: 720 });
}
