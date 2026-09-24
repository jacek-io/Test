// Sample data for the Sparkasse Leipzig folder-panel mockups.
// Peer group names follow the live product ("Aktien Japan Large Cap Growth"), counts come from the
// client's prototype (206 peer groups, 12,029 funds). Folder levels follow the ticket rule:
// level 1 = first word, level 2 = first two words, level 3 = peer group. ETF peer groups sit under
// their own top folder; inside it the same two levels apply after stripping the "ETF" prefix.

// [level1, level2, [ [peer group, count], ... ]]
const RAW = [
  ['Aktien', 'Aktien Europa', [['Aktien Europa Large Cap Blend', 268], ['Aktien Europa Large Cap Growth', 64], ['Aktien Europa Large Cap Value', 53], ['Aktien Europa Small Cap', 115], ['Aktien Europa ex UK Large Cap', 32], ['Aktien Europa Dividenden', 37]]],
  ['Aktien', 'Aktien Eurozone', [['Aktien Eurozone Large Cap', 155], ['Aktien Eurozone Small Cap', 35]]],
  ['Aktien', 'Aktien Deutschland', [['Aktien Deutschland Large Cap', 49], ['Aktien Deutschland Small Cap', 39]]],
  ['Aktien', 'Aktien Global', [['Aktien Global Large Cap Blend', 600], ['Aktien Global Large Cap Growth', 292], ['Aktien Global Large Cap Value', 119], ['Aktien Global Small Cap', 149], ['Aktien Global Low Volatility', 35], ['Aktien Global Dividenden', 110]]],
  ['Aktien', 'Aktien USA', [['Aktien USA Large Cap Blend', 210], ['Aktien USA Large Cap Growth', 88], ['Aktien USA Large Cap Value', 59], ['Aktien USA Small Cap', 86], ['Aktien USA Dividenden', 20]]],
  ['Aktien', 'Aktien Japan', [['Aktien Japan Large Cap Blend', 86], ['Aktien Japan Large Cap Growth', 15], ['Aktien Japan Large Cap Value', 8], ['Aktien Japan Small Cap', 30]]],
  ['Aktien', 'Aktien Schwellenländer', [['Aktien Schwellenländer Blend', 178], ['Aktien Schwellenländer Growth', 118], ['Aktien Schwellenländer Value', 35], ['Aktien Schwellenländer Small Cap', 21], ['Aktien Schwellenländer ex China', 31]]],
  ['Aktien', 'Aktien Asien', [['Aktien Asien Pazifik ex Japan', 47], ['Aktien Asien ex Japan All Cap', 91], ['Aktien Asien ASEAN', 12]]],
  ['Aktien', 'Aktien China', [['Aktien China All Cap', 90], ['Aktien China A-Shares', 36]]],
  ['Aktien', 'Aktien Indien', [['Aktien Indien All Cap', 64]]],
  ['Aktien', 'Aktien Branche', [['Aktien Branche Technologie', 97], ['Aktien Branche Gesundheit', 84], ['Aktien Branche Ökologie', 84], ['Aktien Branche Listed Infrastructure', 70], ['Aktien Branche Gold', 48], ['Aktien Branche Megatrends', 46], ['Aktien Branche Industrials', 38], ['Aktien Branche Mining', 37], ['Aktien Branche Künstliche Intelligenz', 32], ['Aktien Branche Biotech', 29], ['Aktien Branche Clean Energy', 28], ['Aktien Branche Finanzen', 11]]],
  ['Aktien', 'Aktien Immobilien', [['Aktien Immobilien Global', 46], ['Aktien Immobilien Europa', 29], ['Aktien Immobilien Asien', 4]]],
  ['Renten', 'Renten EUR', [['Renten EUR Aggregate', 204], ['Renten EUR Corporates', 221], ['Renten EUR Staatsanleihen', 100], ['Renten EUR High Yield', 100], ['Renten EUR Nachrang', 68], ['Renten EUR Flexibel', 74], ['Renten EUR Aggregate Kurzläufer', 82], ['Renten EUR Aggregate Ultra Kurzläufer', 88], ['Renten EUR Corporates Kurzläufer', 92]]],
  ['Renten', 'Renten Global', [['Renten Global Aggregate EUR hedged', 108], ['Renten Global Aggregate unhedged', 68], ['Renten Global Flexibel EUR hedged', 177], ['Renten Global Flexibel USD hedged', 124], ['Renten Global Corporates EUR hedged', 120], ['Renten Global High Yield EUR hedged', 132], ['Renten Global Staatsanleihen EUR hedged', 35]]],
  ['Renten', 'Renten USD', [['Renten USD Aggregate', 41], ['Renten USD Corporates', 54], ['Renten USD Staatsanleihen', 17], ['Renten USD High Yield', 60], ['Renten USD Flexibel', 30]]],
  ['Renten', 'Renten Schwellenländer', [['Renten Schwellenländer Hartwährung Staat EUR', 123], ['Renten Schwellenländer Hartwährung Staat USD', 118], ['Renten Schwellenländer Hartwährung Corp EUR', 84], ['Renten Schwellenländer Lokalwährung', 93], ['Renten Schwellenländer Blend', 48]]],
  ['Renten', 'Renten Inflation', [['Renten Inflation Eurozone', 27], ['Renten Inflation Global EUR hedged', 33], ['Renten Inflation USA', 9]]],
  ['Renten', 'Renten RMB', [['Renten RMB Onshore (in USD)', 19], ['Renten RMB Offshore (in USD)', 8]]],
  ['Renten', 'Renten Absolute', [['Renten Absolute Return', 47]]],
  ['Mischfonds', 'Mischfonds EUR', [['Mischfonds EUR Defensiv', 455], ['Mischfonds EUR Ausgewogen', 527], ['Mischfonds EUR Dynamisch', 307], ['Mischfonds EUR Flexibel', 691]]],
  ['Mischfonds', 'Mischfonds USD', [['Mischfonds USD Ausgewogen', 113], ['Mischfonds USD Flexibel', 82]]],
  ['Mischfonds', 'Mischfonds CHF', [['Mischfonds CHF Ausgewogen', 87]]],
  ['Mischfonds', 'Mischfonds Schwellenländer', [['Mischfonds Schwellenländer', 19]]],
  ['Geldmarkt', 'Geldmarkt EUR', [['Geldmarkt EUR', 115]]],
  ['Geldmarkt', 'Geldmarkt USD', [['Geldmarkt USD', 67]]],
  ['Geldmarkt', 'Geldmarkt CHF', [['Geldmarkt CHF', 10]]],
  ['Rohstoffe', 'Rohstoffe Diversifiziert', [['Rohstoffe Diversifiziert EUR hedged', 25], ['Rohstoffe Diversifiziert USD', 27]]],
  ['Rohstoffe', 'Rohstoffe Edelmetalle', [['Rohstoffe Edelmetalle USD', 12]]],
  ['Wandelanleihen', 'Wandelanleihen Global', [['Wandelanleihen Global EUR hedged', 84], ['Wandelanleihen Global USD', 45]]],
  ['Wandelanleihen', 'Wandelanleihen Europa', [['Wandelanleihen Europa', 20]]],
  // ETF peer groups: "ETF Aktien Europa Large Cap Blend" -> top folder ETF, then the same two levels
  ['ETF', 'Aktien Europa', [['ETF Aktien Europa Large Cap Blend', 85], ['ETF Aktien Europa Small Cap', 16], ['ETF Aktien Europa Dividenden', 10]]],
  ['ETF', 'Aktien Eurozone', [['ETF Aktien Eurozone Large Cap', 61], ['ETF Aktien Eurozone Dividenden', 11]]],
  ['ETF', 'Aktien Deutschland', [['ETF Aktien Deutschland Large Cap', 22]]],
  ['ETF', 'Aktien Global', [['ETF Aktien Global Large Cap Blend', 122], ['ETF Aktien Global Large Cap Value', 11], ['ETF Aktien Global Small Cap', 16], ['ETF Aktien Global Dividenden', 20]]],
  ['ETF', 'Aktien USA', [['ETF Aktien USA Large Cap Blend', 139], ['ETF Aktien USA Large Cap Growth', 24], ['ETF Aktien USA Large Cap Value', 14], ['ETF Aktien USA SMID', 24], ['ETF Aktien USA Dividenden', 17]]],
  ['ETF', 'Aktien Schwellenländer', [['ETF Aktien Schwellenländer Blend', 37], ['ETF Aktien Schwellenländer Value', 9]]],
  ['ETF', 'Aktien Branche', [['ETF Aktien Branche Technologie', 72], ['ETF Aktien Branche Konsum', 41], ['ETF Aktien Branche Finanzen', 29], ['ETF Aktien Branche Gesundheit', 26], ['ETF Aktien Branche Energie', 18]]],
  ['ETF', 'Renten EUR', [['ETF Renten EUR Staatsanleihen', 73], ['ETF Renten EUR Corporates IG', 36], ['ETF Renten EUR Corporates Kurzläufer', 14], ['ETF Renten EUR Staatsanleihen Kurzläufer', 24], ['ETF Renten EUR High Yield', 11]]],
  ['ETF', 'Renten USD', [['ETF Renten USD Staatsanleihen', 38], ['ETF Renten USD Corporates', 18], ['ETF Renten USD High Yield', 10]]],
  ['ETF', 'Renten Global', [['ETF Renten Global Aggregate unhedged', 12], ['ETF Renten Global Staatsanleihen EUR hedged', 12]]],
  ['ETF', 'Rohstoffe Diversifiziert', [['ETF Rohstoffe Diversifiziert USD', 31]]],
];

