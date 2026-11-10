// Nieuwe gids /mypos-vs-sumup/ (SEO-refresh wk46, pushdatum 11-11-2026).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

test('mypos-vs-sumup: build, title/meta/H1, L7, kannibalisatie, partner myPOS', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', GA_ID: '' } });
  assert.ok(existsSync('dist/mypos-vs-sumup/index.html'));
  assert.ok(existsSync('dist/og/vs-mypos-sumup.png'));
  const H = readFileSync('dist/mypos-vs-sumup/index.html', 'utf8');
  const main = H.slice(H.indexOf('<main'), H.indexOf('</main>'));
  const tekst = main.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
  assert.match(H, /<title>myPOS vs SumUp: tarieven en abonnementen vergeleken<\/title>/);
  assert.match(H, /<meta name="description" content="myPOS of SumUp\? Maandprijs, percentage per pinbetaling en welk pakket past bij lage of hogere omzet — alleen cijfers van hun eigen sites\.">/);
  assert.match(main, /<h1>myPOS vs SumUp: tarieven en abonnementen<\/h1>/);
  assert.match(H, /"datePublished":"2026-11-11"/);
  assert.match(H, /"dateModified":"2026-11-18"/);
  assert.match(H, /Redactie KassaMatch/);
  // Maandprijs eerst in snelvergelijking
  assert.ok(tekst.includes('€ 0 per maand'));
  assert.ok(tekst.includes('€ 19 per maand'));
  assert.ok(tekst.includes('1,49%'));
  assert.ok(tekst.includes('0,99%'));
  assert.ok(tekst.includes('€ 0,06'));
  // Kannibalisatie: link naar sumup-vs-zettle, geen "beste pinautomaat" title
  assert.ok(main.includes('href="/sumup-vs-zettle/"'));
  assert.doesNotMatch(H, /<title>Beste pinautomaat/);
  // Interne links
  for (const l of ['/kassa-match/', '/pinautomaat-vergelijken/', '/aanbieders/mypos/', '/aanbieders/sumup/', '/transactiekosten-vergelijken/', '/gidsen/']) {
    assert.ok(main.includes(`href="${l}"`) || H.includes(`href="${l}"`), l);
  }
  // myPOS partnerknop
  assert.match(main, /rel="sponsored nofollow noopener"[^>]*data-vendor="mypos"|data-vendor="mypos"[^>]*rel="sponsored nofollow noopener"/);
  // SEO/SC B1: geen SumUp-knop (geen betaalde route), wel neutrale bronlink.
  assert.doesNotMatch(main, /data-vendor="sumup"/);
  assert.ok(main.includes('<a href="https://www.sumup.com/nl-nl/prijzen/" rel="noopener">SumUp: prijzen en tarieven</a>'));
  // SC B3/B4/B5: geen SumUp-hardwarebedragen, geen kortingvermelding, uitbetaling met rekeningvoorwaarde.
  for (const s of ['€ 34', '€ 44', '€ 169', 'korting', 'actieprijs']) assert.ok(!tekst.includes(s), s);
  assert.ok(tekst.includes('Op je SumUp Bedrijfsrekening de volgende dag om 07.00 uur'));
  assert.ok(main.includes('href="https://www.mypos.com/nl-nl/pricing-and-fees" rel="noopener">prijspagina van myPOS</a>'));
  // Hub lastmod
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  assert.match(sm, /mypos-vs-sumup\/<\/loc><lastmod>2026-11-18<\/lastmod>/);
  assert.match(sm, /gidsen\/<\/loc><lastmod>2026-11-18<\/lastmod>/);
  const hub = readFileSync('dist/gidsen/index.html', 'utf8');
  assert.ok(hub.includes('href="/mypos-vs-sumup/"'));
  // H2 outline
  const h2 = [...main.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);
  assert.ok(h2.includes('Snelvergelijking'));
  assert.ok(h2.includes('Zonder abonnement'));
  assert.ok(h2.includes('Met abonnement / Plus-achtige plannen'));
  assert.ok(h2.includes('Hardware'));
  assert.ok(h2.includes('Welke past wanneer'));
});
