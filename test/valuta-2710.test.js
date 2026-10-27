// L2 (27-10): geen kale dollarbedragen. Een US$-bedrag mag alleen met een €-indicatie in dezelfde zin,
// en de zin 'wij rekenen dollars niet om' (of een variant) komt nergens meer voor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const tekst = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

test('valuta: geen "rekenen dollars niet om", elk US$-bedrag met €-indicatie', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const html = walk('dist').filter((f) => f.endsWith('.html'));
  assert.ok(html.length > 10);
  for (const f of html) {
    const raw = readFileSync(f, 'utf8');
    assert.ok(!/rekenen\s+(de\s+)?dollars?\s+niet\s+om|dollars?\s+(rekenen|zetten)\s+we\s+niet\s+om|niet\s+om\s*gerekend/i.test(raw), `${f}: 'dollars niet om'`);
    // Elke zin met een dollarbedrag (US$ 39, $ 25, 39 USD) bevat ook een €-bedrag.
    for (const zin of tekst(raw).split(/(?<=[.!?])\s+(?=[A-Z])/)) {
      if (/(US\$|\$)\s?\d|\d\s?(USD|dollar)/.test(zin)) assert.match(zin, /€\s?\d/, `${f}: dollarbedrag zonder €-indicatie: ${zin.slice(0, 160)}`);
    }
  }
});

test('valuta: Shopify POS-pagina noemt europrijs met bron en peildatum', () => {
  const s = readFileSync('dist/aanbieders/shopify-pos/index.html', 'utf8');
  assert.ok(!/US\$/.test(s), 'geen US$ meer op de Shopify POS-pagina');
  assert.match(s, /€ 28 per maand/); assert.match(s, /€ 79 per maand/);
  assert.match(s, /href="https:\/\/www\.shopify\.com\/nl\/pos\/prijzen"/);
  assert.match(s, /27 oktober 2026/);
});
