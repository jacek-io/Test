// Generates the .dc.html artboards + canvas.json for the Anfragen-tab design review.
// Usage: node build.mjs  (writes into ./out)
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { doc } from './lib.mjs';
import { listScreen, expandedScreen } from './screens-list.mjs';
import { createModal, correctionModal, addExchangeModal, followUpModal } from './screens-modals.mjs';
import { markerScreen, emptyScreen, coverBoard } from './screens-misc.mjs';

const OUT = new URL('./out/', import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const boards = [];
const notes = [];
const pages = [
  { id: 'uebersicht', name: 'Übersicht' },
  { id: 'variante-a', name: 'Variante A · Minimal' },
  { id: 'variante-b', name: 'Variante B · Fondsebene' },
  { id: 'variante-c', name: 'Variante C · Thema-first' },
  { id: 'gemeinsam', name: 'Gemeinsame Fixes' },
];

function add(stem, title, html, { page, x, y, w, h }) {
  writeFileSync(OUT + stem + '.dc.html', doc(title, html, w === 720 ? ' body { background: #6f7380; }' : ''));
  boards.push({ file: stem + '.dc.html', title, x, y, w, h, page });
}
function note(id, page, x, y, w, text) { notes.push({ id, page, x, y, w, text }); }

// ---- Übersicht ----
add('Main', 'Übersicht · Entscheidungsmatrix', coverBoard(), { page: 'uebersicht', x: 0, y: 0, w: 1440, h: 1400 });

// ---- Varianten ----
const meta = {
  A: { name: 'Minimal', pageId: 'variante-a',
    notes: [
      'Filtr tematów (pkt 3): jeden dropdown „Thema” obok wyszukiwarki, NAD tabelą. Dropdown z rozwiniętego wiersza znika. Zwinięty wiersz przy aktywnym filtrze pokazuje najnowszą wymianę PASUJĄCĄ do filtra (z etykietą „Neueste Frage zum Thema Kosten · data”). Fundusze bez pasującej wymiany są ukrywane.',
      'ISIN (pkt 4): kolumna pokazuje ISIN, którego dotyczyło ostatnie pytanie („Bezugs-ISIN”), plus chip „+4 Klassen”. Wszystkie klasy z oznaczoną tranżą główną są wypisane w nagłówku rozwiniętego wpisu.\n\nSelektor wersji (pkt 7): na tabie Anfragen ukryty – traktujemy jako pozostałość.',
      'Korekta (pkt 8): dwa pola – „Korrigierte Antwort” (prefill) i „Korrekturhinweis” (obowiązkowy, jedno zdanie). Data i nazwisko dokłada system. Baner w historii = data + nazwisko + hinweis.',
      'Marker (pkt 9): ikona dymka za nazwą funduszu, ten sam marker na każdej klasie. Klik → tab Anfragen, wyszukiwarka prefill funduszem, wpis ROZWINIĘTY i podświetlony.',
    ] },
  B: { name: 'Fondsebene', pageId: 'variante-b',
    notes: [
      'Filtr tematów (pkt 3): pasek chipów z licznikami NAD tabelą. Filtr zawęża listę funduszy, ale zwinięty wiersz zawsze pokazuje najnowszą wymianę funduszu + badge „n Treffer zu Kosten”. Po rozwinięciu trafienia są podświetlone, reszta przygaszona, chronologia zachowana.',
      'ISIN (pkt 4): kolumny ISIN nie ma – wpis jest per fundusz. Komórka „Fonds” pokazuje „5 Anteilsklassen” i pierwszy ISIN; wyszukiwarka nadal znajduje po każdym ISIN/WKN. Kolumna „Dokumente” wraca jako osobna kolumna z licznikiem.\n\nSelektor wersji (pkt 7): zastąpiony statusem „3 Fonds mit Anfragen · zuletzt aktualisiert …”.',
      'Korekta (pkt 8): jedno pole treści + opcjonalny powód. Poprzednia wersja odpowiedzi dostępna dla czytelnika przez „Vorherige Version anzeigen”. Hinweis generowany automatycznie.',
      'Marker (pkt 9): chip „n Anfragen” za nazwą funduszu. Klik → tab Anfragen z listą przefiltrowaną po funduszu, wpis ZWINIĘTY (użytkownik sam rozwija). Duplikat funduszu w modalu: ostrzeżenie z wyborem „Zur Historie hinzufügen” / „Eintrag öffnen”.',
    ] },
  C: { name: 'Thema-first', pageId: 'variante-c',
    notes: [
      'Filtr tematów (pkt 3): pasek chipów NAD tabelą + osobna kolumna „Thema” w wierszu. Rozwinięty wpis grupuje historię po temacie (chronologia w grupie), z nawigacją tematów po lewej i przełącznikiem „Chronologisch anzeigen”. Temat staje się polem obowiązkowym przy tworzeniu.',
      'ISIN (pkt 4): kolumna pokazuje ISIN tranży głównej, tak opisany („LD · Haupttranche”), plus chip „+4”.\n\nSelektor wersji (pkt 7): zostaje dla spójności z innymi tabami, z ikoną info „Anfragen sind versionsunabhängig”.',
      'Korekta (pkt 8): analityk wybiera rodzaj korekty (Tippfehler / Sachliche Korrektur / Ergänzung) – rodzaj steruje widocznością banera; Vorher/Nachher wyliczane automatycznie z różnicy tekstu, notka opcjonalna.',
      'Marker (pkt 9): osobna wąska kolumna z ikoną na początku wiersza, w tym samym miejscu we wszystkich trzech tabelach. Klik → panel boczny z historią funduszu bez opuszczania taba; link „Im Tab Anfragen öffnen”. Duplikat: oznaczony już w pickerze funduszy.',
    ] },
};

for (const v of ['A', 'B', 'C']) {
  const m = meta[v];
  const p = m.pageId;
  add(`${v}1_Liste_User_Filter`, `${v}1 · Liste (Merkur-Nutzer), Filter „Kosten“ aktiv`, listScreen(v), { page: p, x: 0, y: 0, w: 1440, h: 1024 });
  add(`${v}2_Eintrag_Analyst`, `${v}2 · Aufgeklappter Eintrag (Analyst), 5 Anteilsklassen`, expandedScreen(v), { page: p, x: 1560, y: 0, w: 1440, h: v === 'C' ? 2640 : 2420 });
  add(`${v}3_Neue_Anfrage`, `${v}3 · Neue Anfrage erfassen`, createModal(v), { page: p, x: 0, y: 1160, w: 720, h: 1560 });
  add(`${v}4_Antwort_korrigieren`, `${v}4 · Antwort korrigieren`, correctionModal(v), { page: p, x: 800, y: 1160, w: 720, h: 1180 });
  add(`${v}5_Marker_Voranalyse`, `${v}5 · Marker in der Voranalyse + Ziel des Klicks`, markerScreen(v), { page: p, x: 0, y: 2860, w: 1440, h: 1120 });
  m.notes.forEach((t, i) => note(`n-${v.toLowerCase()}-${i + 1}`, p, 3120, i * 260, 360, t));
  note(`n-${v.toLowerCase()}-head`, p, 0, -220, 1440, `VARIANTE ${v} · ${m.name}\n${v === 'A' ? 'Najmniejszy dystans do obecnej makiety: każdą otwartą kwestię rozstrzygamy najprościej, bez zmiany struktury tabeli.' : v === 'B' ? 'Konsekwentnie „jeden fundusz = jedna historia”: usuwamy ISIN jako kolumnę, pokazujemy klasy jako właściwość funduszu, marker zlicza wymiany.' : 'Temat jako oś: kolumna, filtr, grupowanie historii i panel boczny. Największa zmiana, najlepiej skaluje się dla długich, mieszanych historii.'}`);
}

// ---- Gemeinsame Fixes ----
const g = 'gemeinsam';
add('G1_Leerzustand_User', 'G1 · Leerer Zustand (Merkur-Nutzer)', emptyScreen('user'), { page: g, x: 0, y: 0, w: 1440, h: 1024 });
add('G2_Leerzustand_Analyst', 'G2 · Leerer Zustand (Analyst)', emptyScreen('analyst'), { page: g, x: 1560, y: 0, w: 1440, h: 1024 });
add('G3_Update_anfordern', 'G3 · Update anfordern (eigener Placeholder)', followUpModal('update'), { page: g, x: 0, y: 1160, w: 720, h: 720 });
add('G4_Rueckfrage_stellen', 'G4 · Rückfrage stellen (eigener Placeholder)', followUpModal('rueckfrage'), { page: g, x: 800, y: 1160, w: 720, h: 720 });
add('G5_Bestaetigung_gesendet', 'G5 · Bestätigung: Nachricht gesendet', followUpModal('update', { sent: true }), { page: g, x: 1600, y: 1160, w: 720, h: 700 });
add('G6_Frage_Antwort_hinzufuegen', 'G6 · Frage & Antwort hinzufügen (Flow D)', addExchangeModal(), { page: g, x: 2400, y: 1160, w: 720, h: 1460 });
note('n-g-head', g, 0, -200, 1440, 'GEMEINSAME FIXES – identyczne we wszystkich trzech wariantach\nPkt 1 i 2: pola „Eingereicht von” i „Analyst/in FondsConsult” są w modalach A3/B3/C3. Pkt 5: nowy tekst empty state (osobno dla użytkownika i analityka). Pkt 6: „Korrektur speichern”, „Merkur Privatbank” w nawigacji, dwa różne placeholdery, prawdziwe pytanie w polu Frage. Dodatkowo: ekran potwierdzenia wysyłki (kryterium akceptacji) i modal dopisywania wymiany do istniejącej historii (flow D).');
note('n-g-1', g, 3200, 1160, 360, 'Potwierdzenie (G5) celowo powtarza, że wpis się NIE zmienia, dopóki FondsConsult nie opublikuje odpowiedzi – to wymóg z ticketu (flow B, pkt 3).');
note('n-g-2', g, 3200, 1330, 360, 'Placeholdery: „Update anfordern” pyta, CO jest nieaktualne; „Rückfrage stellen” pyta, CO jest niejasne. Dwie różne intencje, jeden mechanizm (e-mail).');

writeFileSync(OUT + 'canvas.json', JSON.stringify({ pages, artboards: boards, annotations: notes, launch: { view: 'canvas', page: 'uebersicht' } }, null, 2));
console.log(`wrote ${boards.length} artboards, ${notes.length} notes -> ${OUT}`);
