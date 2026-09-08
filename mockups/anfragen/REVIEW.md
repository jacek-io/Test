# Tab „Anfragen” (moduł Merkur) – design-review i mockupy w 3 wariantach

Źródło: Figma `EUROMAR-SKETCHES`, strona *Merkur* (node `18-1067`), sekcje *Merkur* (widok użytkownika)
i *Merkur for Analysts* (widok analityka). Ticket: projekt taba Anfragen (implementacja FC-1112).

Mockupy: canvas z 22 artboardami, generowany z `build.mjs` (pliki `out/*.dc.html` można też otworzyć
bezpośrednio w przeglądarce). Strony canvasu: **Übersicht** (macierz decyzji), **Variante A · Minimal**,
**Variante B · Fondsebene**, **Variante C · Thema-first**, **Gemeinsame Fixes**.

## Jak rozumieć warianty

Wszystkie trzy warianty zawierają jednoznaczne poprawki z review (pkt 1, 2, 5, 6 oraz brakujące ekrany).
Różnią się tylko tam, gdzie review zostawił decyzję otwartą (pkt 3, 4, 7, 8, 9 i obsługa funduszu,
który już ma wpis).

| Otwarty punkt | A · Minimal | B · Fondsebene | C · Thema-first |
|---|---|---|---|
| **3 · Filtr tematów** | Dropdown „Thema” obok wyszukiwarki, nad tabelą. Zwinięty wiersz pokazuje najnowszą wymianę **pasującą do filtra** (etykieta „Neueste Frage zum Thema Kosten · data”). Fundusze bez trafień znikają z listy. | Pasek chipów z licznikami nad tabelą. Filtr zawęża listę funduszy, ale wiersz nadal pokazuje najnowszą wymianę funduszu + badge „n Treffer zu Kosten”. Po rozwinięciu trafienia podświetlone, reszta przygaszona. | Pasek chipów + osobna kolumna **Thema**. Rozwinięta historia pogrupowana po temacie (chronologicznie w grupie), nawigacja tematów po lewej, przełącznik „Chronologisch anzeigen”. Temat jest polem obowiązkowym. |
| **4 · ISIN przy wielu klasach** | ISIN, którego dotyczyło ostatnie pytanie („Bezugs-ISIN”) + chip „+4 Klassen”. Wszystkie klasy z tranżą główną wypisane w nagłówku rozwiniętego wpisu. | Kolumny ISIN nie ma. Komórka „Fonds” pokazuje „5 Anteilsklassen” i pierwszy ISIN; wyszukiwarka nadal działa po każdym ISIN/WKN. | ISIN tranży głównej, tak opisany („Haupttranche LD”) + „+4 weitere Klassen”. |
| **7 · Selektor wersji** | Ukryty na tabie Anfragen (pozostałość). | Zastąpiony statusem „3 Fonds mit Anfragen · zuletzt aktualisiert 14.08.2026”. | Zostaje dla spójności z innymi tabami, z ikoną info „Anfragen sind versionsunabhängig”. |
| **8 · Modal korekty** | Dwa pola: **Korrigierte Antwort** (prefill) + **Korrekturhinweis** (obowiązkowy, 1 zdanie). Datę i nazwisko dokłada system. Baner = data + nazwisko + hinweis. | Jedno pole treści + opcjonalny powód. Poprzednia wersja dostępna dla czytelnika przez „Vorherige Version anzeigen”; hinweis generowany. | Analityk wybiera **rodzaj korekty** (Tippfehler / Sachliche Korrektur / Ergänzung), który steruje widocznością banera; Vorher/Nachher wyliczane z różnicy tekstu; notka opcjonalna. |
| **9 · Marker z innych tabów** | Ikona dymka za nazwą funduszu (każda klasa ma marker). Klik → tab Anfragen, wyszukiwarka prefill, wpis **rozwinięty** i podświetlony. | Chip „n Anfragen” za nazwą. Klik → tab Anfragen przefiltrowany po funduszu, wpis **zwinięty**. | Osobna wąska kolumna z ikoną na początku wiersza. Klik → **panel boczny** z historią, bez opuszczania taba; link „Im Tab Anfragen öffnen”. |
| **Flow C · fundusz ma już wpis** | Niebieska informacja, automatyczne dopisanie do historii. | Ostrzeżenie z wyborem „Zur Historie hinzufügen” / „Bestehenden Eintrag öffnen”. | Oznaczenie już w pickerze funduszy („Eintrag vorhanden · 5 Austausche”); dialog przechodzi w „Frage & Antwort hinzufügen”. |
| **Dokumente (zwinięty wiersz)** | Inline pod odpowiedzią („2 Dokumente”), jak w Figmie. | Osobna kolumna z licznikiem. | Osobna kolumna z licznikiem. |

