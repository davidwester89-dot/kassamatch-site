// Nieuwe gids /pinautomaat-huren-of-kopen/ (briefing wk47, pushdatum 20-11-2026).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

test('huren-of-kopen: build, title/meta/H1/H2, L7, links, alleen myPOS-knop, geen L4/SumUp-hardware', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', GA_ID: '' } });
  const f = 'dist/pinautomaat-huren-of-kopen/index.html';
  assert.ok(existsSync(f));
  const H = readFileSync(f, 'utf8');
  const main = H.slice(H.indexOf('<main'), H.indexOf('</main>'));
  const tekst = main.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
  assert.match(H, /<title>Pinautomaat huren of kopen: wat is goedkoper\?<\/title>/);
  assert.match(H, /<meta name="description" content="Pinautomaat huren of kopen\? Wat je kwijt bent aan aanschaf, huur per maand en transactiekosten, en wanneer kopen zonder abonnement goedkoper is dan huur\.">/);
  assert.match(main, /<h1>Pinautomaat huren of kopen: wat is goedkoper\?<\/h1>/);
  const h2 = [...main.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);
  for (const h of ['Huren, kopen of kopen zonder abonnement', 'Kosten naast elkaar', 'Rekenvoorbeeld per maand', 'Eén dag of evenement', 'Zo kies je', 'Bronnen']) assert.ok(h2.includes(h), h);
  assert.match(H, /"datePublished":"2026-11-20"/);
  assert.match(H, /"dateModified":"2026-11-20"/);
  assert.match(H, /Redactie KassaMatch/);
  const sm = readFileSync('dist/sitemap.xml', 'utf8');
  assert.match(sm, /pinautomaat-huren-of-kopen\/<\/loc><lastmod>2026-11-20<\/lastmod>/);
  assert.match(sm, /gidsen\/<\/loc><lastmod>2026-11-20<\/lastmod>/);
  assert.match(sm, /bronnen\/<\/loc><lastmod>2026-11-20<\/lastmod>/);
  assert.match(sm, /goedkoopste-pinautomaat\/<\/loc><lastmod>2026-11-20<\/lastmod>/);
  assert.ok(readFileSync('dist/bronnen/index.html', 'utf8').includes('href="https://www.ccv.eu/nl/betaaloplossingen/apps-diensten/tap-to-pay"'));
  assert.ok(readFileSync('dist/gidsen/index.html', 'utf8').includes('href="/pinautomaat-huren-of-kopen/"'));
  const goedkoop = readFileSync('dist/goedkoopste-pinautomaat/index.html', 'utf8');
  assert.match(goedkoop, /<a href="\/pinautomaat-huren-of-kopen\/">pinautomaat huren of kopen<\/a>/);
  assert.match(goedkoop, /"dateModified":"2026-11-20"/);
  assert.match(goedkoop, /Laatst bijgewerkt <time datetime="2026-11-20">20 november 2026<\/time>/);
  assert.doesNotMatch(goedkoop, /CCV publiceert de prijs van de (betaal)?automaat/);
  assert.match(goedkoop, /CCV toont op de kooppagina een eenmalige prijs vanaf € 399 plus maandelijkse kosten vanaf € 16/);
  assert.match(goedkoop, /De eenmalige koopprijs staat niet op de tarievenpagina, maar wel op de CCV-pagina over pinautomaat kopen: vanaf € 399 plus maandelijkse kosten vanaf € 16/);
  for (const l of ['/goedkoopste-pinautomaat/', '/transactiekosten-vergelijken/', '/aanbieders/mypos/', '/aanbieders/sumup/', '/aanbieders/ccv/', '/mypos-vs-sumup/', '/sumup-vs-zettle/', '/kassa-match/', '/pinautomaat-vergelijken/']) assert.ok(main.includes(`href="${l}"`), l);
  // Alleen de bestaande myPOS-knop; overige merken als gewone bronlink.
  const sponsored = [...main.matchAll(/rel="sponsored[^"]*"/g)];
  assert.equal(sponsored.length, 1);
  assert.match(main, /data-vendor="mypos"/);
  for (const v of ['sumup', 'ccv', 'zettle', 'mollie']) assert.doesNotMatch(main, new RegExp(`data-vendor="${v}"`), v);
  // Gelabeld rekenvoorbeeld; bedragen uit de bronnen.
  assert.ok(tekst.includes('Rekenvoorbeeld van KassaMatch'));
  for (const s of ['€ 25', '€ 28', '€ 30', '€ 399', '€ 16', '€ 0,068', '€ 4,25', '€ 39', '€ 0,25', '12 maanden']) assert.ok(tekst.includes(s), s);
  // SC B3 / L4: geen SumUp-hardwarebedragen, geen kortingen of acties.
  for (const s of ['€ 34', '€ 44', '€ 169', 'korting', 'Black Friday', '€ 28,90']) assert.ok(!tekst.includes(s), s);
  assert.doesNotMatch(tekst, /\b(actie|actieprijs|aanbieding)\b/i);
  // Geen 'volgens X' / 'aldus X' in lopende tekst; geen dagverhuurprijs verzonnen.
  assert.doesNotMatch(tekst, /\b(volgens|aldus) [A-Z]/);
  assert.ok(tekst.includes('publiceert een prijs voor dagverhuur'));
});
