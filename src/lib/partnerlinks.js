// Goedgekeurde partnerlinks per aanbieder-id. LEEG zolang er geen goedgekeurd programma VOOR KASSAMATCH.NL is.
// Shopify (impact.com, account 7989613) is goedgekeurd voor de media property shopmatch.nl, niet voor kassamatch.nl.
// Die link hergebruiken we hier pas als kassamatch.nl in impact.com als property is toegevoegd en goedgekeurd.
// De match en de kostenrekentool lezen dit bestand NOOIT: partnerlinks hebben geen invloed op het advies of de volgorde.
import { AANBIEDERS } from './aanbieders.js';

export const PARTNERLINKS = {};

/** Uitgaande link: partnerlink (rel sponsored nofollow, met label) als die er is, anders de officiële site. */
export function uitgaand(id, partnerlinks = PARTNERLINKS) {
  const p = AANBIEDERS[id];
  if (!p) throw new Error('Onbekende aanbieder ' + id);
  const pl = partnerlinks[id];
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true, naam: p.naam } : { href: p.url, rel: 'noopener', partner: false, naam: p.naam };
}

/** Knop naar de aanbieder. Een partnerlink krijgt altijd direct erna het zichtbare label "partnerlink". */
export function knop(id, pos, cls = 'btn', partnerlinks = PARTNERLINKS) {
  const o = uitgaand(id, partnerlinks);
  const kort = o.naam.split(' (')[0];
  return `<a class="${cls}" href="${o.href}" rel="${o.rel}" target="_blank" data-vendor="${id}" data-pos="${pos}" data-cta="outbound" data-partner-slot="${id}">Naar ${kort}</a>${o.partner ? '<span class="partner">partnerlink</span>' : ''}`;
}
