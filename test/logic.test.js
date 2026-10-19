import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { score, VRAGEN, compleet } from '../src/lib/match.js';
import { planKosten, besteplan, vergelijkPin } from '../src/lib/kosten.js';
import { AANBIEDERS, IDS, PIN_IDS, KASSA_IDS, CHECKED } from '../src/lib/aanbieders.js';
import { uitgaand, knop, PARTNERLINKS } from '../src/lib/partnerlinks.js';

test('data: elke aanbieder heeft bron(nen) op de eigen site, geen verzonnen velden', () => {
  assert.match(CHECKED, /^\d{4}-\d{2}-\d{2}$/);
  for (const id of IDS) {
    const p = AANBIEDERS[id];
    assert.ok(p.bronnen.length >= 1, id);
    const host = new URL(p.url).hostname.replace(/^www\./, '');
    for (const [, u] of p.bronnen) { assert.match(u, /^https:\/\//); assert.ok(new URL(u).hostname.replace(/^www\./, '') === host, `${id}: bron ${u} niet op eigen site ${host}`); }
    for (const k of ['rating', 'review', 'sterren', 'score']) assert.ok(!(k in p), `${id}.${k}`);
  }
  for (const id of PIN_IDS) for (const pl of AANBIEDERS[id].plannen) { assert.ok(pl.maand >= 0 && pl.pct >= 0 && pl.vast >= 0); assert.ok(pl.tarief); }
  // CCV publiceert de prijs van de automaat niet: die moet onbekend blijven.
  assert.equal(AANBIEDERS.ccv.hardware, null);
  // Shopify alleen in dollars; Mplus op offerte; nergens 'prijs op aanvraag' bij Lightspeed.
  assert.equal(AANBIEDERS.shopify.vanaf, null); assert.ok(AANBIEDERS.shopify.usd);
  assert.equal(AANBIEDERS.mplus.vanaf, null);
  assert.ok(!JSON.stringify(AANBIEDERS.lightspeed).includes('op aanvraag'));
  assert.equal(AANBIEDERS.lightspeed.vanaf, 89);
});

test('kosten: formule klopt met de tarieven', () => {
  assert.deepEqual(planKosten({ maand: 0, pct: 1.49, vast: 0 }, 100, 20), { maand: 0, transactie: 29.8, totaal: 29.8 });
  assert.deepEqual(planKosten({ maand: 4.25, pct: 0, vast: 0.068 }, 1000, 25), { maand: 4.25, transactie: 68, totaal: 72.25 });
  // SumUp: zonder abonnement bij weinig omzet, Plus bij veel.
  assert.equal(besteplan('sumup', 50, 20).plan.id, 'sumup-0');
  assert.equal(besteplan('sumup', 1000, 25).plan.id, 'sumup-plus');
  assert.equal(besteplan('mypos', 1000, 25).plan.id, 'mypos-pro');
  // Zonder abonnement: geen plan met maandkosten, CCV valt weg.
  const r = vergelijkPin(300, 25, { geenAbonnement: true });
  assert.ok(r.every((x) => x.plan.maand === 0)); assert.ok(!r.some((x) => x.id === 'ccv'));
  const all = vergelijkPin(300, 25);
  for (let i = 1; i < all.length; i++) assert.ok(all[i - 1].totaal <= all[i].totaal);
});

test('match: logische uitkomsten', () => {
  const a = (o) => ({ type: 'winkel', nodig: 'pin', online: 'nee', aantal: '150', bedrag: '25', budget: 'mid', ...o });
  // Alleen pinnen: top 3 zijn altijd pinaanbieders.
  for (const type of ['winkel', 'horeca', 'onderweg', 'afspraak']) for (const budget of ['laag', 'mid', 'hoog']) for (const online of ['ja', 'nee'])
    assert.ok(score(a({ type, budget, online })).slice(0, 3).every((r) => PIN_IDS.includes(r.id)), `${type}/${budget}/${online}`);
  // Geen abonnement: geen CCV bovenaan.
  assert.notEqual(score(a({ budget: 'laag' }))[0].id, 'ccv');
  // Veel pinnen, abonnement mag: vast bedrag per betaling wint.
  assert.ok(['ccv', 'mypos'].includes(score(a({ aantal: '1500', bedrag: '60' }))[0].id));
  // Online: aanbieders die online betalingen noemen gaan voor.
  assert.ok(score(a({ online: 'ja' })).slice(0, 3).every((r) => AANBIEDERS[r.id].online.ja === true));
  // Horeca met kassa en compleet systeem: horecakassa bovenaan.
  assert.ok(['lightspeed', 'untill', 'mplus'].includes(score(a({ type: 'horeca', nodig: 'kassa', budget: 'hoog' }))[0].id));
  // Winkel + webshop: Shopify POS bovenaan.
  assert.equal(score(a({ nodig: 'kassa', online: 'ja', budget: 'hoog' }))[0].id, 'shopify');
  // Kassa met klein budget: gratis kassasoftware.
  assert.ok(['sumup', 'zettle'].includes(score(a({ nodig: 'kassa', budget: 'laag' }))[0].id));
  // Mollie heeft geen kassasoftware: nooit bovenaan bij 'kassa'.
  for (const type of ['winkel', 'horeca', 'onderweg', 'afspraak']) assert.notEqual(score(a({ type, nodig: 'kassa' }))[0].id, 'mollie');
  assert.ok(compleet(Object.fromEntries(VRAGEN.map((v) => [v.id, v.opties[0][0]]))));
  assert.equal(score(a({})).length, IDS.length);
  assert.equal(KASSA_IDS.length + PIN_IDS.length, IDS.length);
});

test('partnerlinks: alleen goedgekeurd voor kassamatch.nl; gevuld = sponsored nofollow + label', () => {
  for (const [id, href] of Object.entries(PARTNERLINKS)) { assert.ok(AANBIEDERS[id], id); assert.match(href, /^https:\/\//); }
  for (const id of IDS) {
    const o = uitgaand(id);
    if (PARTNERLINKS[id]) { assert.equal(o.rel, 'sponsored nofollow noopener'); } else { assert.equal(o.href, AANBIEDERS[id].url); assert.equal(o.rel, 'noopener'); }
  }
  const k = knop('shopify', 't', 'btn', { shopify: 'https://example.com/aff' });
  assert.match(k, /rel="sponsored nofollow noopener"/); assert.match(k, /<\/a><span class="partner">partnerlink<\/span>$/);
  assert.ok(!knop('shopify', 't', 'btn', {}).includes('partnerlink'));
});

test('match en kosten lezen nooit partnerlinks', () => {
  for (const f of ['../src/lib/match.js', '../src/lib/kosten.js', '../src/lib/aanbieders.js']) assert.ok(!readFileSync(new URL(f, import.meta.url), 'utf8').match(/import[^\n]*partnerlinks/), f);
});
