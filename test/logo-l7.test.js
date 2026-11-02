// L7 30-10: pagina's waar logo's van de aanbieders bijkwamen hebben sitemap-lastmod, de zichtbare bijwerkdatum en (waar aanwezig) dateModified 30-10-2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PAGINAS = ['/', '/kassa-match/', '/pinautomaat-vergelijken/', '/kassasysteem-vergelijken/', '/aanbieders/', '/aanbieders/ccv/', '/aanbieders/mollie/', '/aanbieders/mpluskassa/', '/aanbieders/mypos/', '/aanbieders/sumup/', '/aanbieders/untill/', '/aanbieders/lightspeed/', '/aanbieders/shopify-pos/', '/aanbieders/zettle/', '/sumup-vs-zettle/', '/transactiekosten-vergelijken/', '/bronnen/'];

// 03-11: pagina's met de Zettle-prijs (L1/L4) zijn daarna opnieuw bijgewerkt; voor die pagina's geldt 2026-11-03 (build.mjs ZETTLE_PADEN).
const ZETTLE = new Set(['/', '/kassa-match/', '/pinautomaat-vergelijken/', '/kassasysteem-vergelijken/', '/aanbieders/', '/aanbieders/zettle/', '/sumup-vs-zettle/', '/transactiekosten-vergelijken/', '/bronnen/', '/aanbieders/mollie/']);
// /aanbieders/mollie/: Mollie-korting zonder einddatum weg (L4, 03-11), zie test/mollie-l4-0311.test.js.

test('L7 30-10: pagina\'s met logo\'s', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of PAGINAS) {
    const h = readFileSync(`dist${p}index.html`, 'utf8');
    const d = ZETTLE.has(p) ? '2026-11-03' : '2026-10-30';
    assert.ok(h.includes(`bijgewerkt <time datetime="${d}">`), p);
    assert.doesNotMatch(h, new RegExp(`"dateModified": ?"(?!${d})`), p);
    assert.doesNotMatch(h, new RegExp(`article:modified_time" content="(?!${d})`), p);
    assert.ok(sm.includes(`${p}</loc><lastmod>${d}</lastmod>`), p);
  }
});
