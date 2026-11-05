// Gids /kassasysteem-horeca/ (nieuw, pushdatum 3-11-2026, briefing SEO wk45). Bedragen letterlijk van de eigen pagina's, gerenderd 2-11-2026 vanaf een NL-IP:
// lightspeedhq.nl/kassasysteem/restaurant/prijzen/ (Basic 89, Core 159, Pro 249 "€ /maand", extra licentie €49),
// untillair.nl/prijzen/ (Jaarlijks: € 19,00 / € 29,00 / € 39,00; Maandelijks: € 21,85 / € 33,85 / € 44,85; extra schermen € 10,00 / € 11,50, excl. btw).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
const read = (p) => readFileSync(p, 'utf8');
const tekst = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const H = 'dist/kassasysteem-horeca/index.html';

test('horeca: title, meta, byline en één og:image', () => {
  const h = read(H);
  assert.match(h, /<title>Kassasysteem horeca: prijzen en functies vergeleken<\/title>/);
  assert.ok(tekst(h).includes('Redactie KassaMatch · 3 november 2026'));
  assert.match(h, /"author":\{"@type":"Organization","name":"Redactie KassaMatch"/);
  assert.equal((h.match(/property="og:image"/g) || []).length, 1);
});

test('horeca: maandprijs eerst (L1), jaarbetaling benoemd, bedragen exact', () => {
  const t = tekst(read(H));
  for (const s of ['€ 89 per maand', '€ 159 per maand', '€ 249 per maand', 'een extra licentie kost € 49', '€ 21,85 per maand; € 19 per maand bij jaarbetaling', '€ 33,85 per maand; € 29 per maand bij jaarbetaling', '€ 44,85 per maand; € 39 per maand bij jaarbetaling', '€ 11,50 bij maandelijks betalen of € 10 bij jaarlijks betalen']) assert.ok(t.includes(s), s);
  assert.doesNotMatch(t, /\$|USD|dollar/);
});

test('horeca: interne links, link vanuit de horecakolom en vanuit /gidsen/', () => {
  const h = read(H);
  for (const l of ['/kassa-match/', '/kassasysteem-vergelijken/', '/kassasysteem-kiezen/', '/aanbieders/lightspeed/', '/aanbieders/untill/', '/aanbieders/mpluskassa/', '/transactiekosten-vergelijken/', '/pinautomaat-vergelijken/']) assert.ok(h.includes(`href="${l}"`), l);
  assert.match(read('dist/kassasysteem-vergelijken/index.html'), /<th scope="col"><a href="\/kassasysteem-horeca\/">Horeca<\/a><\/th>/);
  assert.match(read('dist/gidsen/index.html'), /href="\/kassasysteem-horeca\/"/);
  assert.doesNotMatch(h, /sponsored|reddit/i);
});

test('L7 3-11: nieuwe gids (hub /gidsen/ later 5-11) op de pushdatum', () => {
  const sm = read('dist/sitemap.xml');
  // /gidsen/ opnieuw 5-11 (interne-links-exp); datum test test/interne-links-0511.test.js.
  for (const p of ['/kassasysteem-horeca/', '/kassasysteem-vergelijken/', '/', '/bronnen/']) assert.match(sm, new RegExp(`<loc>https://kassamatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>2026-11-03</lastmod>`), p);
  const h = read(H);
  assert.match(h, /"datePublished":"2026-11-03","dateModified":"2026-11-03"/);
  assert.match(h, /bijgewerkt <time datetime="2026-11-03">/i);
});
