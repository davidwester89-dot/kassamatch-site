// L4 03-11 (SC-review KM 7144454): de Mollie-korting 'Op 23 oktober 2026 gaf Mollie 50% korting ...' had geen einddatum en staat nergens meer op de site.
// Alleen de normale prijzen (Tap-terminal € 95, mobiele en vaste POS-terminal € 350). L7: /aanbieders/mollie/ op 2026-11-03.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { AANBIEDERS } from '../src/lib/aanbieders.js';

const bestanden = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? bestanden(p) : /\.(html|js|xml)$/.test(p) ? [p] : []; });

test('Mollie: geen korting zonder einddatum, normale prijzen', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  for (const f of bestanden('dist')) {
    const s = readFileSync(f, 'utf8');
    assert.doesNotMatch(s, /23 oktober 2026 gaf Mollie|€ 47,50|Mollie 50% korting/, f);
  }
  assert.equal(AANBIEDERS.mollie.hardwareNoot, 'Normale prijzen zoals Mollie ze toont.');
  const h = readFileSync('dist/aanbieders/mollie/index.html', 'utf8');
  assert.ok(h.includes('vraag Mollie welke terminal bij Pay as you go werkt.</p>'));
  assert.ok(h.includes('per actieve terminal. Met Tap to Pay op je iPhone of Android-telefoon heb je geen terminal nodig.'));
  assert.ok(h.includes('Normale prijzen zoals Mollie ze toont.'));
});

test('L7 03-11: /aanbieders/mollie/ op de pushdatum', () => {
  const h = readFileSync('dist/aanbieders/mollie/index.html', 'utf8');
  assert.ok(h.includes('bijgewerkt <time datetime="2026-11-13">'));
  assert.doesNotMatch(h, /"dateModified": ?"(?!2026-11-13)/);
  assert.ok(readFileSync('dist/sitemap.xml', 'utf8').includes('/aanbieders/mollie/</loc><lastmod>2026-11-13</lastmod>'));
});
