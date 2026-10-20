import { SITE, esc, ORG, GA_ID, ICONS, fmtDate } from './layout.mjs';
import { PRIVACY_UPDATED, cookieTabel, partnerNetwerk, grondslag, doorgifte, bewaartermijnen, rechten } from './privacy-avg.mjs';
import { PARTNERLINKS } from './lib/partnerlinks.js';
import { AANBIEDERS as A, IDS, PIN_IDS, KASSA_IDS, CHECKED, checkedVan, goedkoopsteHardware } from './lib/aanbieders.js';
import { TEKSTEN } from './aanbieder-teksten.mjs';
import { vergelijkPin, besteplan, fmtEur } from './lib/kosten.js';
import { knop } from './lib/partnerlinks.js';
import { VRAGEN, REKEN } from './lib/match.js';
import { HERO_ART } from './hero-art.mjs';
import { by, bron, bronnenVan, matchCta, article, faqHtml, faqSchema, eur, hwTekst, planTekst, pinVoorbeeld, tarievenTabel, acard, methodBox, kortNaam, vlag } from './parts.mjs';

const BD = [['Belastingdienst: Het kassasysteem in uw bedrijf (brochure)', 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/uw_bedrijf_en_het_kassasysteem'], ['Belastingdienst ODB: informatie afrekensystemen', 'https://odb.belastingdienst.nl/afrekensystemen-kassa/informatie-afrekensystemen-kassa/']];
const top = (aantal, bedrag, opts) => vergelijkPin(aantal, bedrag, opts)[0];
const nm = (id) => esc(kortNaam(id));
const link = (id) => `<a href="/aanbieders/${A[id].slug}/">${nm(id)}</a>`;
// Omslagpunten, berekend uit de tarieven (geen eigen aannames).
const omslagSumup = Math.round(A.sumup.plannen[1].maand / ((A.sumup.plannen[0].pct - A.sumup.plannen[1].pct) / 100));
const omslagMypos = Math.round(A.mypos.plannen[1].maand / ((A.mypos.plannen[0].pct - A.mypos.plannen[1].pct) / 100));
const fmtN = (n) => n.toLocaleString('nl-NL');
const HW = PIN_IDS.map(goedkoopsteHardware).filter((x) => x != null);
const HWMIN = Math.min(...HW); const HWMAX = Math.max(...HW);
const HWVERSCHIL = goedkoopsteHardware('sumup') - goedkoopsteHardware('zettle');
const VS_OMSLAG = Math.round(HWVERSCHIL / ((A.zettle.plannen[0].pct - A.sumup.plannen[0].pct) / 100) / 10) * 10;
const GIDSEN = [
  ['/goedkoopste-pinautomaat/', 'Goedkoopste pinautomaat 2026', 'Wat kost pinnen bij weinig, gemiddeld en veel betalingen?'],
  ['/kassasysteem-kiezen/', 'Kassasysteem kiezen', 'Welke functies je nodig hebt en wat de Belastingdienst vraagt.'],
  ['/transactiekosten-vergelijken/', 'Transactiekosten vergelijken', 'Percentage of vast bedrag: waar ligt het omslagpunt?'],
];
const NIET = {
  sumup: 'Aangepaste tarieven boven € 10.000 omzet per maand (op aanvraag).',
  mypos: 'Offerte op maat voor grote volumes.',
  zettle: 'Aangepaste tarieven (op aanvraag); online betalen niet op de prijspagina.',
  mollie: 'Volumeprijzen vanaf € 100.000 per maand (op aanvraag); btw bij de terminals niet vermeld.',
  ccv: 'Btw bij de huur- en koopprijzen niet vermeld; CCV-tarieven voor 2027 niet gepubliceerd.',
  lightspeed: 'Hardwareprijzen en verwerkingskosten per betaling.',
  shopify: 'Prijzen, transactiekosten en hardware in euro: onbekend.',
  untill: 'Prijs van unTill Prime (op offerte); tarieven unTill Payments.',
  mplus: 'Alle prijzen (op offerte).',
};

// ---- Home ----
const homeFaq = [
  ['Wat is de goedkoopste pinautomaat?', `Dat hangt af van hoeveel je pint. Bij weinig betalingen ben je het goedkoopst uit zonder vaste kosten, zoals bij SumUp of myPOS One. Pin je veel, dan wint een vast bedrag per betaling, zoals bij CCV (€ 0,068) of myPOS Pro (€ 0,06). Zie <a href="/goedkoopste-pinautomaat/">goedkoopste pinautomaat</a>.`],
  ['Waar komen de bedragen vandaan?', 'Van de prijspagina\'s van de aanbieders zelf. Op de pagina <a href="/bronnen/">bronnen</a> staat per aanbieder de link en de datum waarop we het controleerden. Publiceert een aanbieder iets niet, dan staat er "onbekend" of "op offerte".'],
  ['Verdient KassaMatch aan de aanbevelingen?', 'Soms. Bij een aanbieder met een partnerlink kunnen we een vergoeding krijgen als je via ons een account opent. Zo\'n link krijgt altijd het label "partnerlink" en telt nooit mee in de match of de volgorde.'],
];
const ex = vergelijkPin(300, 25);
export const home = {
  path: '/', title: 'Pinautomaat of kassasysteem kiezen? | KassaMatch', ogTitle: 'KassaMatch: welke pinautomaat of kassa past bij jouw zaak?', h1: 'Pinautomaat of kassa kiezen? Reken het eerst uit.', og: 'home',
  description: 'Vergelijk SumUp, myPOS, Zettle, Mollie, CCV, Lightspeed, Shopify POS, unTill en MplusKASSA op kosten per maand. Doe de match en zie je top 3.',
  schema: [faqSchema(homeFaq)],
  body: `<section class="hero sec"><div class="hero-txt">
<p class="h1-brand">Kassa<b>Match</b>.nl</p>
<h1 class="tagline">Pinautomaat of kassa kiezen? Reken het eerst uit.</h1>
<p class="lead">Wat kost pinnen jou per maand? We zetten ${PIN_IDS.length} pinaanbieders en ${KASSA_IDS.length} kassasystemen naast elkaar, met de tarieven van hun eigen site. Beantwoord 6 korte vragen en zie je top 3.</p>
<div class="actions"><a class="btn" href="/kassa-match/" data-cta="home_hero">Start de match</a><a class="btn ghost" href="/pinautomaat-vergelijken/">Reken je pinkosten uit</a></div>
</div>
<div class="hero-side">
${HERO_ART}
<div class="hero-q"><p class="hero-q-step">Vraag 1 van ${VRAGEN.length}</p><p class="hero-q-title" id="hq">${esc(VRAGEN[0].vraag)}</p><div class="hero-q-opts" role="group" aria-labelledby="hq">${VRAGEN[0].opties.map(([v, l]) => `<a class="choice" href="/kassa-match/?type=${v}" rel="nofollow" data-cta="home_q1">${esc(l)}<span aria-hidden="true">→</span></a>`).join('')}</div><p class="hero-q-foot">Daarna nog ${VRAGEN.length - 1} korte vragen. Gratis, zonder account.</p></div>
</div>
<ul class="trustbar">
<li>${ICONS.kalender}<span>Tarieven gecontroleerd op <time datetime="${CHECKED}">${fmtDate(CHECKED)}</time></span></li>
<li>${ICONS.bron}<span>Bron bij elk bedrag</span></li>
<li>${ICONS.schild}<span>Volgorde nooit betaald</span></li>
<li>${ICONS.gratis}<span>Gratis, zonder account</span></li>
</ul>
</section>
<section class="sec">
<h2>Wat kost pinnen per maand?</h2>
<p class="sub">Voorbeeld: 300 pinbetalingen per maand van gemiddeld € 25 met een Nederlandse betaalpas. Per aanbieder het goedkoopste plan bij dit volume, goedkoopste eerst. Het pinapparaat betaal je eenmalig.</p>
${pinVoorbeeld(300, 25)}
<p>Bij dit voorbeeld is ${link(ex[0].id)} het goedkoopst per maand${ex[0].id === 'ccv' ? ', maar CCV publiceert de prijs van de betaalautomaat niet' : ''}. Met andere aantallen kan de volgorde omdraaien. <a href="/pinautomaat-vergelijken/">Reken het uit met je eigen aantallen →</a></p>
</section>
<section class="sec tint">
<h2>Kassasystemen op een rij</h2>
<p class="sub">Prijs zoals de aanbieder die toont. Shopify toont ons alleen dollars, Mplus en het volledige unTill werken op offerte.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Kassasysteem</th><th scope="col">Prijs</th><th scope="col">Horeca</th><th scope="col">Winkel</th><th scope="col">Webshop of online</th></tr></thead><tbody>${['sumup', 'zettle', ...KASSA_IDS].map((id) => `<tr><th scope="row">${link(id)}</th><td data-l="Prijs">${esc(A[id].soort === 'pin' ? (id === 'sumup' ? 'Software € 0 of € 49 per maand, kassa € 399' : 'Kassa-app € 0, terminal € 199') : A[id].vanafTekst)}</td><td data-l="Horeca">${vlag(A[id].horeca ?? null)}</td><td data-l="Winkel">${vlag(A[id].winkel ?? null)}</td><td data-l="Webshop of online">${vlag(A[id].online.ja)}</td></tr>`).join('')}</tbody></table></div>
<p><a href="/kassasysteem-vergelijken/">Alle kassasystemen vergelijken →</a></p>
</section>
<section class="sec">
<h2>Gidsen</h2>
<div class="grid cards">${GIDSEN.map(([h, t, d]) => `<a class="card" href="${h}"><h3>${esc(t)}</h3><p>${esc(d)}</p><span class="more">Lees de gids →</span></a>`).join('')}</div>
</section>
<section class="band method-band sec">
<h2>Zo vergelijken we</h2>
<ol class="steps">
<li><strong>Tarieven van de aanbieder zelf.</strong> Elk bedrag komt van de prijspagina van de aanbieder, met link op de pagina <a href="/bronnen/">bronnen</a>.</li>
<li><strong>Rekenen, niet raden.</strong> Vaste kosten plus aantal betalingen keer het tarief. Wat niet gepubliceerd is, noemen we onbekend.</li>
<li><strong>Partnerlinks veranderen niets.</strong> Eerst wat past, dan de kosten. Commissie telt nooit mee.</li>
</ol>
<p class="author">Door <a href="/over/">${SITE.owner}</a> · <a href="/over/#methode">Hoe de match werkt</a></p>
</section>
<section class="sec tint"><div class="faq-sec">
${faqHtml(homeFaq)}
</div></section>
<section class="sec band-sec">
<div class="cta-band"><div><h2>Welke pinautomaat of kassa past bij jou?</h2><p>Beantwoord ${VRAGEN.length} korte vragen en zie je top 3. Gratis, zonder account.</p></div><a class="btn" href="/kassa-match/" data-cta="home_band">Start de match</a></div>
</section>`,
};

// ---- Match ----
export const quiz = {
  path: '/kassa-match/', title: 'Keuzehulp pinautomaat en kassa: doe de KassaMatch', h1: 'Welke pinautomaat of kassa past bij jou?', crumb: 'De match', og: 'match', noCta: true,
  description: 'Zes vragen over je zaak, je pinbetalingen en vaste kosten. Je krijgt de drie pinautomaten of kassasystemen die het best passen, met kosten.',
  scripts: ['/js/quiz.js'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'KassaMatch', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITE.domain + '/kassa-match/', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: ORG }],
  body: `<h1>Welke pinautomaat of kassa past bij jou?</h1><p class="lead">Beantwoord ${VRAGEN.length} korte vragen. Je ziet meteen wat past, wat het per maand kost en waarom.</p>
<div class="mgrid">
<form id="form" class="quiz card" novalidate>
<div class="qprog"><p id="q-prog" aria-live="polite">0 van ${VRAGEN.length} vragen beantwoord</p><div class="qbar"><span id="q-bar"></span></div></div>
${VRAGEN.map((v, i) => `<fieldset class="q"><legend>${i + 1}. ${esc(v.vraag)}</legend><div class="opts">${v.opties.map(([val, t]) => `<label><input type="radio" name="${v.id}" value="${val}" required><span>${esc(t)}</span></label>`).join('')}</div></fieldset>`).join('')}
<div class="qdone"><button class="btn" type="submit">Toon mijn match</button><p class="sub">Gratis, zonder account. Je antwoorden blijven in je browser.</p></div>
</form>
<aside class="card mpanel" id="result" aria-live="polite"><h2>Jouw beste match</h2><p class="mwait">Beantwoord de vragen. Je top 3 verschijnt hier, met kosten en uitleg.</p><p class="sub">Of bekijk <a href="/pinautomaat-vergelijken/">alle pinautomaten naast elkaar</a>.</p></aside>
</div>
<noscript><p class="alert">De match werkt met JavaScript. Zonder JavaScript vind je alle tarieven op <a href="/pinautomaat-vergelijken/">pinautomaten vergelijken</a>.</p></noscript>
<section class="method" id="methode"><h2>Zo werkt de match</h2><ol><li><strong>Eerst wat past.</strong> Zoek je alleen een pinapparaat, dan kijken we naar de pinaanbieders. Zoek je een kassa, dan tellen kassasoftware, horeca of winkel en een webshop mee. Wil je ook online betalingen, dan gaan aanbieders die dat op hun site noemen voor.</li><li><strong>Dan de kosten.</strong> Voor pinnen rekenen we per aanbieder het goedkoopste plan uit: vaste kosten + aantal betalingen × tarief. We rekenen met ${Object.values(REKEN.aantal).map(fmtN).join(', ')} betalingen per maand en een bedrag van ${Object.values(REKEN.bedrag).map(eur).join(', ')}, afhankelijk van je antwoord. Voor kassasystemen gebruiken we de laagste prijs die de aanbieder toont; op offerte of alleen in dollars komt achteraan.</li><li><strong>Liefst geen abonnement?</strong> Dan rekenen we alleen met plannen zonder vaste maandkosten.</li><li><strong>Bij gelijke stand: alfabetisch.</strong> Partnerlinks tellen nooit mee; de match leest ze niet.</li></ol><p class="src">Tarieven gecontroleerd op ${fmtDate(CHECKED)} bij de aanbieders. <a href="/bronnen/">Alle bronnen</a>.</p></section>`,
};

// ---- Pinautomaten vergelijken (met rekentool) ----
const pinFaq = [
  ['Welke pinautomaat heeft geen abonnement?', `Zonder vaste maandkosten: ${PIN_IDS.filter((id) => A[id].plannen.some((p) => p.maand === 0)).map(nm).join(', ')}. CCV rekent € 4,25 per maand per betaalautomaat.`],
  ['Zijn de bedragen inclusief btw?', 'SumUp, myPOS en PayPal (Zettle) tonen de pinapparaten exclusief btw. Mollie vermeldt het niet bij de terminals. De transactietarieven nemen we over zoals de aanbieder ze noemt.'],
  ['Waarom rekenen jullie met een Nederlandse betaalpas?', 'Daarmee betalen de meeste klanten in een Nederlandse winkel. Creditcards, zakelijke passen en online betalingen hebben bij de meeste aanbieders hogere tarieven. Die staan op de pagina van elke aanbieder.'],
];
export const pinVergelijk = {
  path: '/pinautomaat-vergelijken/', title: 'Pinautomaat vergelijken: kosten per maand | KassaMatch', h1: 'Pinautomaat vergelijken: wat kost pinnen jou per maand?', crumb: 'Pinautomaten vergelijken', og: 'pin',
  description: 'Vul je aantal pinbetalingen en je gemiddelde bedrag in en zie per aanbieder de kosten per maand: SumUp, myPOS, Zettle, Mollie en CCV.',
  scripts: ['/js/rekentool.js'], stamp: { checked: CHECKED }, schema: [faqSchema(pinFaq)],
  body: `<h1>Pinautomaat vergelijken: wat kost pinnen jou per maand?</h1>${by()}
<p class="lead">Een pinautomaat kost je op drie manieren: het apparaat, vaste kosten per maand en een bedrag per betaling. Vul hieronder je eigen aantallen in. We kiezen per aanbieder het goedkoopste plan.</p>
<form id="form" class="card kcalc" novalidate>
<div class="calc-row"><label for="k-aantal">Pinbetalingen per maand</label><input id="k-aantal" name="aantal" type="number" inputmode="numeric" min="1" max="100000" step="1" value="300"></div>
<div class="calc-row"><label for="k-bedrag">Gemiddeld bedrag per betaling (€)</label><input id="k-bedrag" name="bedrag" type="number" inputmode="decimal" min="1" max="10000" step="0.5" value="25"></div>
<div class="calc-row"><label class="chk"><input id="k-geenabo" name="geenabo" type="checkbox"> <span>Alleen plannen zonder vaste maandkosten</span></label></div>
<p class="sub">Je invoer blijft in je browser.</p>
</form>
<div id="k-out" aria-live="polite">${pinVoorbeeld(300, 25)}</div>
<p class="sub">Rekenmethode: vaste kosten per maand + aantal betalingen × (vast bedrag + percentage × gemiddeld bedrag), met de tarieven voor een Nederlandse consumentenbetaalpas. Het pinapparaat betaal je eenmalig; CCV publiceert die prijs niet.</p>
<h2>Alle tarieven per plan</h2>
${tarievenTabel()}
<h2>Waar je verder op let</h2>
<ul><li><strong>Omslagpunt van een abonnement.</strong> Bij SumUp is Betalingen Plus (€ 19 per maand) goedkoper vanaf ongeveer ${eur(omslagSumup)} pinomzet per maand, als je alleen met de tarieven rekent. SumUp noemt zelf € 4.645. Bij myPOS Plus ligt dat omslagpunt ook op ${eur(omslagMypos)}; myPOS noemt € 4.000. Lees meer in <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a>.</li>
<li><strong>Vast bedrag of percentage.</strong> CCV (€ 0,068) en myPOS Pro (€ 0,06) rekenen een vast bedrag per betaling met een Nederlandse pas. Hoe hoger je gemiddelde bedrag, hoe meer dat scheelt.</li>
<li><strong>Online betalen.</strong> SumUp, myPOS en Mollie noemen ook online betalingen of betaallinks, tegen andere tarieven.</li>
<li><strong>Kassa erbij?</strong> SumUp en Zettle hebben kassasoftware, myPOS een kassa-app. Zie <a href="/kassasysteem-vergelijken/">kassasystemen vergelijken</a>.</li></ul>
${matchCta('Liever een advies op maat?', 'pin_match')}
${faqHtml(pinFaq)}
${bron(bronnenVan(...PIN_IDS))}`,
};

// ---- Kassasystemen vergelijken ----
const KASSA_RIJ = ['sumup', 'zettle', 'mypos', ...KASSA_IDS];
const kassaPrijs = (id) => (id === 'sumup' ? 'Software € 0, of € 49 per maand (POS Plus); kassa € 399 excl. btw' : id === 'zettle' ? 'Kassa-app € 0; PayPal Terminal € 199 excl. btw' : id === 'mypos' ? 'Kassa-app bij Flex (€ 69) en Ultra (€ 179) excl. btw' : A[id].vanafTekst);
const kassaFaq = [
  ['Wat kost een kassasysteem per maand?', 'Van € 0 voor de kassasoftware van SumUp of Zettle tot € 249 per maand voor Lightspeed Horeca Pro. Lightspeed begint bij € 89 (horeca) of € 99 (retail). unTill Air begint bij € 19. Mplus en het volledige unTill werken op offerte.'],
  ['Heb ik een keurmerkkassa nodig?', 'Volgens de Belastingdienst mag je bij een keurmerkkassa ervan uitgaan dat je kassa-administratie aan de eisen voldoet. Verplicht is een keurmerk niet; de gegevens in je kassa horen bij je administratie en bewaar je 7 jaar. Zie <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>.'],
  ['Kan ik mijn kassa koppelen aan een webshop?', 'Shopify POS deelt producten en voorraad met een Shopify-webshop. De retailpakketten van Lightspeed hebben Lightspeed eCom ingebouwd. Voor het kiezen van een webshop: zie <a href="https://shopmatch.nl/">ShopMatch</a>.'],
];
export const kassaVergelijk = {
  path: '/kassasysteem-vergelijken/', title: 'Kassasysteem vergelijken: prijzen en functies | KassaMatch', h1: 'Kassasysteem vergelijken voor winkel en horeca', crumb: 'Kassasystemen vergelijken', og: 'kassa',
  description: 'Kassasystemen naast elkaar: SumUp, Zettle, myPOS, Lightspeed, Shopify POS, unTill en MplusKASSA. Prijs per maand, horeca of winkel, met bronnen.',
  stamp: { checked: CHECKED }, schema: [faqSchema(kassaFaq)],
  body: `<h1>Kassasysteem vergelijken voor winkel en horeca</h1>${by()}
<p class="lead">Een kassasysteem doet meer dan afrekenen: producten, voorraad, omzet per dag en soms tafels of een webshop. De prijzen lopen uiteen van € 0 tot een offerte op maat.</p>
<div class="table-wrap"><table class="data stack"><caption class="sr-only">Kassasystemen naast elkaar</caption><thead><tr><th scope="col">Kassasysteem</th><th scope="col">Prijs</th><th scope="col">Hardware</th><th scope="col">Horeca</th><th scope="col">Winkel</th><th scope="col">Webshop of online</th></tr></thead><tbody>${KASSA_RIJ.map((id) => `<tr><th scope="row">${link(id)}</th><td data-l="Prijs">${esc(kassaPrijs(id))}</td><td data-l="Hardware">${esc(A[id].soort === 'pin' ? hwTekst(id) : A[id].hardwareNoot)}</td><td data-l="Horeca">${vlag(A[id].horeca ?? null)}</td><td data-l="Winkel">${vlag(A[id].winkel ?? null)}</td><td data-l="Webshop of online">${vlag(A[id].online.ja)}</td></tr>`).join('')}</tbody></table></div>
<p class="sub">"Niet vermeld" betekent dat de aanbieder het niet noemt op de pagina die we controleerden. Volgorde: eerst de pinaanbieders met kassasoftware, dan de kassasystemen in alfabetische volgorde.</p>
<h2>Lightspeed: retail en horeca</h2>
<ul class="pkg-grid">${A.lightspeed.pakketten.map(([n, pr, w]) => `<li><div class="pkg-card"><h3>${esc(n)}</h3><p class="pkg-price"><strong>${esc(pr)}</strong></p><p class="pkg-facts">${esc(w)}</p></div></li>`).join('')}</ul>
<p>Lightspeed meldt: "Prijzen kunnen variëren en extra servicekosten kunnen van toepassing zijn." De verwerkingskosten voor betalingen staan niet op de prijspagina.</p>
<h2>Shopify POS: alleen in dollars</h2>
<p>De Nederlandse prijspagina van Shopify stuurde ons door naar de internationale pagina. Daar staat Basic op US$ 39 per maand en POS Pro op US$ 89 per maand per locatie. Een europrijs zagen we niet; die hangt af van je land.</p>
<h2>Op offerte: MplusKASSA en unTill</h2>
<p>MplusKASSA geeft geen bedragen op de site; je krijgt een prijsoverzicht op maat via een leverancier. Bij unTill is unTill Air er vanaf € 19 per maand. Het volledige unTill-systeem voor grotere horecazaken gaat via een unTill-partner.</p>
${matchCta('Welke kassa past bij jouw zaak?', 'kassa_match')}
${faqHtml(kassaFaq)}
${bron(bronnenVan(...KASSA_RIJ))}`,
};

// ---- Aanbieders ----
export const aanbiedersHub = {
  path: '/aanbieders/', title: 'Alle aanbieders: pinautomaten en kassa\'s | KassaMatch', h1: 'Alle aanbieders', crumb: 'Aanbieders', og: 'aanbieders',
  description: 'Overzicht van alle pinautomaten en kassasystemen op KassaMatch, met tarieven, hardwareprijzen en voor wie ze passen. Alles met bron.',
  stamp: { checked: CHECKED },
  body: `<h1>Alle aanbieders</h1><p class="lead">${IDS.length} aanbieders: ${PIN_IDS.length} voor pinnen en ${KASSA_IDS.length} kassasystemen. Alfabetisch, met de tarieven van hun eigen site.</p>
<h2>Pinautomaten</h2><ul class="plist">${[...PIN_IDS].sort().map((id) => acard(id, { level: 'h3', pos: 'hub' })).join('')}</ul>
<h2>Kassasystemen</h2><ul class="plist">${[...KASSA_IDS].sort().map((id) => acard(id, { level: 'h3', pos: 'hub' })).join('')}</ul>
${matchCta()}`,
};

const RELATED = {
  sumup: [['/sumup-vs-zettle/', 'SumUp of Zettle'], ['/goedkoopste-pinautomaat/', 'Goedkoopste pinautomaat']],
  zettle: [['/sumup-vs-zettle/', 'SumUp of Zettle'], ['/transactiekosten-vergelijken/', 'Transactiekosten vergelijken']],
  mypos: [['/transactiekosten-vergelijken/', 'Transactiekosten vergelijken'], ['/goedkoopste-pinautomaat/', 'Goedkoopste pinautomaat']],
  mollie: [['/transactiekosten-vergelijken/', 'Transactiekosten vergelijken']],
  ccv: [['/goedkoopste-pinautomaat/', 'Goedkoopste pinautomaat'], ['/transactiekosten-vergelijken/', 'Transactiekosten vergelijken']],
  lightspeed: [['/kassasysteem-kiezen/', 'Kassasysteem kiezen']],
  shopify: [['/kassasysteem-kiezen/', 'Kassasysteem kiezen']],
  untill: [['/kassasysteem-kiezen/', 'Kassasysteem kiezen']],
  mplus: [['/kassasysteem-kiezen/', 'Kassasysteem kiezen']],
};
export const aanbiederPages = IDS.map((id) => {
  const p = A[id]; const path = `/aanbieders/${p.slug}/`;
  const pin = p.soort === 'pin';
  const voorbeelden = pin ? [[50, 20], [300, 25], [1000, 25]].map(([n, b]) => { const r = besteplan(id, n, b); return `<tr><td data-l="Voorbeeld">${fmtN(n)} × ${eur(b)}</td><td data-l="Goedkoopste plan">${esc(r.plan.naam)}</td><td class="n" data-l="Kosten per maand"><strong>${fmtEur(r.totaal)}</strong></td></tr>`; }).join('') : '';
  // Optionele extra tekst per aanbieder (aanbieder-teksten.mjs). Zonder tekst blijft de pagina zoals ze was.
  const T = TEKSTEN[id] || {};
  const checked = checkedVan(id);
  const secties = (lijst) => (lijst || []).map(([h, html]) => `<h2>${esc(h)}</h2>${typeof html === 'function' ? html() : html}`).join('\n');
  const title = T.title || `${kortNaam(id)}: ${pin ? 'kosten en tarieven' : 'prijzen'} 2026 | KassaMatch`;
  const h1 = T.h1 || `${p.naam}: ${pin ? 'kosten, tarieven en pinapparaten' : 'prijzen en voor wie het past'}`;
  return {
    path, title, h1, crumb: kortNaam(id), parents: [['/aanbieders/', 'Aanbieders']], og: `a-${id}`, lastmod: checked,
    description: T.description || (pin ? `Wat kost ${kortNaam(id)}? Vaste kosten, tarief per pinbetaling, prijs van het pinapparaat en een rekenvoorbeeld. Alles van de eigen site, met bron.` : `Wat kost ${kortNaam(id)}? De pakketten en prijzen zoals de aanbieder ze toont, wat niet gepubliceerd is en voor welke zaak het past. Met bron.`).slice(0, 155),
    stamp: { checked },
    ...(T.faq?.length ? { schema: [faqSchema(T.faq)] } : {}),
    body: `<article class="prose"><h1>${esc(h1)}</h1>${by(checked)}
<p class="lead">${esc(p.wat)}</p>
<div class="actions">${knop(id, 'aanbieder_top')}</div>
${secties(T.voor)}
${pin ? `<h2>Plannen en tarieven</h2><ul class="pkg-grid">${p.plannen.map((pl) => `<li><div class="pkg-card"><h3>${esc(pl.naam)}</h3><p class="pkg-price"><strong>${pl.maand ? eur(pl.maand) : '€ 0'}</strong> <span>per maand</span></p><p class="pkg-facts">${esc(pl.tarief)}</p></div></li>`).join('')}</ul>
<h2>Pinapparaten</h2>${p.hardware ? `<ul>${p.hardware.map(([n, pr]) => `<li>${esc(n)}: <strong>${eur(pr)}</strong></li>`).join('')}</ul>` : ''}<p>${esc(p.hardwareNoot)}</p>
<h2>Rekenvoorbeeld</h2><p>Kosten per maand bij betalingen met een Nederlandse consumentenbetaalpas, met het goedkoopste plan van ${nm(id)} bij dat volume. Het pinapparaat komt er eenmalig bij.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Voorbeeld (aantal × bedrag)</th><th scope="col">Goedkoopste plan</th><th scope="col">Kosten per maand</th></tr></thead><tbody>${voorbeelden}</tbody></table></div>
<p><a href="/pinautomaat-vergelijken/">Vergelijk met de andere aanbieders bij jouw aantallen →</a></p>
<h2>Kassa en online</h2><ul><li><strong>Kassasoftware:</strong> ${p.kassa.v ? esc(p.kassa.t) : 'niet vermeld op de tarievenpagina.'}</li><li><strong>Online betalen:</strong> ${p.online.ja ? esc(p.online.t) : 'niet vermeld op de tarievenpagina.'}</li></ul>`
    : `<h2>Pakketten en prijzen</h2><ul class="pkg-grid">${p.pakketten.map(([n, pr, w]) => `<li><div class="pkg-card"><h3>${esc(n)}</h3><p class="pkg-price"><strong>${esc(pr)}</strong></p><p class="pkg-facts">${esc(w)}</p></div></li>`).join('')}</ul>
<h2>Hardware en betalingen</h2><ul><li><strong>Hardware:</strong> ${esc(p.hardwareNoot)}</li><li><strong>Betalingen:</strong> ${esc(p.transactie)}</li></ul>
<h2>Voor wie?</h2><ul><li><strong>Horeca:</strong> ${p.horeca ? 'ja, de aanbieder richt zich op horeca.' : 'niet de focus van deze aanbieder.'}</li><li><strong>Winkel:</strong> ${p.winkel ? 'ja.' : 'niet de focus van deze aanbieder.'}</li><li><strong>Webshop of online:</strong> ${p.online.ja ? esc(p.online.t) : 'niet vermeld.'}</li></ul>`}
<h2>Goed om te weten</h2><ul>${p.extra.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
${secties(T.na)}
${T.faq?.length ? faqHtml(T.faq) : ''}
${RELATED[id]?.length ? `<p>Lees ook: ${RELATED[id].map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join(' · ')}</p>` : ''}
${id === 'shopify' ? `<p>Shopify POS deelt producten en voorraad met je Shopify-webshop. Een webshopplatform kiezen doe je op <a href="https://shopmatch.nl/platformen/shopify/">ShopMatch</a>.</p>` : ''}
${id === 'lightspeed' ? `<p>De retailpakketten van Lightspeed hebben Lightspeed eCom ingebouwd. Een webshopplatform kiezen doe je op <a href="https://shopmatch.nl/platformen/lightspeed/">ShopMatch</a>.</p>` : ''}
<div class="actions">${knop(id, 'aanbieder_bottom')}</div>
${matchCta(`Past ${esc(kortNaam(id))} bij jou?`, 'aanbieder_match')}${bron(p.bronnen)}</article>`,
  };
});

// ---- SumUp of Zettle ----
const vsRows = [[50, 15], [200, 25], [800, 25]];
const vsFaq = [
  ['Is SumUp of Zettle goedkoper?', `Per betaling met een Nederlandse pas is SumUp goedkoper: 1,49% zonder abonnement tegen 1,95% bij Zettle. Het goedkoopste apparaat is bij Zettle goedkoper: de PayPal Reader kost € 29 voor nieuwe zakelijke gebruikers, de SumUp Solo Lite ${eur(goedkoopsteHardware('sumup'))} (beide excl. btw; met oplaadstation € 44).`],
  ['Heeft Zettle een abonnement?', 'Nee. PayPal noemt geen contracten of terugkerende kosten voor Zettle (PayPal Point of Sale): je betaalt per transactie en voor de hardware.'],
];
export const sumupVsZettle = {
  ...article({ path: '/sumup-vs-zettle/', title: 'SumUp of Zettle: wat is goedkoper? | KassaMatch', h1: 'SumUp of Zettle: wat is goedkoper voor jou?', description: 'SumUp en Zettle (PayPal Point of Sale) naast elkaar: tarief per pinbetaling, pinapparaat, kassa-app en een rekenvoorbeeld. Met bronnen.', og: 'vs-sumup-zettle', faq: vsFaq }),
  crumb: 'SumUp of Zettle',
  body: `<article class="prose"><h1>SumUp of Zettle: wat is goedkoper voor jou?</h1>${by()}
<p class="lead">SumUp en Zettle zijn allebei pinapparaten zonder verplicht abonnement. Het verschil zit in het tarief per betaling, de prijs van het apparaat en wat je aan kassasoftware krijgt.</p>
<div class="table-wrap"><table class="data side"><thead><tr><th scope="col"></th><th scope="col">SumUp</th><th scope="col">Zettle (PayPal)</th></tr></thead><tbody>
<tr><th scope="row">Vaste kosten</th><td data-l="SumUp">€ 0, of € 19 per maand (Betalingen Plus)</td><td data-l="Zettle">€ 0</td></tr>
<tr><th scope="row">Per pinbetaling</th><td data-l="SumUp">1,49%, met Plus 0,99%</td><td data-l="Zettle">1,95% voor de belangrijkste kaarten, ook AMEX</td></tr>
<tr><th scope="row">Goedkoopste apparaat</th><td data-l="SumUp">Solo Lite ${eur(goedkoopsteHardware('sumup'))} excl. btw (met oplaadstation € 44; SumUp, gecontroleerd 20-10-2026)</td><td data-l="Zettle">PayPal Reader € 29 excl. btw (aanbieding nieuwe gebruikers)</td></tr>
<tr><th scope="row">Terminal met eigen scherm</th><td data-l="SumUp">Terminal met printer € 169</td><td data-l="Zettle">PayPal Terminal € 199</td></tr>
<tr><th scope="row">Kassasoftware</th><td data-l="SumUp">€ 0, of € 49 per maand voor POS Plus</td><td data-l="Zettle">Kassa-app zonder extra kosten</td></tr>
<tr><th scope="row">Online betalen</th><td data-l="SumUp">2,50% per onlinebetaling</td><td data-l="Zettle">Niet vermeld op de prijspagina</td></tr>
</tbody></table></div>
<h2>Rekenvoorbeeld</h2><p>Kosten per maand met een Nederlandse betaalpas, met het goedkoopste plan bij dat volume.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Voorbeeld</th><th scope="col">SumUp</th><th scope="col">Zettle</th></tr></thead><tbody>${vsRows.map(([n, b]) => { const s = besteplan('sumup', n, b); const z = besteplan('zettle', n, b); return `<tr><td data-l="Voorbeeld">${fmtN(n)} × ${eur(b)}</td><td class="n" data-l="SumUp">${fmtEur(s.totaal)} <span class="fnote">${esc(s.plan.naam)}</span></td><td class="n" data-l="Zettle">${fmtEur(z.totaal)}</td></tr>`; }).join('')}</tbody></table></div>
<p>Pin je weinig, dan is het verschil een paar euro per maand en kan de goedkopere Reader van Zettle de doorslag geven. Pin je meer, dan loopt het verschil in tarief snel op in het voordeel van SumUp.</p>
<h2>Kies SumUp als</h2><ul><li>je regelmatig pint: het lagere tarief maakt het prijsverschil van het goedkoopste apparaat (${eur(HWVERSCHIL)}) goed na ongeveer ${eur(VS_OMSLAG)} pinomzet;</li><li>je ook online betalingen wilt;</li><li>je later een kassa met twee schermen wilt (SumUp Kassa, € 399 excl. btw).</li></ul>
<h2>Kies Zettle als</h2><ul><li>je weinig pint en zo goedkoop mogelijk wilt beginnen met de Reader;</li><li>je één tarief wilt voor alle kaarten, ook American Express;</li><li>je al een zakelijke PayPal-rekening gebruikt.</li></ul>
<p>Beide nog te duur bij jouw aantallen? Kijk naar <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a> of <a href="/pinautomaat-vergelijken/">vergelijk alle aanbieders</a>.</p>
${faqHtml(vsFaq)}
${matchCta('Twijfel je nog?', 'vs_match')}${bron(A.sumup.bronnen, A.zettle.bronnen)}</article>`,
};

// ---- Gidsen ----
const wk = (n, b) => { const r = top(n, b); return `${link(r.id)} (${esc(r.plan.naam)}, ${fmtEur(r.totaal)} per maand)`; };
const wk0 = (n, b) => { const r = top(n, b, { geenAbonnement: true }); return `${link(r.id)} (${fmtEur(r.totaal)} per maand)`; };
const goedkoopFaq = [
  ['Wat is de goedkoopste pinautomaat zonder abonnement?', `Bij 50 betalingen van € 20 per maand zijn SumUp en myPOS One even duur (1,49%). Het goedkoopste losse apparaat in ons overzicht is de PayPal Reader van Zettle (€ 29 excl. btw, aanbieding voor nieuwe zakelijke gebruikers), maar Zettle rekent 1,95% per betaling.`],
  ['Is een pinautomaat met vast bedrag per betaling goedkoper?', 'Bij hogere bedragen wel. CCV rekent € 0,068 en myPOS Pro € 0,06 per betaling met een Nederlandse pas, ongeacht het bedrag. Bij een percentage betaal je meer naarmate het bedrag stijgt.'],
  ['Wat kost een pinautomaat eenmalig?', `Van ${eur(Math.min(...PIN_IDS.map(goedkoopsteHardware).filter((x) => x != null)))} tot ${eur(Math.max(...PIN_IDS.map(goedkoopsteHardware).filter((x) => x != null)))} voor het goedkoopste apparaat per aanbieder, volgens hun eigen sites. CCV publiceert de prijs van de automaat niet.`],
];
export const goedkoopste = {
  ...article({ path: '/goedkoopste-pinautomaat/', title: 'Goedkoopste pinautomaat 2026: kosten vergeleken', h1: 'Goedkoopste pinautomaat 2026: wat kost pinnen echt?', description: 'Welke pinautomaat is het goedkoopst bij weinig, gemiddeld en veel betalingen? Rekenvoorbeelden met de tarieven van SumUp, myPOS, Zettle, Mollie en CCV.', og: 'goedkoopste', parents: [['/gidsen/', 'Gidsen']], faq: goedkoopFaq }),
  crumb: 'Goedkoopste pinautomaat',
  body: `<article class="prose"><h1>Goedkoopste pinautomaat 2026: wat kost pinnen echt?</h1>${by()}
<p class="lead">De goedkoopste pinautomaat bestaat niet. Wat het goedkoopst is, hangt af van hoeveel je pint en hoe hoog je bedragen zijn. Hieronder drie rekenvoorbeelden met de tarieven van de aanbieders zelf.</p>
<h2>Waaruit bestaan de kosten?</h2><ul><li><strong>Het apparaat.</strong> Eenmalig. Het goedkoopste apparaat per aanbieder kost ${eur(HWMIN)} tot ${eur(HWMAX)} (CCV: huur vanaf € 25 per maand of koop vanaf € 399 plus maandkosten).</li><li><strong>Vaste kosten per maand.</strong> € 0 bij plannen zonder abonnement, tot € 39 bij myPOS Pro.</li><li><strong>Transactiekosten.</strong> Een percentage van het bedrag, een vast bedrag per betaling, of een combinatie.</li></ul>
<h2>Weinig pinnen: 50 betalingen van € 20</h2><p>Goedkoopst per maand: ${wk(50, 20)}. Vaste kosten wegen hier zwaar, dus een plan zonder abonnement wint vaak. Zonder enig abonnement: ${wk0(50, 20)}.</p>
${pinVoorbeeld(50, 20)}
<h2>Gemiddeld: 300 betalingen van € 25</h2><p>Goedkoopst per maand: ${wk(300, 25)}. Zonder abonnement: ${wk0(300, 25)}.</p>
${pinVoorbeeld(300, 25)}
<h2>Veel pinnen: 1.000 betalingen van € 25</h2><p>Goedkoopst per maand: ${wk(1000, 25)}. Zonder abonnement: ${wk0(1000, 25)}.</p>
${pinVoorbeeld(1000, 25)}
<h2>Let op bij CCV</h2><p>CCV is in deze voorbeelden vaak het goedkoopst per maand, omdat je een vast bedrag van € 0,068 per betaling betaalt. CCV publiceert de prijs van de betaalautomaat alleen niet op de tarievenpagina. Vraag die prijs op voordat je vergelijkt over een heel jaar.</p>
<h2>Zo kies je</h2><ol><li>Tel hoeveel pinbetalingen je per maand verwacht en wat een gemiddeld bedrag is.</li><li>Vul dat in bij <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.</li><li>Tel het apparaat erbij op voor het eerste jaar.</li><li>Kijk of je ook online betalingen of een kassa nodig hebt.</li></ol>
${faqHtml(goedkoopFaq)}
${matchCta('Welke pinautomaat past bij jouw aantallen?', 'gids_match')}${bron(bronnenVan(...PIN_IDS))}</article>`,
};

const kiezenFaq = [
  ['Hoe lang moet ik kassagegevens bewaren?', 'De bewaartermijn voor je administratie is zeven jaar, schrijft de Belastingdienst. De gegevens in je kassasysteem horen bij die administratie.'],
  ['Wat is een x-afslag en een z-afslag?', 'Een x-afslag is een tussenrapport uit de kassa; daarna telt de kassa gewoon door. Een z-afslag is een eindrapport; daarna begint de kassa opnieuw te tellen. Zo legt de Belastingdienst het uit.'],
  ['Is een keurmerk verplicht?', 'Nee. De Belastingdienst schrijft dat je bij een keurmerkkassa ervan uit mag gaan dat je administratie op belangrijke punten aan de eisen voldoet, zoals het bewaren en kunnen reproduceren van transacties.'],
];
export const kiezen = {
  ...article({ path: '/kassasysteem-kiezen/', title: 'Kassasysteem kiezen: zo vind je wat past | KassaMatch', h1: 'Kassasysteem kiezen: wat heb je nodig?', description: 'Een kassasysteem kiezen voor je winkel, horecazaak of marktkraam. Welke functies tellen, wat de Belastingdienst vraagt en wat het kost.', og: 'kiezen', parents: [['/gidsen/', 'Gidsen']], faq: kiezenFaq }),
  crumb: 'Kassasysteem kiezen',
  body: `<article class="prose"><h1>Kassasysteem kiezen: wat heb je nodig?</h1>${by()}
<p class="lead">Een kassasysteem legt je verkopen vast en helpt bij je kascontrole. Welk systeem past, hangt af van je zaak: een marktkraam heeft andere wensen dan een restaurant met drie kassa's.</p>
<h2>Stap 1: alleen pinnen of een echte kassa?</h2><p>Verkoop je een paar producten en wil je vooral kunnen pinnen, dan is een pinapparaat met een gratis kassa-app vaak genoeg. SumUp en Zettle hebben kassasoftware voor € 0 per maand, myPOS een kassa-app op de Flex en Ultra. Heb je veel producten, voorraad of personeel, dan kom je uit bij een kassasysteem zoals Lightspeed, MplusKASSA of unTill.</p>
<h2>Stap 2: welke functies tellen voor jouw zaak?</h2><ul><li><strong>Winkel:</strong> producten met barcode, voorraad, omzet per artikel en eventueel een webshop die dezelfde voorraad gebruikt.</li><li><strong>Horeca:</strong> tafels en plattegrond, bestellingen naar de keuken, meerdere kassa's of handhelds, fooi.</li><li><strong>Onderweg of op afspraak:</strong> mobiel pinnen met 4G of je telefoon, betaallinks, een simpel omzetoverzicht.</li></ul>
<h2>Stap 3: wat vraagt de Belastingdienst?</h2><p>De gegevens in je kassasysteem horen bij je administratie. De Belastingdienst noemt in de brochure <em>Het kassasysteem in uw bedrijf</em> onder meer deze punten:</p>
<ul><li>Je bewaart alle transacties. De bewaartermijn voor je administratie is zeven jaar.</li><li>Gegevens die digitaal zijn vastgelegd, bewaar je ook digitaal en kun je binnen redelijke termijn reproduceren.</li><li>Transacties zijn te volgen, bijvoorbeeld met een doorlopende nummering. Ook correcties, de trainingsstand en "geldlade open zonder verkoop" leg je vast.</li><li>Je geeft inzicht in de instellingen van je kassa en bewaart wijzigingen, bijvoorbeeld van prijzen en btw-percentages.</li><li>Je beveiligt de gegevens, zodat ze niet verloren gaan of achteraf te wijzigen zijn.</li></ul>
<p>Een keurmerkkassa is niet verplicht. Met een keurmerkkassa mag je er volgens de Belastingdienst wel van uitgaan dat je administratie op deze punten aan de eisen voldoet.</p>
<h2>Stap 4: wat kost het?</h2><ul><li><strong>Gratis kassasoftware:</strong> SumUp (€ 0, of € 49 per maand voor POS Plus) en Zettle (€ 0). Je betaalt per pinbetaling en voor de hardware.</li><li><strong>Instap voor horeca:</strong> unTill Air vanaf € 19 per maand, op je eigen Apple- of Android-hardware.</li><li><strong>Uitgebreid:</strong> Lightspeed vanaf € 89 per maand (horeca) of € 99 (retail), tot € 249.</li><li><strong>Met webshop:</strong> Shopify POS vanaf US$ 39 per maand; een europrijs zagen we niet.</li><li><strong>Op offerte:</strong> MplusKASSA en het volledige unTill.</li></ul>
<p>Alle bedragen naast elkaar: <a href="/kassasysteem-vergelijken/">kassasystemen vergelijken</a>.</p>
<h2>Stap 5: vragen voor je tekent</h2><ul><li>Hoe lang loopt het contract en hoe zeg je op?</li><li>Wat kost de hardware, en kun je eigen hardware gebruiken?</li><li>Welke transactiekosten gelden, en zit je vast aan de betaaldienst van de kassa?</li><li>Kun je je gegevens exporteren, ook na opzeggen?</li><li>Is er een koppeling met je boekhoudprogramma? Een boekhoudprogramma kiezen doe je op <a href="https://boekhoudmatch.nl/">BoekhoudMatch</a>.</li></ul>
${faqHtml(kiezenFaq)}
${matchCta('Welke kassa past bij jouw zaak?', 'gids_match')}${bron(BD, bronnenVan('sumup', 'zettle', 'mypos', ...KASSA_IDS))}</article>`,
};

const transFaq = [
  ['Wat zijn transactiekosten bij pinnen?', 'Het bedrag dat de aanbieder rekent per pinbetaling. Dat is een percentage van het bedrag (bijvoorbeeld 1,49%), een vast bedrag (bijvoorbeeld € 0,068) of een combinatie (bijvoorbeeld € 0,10 + 1,50%).'],
  ['Wat is interchange?', 'Volgens CCV is interchange de vergoeding die de betaaldienst van de ondernemer betaalt aan de uitgever van de kaart. Bij CCV zit die in de transactiekosten.'],
  ['Zijn creditcards duurder?', 'Bij de meeste aanbieders wel. Uitzonderingen: Zettle noemt één tarief van 1,95% voor de belangrijkste kaarten, ook American Express. SumUp rekent zonder abonnement 1,49% voor betaalpassen en creditcards, ook American Express.'],
];
const BEDRAGEN = [5, 20, 50, 100];
export const transactie = {
  ...article({ path: '/transactiekosten-vergelijken/', title: 'Transactiekosten pinnen vergelijken | KassaMatch', h1: 'Transactiekosten vergelijken: percentage of vast bedrag?', description: 'Transactiekosten van SumUp, myPOS, Zettle, Mollie en CCV naast elkaar. Wanneer een vast bedrag per pinbetaling goedkoper is en waar het omslagpunt ligt.', og: 'transactie', parents: [['/gidsen/', 'Gidsen']], faq: transFaq }),
  crumb: 'Transactiekosten vergelijken',
  body: `<article class="prose"><h1>Transactiekosten vergelijken: percentage of vast bedrag?</h1>${by()}
<p class="lead">Bij pinnen betaal je per betaling. Sommige aanbieders rekenen een percentage, andere een vast bedrag. Welke goedkoper is, hangt vooral af van je gemiddelde bedrag.</p>
<h2>Alle tarieven op een rij</h2>${tarievenTabel()}
<h2>Kosten per pinbetaling bij verschillende bedragen</h2><p>Alleen de transactiekosten van één betaling met een Nederlandse pas, per plan. Vaste maandkosten tellen hier niet mee.</p>
<div class="table-wrap"><table class="data stack"><caption class="sr-only">Transactiekosten van één pinbetaling per plan</caption><thead><tr><th scope="col">Aanbieder en plan</th>${BEDRAGEN.map((b) => `<th scope="col">Bij ${eur(b)}</th>`).join('')}</tr></thead><tbody>${PIN_IDS.flatMap((id) => A[id].plannen.map((pl) => `<tr><th scope="row">${link(id)}<span class="fnote">${esc(pl.naam)}</span></th>${BEDRAGEN.map((b) => `<td class="n" data-l="Bij ${eur(b)}">${fmtEur(pl.vast + (pl.pct / 100) * b)}</td>`).join('')}</tr>`)).join('')}</tbody></table></div>
<p>Hoe hoger het bedrag, hoe meer een vast bedrag per betaling scheelt. Bij kleine bedragen ligt het dichter bij elkaar.</p>
<h2>Wanneer loont een abonnement?</h2><ul><li><strong>SumUp Betalingen Plus</strong> (€ 19 per maand, 0,99% in plaats van 1,49%): reken je alleen met de tarieven, dan is Plus goedkoper vanaf ongeveer ${eur(omslagSumup)} pinomzet per maand. SumUp noemt zelf een omzet van minimaal € 4.645.</li><li><strong>myPOS Plus</strong> (€ 19 per maand, 0,99% in plaats van 1,49%): ook vanaf ongeveer ${eur(omslagMypos)} pinomzet per maand. myPOS noemt Plus voordelig vanaf € 4.000.</li><li><strong>myPOS Pro</strong> (€ 39 per maand, € 0,06 per betaling met een Nederlandse bankpas): loont bij veel betalingen of hoge bedragen. Reken het uit bij <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.</li><li><strong>Mollie Pro</strong> (€ 20 per maand): Mollie noemt Pro de beste keuze vanaf € 2.000 per maand. Voor "andere consumentenkaarten" betaal je dan € 0,10 + 1,50% in plaats van 1,80%.</li></ul>
<h2>Andere kosten om te checken</h2><ul><li><strong>Creditcards en zakelijke passen:</strong> bij CCV 1,3% (consumenten-creditcard, EER) en 2,3% (zakelijk); bij myPOS 2,69% voor "alle andere kaarten" bij One.</li><li><strong>Online betalingen:</strong> SumUp 2,50%; myPOS One 1,99% + € 0,20; Mollie vanaf 1,80% + € 0,25 voor creditcards en € 0,32 voor iDEAL | Wero.</li><li><strong>Extra's:</strong> bij CCV kosten retourpinnen (€ 4,25), fooi (€ 1,95) en een variabele boekingsperiode (€ 2,95) per maand extra. Een chargeback kost € 25.</li></ul>
${faqHtml(transFaq)}
${matchCta('Wat kost pinnen bij jouw aantallen?', 'gids_match')}${bron(bronnenVan(...PIN_IDS))}</article>`,
};
export const guides = [goedkoopste, kiezen, transactie];
// Gidsen-hub: per thema een korte samenvatting + link (geen volledige antwoorden, om de gidsen zelf niet te beconcurreren).
// Bedragen alleen uit AANBIEDERS (zelfde bronnen als de aanbiederpagina's).
const pctT = (n) => n.toLocaleString('nl-NL') + '%';
const hubFaq = [
  ['Wat kost een pinautomaat per maand?', `Dat hangt af van hoeveel je pint. Zonder abonnement betaal je geen vaste kosten, alleen per betaling: bijvoorbeeld ${pctT(A.sumup.plannen[0].pct)} bij SumUp of ${pctT(A.zettle.plannen[0].pct)} bij Zettle. Met een abonnement betaal je vaste kosten, zoals ${eur(A.sumup.plannen[1].maand)} per maand bij SumUp Betalingen Plus of ${eur(A.ccv.plannen[0].maand)} per automaat bij CCV, en minder per betaling. Reken het uit met jouw aantallen in <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.`],
  ['Kan ik een pinautomaat zonder abonnement krijgen?', `Ja. PayPal noemt bij Zettle geen contracten of terugkerende kosten, en SumUp, myPOS en Mollie hebben een plan zonder vaste kosten per maand. Je betaalt dan per betaling en eenmalig voor het apparaat. Zie <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a>.`],
  ['Is een kassasysteem verplicht?', `De Belastingdienst stelt eisen aan je administratie. Gebruik je een kassasysteem, dan hoort dat volgens de Belastingdienst bij je administratie, en moet je het volgens de wettelijke regels inrichten en bewaren. Lees de <a href="${BD[0][1]}" rel="noopener">brochure van de Belastingdienst</a> en onze gids <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>.`],
  ['Huren of kopen: wat is goedkoper?', `Dat hangt af van hoe lang je het apparaat gebruikt en welke maandkosten erbij komen. Bij CCV huur je bijvoorbeeld vanaf € 25 per maand of koop je vanaf € 399 plus maandkosten vanaf € 16. Leg de bedragen voor jouw termijn naast elkaar, en vergelijk de kosten per betaling in het rekenvoorbeeld op <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.`],
];
export const gidsHub = {
  path: '/gidsen/', title: 'Gidsen: pinautomaat en kassasysteem kiezen | KassaMatch', h1: 'Gidsen over pinautomaten en kassasystemen', crumb: 'Gidsen', og: 'gidsen',
  description: 'Welke pinautomaat of kassa past bij je zaak? Gidsen over kosten per pinbetaling, huren of kopen, een kassasysteem kiezen en wat de Belastingdienst vraagt.',
  schema: [faqSchema(hubFaq)],
  body: `<h1>Gidsen over pinautomaten en kassasystemen</h1><p class="lead">Uitleg en rekenvoorbeelden, met de tarieven van de aanbieders en de regels van de Belastingdienst.</p>
<div class="grid cards">${[...GIDSEN, ['/sumup-vs-zettle/', 'SumUp of Zettle', 'Tarief, apparaat en kassa-app naast elkaar.']].map(([h, t, d]) => `<a class="card" href="${h}"><h2>${esc(t)}</h2><p>${esc(d)}</p><span class="more">Lees verder →</span></a>`).join('')}</div>
<div class="prose">
<h2>Waar begin je?</h2>
<p>Begin bij je eigen vraag. Wil je alleen pinbetalingen aannemen, bijvoorbeeld op de markt of bij klanten thuis? Dan zoek je een pinautomaat, en draait het vooral om de kosten per betaling. Wil je ook producten, voorraad, tafels of personeel beheren? Dan zoek je een kassasysteem, met een pinkoppeling erbij.</p>
<p>Twijfel je nog? <a href="/kassa-match/">Doe de match</a>. Je beantwoordt zes korte vragen en krijgt de opties die het best passen.</p>
<h2>Wat kost pinnen?</h2>
<p>Een pinautomaat kost je op drie manieren: het apparaat, vaste kosten per maand en een bedrag per betaling. Het goedkoopste los te kopen apparaat per aanbieder kost ${eur(HWMIN)} tot ${eur(HWMAX)} (zoals de aanbieders het tonen). Wat je per maand kwijt bent, hangt vooral af van hoeveel je pint en hoe hoog je bedragen zijn.</p>
<p>In <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a> rekenen we drie voorbeelden door, van weinig tot veel betalingen.</p>
<h2>Pinautomaat met of zonder abonnement</h2>
<p>Zonder abonnement betaal je een percentage per betaling, bijvoorbeeld ${pctT(A.sumup.plannen[0].pct)} bij SumUp of ${pctT(A.zettle.plannen[0].pct)} bij Zettle. Met een abonnement betaal je een vast bedrag per maand en minder per betaling. Bij myPOS Pro is dat ${eur(A.mypos.plannen[2].maand)} per maand en ${eur(A.mypos.plannen[2].vast)} per betaling, bij CCV ${eur(A.ccv.plannen[0].maand)} per maand en ${eur(A.ccv.plannen[0].vast)} per betaling.</p>
<p>Pin je weinig, dan is een percentage meestal goedkoper. Pin je veel of hoge bedragen, dan wint vaak een vast bedrag. Waar dat omslagpunt ligt, lees je in <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a>.</p>
<h2>Huren of kopen</h2>
<p>De meeste pinaanbieders verkopen het apparaat. CCV laat je kiezen: huren kan vanaf € 25 per maand, met de transactieverwerking in de huurprijs. Kopen kan vanaf € 399 eenmalig plus maandelijkse kosten vanaf € 16. Wat voor jou goedkoper is, hangt af van hoe lang je het apparaat gebruikt. Alle bedragen per model staan op de pagina over <a href="/aanbieders/ccv/">CCV</a>.</p>
<h2>Een kassasysteem kiezen</h2>
<p>Een kassasysteem kies je op wat je zaak nodig heeft: tafels en een keuken in de horeca, voorraad en een webshop in een winkel. Sommige pinaanbieders hebben een eenvoudige kassa-app erbij. Uitgebreide systemen werken met een abonnement per maand of op offerte.</p>
<p>Welke functies je nodig hebt, lees je in <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>. Alle systemen naast elkaar staan in <a href="/kassasysteem-vergelijken/">kassasysteem vergelijken</a>, en alleen pinautomaten in <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>. Alle aanbieders op een rij vind je bij <a href="/aanbieders/">aanbieders</a>.</p>
<h2>Wat vraagt de Belastingdienst van je kassa?</h2>
<p>Gebruik je een kassasysteem, dan is dat volgens de Belastingdienst onderdeel van je administratie. Die moet je volgens de wettelijke regels inrichten en bewaren. Welke eisen precies gelden, hangt volgens de Belastingdienst af van onder meer de aard, omvang en complexiteit van je onderneming.</p>
<p>Meer uitleg staat in <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>, en bij de Belastingdienst zelf: ${BD.map(([t, u]) => `<a href="${u}" rel="noopener">${esc(t)}</a>`).join(' en ')}.</p>
${faqHtml(hubFaq)}
${bron(A.ccv.bronnen.filter(([, u]) => /huren|kopen|tarieven/.test(u)), A.zettle.bronnen.slice(0, 1), A.sumup.bronnen.slice(0, 1), A.mypos.bronnen.slice(0, 1), A.mollie.bronnen.slice(0, 1), BD)}
</div>
${matchCta()}`,
};

// ---- Bronnen ----
export const bronnen = {
  path: '/bronnen/', title: 'Bronnen: waar onze bedragen vandaan komen | KassaMatch', h1: 'Bronnen', crumb: 'Bronnen', og: 'home',
  description: 'Alle bronnen van KassaMatch: de prijspagina\'s van de aanbieders en de Belastingdienst, met de datum waarop we ze controleerden.',
  stamp: { checked: CHECKED },
  body: `<article class="prose"><h1>Bronnen</h1><p class="lead">Elk bedrag op KassaMatch komt van de eigen site van de aanbieder. Hier staan alle pagina's die we gebruiken, met de datum van de laatste controle.</p>
<div class="table-wrap"><table class="data stack"><thead><tr><th scope="col">Aanbieder</th><th scope="col">Bron</th><th scope="col">Gecontroleerd</th><th scope="col">Wat staat er niet</th></tr></thead><tbody>${IDS.map((id) => `<tr><th scope="row">${link(id)}</th><td data-l="Bron">${A[id].bronnen.map(([t, u]) => `<a href="${u}" rel="noopener">${esc(t)}</a>`).join('<br>')}</td><td data-l="Gecontroleerd"><time datetime="${checkedVan(id)}">${fmtDate(checkedVan(id))}</time></td><td data-l="Wat staat er niet">${esc(NIET[id])}</td></tr>`).join('')}</tbody></table></div>
<h2>Regels en uitleg</h2><ul>${BD.map(([t, u]) => `<li><a href="${u}" rel="noopener">${esc(t)}</a></li>`).join('')}</ul>
<h2>Hoe we controleren</h2><ul><li>We lezen de openbare prijspagina's, zonder in te loggen en zonder formulieren in te vullen.</li><li>De site van Lightspeed blokkeert geautomatiseerde verzoeken van onze server. De bedragen van Lightspeed hebben we via een andere ophaalmethode op de eigen prijspagina van Lightspeed gelezen.</li><li>Shopify toont ook op de Nederlandse POS-prijspagina de prijzen in US$. Daarom tonen we Shopify POS in dollars.</li><li>Ziet een aanbieder een fout, of veranderen tarieven? Mail <a href="mailto:${SITE.email}">${SITE.email}</a>, dan passen we het aan met bron.</li></ul></article>`,
};

// ---- Over, privacy, disclaimer, contact, 404 ----
export const over = {
  path: '/over/', title: 'Over KassaMatch: wie we zijn en hoe we werken', h1: 'Over ons', crumb: 'Over ons', og: 'home',
  description: 'KassaMatch helpt ondernemers kiezen tussen pinautomaten en kassasystemen. Wie we zijn, hoe we tarieven controleren en hoe we onafhankelijk blijven.',
  schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Over KassaMatch', about: ORG }],
  body: `<article class="prose"><h1>Over ons</h1><p class="lead">KassaMatch komt van het team achter BoekhoudMatch en ShopMatch. Bij ondernemers met een winkel, horecazaak of marktkraam komt steeds dezelfde vraag terug: welke pinautomaat of kassa past bij mij, en wat kost dat nou echt?</p>
<p>De tarieven van pinaanbieders zijn lastig te vergelijken: de een rekent een percentage, de ander een vast bedrag, een derde een abonnement. Wij rekenen het voor je uit met de tarieven van de aanbieders zelf.</p>
<h2>Hoe we werken</h2><ul><li><strong>Alleen de bron.</strong> Elk bedrag komt van de site van de aanbieder. Alle links staan op de pagina <a href="/bronnen/">bronnen</a>.</li><li><strong>Niets verzonnen.</strong> Staat iets niet op de site van de aanbieder, dan zeggen we dat. Geen sterren, geen reviews, geen experts.</li><li><strong>Onafhankelijk.</strong> We verkopen geen pinapparaten of kassa's.</li><li><strong>Partnerlinks tellen nooit mee</strong> in de match of de volgorde. Ze krijgen altijd het label "partnerlink".</li></ul>
</article>${methodBox()}<article class="prose"><h2>Hoe werkt de match precies?</h2><p>Zie <a href="/kassa-match/#methode">zo werkt de match</a>. De regels staan in de code van de site en zijn voor iedereen gelijk.</p>
<p>Fout gezien? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></article>`,
};

export const privacy = {
  path: '/privacy/', title: 'Privacy en cookies | KassaMatch', h1: 'Privacy en cookies', crumb: 'Privacy', og: 'home', stamp: { updated: PRIVACY_UPDATED },
  description: 'Hoe KassaMatch met je gegevens omgaat: geen account, je antwoorden blijven in je browser en statistieken alleen na jouw toestemming.',
  body: `<article class="prose"><h1>Privacy en cookies</h1>
<p>Vragen? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Wie is verantwoordelijk?</h2><p>Verantwoordelijk voor de verwerking van persoonsgegevens op deze site: KassaMatch, <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Welke gegevens?</h2><p>Je antwoorden in de KassaMatch en je invoer in de rekentool blijven in je browser. We slaan ze niet op en sturen ze nergens heen. We vragen geen naam, e-mailadres of andere persoonsgegevens.</p>
${GA_ID ? `<h2 id="cookies">Cookies en statistieken</h2><p>We gebruiken geen advertentiecookies. Statistieken met Google Analytics zetten we alleen aan als je in de cookiemelding op "Accepteren" klikt. Zonder toestemming laden we Google Analytics niet en gaat er niets naar Google.</p>
<p>Geef je toestemming, dan plaatst Google Analytics cookies (zoals <code>_ga</code>) en meten we welke pagina's bezocht worden en op welke knoppen en links naar aanbieders wordt geklikt. Je invoer in de match of de rekentool sturen we niet mee. Google Analytics 4 slaat geen IP-adressen op. We gebruiken de gegevens alleen voor statistieken (zie <a href="#bewaren">bewaartermijnen</a>). Google verwerkt de gegevens als verwerker; zie het <a href="https://policies.google.com/privacy" rel="noopener">privacybeleid van Google</a>.</p>
<p>Je keuze bewaren we 12 maanden in je browser (localStorage). Je kunt je toestemming altijd intrekken via <a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a> (ook onderaan elke pagina). Dan stoppen we Google Analytics en wissen we de <code>_ga</code>-cookies.</p>
<h3>Welke cookies en opslag?</h3>${cookieTabel(GA_ID, 'km-consent')}
` : '<h2 id="cookies">Cookies en statistieken</h2><p>We plaatsen geen cookies: geen advertentiecookies en geen statistiekcookies. Zetten we later statistieken aan, dan vragen we eerst je toestemming in een cookiemelding en passen we deze pagina aan.</p>'}<h2>Links naar aanbieders</h2><p>Klik je door naar een aanbieder, dan geldt de privacyverklaring van die aanbieder. Bij een partnerlink ziet de aanbieder dat je via KassaMatch komt.</p>
${partnerNetwerk(SITE.name, PARTNERLINKS)}
${grondslag()}
${doorgifte()}
${bewaartermijnen(14)}
<h2>Hosting</h2><p>De site draait op GitHub Pages. GitHub verwerkt technische gegevens zoals je IP-adres om de site te leveren (zie het <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">privacybeleid van GitHub</a>).</p>
${rechten(SITE.email)}</article>`,
};

export const disclaimer = {
  path: '/disclaimer/', title: 'Disclaimer | KassaMatch', h1: 'Disclaimer', crumb: 'Disclaimer', og: 'home',
  description: 'De voorwaarden van KassaMatch: waar de bedragen vandaan komen, hoe partnerlinks werken en wat je met de uitkomst van de match kunt doen.',
  body: `<article class="prose"><h1>Disclaimer</h1>
<p>KassaMatch geeft een overzicht van pinautomaten en kassasystemen op basis van wat de aanbieders zelf publiceren. We doen ons best om alles juist en actueel te houden, en zetten bij elke pagina de datum van de laatste controle.</p>
<h2>Bedragen en tarieven</h2><p>Alle bedragen komen van de sites van de aanbieders, op de datum die bij de pagina staat. Aanbieders kunnen hun tarieven en acties wijzigen. Wat de aanbieder je in een offerte of contract aanbiedt, gaat altijd voor. De rekenvoorbeelden gaan uit van betalingen met een Nederlandse consumentenbetaalpas.</p>
<h2>De match</h2><p>De match is een hulpmiddel op basis van vaste regels en je antwoorden. Het is een eerste selectie, geen persoonlijk advies over je bedrijf. Over fiscale vragen lees je meer bij de Belastingdienst.</p>
<h2>Partnerlinks</h2><p>Bij sommige aanbieders kunnen we een vergoeding krijgen als je via ons een account opent. Zo'n link heeft altijd het label "partnerlink". Partnerlinks hebben geen invloed op de match, de rekentool of de volgorde.</p>
<h2>Merken</h2><p>Merknamen zijn van de betreffende aanbieders. KassaMatch is niet verbonden aan een van deze aanbieders.</p>
<h2>Fout gezien?</h2><p>Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>, dan passen we het aan.</p></article>`,
};

export const contact = {
  path: '/contact/', title: 'Contact | KassaMatch', h1: 'Contact', crumb: 'Contact', og: 'home',
  description: 'Vraag, fout gezien of een tarief veranderd? Mail de redactie van KassaMatch. We passen het aan met bron.',
  schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact KassaMatch', about: ORG }],
  body: `<article class="prose"><h1>Contact</h1>
<p class="lead">Een vraag, een fout gezien of een tarief dat veranderd is? Mail ons op <a href="mailto:${SITE.email}" data-cta="contact_mail">${SITE.email}</a>.</p>
<ul><li><strong>Fout of verouderd tarief:</strong> stuur de link naar de bron mee, dan passen we het snel aan.</li><li><strong>Aanbieder?</strong> Je mag ons wijzen op nieuwe tarieven of producten. Een plek in de match of de volgorde kun je niet kopen.</li><li><strong>Persoonlijk advies</strong> over je bedrijf of je belastingen geven we niet.</li></ul></article>`,
};

export const notfound = {
  path: '/404.html', title: 'Pagina niet gevonden | KassaMatch', h1: 'Niet gevonden', noindex: true, og: 'home',
  description: 'Deze pagina bestaat niet.',
  body: `<div class="notfound"><h1>Deze pagina bestaat niet</h1><div class="actions"><a class="btn" href="/kassa-match/" data-cta="404_match">Start de match</a><a class="btn ghost" href="/aanbieders/">Alle aanbieders</a><a class="btn ghost" href="/">Homepage</a></div></div>`,
};
