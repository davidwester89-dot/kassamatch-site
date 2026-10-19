import { readFileSync } from 'node:fs';
import { GA_ID as GA_CONFIG } from './analytics.config.mjs';
import { GA_ID_RE } from './lib/consent.js';
import { networkFor } from './network.mjs';

export const GA_ID = (process.env.GA_ID ?? GA_CONFIG).trim();
if (GA_ID && !GA_ID_RE.test(GA_ID)) throw new Error(`Ongeldige GA_ID "${GA_ID}"`);
// Preview op GitHub Pages (davidwester89-dot.github.io/kassamatch-site/): BASE=/kassamatch-site, altijd noindex.
export const BASE = (process.env.BASE || '').replace(/\/$/, '');
export const PREVIEW = BASE !== '' || process.env.PREVIEW === '1';
const G = GA_ID ? { script: ' https://www.googletagmanager.com', connect: ' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com', img: ' https://*.google-analytics.com https://www.googletagmanager.com' } : { script: '', connect: '', img: '' };

export const SITE = {
  name: 'KassaMatch', domain: 'https://kassamatch.nl', email: 'info@kassamatch.nl',
  tagline: 'Pinautomaat of kassa kiezen? Reken het eerst uit.', updated: '2026-10-19', theme: '#8a2d6b', owner: 'Redactie KassaMatch',
};
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const BRAND = 'Kassa<b>Match</b>';
// Logo: zelfde opbouw als BoekhoudMatch (afgerond vlak, wit symbool, amber stip), eigen accent: pinautomaat met vinkje op pruim.
export const LOGO = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="11" fill="#8a2d6b"/><rect x="12" y="8" width="16" height="25" rx="3" fill="#fff"/><rect x="15" y="11" width="10" height="7" rx="1.5" fill="#8a2d6b"/><path d="m15.5 25 3 3 6-6" fill="none" stroke="#8a2d6b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="8" r="4" fill="#e7a33e"/></svg>';

