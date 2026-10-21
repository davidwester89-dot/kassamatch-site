// Goedgekeurde partnerlinks per aanbieder-id. Alleen programma's die voor kassamatch.nl zijn goedgekeurd.
// Shopify POS: impact.com, publisher-account 7989613, programma 13624; kassamatch.nl is daar geverifieerde property (19-10-2026).
// myPOS: impact.com, publisher-account 7989613, goedgekeurd voor kassamatch.nl (21-10-2026); trackinglink van Dave.
// De match en de kostenrekentool lezen dit bestand NOOIT: partnerlinks hebben geen invloed op het advies of de volgorde.
import { AANBIEDERS } from './aanbieders.js';

export const PARTNERLINKS = {
  shopify: 'https://shopify.pxf.io/c/7989613/1061744/13624?u=https%3A%2F%2Fwww.shopify.com%2Fnl%2Fpos',
  mypos: 'https://mypos.sjv.io/c/7989613/3298511/42951',
};

/** Uitgaande link: partnerlink (rel sponsored nofollow, zonder zichtbaar label) als die er is, anders de officiële site. */
export function uitgaand(id, partnerlinks = PARTNERLINKS) {
  const p = AANBIEDERS[id];
  if (!p) throw new Error('Onbekende aanbieder ' + id);
  const pl = partnerlinks[id];
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true, naam: p.naam } : { href: p.url, rel: 'noopener', partner: false, naam: p.naam };
}

/** Knop naar de aanbieder. Een partnerlink krijgt rel sponsored nofollow noopener, geen zichtbaar label (uitleg in de FAQ). */
export function knop(id, pos, cls = 'btn', partnerlinks = PARTNERLINKS) {
  const o = uitgaand(id, partnerlinks);
  const kort = o.naam.split(' (')[0];
  return `<a class="${cls}" href="${o.href}" rel="${o.rel}" target="_blank" data-vendor="${id}" data-pos="${pos}" data-cta="outbound" data-partner-slot="${id}">Naar ${kort}</a>`;
}
