// B2: quizEnCalculator is een deny-list. Hardwareprijs en naam horen de vingerafdruk te wijzigen;
// transactie, bronnen en updated niet (die leest de quiz niet).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { quizEnCalculator } from '../scripts/l7.config.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function kloon() {
  const dir = mkdtempSync(join(tmpdir(), 'quizfp-'));
  const lib = join(dir, 'js/lib');
  mkdirSync(lib, { recursive: true });
  for (const f of ['aanbieders.js', 'match.js', 'kosten.js']) cpSync(join(ROOT, 'src/lib', f), join(lib, f));
  return dir;
}

function vervang(dir, van, naar) {
  const p = join(dir, 'js/lib/aanbieders.js');
  const s = readFileSync(p, 'utf8');
  const n = s.replace(van, naar);
  assert.notEqual(n, s, `patch miste: ${van}`);
  assert.equal(n.split(naar).length, 2, `patch niet uniek: ${naar}`);
  writeFileSync(p, n);
}

test('quizEnCalculator: hardwareprijs en naam wijzigen de vingerafdruk, transactie/bronnen/updated niet', () => {
  const base = kloon();
  const orig = quizEnCalculator(base);
  const hw = kloon();
  const naam = kloon();
  const meta = kloon();
  try {
    vervang(hw, "['Solo Lite (werkt met je telefoon)', 34]", "['Solo Lite (werkt met je telefoon)', 29]");
    assert.notEqual(quizEnCalculator(hw), orig, 'hardwareprijs');
    vervang(naam, "naam: 'SumUp'", "naam: 'SumUp Pay'");
    assert.notEqual(quizEnCalculator(naam), orig, 'naam');
    vervang(meta, "gecontroleerd 9-11-2026: betaalpas", "gecontroleerd 9-11-2026: pas");
    vervang(meta, "['Shopify: prijzen', 'https://www.shopify.com/nl/prijzen']", "['Shopify: prijzen', 'https://www.shopify.com/nl/prijzen/']");
    vervang(meta, "checked: '2026-10-27', updated: '2026-11-10'", "checked: '2026-10-27', updated: '2026-12-01'");
    assert.equal(quizEnCalculator(meta), orig, 'alleen transactie, bronnen en updated');
  } finally {
    rmSync(base, { recursive: true, force: true });
    rmSync(hw, { recursive: true, force: true });
    rmSync(naam, { recursive: true, force: true });
    rmSync(meta, { recursive: true, force: true });
  }
});
