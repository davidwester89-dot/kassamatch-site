// Nieuwe gids /kassasysteem-winkel/ (briefing SEO wk48, pushdatum 27-11-2026). Bedragen uit src/lib/aanbieders.js
// (zelfde data als /kassasysteem-vergelijken/). Partner: alleen de bestaande knoppen Shopify POS en myPOS.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dateFields, readSitemap } from '../scripts/l7check.mjs';
import { revisieDatum } from './nuchter-datums-helper.mjs';
const D = '2026-11-27';
const read = (p) => readFileSync(`dist${p}index.html`, 'utf8');
const H = read('/kassasysteem-winkel/');
const main = H.slice(H.indexOf('<main'), H.indexOf('</main>'));

test('winkel: title, meta en H2-opbouw volgens briefing', () => {
  const title = H.match(/<title>([^<]+)<\/title>/)[1];
  assert.equal(title, 'Kassasysteem winkel: kosten, webshopkoppeling en kiezen');
  assert.ok(title.length <= 60);
  const meta = H.match(/<meta name="description" content="([^"]+)"/)[1].replace(/&#39;/g, "'");
  assert.ok(meta.length >= 120 && meta.length <= 155, String(meta.length));
  const h2 = [...main.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);
  for (const t of ['Wat een winkelkassa moet kunnen', 'Kassa en webshop koppelen', 'Kosten per maand', 'Kopen of huren', 'Kleine winkel: is een pinautomaat genoeg?', 'Wat de Belastingdienst vraagt', 'Bronnen']) assert.ok(h2.includes(t), t);
  assert.match(main, /Door Redactie KassaMatch/);
  assert.doesNotMatch(main, /\bvolgens\b|\baldus\b/i);
});

test('winkel: L7 nieuw op 27-11; /gidsen/ (kaart) en /kassasysteem-horeca/ (inlink) tillen mee', () => {
  const sm = readSitemap('dist');
  const f = dateFields(H);
  assert.equal(f.visible, D);
  assert.equal(sm.get('/kassasysteem-winkel/'), D);
  for (const d of [...f.ld, ...f.og]) assert.equal(d, D);
  assert.match(H, /"datePublished":"2026-11-27","dateModified":"2026-11-27"/);
  assert.ok(read('/gidsen/').includes('href="/kassasysteem-winkel/"'));
  assert.match(read('/kassasysteem-horeca/'), /<a href="\/kassasysteem-winkel\/">kassasysteem winkel<\/a>/);
  for (const p of ['/gidsen/', '/kassasysteem-horeca/']) {
    assert.equal(revisieDatum(p, '2026-11-18'), D);
    assert.equal(sm.get(p), D, p);
    const fp = dateFields(read(p));
    assert.equal(fp.visible, D, p);
    assert.ok(fp.ld.length > 0, p + ': JSON-LD dateModified');
    for (const d of fp.ld) assert.equal(d, D, p);
  }
  // Geen lift zonder eigen bodywijziging.
  assert.notEqual(sm.get('/'), D);
  assert.notEqual(sm.get('/bronnen/'), D);
  assert.notEqual(sm.get('/kassasysteem-kiezen/'), D);
});

test('winkel: bedragen uit de data, interne links en partnerlinks', () => {
  for (const s of ['€ 399', '€ 199', 'Flex (€ 69)', 'Ultra (€ 179)', '€ 129 per maand maandelijks of € 99 per maand bij jaarbetaling', '€ 149 per maand', '€ 229 per maand', '€ 28 per maand', '€ 384 per maand', 'op offerte', 'zeven jaar']) assert.ok(main.includes(s), s);
  for (const l of ['/kassasysteem-kiezen/', '/kassasysteem-horeca/', '/aanbieders/shopify-pos/', '/aanbieders/lightspeed/', '/pinautomaat-huren-of-kopen/', '/goedkoopste-pinautomaat/', '/transactiekosten-vergelijken/', '/kassa-match/', '/kassasysteem-vergelijken/', 'https://shopmatch.nl/platformen/shopify/']) assert.ok(main.includes(`href="${l}"`), l);
  const sponsored = [...main.matchAll(/<a [^>]*rel="sponsored[^"]*"[^>]*data-vendor="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(sponsored.sort(), ['mypos', 'shopify']);
  assert.equal((main.match(/class="pnoot"/g) || []).length, 2);
  for (const id of ['lightspeed', 'sumup', 'zettle', 'mplus', 'untill', 'mollie']) assert.doesNotMatch(main, new RegExp(`<a class="btn"[^>]*data-vendor="${id}"`), id);
  assert.doesNotMatch(main, /data-cta="e-cta|class="e-cta/i);
});
