// Logo's van de aanbieders (30-10): officieel logo of merkicoon van hun eigen site (bronnen in src/assets/logos/BRONNEN.md).
// Neutraal: elke aanbieder krijgt precies hetzelfde vak (80 x 24, object-fit contain), partner of niet.
// Logo's tellen nooit mee in de match of de volgorde. Ook in de browser gebruikt (quiz.js, rekentool.js), dus zonder Node-imports.
import { AANBIEDERS } from './aanbieders.js';
// Alle aanbieders met logo (besluit 30-10); een merk dat om weghalen vraagt gaat uit LOGO_MERK (en in ZONDER_LOGO in logo-rechten.js).

export const LOGO_MAAT = [80, 24];
/** id -> merknaam (alleen merken met een logo). */
export const LOGO_MERK = { sumup: 'SumUp', mypos: 'myPOS', zettle: 'PayPal', mollie: 'Mollie', ccv: 'CCV', lightspeed: 'Lightspeed', shopify: 'Shopify', untill: 'unTill', mplus: 'MplusKASSA' };

/** Logo in een vast vak; lazy, width/height in de html (geen layoutverschuiving). Decoratief: de naam staat ernaast. */
export function logoImg(id, { base = '' } = {}) {
  if (!AANBIEDERS[id]) throw new Error('Onbekende aanbieder ' + id);
  if (!LOGO_MERK[id]) return '';
  const [w, h] = LOGO_MAAT;
  return `<span class="cel-logo"><img src="${base}/logos/${id}.png" alt="" aria-hidden="true" width="${w}" height="${h}" loading="lazy" decoding="async"></span>`;
}
