// L7 23-11: CCV-koopprijs vanaf € 399 op / en /pinautomaat-vergelijken/ (officiële kooppagina).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { revisieDatum } from './nuchter-datums-helper.mjs';

const KOOP = 'https://www.ccv.eu/nl/betaaloplossingen/pinautomaten/pinautomaat-kopen';
const PADEN = ['/', '/pinautomaat-vergelijken/'];
const html = (p) => readFileSync(p === '/' ? 'dist/index.html' : `dist${p}index.html`, 'utf8');
const main = (h) => (h.match(/<main\b[^>]*>([\s\S]*)<\/main>/i) || [, h])[1];

test('CCV-koopprijs: / en /pinautomaat-vergelijken/ noemen kopen vanaf € 399, oude claim weg, bron in de lijst', () => {
  for (const p of PADEN) {
    const t = main(html(p));
    assert.match(t, /koop je vanaf € 399/);
    assert.match(t, /maandelijkse kosten vanaf € 16/);
    assert.doesNotMatch(t, /CCV publiceert (de prijs van de betaalautomaat|die prijs) niet/);
    assert.doesNotMatch(t, /volgens CCV|aldus CCV/i);
    assert.ok(t.includes(`href="${KOOP}"`), p + ': bronlink kooppagina');
    assert.match(t, />CCV: pinautomaat kopen</);
  }
});

test('L7 23-11: lastmod en zichtbaar bijgewerkt op /, /pinautomaat-vergelijken/ en hub /gidsen/', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  const d = '2026-11-23';
  for (const p of [...PADEN, '/gidsen/']) {
    assert.equal(revisieDatum(p, '2026-11-03'), d, p);
    assert.match(sm, new RegExp(`<loc>https://kassamatch\\.nl${p.replace(/[/.]/g, '\\$&')}</loc><lastmod>${d}</lastmod>`), p);
    assert.match(html(p), new RegExp(`Laatst bijgewerkt <time datetime="${d}">`));
  }
});
