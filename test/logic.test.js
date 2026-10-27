import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { score, VRAGEN, compleet, prijsInEuro } from '../src/lib/match.js';
import { planKosten, besteplan, vergelijkPin } from '../src/lib/kosten.js';
import { AANBIEDERS, IDS, PIN_IDS, KASSA_IDS, CHECKED, checkedVan, goedkoopsteHardware } from '../src/lib/aanbieders.js';
import { uitgaand, knop, PARTNERLINKS } from '../src/lib/partnerlinks.js';

test('data: elke aanbieder heeft bron(nen) op de eigen site, geen verzonnen velden', () => {
  assert.match(CHECKED, /^\d{4}-\d{2}-\d{2}$/);
  for (const id of IDS) {
    const p = AANBIEDERS[id];
    assert.ok(p.bronnen.length >= 1, id);
    const host = new URL(p.url).hostname.replace(/^www\./, '');
    // Eigen site = het domein van url, plus eventueel extra officiële domeinen van dezelfde aanbieder (domeinen).
    const hosts = [host, ...(p.domeinen || [])];
    for (const [, u] of p.bronnen) { assert.match(u, /^https:\/\//); assert.ok(hosts.includes(new URL(u).hostname.replace(/^www\./, '')), `${id}: bron ${u} niet op eigen site ${hosts}`); }
    if (p.checked) assert.match(p.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(checkedVan(id) >= CHECKED, id);
    for (const k of ['rating', 'review', 'sterren', 'score']) assert.ok(!(k in p), `${id}.${k}`);
  }
  for (const id of PIN_IDS) for (const pl of AANBIEDERS[id].plannen) { assert.ok(pl.maand >= 0 && pl.pct >= 0 && pl.vast >= 0); assert.ok(pl.tarief); }
  // CCV: huur en koop hebben ook maandbedragen, dus geen losse koopprijs in de rekentool; wel als tekst.
  // SumUp Solo Lite: € 34 los, € 44 met oplaadstation (sumup.com/nl-nl/solo-lite-pinapparaat, 20-10-2026); goedkoopste = € 34.
  assert.equal(goedkoopsteHardware('sumup'), 34); assert.ok(AANBIEDERS.sumup.hardware.some(([n, p]) => /oplaadstation/.test(n) && p === 44));
  assert.equal(goedkoopsteHardware('zettle'), 29); assert.ok(goedkoopsteHardware('zettle') < goedkoopsteHardware('sumup'));
  assert.equal(AANBIEDERS.ccv.hardware, null); assert.match(AANBIEDERS.ccv.hardwareKort, /€ 25/); assert.match(AANBIEDERS.ccv.hardwareKort, /€ 399/);
  // SumUp en myPOS zijn op 20-10 opnieuw gecontroleerd (uitgebreide pagina's), Mollie op 23-10 (indexering).
  for (const id of ['sumup', 'mypos']) assert.equal(checkedVan(id), '2026-10-20', id);
  assert.equal(checkedVan('mollie'), '2026-10-23', 'mollie');
  // unTill: € 19 is het jaarabonnement, maandabonnement € 21,85; het volledige systeem heet unTill Prime.
  const ut = JSON.stringify(AANBIEDERS.untill); assert.match(ut, /jaarabonnement/); assert.match(ut, /21,85/); assert.match(ut, /unTill Prime/); assert.ok(!/maandelijks opzegbaar|in het Engels/i.test(ut));
  // MplusKASSA noemt webshop- en pinkoppelingen.
  assert.equal(AANBIEDERS.mplus.online.ja, true); assert.match(AANBIEDERS.mplus.transactie, /CCV/);
  // Shopify: europrijzen van de NL-prijspagina (27-10); Mplus op offerte; nergens 'prijs op aanvraag' bij Lightspeed.
  assert.equal(AANBIEDERS.shopify.vanaf, 21); assert.equal(AANBIEDERS.shopify.prijsBasis, 'jaarbetaling'); assert.equal(AANBIEDERS.shopify.valuta, 'EUR'); assert.equal(AANBIEDERS.shopify.peildatum, '2026-10-27'); assert.ok(!('usd' in AANBIEDERS.shopify));
  assert.match(AANBIEDERS.shopify.vanafTekst, /€ 28/); assert.equal(checkedVan('shopify'), '2026-10-27');
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

test('partnerlinks: alleen goedgekeurd voor kassamatch.nl; gevuld = sponsored nofollow, geen zichtbaar label', () => {
  for (const [id, href] of Object.entries(PARTNERLINKS)) { assert.ok(AANBIEDERS[id], id); assert.match(href, /^https:\/\//); }
  for (const id of IDS) {
    const o = uitgaand(id);
    if (PARTNERLINKS[id]) { assert.equal(o.rel, 'sponsored nofollow noopener'); } else { assert.equal(o.href, AANBIEDERS[id].url); assert.equal(o.rel, 'noopener'); }
  }
  const k = knop('shopify', 't', 'btn', { shopify: 'https://example.com/aff' });
  assert.match(k, /rel="sponsored nofollow noopener"/); assert.match(k, /<\/a>$/); assert.ok(!/<span class="partner"|>\s*partnerlink\s*</i.test(k));
  assert.ok(!knop('shopify', 't', 'btn', {}).includes('partnerlink'));
});

test('match en kosten lezen nooit partnerlinks', () => {
  for (const f of ['../src/lib/match.js', '../src/lib/kosten.js', '../src/lib/aanbieders.js']) assert.ok(!readFileSync(new URL(f, import.meta.url), 'utf8').match(/import[^\n]*partnerlinks/), f);
});

test('match: valuta bepaalt de volgorde niet (US$ op €-equivalent, ECB-koers in de data)', () => {
  const basis = { soort: 'kassa', online: { ja: false }, horeca: false, winkel: true };
  const koers = { usdPerEur: 1.115, datum: '2026-10-27', bron: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html' };
  // US$ 39 tegen 1,115 = € 34,98: gelijk aan een aanbieder met € 34,98.
  assert.equal(prijsInEuro({ vanaf: 39, valuta: 'USD', koers }), 34.98);
  assert.equal(prijsInEuro({ vanaf: 28, valuta: 'EUR' }), 28);
  assert.equal(prijsInEuro({ vanaf: 39, valuta: 'USD' }), null, 'zonder koers niet vergelijkbaar');
  const lijst = { 'b-usd': { ...basis, vanaf: 39, valuta: 'USD', koers }, 'a-eur': { ...basis, vanaf: 34.98, valuta: 'EUR' }, 'c-duur': { ...basis, vanaf: 35, valuta: 'EUR' }, 'd-goedkoop': { ...basis, vanaf: 34, valuta: 'EUR' } };
  const r = score({ type: 'winkel', nodig: 'kassa', online: 'nee', aantal: '150', bedrag: '25', budget: 'mid' }, lijst);
  // Zelfde fit; volgorde op euro: 34 < 34,98 = 34,98 (dan alfabetisch) < 35. De US$-aanbieder komt niet achteraan.
  assert.deepEqual(r.map((x) => x.id), ['d-goedkoop', 'a-eur', 'b-usd', 'c-duur']);
  assert.equal(r[1].kosten, r[2].kosten);
  // Omdraaien van de namen draait alleen de gelijke stand om, niet de valuta.
  const r2 = score({ type: 'winkel', nodig: 'kassa', online: 'nee', aantal: '150', bedrag: '25', budget: 'mid' }, { 'a-usd': lijst['b-usd'], 'b-eur': lijst['a-eur'] });
  assert.deepEqual(r2.map((x) => x.id), ['a-usd', 'b-eur']);
  // Partnerlinks/commissie zitten niet in de data van de match.
  assert.ok(!/partner|commissie|affiliate/i.test(readFileSync('src/lib/match.js', 'utf8').replace(/^\s*(\/\/|\*|\/\*\*).*$/gm, '')));
});

test('match: Shopify POS rankt op de laagste maandprijs (€ 21 bij jaarbetaling), niet meer automatisch achteraan', () => {
  const r = score({ type: 'winkel', nodig: 'kassa', online: 'nee', aantal: '150', bedrag: '25', budget: 'mid' });
  const s = r.find((x) => x.id === 'shopify');
  assert.equal(s.kosten, 21); assert.ok(Number.isFinite(s.kosten));
  assert.ok(!s.waarom.some((w) => /dollar|offerte/i.test(w)));
});

test('data: elke vanafTekst met een prijs noemt per bedrag de betaalbasis', () => {
  const BASIS = /bij jaarbetaling|maandelijks|jaarabonnement|maandelijks opzegbaar|betaalbasis niet vermeld/;
  let n = 0;
  for (const id of IDS) {
    const t = AANBIEDERS[id].vanafTekst;
    if (!t || !/€\s?\d/.test(t)) continue;
    // Elk €-bedrag tot het volgende €-bedrag (of het einde) moet een betaalbasis noemen.
    const stukken = t.split(/(?=€\s?\d)/).slice(1);
    for (const st of stukken) { n++; assert.match(st, BASIS, `${id}: geen betaalbasis bij "${st}"`); }
    // Het bedrag waarmee de match rekent staat in de tekst, en de basis staat ook in de data.
    if (AANBIEDERS[id].vanaf != null) {
      assert.ok(t.includes(`€ ${AANBIEDERS[id].vanaf} `), `${id}: vanaf ${AANBIEDERS[id].vanaf} niet in vanafTekst`);
      assert.ok('prijsBasis' in AANBIEDERS[id] && AANBIEDERS[id].peildatum && AANBIEDERS[id].prijsBron, `${id}: prijsBasis/peildatum/prijsBron ontbreekt`);
    }
  }
  assert.ok(n >= 6, `te weinig bedragen gecontroleerd (${n})`);
});

const profiel = (x) => ({ type: 'winkel', nodig: 'kassa', online: 'nee', aantal: '150', bedrag: '25', budget: 'mid', ...x });
const vind = (x, id) => score(profiel(x)).find((r) => r.id === id);

test('match: Shopify bij budget hoog incl. POS Pro (€ 21 + € 59 = € 80)', () => {
  for (const online of ['ja', 'nee']) {
    const s = vind({ budget: 'hoog', online }, 'shopify');
    assert.equal(s.kosten, 80, online);
    assert.ok(s.waarom.includes('incl. POS Pro: € 79 per maand, of € 59 per maand bij jaarbetaling'), JSON.stringify(s.waarom));
  }
  assert.equal(AANBIEDERS.shopify.optieBijHoog.bedrag, 59); assert.equal(AANBIEDERS.shopify.optieBijHoog.prijsBasis, 'jaarbetaling');
});

test('match: Shopify bij budget mid en laag alleen Basic (€ 21), zonder POS Pro', () => {
  for (const budget of ['mid', 'laag']) {
    const s = vind({ budget }, 'shopify');
    assert.equal(s.kosten, 21, budget);
    assert.ok(!s.waarom.some((w) => /POS Pro/.test(w)), budget);
  }
});

test('match: Lightspeed rekent per type: winkel € 99 (retail, jaarbetaling), horeca € 89', () => {
  for (const budget of ['laag', 'mid', 'hoog']) {
    assert.equal(vind({ type: 'winkel', budget }, 'lightspeed').kosten, 99, budget);
    assert.equal(vind({ type: 'horeca', budget }, 'lightspeed').kosten, 89, budget);
  }
  const pt = AANBIEDERS.lightspeed.prijsPerType;
  assert.equal(pt.winkel.prijsBasis, 'jaarbetaling'); assert.match(pt.winkel.prijsBron, /retail\/prijzen/); assert.match(pt.horeca.prijsBron, /restaurant\/prijzen/);
  for (const k of ['winkel', 'horeca']) assert.ok('prijsBasis' in pt[k] && pt[k].peildatum && pt[k].prijsBron, k);
  // De bedragen per type staan ook in de vanafTekst.
  assert.match(AANBIEDERS.lightspeed.vanafTekst, /€ 99 per maand bij jaarbetaling \(retail\)/); assert.match(AANBIEDERS.lightspeed.vanafTekst, /€ 89 per maand \(horeca/);
});