// Lijn-iconen (zelfde set en stijl als BoekhoudMatch: 24px, lijn 2, ronde uiteinden; Lucide-stijl, MIT).
const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const ICONS = {
  match: ic('<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>'),
  kalender: ic('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
  bron: ic('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
  schild: ic('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),
  gratis: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/><path d="M17 11l2 2 4-4"/>'),
};

const NAV = [
  ['/kassa-match/', 'Start de match', 'nav-cta'],
  ['/pinautomaat-vergelijken/', 'Pinautomaten'],
  ['/kassasysteem-vergelijken/', 'Kassasystemen'],
  ['/aanbieders/', 'Aanbieders'],
  ['/gidsen/', 'Gidsen'],
  ['/over/', 'Over ons'],
];
const navLinks = (navPath) => NAV.map(([h, t, c]) => `<a href="${h}"${c ? ` class="${c}"` : ''}${navPath.startsWith(h) ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('');
const CSS = readFileSync(new URL('./assets/css/style.css', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};:,>])\s*/g, '$1').replace(/;}/g, '}');

export function networkFooter() {
  return `<div class="net"><p class="fh">Ook van ons</p><ul>${networkFor('kassamatch.nl').map((s) => `<li><a href="${s.url}">${s.logo}</a> · ${esc(s.wat)}</li>`).join('')}</ul></div>`;
}

/** Interne links (en lettertypes in de CSS) krijgen in de preview het BASE-pad; externe links en canonicals blijven gelijk. */
export function withBase(html) {
  if (!BASE) return html;
  return html.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`).replace(/srcset="([^"]+)"/g, (m, v) => `srcset="${v.replace(/(^|, )\//g, `$1${BASE}/`)}"`).replace(/url\(\/fonts\//g, `url(${BASE}/fonts/`);
}

export function layout(p) {
  const url = SITE.domain + (p.path === '/404.html' ? '/' : p.path);
  const trail = p.path === '/' || p.path === '/404.html' ? [] : [['/', 'Home'], ...(p.parents || []), [p.path, p.crumb || p.h1]];
  const crumbs = trail.length ? `<nav class="crumbs" aria-label="Kruimelpad">${trail.map(([h, t], i) => (i === trail.length - 1 ? `<span aria-current="page">${esc(t)}</span>` : `<a href="${h}">${esc(t)}</a>`)).join(' › ')}</nav>` : '';
  const ld = [
    ...(trail.length ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map(([h, t], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: SITE.domain + h })) }] : []),
    siteGraph(),
    ...(p.schema || []),
  ];
  const hasCta = !p.noCta && p.path !== '/kassa-match/' && p.path !== '/404.html';
  const og = `${SITE.domain}/og/${p.og || 'home'}.png`;
  const navPath = p.navPath || p.path;
  const robots = PREVIEW || p.noindex ? '<meta name="robots" content="noindex">' : '';
  const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'${G.script}; style-src 'self' 'unsafe-inline'; img-src 'self' data:${G.img}; font-src 'self'; connect-src 'self'${G.connect}; base-uri 'self'; form-action 'self'; object-src 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
${p.path === '/' ? '<meta name="impact-site-verification" value="411afa60-a00a-4d99-9260-bcdb87ad9dbe">\n' : ''}<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
${robots}${p.noindex ? '' : `<link rel="canonical" href="${url}">`}
<meta property="og:site_name" content="${SITE.name}"><meta property="og:locale" content="nl_NL"><meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(p.h1 || p.title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.ogTitle || p.title)}"><meta name="twitter:description" content="${esc(p.description)}"><meta name="twitter:image" content="${og}">
${p.article ? `<meta property="article:published_time" content="${p.article.date}"><meta property="article:modified_time" content="${p.article.updated}">` : ''}
<meta name="theme-color" content="${SITE.theme}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/inter-800.woff2" as="font" type="font/woff2" crossorigin>
<style>${CSS}</style>
${ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body${hasCta ? ' class="has-cta"' : ''}${GA_ID ? ` data-ga="${GA_ID}"` : ''}${BASE ? ` data-base="${BASE}"` : ''}>
<a class="skip" href="#inhoud">Naar de inhoud</a>
${PREVIEW ? '<p class="preview">Preview van KassaMatch.nl, nog niet live</p>' : ''}
<header class="site"><div class="wrap">
<a class="logo" href="/" aria-label="${SITE.name}, naar de homepage">${LOGO}<span>${BRAND}</span></a>
<nav class="main" aria-label="Hoofdmenu">${navLinks(navPath)}</nav>
<details class="menu"><summary><span class="burger" aria-hidden="true"></span><span class="menu-txt">Menu</span></summary><nav aria-label="Hoofdmenu">${navLinks(navPath)}</nav></details>
</div></header>
<main id="inhoud"><div class="wrap">
${crumbs}
${withStamp(p.body, p.stamp)}
${foutGezien(url)}
</div></main>
<footer class="site"><div class="wrap">
<div class="cols">
<div><a class="logo" href="/">${LOGO}<span>${BRAND}</span></a><p>Eerlijke hulp bij het kiezen van een pinautomaat of kassasysteem.</p></div>
<div><p class="fh">Vergelijken</p><ul><li><a href="/kassa-match/">Doe de KassaMatch</a></li><li><a href="/pinautomaat-vergelijken/">Pinautomaten vergelijken</a></li><li><a href="/kassasysteem-vergelijken/">Kassasystemen vergelijken</a></li><li><a href="/sumup-vs-zettle/">SumUp of Zettle</a></li><li><a href="/aanbieders/">Alle aanbieders</a></li></ul></div>
<div><p class="fh">Gidsen</p><ul><li><a href="/goedkoopste-pinautomaat/">Goedkoopste pinautomaat</a></li><li><a href="/kassasysteem-kiezen/">Kassasysteem kiezen</a></li><li><a href="/transactiekosten-vergelijken/">Transactiekosten vergelijken</a></li><li><a href="/gidsen/">Alle gidsen</a></li></ul></div>
<div><p class="fh">Over ons</p><ul><li><a href="/over/">Over KassaMatch</a></li><li><a href="/over/#methode">Zo vergelijken we</a></li><li><a href="/bronnen/">Bronnen</a></li><li><a href="/privacy/">Privacy en cookies</a></li>${GA_ID ? '<li><a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a></li>' : ''}<li><a href="/disclaimer/">Disclaimer</a></li><li><a href="/contact/">Contact</a></li></ul></div>
</div>
${networkFooter()}
<p class="fine">© 2026 ${SITE.name}. Partnerlinks hebben nooit invloed op de volgorde of de match.</p>
</div></footer>
${hasCta ? `<a class="stickycta" href="/kassa-match/" data-cta="sticky_match">${ICONS.match}<span>Bekijk jouw match in 1 minuut</span></a>` : ''}
${[...(GA_ID ? ['/js/consent.js'] : []), ...(p.scripts || [])].map((s) => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>`;
  return withBase(html);
}

export const ORG = { '@type': 'Organization', '@id': SITE.domain + '/#org', name: SITE.name, url: SITE.domain + '/', email: SITE.email, logo: { '@type': 'ImageObject', url: SITE.domain + '/apple-touch-icon.png' } };
/** Auteur van artikelen: de redactie (organisatie), nooit een persoonsnaam. */
export const AUTHOR = { '@type': 'Organization', name: SITE.owner, url: SITE.domain + '/over/', parentOrganization: { '@id': SITE.domain + '/#org' } };
export function siteGraph() {
  return { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', '@id': SITE.domain + '/#website', name: SITE.name, url: SITE.domain + '/', inLanguage: 'nl-NL', publisher: { '@id': SITE.domain + '/#org' } }] };
}
const MND = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
export const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MND[m - 1]} ${y}`; };
const SCHILD = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
export function stampHtml(stamp) {
  if (!stamp || (!stamp.checked && !stamp.updated)) return '';
  const t = (d) => `<time datetime="${d}">${fmtDate(d)}</time>`;
  return `<p class="stamp">${stamp.checked ? `<span class="badge-ok">${SCHILD}<span>Prijzen gecontroleerd op ${t(stamp.checked)}</span></span>` : ''}${stamp.updated ? `<span class="upd">Laatst bijgewerkt ${t(stamp.updated)}</span>` : ''}</p>`;
}
export function withStamp(body, stamp) {
  const html = stampHtml(stamp);
  if (!html) return body;
  const m = body.match(/<\/h1>(<p class="src">Door [\s\S]*?<\/p>)?/);
  if (!m) return html + body;
  const end = m.index + m[0].length;
  return body.slice(0, end) + html + body.slice(end);
}
export function foutGezien(url) {
  const q = `subject=${encodeURIComponent(`Fout gezien op ${url.replace(/^https?:\/\//, '')}`)}&body=${encodeURIComponent(`Pagina: ${url}\n\nWat klopt er niet?\n`)}`;
  return `<p class="report">Fout gezien? <a href="mailto:${SITE.email}?${q}" data-cta="report_error">Laat het ons weten</a>.</p>`;
}
