import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PARTNERLINKS } from '../src/lib/partnerlinks.js';
import { AANBIEDERS } from '../src/lib/aanbieders.js';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('build (productie): pagina’s, sitemap, robots, IndexNow, regels', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  const html = walk('dist').filter((f) => f.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(f));
  assert.ok(html.length >= 25, `aantal pagina's ${html.length}`);
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  assert.equal((sm.match(/<loc>/g) || []).length, html.length - 1);
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/kassamatch.nl\/sitemap.xml/);
  assert.equal(readFileSync('dist/CNAME', 'utf8').trim(), 'kassamatch.nl');
  const key = readdirSync('dist').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.ok(key && readFileSync(join('dist', key), 'utf8') === key.replace('.txt', ''));
  const verboden = [/Dave/i, /Wester/i, /batterijmatch/i, /goodfellas/i, /reddit/i, /prijs op aanvraag/i, /geraadpleegd op/i, /check altijd/i, /dit is geen advies/i, /★/, /aggregateRating/, /reviewCount/, /ratingValue/, /sterrenbeoordeling/i, /klantbeoordeling/i, /<img [^>]*\.(jpe?g|webp)/i, /shopmatch-site|shopmatch\.nl\/shop-match/];
  for (const f of html) {
    const s = readFileSync(f, 'utf8');
    for (const r of verboden) assert.ok(!r.test(s), `${f} bevat ${r}`);
    // Affiliate-URL's alleen als goedgekeurde partnerlink uit partnerlinks.js.
    for (const m of s.matchAll(/https:\/\/[^"' ]*(pxf\.io|impact\.com|awin1|tradetracker|daisycon)[^"' ]*/g)) assert.ok(Object.values(PARTNERLINKS).includes(m[0]), `${f}: niet-goedgekeurde affiliate-URL ${m[0]}`);
    if (!f.endsWith('404.html')) { assert.match(s, /<link rel="canonical" href="https:\/\/kassamatch.nl\//); assert.ok(!s.includes('noindex'), f); }
    const title = unesc(s.match(/<title>(.*?)<\/title>/)[1]); assert.ok(title.length <= 60, `${f}: titel te lang (${title.length}) ${title}`);
    assert.match(s, /Ook van ons/);
    for (const d of ['boekhoudmatch.nl', 'shopmatch.nl', 'verduurzaammatch.nl', 'warmtepompenmatch.nl', 'thuisaccumatch.nl']) assert.ok(s.includes(`https://${d}/`), `${f}: netwerk ${d}`);
    const net = s.slice(s.indexOf('<div class="net">'), s.indexOf('<p class="fine">'));
    assert.ok(!net.includes('kassamatch.nl'), `${f}: netwerkfooter linkt naar zichzelf`);
    assert.match(s, /<details class="menu">/); assert.match(s, /<footer class="site">/);
    if (/class="src">Door/.test(s)) assert.match(s, /Door Redactie KassaMatch/);
    for (const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
    for (const m of s.matchAll(/href="(\/[^"#?]*)/g)) {
      const p = m[1]; const t = p.endsWith('/') ? join('dist', p, 'index.html') : join('dist', p);
      assert.ok(existsSync(t), `${f}: kapotte link ${p}`);
    }
    for (const m of s.matchAll(/<a [^>]*data-partner-slot="([^"]+)"[^>]*>/g)) {
      const id = m[1]; const href = m[0].match(/href="([^"]+)"/)[1];
      if (PARTNERLINKS[id]) { assert.equal(href, PARTNERLINKS[id]); assert.match(m[0], /rel="sponsored nofollow noopener"/); }
      else { assert.equal(href, AANBIEDERS[id].url, `${f}: ${id}`); assert.match(m[0], /rel="noopener"/); }
      assert.match(m[0], /data-vendor="[a-z]+"/); assert.match(m[0], /data-pos="[a-z0-9_]+"/); assert.match(m[0], /data-cta="outbound"/);
    }
    const sponsored = [...s.matchAll(/<a [^>]*rel="[^"]*sponsored[^"]*"[^>]*>/g)];
    for (const m of sponsored) assert.match(s.slice(m.index), /^<a [^>]*>[^<]*<\/a><span class="partner">partnerlink<\/span>/, `${f}: sponsored zonder label`);
    assert.equal((s.match(/class="partner"/g) || []).length, sponsored.length, `${f}: label zonder sponsored link`);
  }
  // Belangrijke pagina's bestaan.
  for (const p of ['kassa-match', 'pinautomaat-vergelijken', 'kassasysteem-vergelijken', 'aanbieders', 'goedkoopste-pinautomaat', 'kassasysteem-kiezen', 'transactiekosten-vergelijken', 'bronnen', 'privacy', 'disclaimer', 'contact', 'sumup-vs-zettle']) assert.ok(existsSync(`dist/${p}/index.html`), p);
  for (const id of Object.keys(AANBIEDERS)) assert.ok(existsSync(`dist/aanbieders/${AANBIEDERS[id].slug}/index.html`), id);
  // Bronnenpagina noemt elke bron-URL.
  const br = readFileSync('dist/bronnen/index.html', 'utf8');
  for (const id of Object.keys(AANBIEDERS)) for (const [, u] of AANBIEDERS[id].bronnen) assert.ok(br.includes(`href="${u}"`), `bronnen mist ${u}`);
  assert.match(br, /Lightspeed/); assert.match(br, /onbekend/i);
  // CCV: huur- en koopprijzen van ccv.eu zichtbaar, geen 'onbekend' meer voor de automaat.
  const ccv = readFileSync('dist/aanbieders/ccv/index.html', 'utf8');
  assert.match(ccv, /€ 25/); assert.match(ccv, /€ 399/); assert.ok(!/0,069|4,37/.test(ccv), 'geen CCV-tarieven 2027');
  // Uitgebreide aanbiederpagina's: zichtbare FAQ + FAQPage, eigen controledatum, ≥ 600 woorden in <main>.
  for (const slug of ['ccv', 'lightspeed', 'mpluskassa', 'shopify-pos', 'untill', 'zettle']) {
    const s = readFileSync(`dist/aanbieders/${slug}/index.html`, 'utf8');
    const main = s.slice(s.indexOf('<main'), s.indexOf('</main>'));
    assert.ok(main.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length >= 600, `${slug}: te weinig woorden`);
    assert.match(s, /"@type":"FAQPage"/, slug); assert.match(main, /<details>/, slug);
    assert.match(main, /datetime="2026-10-20"/, slug);
  }
  for (const slug of ['sumup', 'mypos', 'mollie']) { const s = readFileSync(`dist/aanbieders/${slug}/index.html`, 'utf8'); assert.ok(!s.includes('"FAQPage"'), slug); assert.ok(!s.includes('datetime="2026-10-20"'), slug); }
  // Lightspeed: geen onbevestigde maandprijzen.
  assert.ok(!/\b(129|189|269)\b|€ 29 per extra kassa/.test(readFileSync('dist/aanbieders/lightspeed/index.html', 'utf8')));
  // Shopify POS: partnerlink ongewijzigd (via knop()).
  assert.ok(readFileSync('dist/aanbieders/shopify-pos/index.html', 'utf8').includes(`href="${PARTNERLINKS.shopify}" rel="sponsored nofollow noopener"`));
  assert.match(readFileSync('dist/aanbieders/shopify-pos/index.html', 'utf8'), /US\$/);
});

test('build (preview): noindex, Disallow, BASE-paden, geen CNAME', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '/kassamatch-site', GO_LIVE: '' } });
  const s = readFileSync('dist/index.html', 'utf8');
  assert.match(s, /<meta name="robots" content="noindex">/);
  assert.match(s, /href="\/kassamatch-site\/kassa-match\/"/);
  assert.match(s, /<link rel="canonical" href="https:\/\/kassamatch.nl\/">/);
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Disallow: \//);
  assert.ok(!existsSync('dist/CNAME'));
});

test('analytics: consent-script met vendor_click (vendor, page, position, cta_type) en match_cta', () => {
  const c = readFileSync('src/assets/js/consent.js', 'utf8');
  assert.match(c, /track\('vendor_click', \{ vendor: t\.dataset\.vendor, page: location\.pathname, position: t\.dataset\.pos, cta_type: t\.dataset\.cta \}\)/);
  assert.match(c, /track\('match_cta'/);
  execSync('node build.mjs', { env: { ...process.env, BASE: '', GO_LIVE: '1', GA_ID: 'G-TEST1234' } });
  const s = readFileSync('dist/index.html', 'utf8');
  assert.match(s, /data-ga="G-TEST1234"/); assert.match(s, /src="\/js\/consent.js"/); assert.match(s, /googletagmanager/);
  assert.match(readFileSync('dist/privacy/index.html', 'utf8'), /_ga/);
  // Zonder ID: geen consent-script en geen Google.
  execSync('node build.mjs', { env: { ...process.env, BASE: '', GO_LIVE: '1', GA_ID: '' } });
  const z = readFileSync('dist/index.html', 'utf8');
  assert.ok(!z.includes('googletagmanager')); assert.ok(!z.includes('consent.js'));
});