Rekomendacja do dyskusji: **B** dla poziomu funduszu (ISIN, marker, duplikaty) i **A** dla modalu korekty
(dwa pola dają klientowi dokładnie to, co widać na banerze). C warto pokazać jako kierunek, jeśli klient
potwierdzi, że historie będą długie i mieszane.

## Poprawki wspólne (strona „Gemeinsame Fixes” + modale A3/B3/C3)

1. **Eingereicht von** – nowe pole w „Neue Anfrage erfassen” (A: tekst z podpowiedziami, B: lista użytkowników Merkur + freetext, C: Name + Institution).
2. **Analyst/in FondsConsult** – edytowalne, domyślnie zalogowana osoba, select z zespołu (jak w Analyst Tool).
5. **Empty state** – własny tekst: czym jest tab i skąd biorą się wpisy; wersja użytkownika (wskazanie na przyciski w innych tabach) i analityka (CTA „Erste Anfrage erfassen”).
6. **Drobiazgi** – „Korrektur speichern”, „Merkur Privatbank” w nawigacji analityka, dwa różne placeholdery (Update: *co jest nieaktualne*; Rückfrage: *co jest niejasne*), prawdziwe pytanie w polu Frage.
- **Bestätigung „Nachricht an FondsConsult gesendet”** – kryterium akceptacji; komunikat powtarza, że wpis się nie zmienia do publikacji odpowiedzi.
- **„Frage & Antwort hinzufügen”** – modal dla flow D (dopisanie wymiany do istniejącej historii, z opcjonalnym powiązaniem z wymianą, której dotyczy Rückfrage).
- Usunięty link „+ Neue Anfrage erfassen” z widoku użytkownika (w Figmie pojawia się w rozwiniętym wierszu makiet z modalami follow-up).
- Usunięta wewnętrzna notatka „Entwurf – offene Entscheidung” z historii.

## Dodatkowo zauważone w review (poza 9 punktami)

- Kolumna **Dokumente** jest w nagłówku pustego stanu i w tickecie (6 punktów danych), ale w wypełnionej tabeli zniknęła – dokumenty schowano pod odpowiedzią. Trzeba zdecydować świadomie (A vs B/C).
- **Datum** – nie wiadomo, czy to data utworzenia wpisu czy ostatniej aktywności. Skoro domyślna kolejność to „ostatnia aktywność”, proponuję etykietę „letzte Aktivität” (B/C).
- Nie narysowane, a wymagane kryteriami akceptacji: potwierdzenie po wysyłce, obsługa funduszu z istniejącym wpisem, modal dopisywania odpowiedzi, marker w Voranalyse/Watchlist/Empfehlungsliste w wypełnionej tabeli.
- Przykładowa tabela ma 3 wiersze – za mało, by pokazać sortowanie i paginację; warto dołożyć ~8 wierszy przed pokazem klientowi.
- Otwarte z klientem: przycisk „Anfrage stellen” w tabie – layout zostawia miejsce obok „Export”.
- Wszystkie ISIN-y i nazwiska w mockupach są przykładowe.

## Pliki

- `lib.mjs` – tokeny (z Figmy: primary `#1167fe`, stroke `#e4e6eb`, tło `#f3f5f9`, Inter), ikony, nawigacja, shell strony/modalu.
- `screens-list.mjs` – lista, rozwinięty wpis, dane przykładowe, filtry per wariant.
- `screens-modals.mjs` – modale: Neue Anfrage, Antwort korrigieren, Frage & Antwort hinzufügen, Update/Rückfrage + potwierdzenie.
- `screens-misc.mjs` – marker w Voranalyse (+ panel boczny w C), empty state, strona przeglądowa.
- `build.mjs` – generuje `out/*.dc.html` i `out/canvas.json` (`node build.mjs`).