export function buildTree() {
  const roots = new Map();
  for (const [l1, l2, leaves] of RAW) {
    if (!roots.has(l1)) roots.set(l1, { name: l1, count: 0, children: new Map() });
    const r = roots.get(l1);
    if (!r.children.has(l2)) r.children.set(l2, { name: l2, count: 0, children: [] });
    const s = r.children.get(l2);
    for (const [name, count] of leaves) { s.children.push({ name, count }); s.count += count; r.count += count; }
  }
  const order = ['Aktien', 'Renten', 'Mischfonds', 'Geldmarkt', 'Rohstoffe', 'Wandelanleihen', 'ETF'];
  return order.filter((k) => roots.has(k)).map((k) => { const r = roots.get(k); return { ...r, children: [...r.children.values()] }; });
}
export const TREE = buildTree();
export const TOTAL = TREE.reduce((a, r) => a + r.count, 0);
export const PEERGROUP_COUNT = RAW.reduce((a, [, , l]) => a + l.length, 0);
export const de = (n) => n.toLocaleString('en-US');

// Voranalyse rows (live product style). stripe: 'green' | 'red' | null (FC-1149 red stripe = not investable for IVV)
export const VORANALYSE_ROWS = [
  { name: 'abrdn SICAV I – European Equity Fund', pg: 'Aktien Europa Large Cap Blend', rank: '1', of: 268, lvs: true, ivv: true, vol: ['High', 'g'], tr: ['Long', 'g'], ret: ['Good', 'g'], risk: ['Medium', 'n'], am: ['Good', 'g'], size: ['1.20 bn', 'g'] },
  { name: 'Allianz Global Investors – Allianz Europe Equity Growth', pg: 'Aktien Europa Large Cap Growth', rank: '1', of: 64, lvs: true, ivv: true, vol: ['High', 'g'], tr: ['Long', 'g'], ret: ['Very good', 'gg'], risk: ['Medium', 'n'], am: ['Very good', 'gg'], size: ['4.30 bn', 'g'] },
  { name: 'Amundi Funds – European Equity Value', pg: 'Aktien Europa Large Cap Value', rank: '2', of: 53, lvs: true, ivv: false, vol: ['Medium', 'n'], tr: ['Long', 'g'], ret: ['Good', 'g'], risk: ['Medium', 'n'], am: ['Good', 'g'], size: ['610 m', 'g'] },
  { name: 'BlackRock Global Funds – European Special Situations', pg: 'Aktien Europa Large Cap Blend', rank: '4', of: 268, lvs: false, ivv: true, vol: ['High', 'g'], tr: ['Medium', 'n'], ret: ['Good', 'g'], risk: ['Poor', 'r'], am: ['Good', 'g'], size: ['890 m', 'g'] },
  { name: 'Comgest Growth Europe', pg: 'Aktien Europa Large Cap Growth', rank: '2', of: 64, lvs: true, ivv: true, vol: ['High', 'g'], tr: ['Long', 'g'], ret: ['Very good', 'gg'], risk: ['Good', 'g'], am: ['Very good', 'gg'], size: ['3.90 bn', 'g'] },
  { name: 'DWS Invest European Small Cap', pg: 'Aktien Europa Small Cap', rank: '3', of: 115, lvs: true, ivv: true, vol: ['Low', 'r'], tr: ['Long', 'g'], ret: ['Medium', 'n'], risk: ['Medium', 'n'], am: ['Good', 'g'], size: ['96 m', 'r'] },
  { name: 'Fidelity Funds – European Dividend Fund', pg: 'Aktien Europa Dividenden', rank: '1', of: 37, lvs: true, ivv: true, vol: ['High', 'g'], tr: ['Medium', 'n'], ret: ['Good', 'g'], risk: ['Good', 'g'], am: ['Good', 'g'], size: ['2,10 bn', 'g'] },
];

