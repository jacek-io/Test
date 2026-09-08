// Produces an English copy of the generated artboards: out/ -> out-en/.
// Text nodes, title attributes, <title> tags, canvas titles/pages and sticky notes are translated
// via i18n-en.mjs. Unknown strings are reported so nothing slips through untranslated.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { strings, notes, keep } from './i18n-en.mjs';

const SRC = new URL('./out/', import.meta.url).pathname;
const OUT = new URL('./out-en/', import.meta.url).pathname;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const unknown = new Set();
const skip = /^[\s\d.,%·+–\-…/()§:]+$/;
function tr(text) {
  const m = text.match(/^(\s*)(.*?)(\s*)$/s);
  const core = m[2];
  if (!core || skip.test(core)) return text;
  if (core in strings) return m[1] + strings[core] + m[3];
  if (!keep.has(core) && !/^[A-Z]{2}[A-Z0-9]{10}$|^[A-Z0-9]{6}$/.test(core)) unknown.add(core);
  return text;
}

for (const f of readdirSync(SRC)) {
  let s = readFileSync(SRC + f, 'utf8');
  if (f === 'canvas.json') {
    const c = JSON.parse(s);
    c.artboards.forEach((b) => { b.title = tr(b.title); });
    c.pages.forEach((p) => { p.name = tr(p.name); });
    c.annotations.forEach((n) => { if (notes[n.id]) n.text = notes[n.id]; else unknown.add('note:' + n.id); });
    writeFileSync(OUT + f, JSON.stringify(c, null, 2));
    continue;
  }
  s = s.replace(/<title>([^<]+)<\/title>/, (_, t) => `<title>${tr(t)}</title>`);
  s = s.replace(/title="([^"]+)"/g, (_, t) => `title="${tr(t)}"`);
  const [head, body] = s.includes('</helmet>') ? s.split('</helmet>') : ['', s];
  const tb = body.replace(/>([^<>]+)</g, (_, t) => `>${tr(t)}<`);
  writeFileSync(OUT + f, head ? head + '</helmet>' + tb : tb);
}
if (unknown.size) {
  console.error(`untranslated (${unknown.size}):`);
  for (const u of unknown) console.error('  ' + JSON.stringify(u));
} else console.log('all strings translated');
console.log(`wrote English artboards -> ${OUT}`);
