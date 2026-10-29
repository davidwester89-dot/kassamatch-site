// Groeiexperiment E3 (29-10): contextuele interne links in het pincluster. Test: /sumup-vs-zettle/ en /goedkoopste-pinautomaat/.
// Controlegroep /aanbieders/ccv/, /aanbieders/sumup/, /aanbieders/zettle/ blijft onaangeroerd.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const main = (p) => { const t = readFileSync(`dist${p}index.html`, 'utf8'); return (t.match(/<main[\s\S]*?<\/main>/) || [''])[0]; };
const count = (html, href) => (html.match(new RegExp(`href="${href.replace(/\//g, '\\/')}"`, 'g')) || []).length;
const NIEUW = [
  ['/goedkoopste-pinautomaat/', '/sumup-vs-zettle/', 'SumUp en Zettle naast elkaar'],
  ['/pinautomaat-vergelijken/', '/sumup-vs-zettle/', 'SumUp en Zettle vergeleken'],
  ['/transactiekosten-vergelijken/', '/sumup-vs-zettle/', 'de vergelijking van SumUp en Zettle'],
  ['/pinautomaat-vergelijken/', '/goedkoopste-pinautomaat/', 'wat een pinautomaat in totaal kost'],
];

test('E3: de 4 nieuwe contextlinks staan erin, gewone interne links zonder rel', () => {
  if (!existsSync('dist/sitemap.xml')) execSync("node build.mjs", { env: { ...process.env, BASE: '', GO_LIVE: '1' } });
  for (const [bron, doel, anker] of NIEUW) {
    assert.ok(main(bron).includes(`<a href="${doel}">${anker}</a>`), `${bron} → ${doel}`);
  }
});

test('E3: aantallen: /sumup-vs-zettle/ 1× vanaf elke bronpagina, /goedkoopste-pinautomaat/ 1× vanaf /pinautomaat-vergelijken/, max 3 nieuwe per pagina', () => {
  assert.equal(count(main('/goedkoopste-pinautomaat/'), '/sumup-vs-zettle/'), 1);
  assert.equal(count(main('/pinautomaat-vergelijken/'), '/sumup-vs-zettle/'), 1);
  assert.equal(count(main('/transactiekosten-vergelijken/'), '/sumup-vs-zettle/'), 1);
  assert.equal(count(main('/pinautomaat-vergelijken/'), '/goedkoopste-pinautomaat/'), 1);
  assert.equal(count(main('/sumup-vs-zettle/'), '/goedkoopste-pinautomaat/'), 1, 'bestond al, geen dubbele link');
});

test('E3: controlegroep heeft geen links naar de nieuwe ankers en geen wijziging in bron', () => {
  const src = readFileSync('src/pages.mjs', 'utf8');
  for (const [, , anker] of NIEUW) assert.equal(src.split(anker).length - 1, 1, anker);
  for (const p of ['/aanbieders/ccv/', '/aanbieders/sumup/', '/aanbieders/zettle/']) {
    const m = main(p);
    for (const [, , anker] of NIEUW) assert.ok(!m.includes(anker), `${p}: ${anker}`);
    assert.equal(count(m, '/sumup-vs-zettle/'), p === '/aanbieders/ccv/' ? 0 : 2, p);
  }
});

test('E3 L7: de 3 bronpagina\'s hebben lastmod, zichtbaar bijgewerkt (en dateModified bij artikelen) 2026-10-29', () => {
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  for (const p of ['/goedkoopste-pinautomaat/', '/pinautomaat-vergelijken/', '/transactiekosten-vergelijken/']) {
    assert.ok(sm.includes(`<loc>https://kassamatch.nl${p}</loc><lastmod>2026-10-29</lastmod>`), p);
    assert.match(readFileSync(`dist${p}index.html`, 'utf8'), /Laatst bijgewerkt <time datetime="2026-10-29">29 oktober 2026<\/time>/, p);
  }
  for (const p of ['/goedkoopste-pinautomaat/', '/transactiekosten-vergelijken/']) {
    const t = readFileSync(`dist${p}index.html`, 'utf8');
    assert.match(t, /"dateModified":"2026-10-29"/, p);
    assert.match(t, /article:modified_time" content="2026-10-29"/, p);
  }
});
