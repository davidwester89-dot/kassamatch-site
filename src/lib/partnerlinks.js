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

// Partnerzin: geen label per knop, maar precies één korte zin direct na elk blok waarin een partnerlink staat
// (rel sponsored). Werkt automatisch: staat er geen partnerlink in een blok, dan komt er ook geen zin.
export const PARTNER_NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
export const NOOT_HTML = `<p class="pnoot">${PARTNER_NOOT}</p>`;
const SPONSORED = /<a\s[^>]*rel="[^"]*\bsponsored\b/;
/** Eén blok als string: de zin erachter als er een partnerlink in staat. */
export const metNoot = (html) => (SPONSORED.test(html) ? html + NOOT_HTML : html);
/** Blokken (op class) met knoppen of links naar aanbieders. Het buitenste blok telt; binnen een blok komt geen tweede zin. */
export const BLOKKEN = ['plist', 'actions', 'out', 'pc-cta'];
/** Begin en eind van elk blok in html (buitenste eerst), en of er een partnerlink in staat. kaal = ook <p>, <ul>, <ol> zonder class. */
export function partnerBlokken(html, { blokken = BLOKKEN, kaal = false } = {}) {
  const cls = `<(div|ol|ul|p|aside|section)\\s[^>]*class="(?:[^"]*\\s)?(?:${blokken.join('|')})(?:\\s[^"]*)?"[^>]*>`;
  const re = new RegExp(kaal ? `${cls}|<(p|ul|ol)>` : cls, 'g');
  const res = []; let m;
  while ((m = re.exec(html))) {
    const tag = m[1] || m[2];
    const t = new RegExp(`<${tag}\\b|</${tag}>`, 'g'); t.lastIndex = m.index;
    let d = 0, eind = -1, x;
    while ((x = t.exec(html))) { if (x[0][1] === '/') { if (--d === 0) { eind = x.index + x[0].length; break; } } else d++; }
    if (eind < 0) continue;
    res.push({ start: m.index, end: eind, partner: SPONSORED.test(html.slice(m.index, eind)) });
    re.lastIndex = eind;
  }
  return res;
}
/** Hele pagina: precies één zin direct na elk blok met een partnerlink. */
export function partnerNoten(html, opts) {
  let out = '', i = 0;
  for (const b of partnerBlokken(html, opts)) if (b.partner && !html.startsWith(NOOT_HTML, b.end)) { out += html.slice(i, b.end) + NOOT_HTML; i = b.end; }
  return out + html.slice(i);
}
