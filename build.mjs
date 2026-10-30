import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { layout, SITE, BASE, PREVIEW } from './src/layout.mjs';
import { partnerNoten } from './src/lib/partnerlinks.js';
import * as P from './src/pages.mjs';
import { maakLogoCellen } from './src/lib/logo-cellen.mjs';
import { AANBIEDERS } from './src/lib/aanbieders.js';
import { LOGO_MERK } from './src/lib/logos.js';
const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
// Logo's in tabelcellen met precies de naam van een aanbieder (Dave 30-10); zelfde vak voor iedereen, alleen beeld.
const logoCellen = maakLogoCellen(Object.entries(AANBIEDERS).filter(([id]) => LOGO_MERK[id]).map(([id, a]) => ({ namen: [...new Set([a.naam, a.naam.split(' (')[0], LOGO_MERK[id]])], src: `${BASE}/logos/${id}.png`, merk: LOGO_MERK[id] })), { productrijen: true });
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, p.endsWith('.html') ? logoCellen(s) : s); };
// L7 30-10: pagina's waar logo's van de aanbieders bijkwamen (tabellen, kaarten, aanbiederpagina's, keuzehulp): bijgewerkt-datum, lastmod en dateModified.
const LOGO_UPD = '2026-10-30';
const LOGO_PADEN = new Set(['/', '/kassa-match/', '/pinautomaat-vergelijken/', '/kassasysteem-vergelijken/', '/aanbieders/', '/aanbieders/ccv/', '/aanbieders/mollie/', '/aanbieders/mpluskassa/', '/aanbieders/mypos/', '/aanbieders/sumup/', '/aanbieders/untill/', '/aanbieders/lightspeed/', '/aanbieders/shopify-pos/', '/aanbieders/zettle/', '/sumup-vs-zettle/', '/transactiekosten-vergelijken/', '/bronnen/']);
const bijgewerkt = (pg, upd) => ({ ...pg, lastmod: upd, stamp: { ...pg.stamp, updated: upd }, ...(pg.article ? { article: { ...pg.article, updated: upd } } : {}), ...(pg.schema ? { schema: pg.schema.map((x) => ('dateModified' in x ? { ...x, dateModified: upd } : x)) } : {}) });
export const pages = [P.home, P.quiz, P.pinVergelijk, P.kassaVergelijk, P.aanbiedersHub, ...P.aanbiederPages, P.sumupVsZettle, P.gidsHub, ...P.guides, P.bronnen, P.over, P.privacy, P.disclaimer, P.contact, P.notfound].map((p) => (LOGO_PADEN.has(p.path) ? bijgewerkt(p, LOGO_UPD) : p));
for (const p of pages) write(p.path.endsWith('.html') ? join(OUT, p.path) : join(OUT, p.path, 'index.html'), partnerNoten(layout(p)));
cpSync('src/assets/js', join(OUT, 'js'), { recursive: true });
cpSync('src/lib', join(OUT, 'js/lib'), { recursive: true });
cpSync('src/assets/og', join(OUT, 'og'), { recursive: true });
cpSync('src/assets/logos', join(OUT, 'logos'), { recursive: true, filter: (f) => !f.endsWith('.md') });
cpSync('src/assets/icons', OUT, { recursive: true });
cpSync('src/assets/fonts', join(OUT, 'fonts'), { recursive: true });
cpSync('src/root', OUT, { recursive: true });
// CNAME pas bij livegang (GO_LIVE=1). Zonder CNAME blijft dit een preview op github.io.
if (process.env.GO_LIVE === '1') write(join(OUT, 'CNAME'), 'kassamatch.nl\n');
write(join(OUT, '.nojekyll'), '');
write(join(OUT, 'robots.txt'), PREVIEW ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
write(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((p) => !p.noindex).map((p) => `<url><loc>${SITE.domain}${p.path}</loc><lastmod>${p.lastmod || SITE.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${pages.length} pages → ${OUT}/${PREVIEW ? ` (preview, BASE=${BASE || '/'})` : ''}`);
