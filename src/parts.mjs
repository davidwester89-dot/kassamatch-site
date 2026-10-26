import { SITE, esc, ORG, AUTHOR, fmtDate } from './layout.mjs';
import { AANBIEDERS, CHECKED, PIN_IDS, goedkoopsteHardware } from './lib/aanbieders.js';
import { vergelijkPin, fmtEur } from './lib/kosten.js';
import { knop } from './lib/partnerlinks.js';
export const A = AANBIEDERS;
export const DATE = '2026-10-19';
export const kortNaam = (id) => A[id].naam.split(' (')[0];
export const by = (d = DATE) => `<p class="src">Door ${SITE.owner} · ${fmtDate(d)}</p>`;
export const bron = (...lists) => {
  const all = lists.flat();
  const seen = new Set();
  const uniq = all.filter(([, u]) => (seen.has(u) ? false : seen.add(u)));
  return `<p class="src">Bronnen: ${uniq.map(([t, u]) => `<a href="${u}" rel="noopener">${esc(t)}</a>`).join(' · ')}</p>`;
};
export const bronnenVan = (...ids) => ids.flatMap((id) => A[id].bronnen);
export const matchCta = (t = 'Twijfel je nog?', pos = 'match') => `<div class="cta"><h2>${t}</h2><p>Zes korte vragen over je zaak, je aantal pinbetalingen en hoe je naar vaste kosten kijkt. Je krijgt de drie opties die het best passen, met kosten per maand.</p><a class="btn" href="/kassa-match/" data-cta="${pos}">Start de match</a></div>`;
export const article = ({ path, title, h1, description, og, parents, date = DATE, updated = date, faq, schemaType = 'Article' }) => ({
  path, title, h1, crumb: h1, description, og, parents, ogType: 'article', lastmod: updated,
  article: { date, updated }, stamp: updated !== date ? { checked: CHECKED, updated } : { checked: CHECKED },
  schema: [
    { '@context': 'https://schema.org', '@type': schemaType, headline: h1, description, mainEntityOfPage: SITE.domain + path, image: `${SITE.domain}/og/${og}.png`, datePublished: date, dateModified: updated, author: AUTHOR, publisher: ORG, inLanguage: 'nl' },
    ...(faq ? [faqSchema(faq)] : []),
  ],
});
export const faqSchema = (faq) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
export const faqHtml = (faq) => `<h2>Veelgestelde vragen</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}`;

