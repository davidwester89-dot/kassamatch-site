// L1/L4 03-11 (externe feedback nov): Zettle PayPal Reader met de reguliere prijs (€ 79 excl. btw, shop.zettle.com/nl, gecontroleerd 1-11-2026).
// De aanbieding '€ 29 voor nieuwe zakelijke gebruikers' heeft op zettle.com/nl/prijsstelling geen einddatum, dus staat ze nergens op de site.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const html = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? html(p) : p.endsWith('.html') ? [p] : []; });
const tekst = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('Zettle: geen aanbieding zonder einddatum, reguliere Reader-prijs € 79', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  for (const f of html('dist')) {
    const h = readFileSync(f, 'utf8'); const t = tekst(h);
    assert.doesNotMatch(t, /aanbieding nieuwe (klanten|gebruikers)|voor nieuwe zakelijke gebruikers/i, f);
    assert.doesNotMatch(t, /(PayPal Reader|Zettle)[^.]{0,80}€ 29\b/, f);
  }
  const z = tekst(readFileSync('dist/aanbieders/zettle/index.html', 'utf8'));
  assert.match(z, /PayPal Reader: € 79/); assert.match(z, /PayPal Terminal: € 199/);
  assert.ok(readFileSync('dist/aanbieders/zettle/index.html', 'utf8').includes('https://shop.zettle.com/nl'));
  assert.match(tekst(readFileSync('dist/sumup-vs-zettle/index.html', 'utf8')), /PayPal Reader € 79 excl\. btw/);
});
