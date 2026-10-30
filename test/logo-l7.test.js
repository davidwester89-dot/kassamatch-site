// L7 30-10: pagina's waar logo's van de aanbieders bijkwamen hebben sitemap-lastmod, de zichtbare bijwerkdatum en (waar aanwezig) dateModified 30-10-2026.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PAGINAS = ['/', '/kassa-match/', '/pinautomaat-vergelijken/', '/kassasysteem-vergelijken/', '/aanbieders/', '/aanbieders/ccv/', '/aanbieders/mollie/', '/aanbieders/mpluskassa/', '/aanbieders/mypos/', '/aanbieders/sumup/', '/aanbieders/untill/', '/sumup-vs-zettle/', '/transactiekosten-vergelijken/', '/bronnen/'];

test('L7 30-10: pagina\'s met logo\'s', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of PAGINAS) {
    const h = readFileSync(`dist${p}index.html`, 'utf8');
    assert.match(h, /bijgewerkt <time datetime="2026-10-30">/, p);
    assert.doesNotMatch(h, /"dateModified": ?"(?!2026-10-30)/, p);
    assert.doesNotMatch(h, /article:modified_time" content="(?!2026-10-30)/, p);
    assert.ok(sm.includes(`${p}</loc><lastmod>2026-10-30</lastmod>`), p);
  }
});