// ---- Bedragen ----
export const eur = (n) => (n === 0 ? '€ 0' : '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 3 }));
export { fmtEur };
export const hwTekst = (id) => {
  const list = AANBIEDERS[id].hardware;
  if (!list) return AANBIEDERS[id].hardwareKort || 'onbekend (niet gepubliceerd)';
  const [naam, prijs] = list.reduce((m, h) => (h[1] < m[1] ? h : m));
  const noot = /aanbieding/i.test(naam) ? ' (aanbieding nieuwe klanten)' : '';
  return `vanaf ${eur(prijs)} excl. btw${noot}`;
};
export const planTekst = (pl) => `${pl.maand ? eur(pl.maand) + ' per maand' : 'geen vaste kosten'} · ${pl.tarief}`;

/** Tabel: pinkosten per aanbieder bij een vast voorbeeld (goedkoopste plan bij dat volume). */
export function pinVoorbeeld(aantal, bedrag, { caption = true } = {}) {
  const rows = vergelijkPin(aantal, bedrag).map((r, i) => `<tr><th scope="row">${i + 1}. <a href="/aanbieders/${A[r.id].slug}/">${esc(kortNaam(r.id))}</a><span class="fnote">${esc(r.plan.naam)}</span></th><td class="n" data-l="Vast per maand">${fmtEur(r.maand)}</td><td class="n" data-l="Transactiekosten">${fmtEur(r.transactie)}</td><td class="n" data-l="Totaal per maand"><strong>${fmtEur(r.totaal)}</strong></td><td data-l="Pinapparaat">${hwTekst(r.id)}</td></tr>`).join('');
  return `<div class="table-wrap"><table class="data stack">${caption ? `<caption class="sr-only">Kosten per maand bij ${aantal} pinbetalingen van gemiddeld ${eur(bedrag)}</caption>` : ''}<thead><tr><th scope="col">Aanbieder en plan</th><th scope="col">Vast per maand</th><th scope="col">Transactiekosten</th><th scope="col">Totaal per maand</th><th scope="col">Pinapparaat</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Tarieventabel van alle pinaanbieders (alle plannen). */
export function tarievenTabel() {
  const rows = PIN_IDS.flatMap((id) => A[id].plannen.map((pl, i) => `<tr><th scope="row">${i === 0 ? `<a href="/aanbieders/${A[id].slug}/">${esc(kortNaam(id))}</a>` : `<span class="sr-only">${esc(kortNaam(id))} </span>`}<span class="fnote">${esc(pl.naam)}</span></th><td class="n" data-l="Vast per maand">${pl.maand ? eur(pl.maand) : '€ 0'}</td><td data-l="Per pinbetaling (NL betaalpas)">${esc(pl.tarief)}</td><td data-l="Goedkoopste pinapparaat">${i === 0 ? hwTekst(id) : ''}</td></tr>`)).join('');
  return `<div class="table-wrap"><table class="data stack"><caption class="sr-only">Tarieven van de pinaanbieders per plan</caption><thead><tr><th scope="col">Aanbieder en plan</th><th scope="col">Vast per maand</th><th scope="col">Per pinbetaling (NL betaalpas)</th><th scope="col">Goedkoopste pinapparaat</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

const vlag = (v) => (v === true || v === 'ja' ? '<span class="fv ja">Ja</span>' : v === 'deels' ? '<span class="fv deels">Deels</span>' : v === false || v === 'nee' ? '<span class="fv nee">Nee</span>' : '<span class="fv nv">Niet vermeld</span>');
export { vlag };

/** Kaart van een aanbieder (overzicht). */
export function acard(id, { level = 'h2', pos = 'lijst' } = {}) {
  const p = A[id];
  const facts = p.soort === 'pin'
    ? [['Vast per maand', p.plannen.map((pl) => (pl.maand ? eur(pl.maand) : '€ 0')).join(' / ')], ['Per pinbetaling', esc(p.plannen[0].tarief)], ['Pinapparaat', hwTekst(id)], ['Kassasoftware', vlag(p.kassa.v)], ['Online betalen', vlag(p.online.ja)]]
    : [['Prijs', esc(p.vanafTekst)], ['Hardware', esc(p.hardwareNoot)], ['Horeca', vlag(p.horeca)], ['Winkel', vlag(p.winkel)], ['Online / webshop', vlag(p.online.ja)]];
  return `<li class="pcard" data-id="${id}"><div class="pc-head"><span><span class="tag best">${p.soort === 'pin' ? 'Pinautomaat' : 'Kassasysteem'}</span></span><${level}><a href="/aanbieders/${p.slug}/">${esc(p.naam)}</a></${level}><p class="pc-for">${esc(p.kort)}</p></div>
<ul class="pc-facts">${facts.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join('')}</ul>
<div class="pc-cta">${knop(id, pos, 'btn sm')}<a href="/aanbieders/${p.slug}/">Alles over ${esc(kortNaam(id))} →</a></div></li>`;
}

export const methodBox = (h = 'h2') => `<section class="method" id="methode"><${h}>Zo vergelijken we</${h}><ol><li><strong>Tarieven van de aanbieder zelf.</strong> Elk bedrag komt van de prijspagina van de aanbieder, met link naar de bron op de pagina <a href="/bronnen/">bronnen</a>. Publiceert een aanbieder iets niet, dan staat er "onbekend" of "op offerte".</li><li><strong>Rekenen, niet raden.</strong> Pinkosten per maand = vaste kosten + aantal pinbetalingen × tarief. We rekenen met betalingen met een Nederlandse consumentenbetaalpas en kiezen per aanbieder het goedkoopste plan bij jouw volume. Creditcards, zakelijke passen en online betalingen kosten vaak meer.</li><li><strong>Partnerlinks veranderen niets.</strong> De match kijkt eerst naar wat past, dan naar de kosten. Commissie telt nooit mee, en de match leest de partnerlinks niet eens.</li></ol><p class="src">Door ${SITE.owner} · Tarieven gecontroleerd op ${fmtDate(CHECKED)}</p></section>`;
