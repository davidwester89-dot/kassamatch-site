import { revisieDatum } from './nuchter-datums-helper.mjs'; // Latere stijlrevisie, exacte datumtests blijven gelden.
// Interne-links-experiment (SEO-lijst 5-11, MM-OK): 4 contextuele links op KM-bronpagina's.
// Targets (geen title/H1-wijziging): /aanbieders/mollie/, /aanbieders/mypos/, /aanbieders/zettle/, /aanbieders/ccv/.
// L7 pushdatum: 2026-11-05 (gas vóór di-batch 10-11).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const main = (p) => { const t = readFileSync(`dist${p}index.html`, 'utf8'); return (t.match(/<main[\s\S]*?<\/main>/) || [''])[0]; };
const DATUM = '2026-11-05';
// /aanbieders/ en /gidsen/ zijn 10-11 opnieuw gezet (Shopify-winkeltarieven, hub van een nieuwer kind).
const HUB_1011 = new Set(['/aanbieders/', '/gidsen/']);
const LINKS = [
  ['/sumup-vs-zettle/', '/aanbieders/mollie/', 'Mollie als je pin en online bij één partij wilt'],
  ['/aanbieders/ccv/', '/aanbieders/mypos/', 'myPOS Pro met een vast bedrag per pin'],
  ['/aanbieders/mypos/', '/aanbieders/zettle/', 'Zettle (PayPal) met één tarief voor alle kaarten'],
  ['/sumup-vs-zettle/', '/aanbieders/ccv/', 'CCV met een vast bedrag per pinbetaling'],
];
const BRON_L7 = ['/sumup-vs-zettle/', '/aanbieders/ccv/', '/aanbieders/mypos/', '/aanbieders/', '/gidsen/'];

test('interne-links-exp: 4 contextlinks met exacte ankers, gewone interne links zonder rel', () => {
  if (!existsSync('dist/sitemap.xml')) execSync('node build.mjs', { env: { ...process.env, BASE: '', GO_LIVE: '1' }, stdio: 'ignore' });
  for (const [bron, doel, anker] of LINKS) {
    assert.ok(main(bron).includes(`<a href="${doel}">${anker}</a>`), `${bron} → ${doel}: ${anker}`);
  }
});

test('interne-links-exp L7: bronpagina\'s + hubs op 2026-11-05', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of BRON_L7) {
    const d = revisieDatum(p, HUB_1011.has(p) ? '2026-11-10' : DATUM);
    assert.ok(sm.includes(`<loc>https://kassamatch.nl${p}</loc><lastmod>${d}</lastmod>`), p);
    assert.match(readFileSync(`dist${p}index.html`, 'utf8'), new RegExp(`bijgewerkt <time datetime="${d}">`), p);
  }
  // Article-pagina /sumup-vs-zettle/ heeft dateModified
  assert.match(readFileSync('dist/sumup-vs-zettle/index.html', 'utf8'), new RegExp(`"dateModified":"${DATUM}"`));
});

test('interne-links-exp: geen title/H1-wijziging op de 4 KM-targets', () => {
  // Targets behouden bestaande titles (geen experiment-title)
  assert.match(readFileSync('dist/aanbieders/mollie/index.html', 'utf8'), /<title>Mollie pinautomaat: kosten en terminals 2026/);
  assert.match(readFileSync('dist/aanbieders/mypos/index.html', 'utf8'), /<title>myPOS kosten 2026: plannen en pinapparaten/);
  assert.match(readFileSync('dist/aanbieders/zettle/index.html', 'utf8'), /<title>Zettle kosten 2026: tarief, Reader en Terminal/);
  assert.match(readFileSync('dist/aanbieders/ccv/index.html', 'utf8'), /<title>CCV transactiekosten en tarieven 2026/);
});