// Fondsmatrix rows; assetklasse null = no assignment
export const MATRIX_ROWS = [
  { name: 'abrdn-Emrg Mrkt SDG Corp Bond I AccHEUR', isin: 'LU2392364308', ak: 'Renten', sub: 'High Yield und EM', idx: 'EM Corporate Bonds EUR hedged', use: 'Acc', freq: '–', month: '–', ter: '0.63 %', cur: 'EUR', hedge: 'Yes', lvs: 'eligible', ivv: 'eligible' },
  { name: 'Amundi Core Stoxx Eurp 600 ETF Acc', isin: 'LU0908500753', ak: 'Aktien', sub: 'Europa', idx: 'Stoxx Europe 600', use: 'Acc', freq: '–', month: '–', ter: '0.07 %', cur: 'EUR', hedge: 'No', lvs: 'eligible', ivv: 'eligible' },
  { name: 'Amundi EUR Corporate Bd 0-3Y ESG ETF DRC', isin: 'LU2037748774', ak: 'Renten', sub: 'Kurzläufer', idx: 'Euro Corporate Bond 0-3Y', use: 'Acc', freq: '–', month: '–', ter: '0.12 %', cur: 'EUR', hedge: 'No', lvs: 'eligible', ivv: 'eligible' },
  { name: 'Amundi Ibex 35 ETF Acc', isin: 'FR0010655746', ak: 'Aktien', sub: 'Europa', idx: 'IBEX 35', use: 'Acc', freq: '–', month: '–', ter: '0.30 %', cur: 'EUR', hedge: 'No', lvs: 'not on positive list', ivv: 'eligible' },
  { name: 'Avaron Emerging Europe E', isin: 'EE3600108874', ak: 'Aktien', sub: 'Europa', idx: 'Emerging Europe', use: 'Acc', freq: '–', month: '–', ter: '1.10 %', cur: 'EUR', hedge: 'No', lvs: 'eligible', ivv: '–' },
  { name: 'Bantleon Select Corporate Hy IA EUR Inc', isin: 'LU2038754953', ak: 'Renten', sub: 'Sonstige Rentenfonds', idx: 'Corporate Hybrids', use: 'Inc', freq: 'annual', month: 'Dec', ter: '0.60 %', cur: 'EUR', hedge: 'No', lvs: 'on negative list', ivv: 'eligible' },
  { name: 'Deka-Nachhaltigkeit Renten CF', isin: 'LU0703710904', ak: null, sub: null, idx: '–', use: 'Inc', freq: 'annual', month: 'Nov', ter: '0.85 %', cur: 'EUR', hedge: 'No', lvs: 'eligible', ivv: 'eligible' },
];

export const MATRIX_TREE = [
  { name: 'Aktien', count: 52, children: [['Europa', 14], ['Nordamerika', 8], ['Weltweit', 9], ['Schwellenländer & restliche Welt', 7], ['Themen | Sektoren | Rohstoffe', 10], ['Dividenden', 4]] },
  { name: 'Renten', count: 32, children: [['Kurzläufer & Geldmarkt', 8], ['High Yield und EM', 7], ['Corporate Bonds', 9], ['Sonstige Rentenfonds', 5], ['Pfandbriefe', 3]] },
  { name: 'Mischfonds', count: 6, children: [['Defensiv', 2], ['Ausgewogen', 3], ['Flexibel', 1]] },
];
export const MATRIX_UNASSIGNED = 3;
export const MATRIX_TOTAL = MATRIX_TREE.reduce((a, r) => a + r.count, 0) + MATRIX_UNASSIGNED;
