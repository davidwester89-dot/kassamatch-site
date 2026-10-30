// Logo's van de aanbieders (Dave 30-10): officieel logo of merkicoon van hun eigen site (bronnen in src/assets/logos/BRONNEN.md).
// Neutraal: elke aanbieder krijgt precies hetzelfde vak (80 x 24, object-fit contain), partner of niet.
// Logo's tellen nooit mee in de match of de volgorde. Ook in de browser gebruikt (quiz.js, rekentool.js), dus zonder Node-imports.
import { AANBIEDERS } from './aanbieders.js';
// Shopify, Lightspeed en Zettle staan niet in LOGO_MERK: hun merkrichtlijn vraagt toestemming of een licentie (ZONDER_LOGO in logo-rechten.js, SC 30-10).

export const LOGO_MAAT = [80, 24];
/** id -> merknaam (alleen merken met een logo). */
export const LOGO_MERK = { sumup: 'SumUp', mypos: 'myPOS', mollie: 'Mollie', ccv: 'CCV', untill: 'unTill', mplus: 'MplusKASSA' };

/** Logo in een vast vak; lazy, width/height in de html (geen layoutverschuiving). Decoratief: de naam staat ernaast. */
export function logoImg(id, { base = '' } = {}) {
  if (!AANBIEDERS[id]) throw new Error('Onbekende aanbieder ' + id);
  if (!LOGO_MERK[id]) return '';
  const [w, h] = LOGO_MAAT;
  return `<span class="cel-logo"><img src="${base}/logos/${id}.png" alt="" aria-hidden="true" width="${w}" height="${h}" loading="lazy" decoding="async"></span>`;
}
