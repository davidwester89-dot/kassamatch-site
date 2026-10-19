// KassaMatch: aanbieders van pinautomaten en kassasystemen.
// ALLEEN feiten van de eigen site van de aanbieder, met bron-URL en controledatum (CHECKED).
// null = niet gepubliceerd / onbekend. Nooit schatten. Ook in de browser gebruikt (quiz.js, rekentool.js), dus zonder Node-imports.
// Partnerlinks staan NIET hier maar in partnerlinks.js; match.js en kosten.js lezen die nooit.

export const CHECKED = '2026-10-19';

/**
 * Pinplannen voor de kostenrekentool. Per plan:
 * - maand: vaste kosten per maand (per automaat), in euro
 * - pct: percentage per pinbetaling met een Nederlandse consumentenbetaalpas
 * - vast: vast bedrag per pinbetaling met zo'n pas
 * - tarief: hoe de aanbieder het tarief noemt (tekst)
 */
export const AANBIEDERS = {
  sumup: {
    naam: 'SumUp', slug: 'sumup', soort: 'pin', url: 'https://www.sumup.com/nl-nl/',
    kort: 'Pinapparaat zonder abonnement, met losse kassa als je wilt',
    wat: 'SumUp verkoopt pinapparaten (Solo Lite, Terminal) en een kassasysteem met twee schermen. Je kiest zonder abonnement of met Betalingen Plus voor lagere tarieven.',
    plannen: [
      { id: 'sumup-0', naam: 'Betaal naar gebruik', maand: 0, pct: 1.49, vast: 0, tarief: '1,49% per betaling met een betaalpas' },
      { id: 'sumup-plus', naam: 'Betalingen Plus', maand: 19, pct: 0.99, vast: 0, tarief: '0,99% per fysieke betaling (AMEX en premium passen 1,49%)' },
    ],
    hardware: [['Solo Lite met oplaadstation (werkt met je telefoon)', 44], ['Terminal met printer', 169], ['Kassa met twee schermen', 399]],
    hardwareNoot: 'Excl. btw, zoals SumUp het toont.',
    online: { ja: true, t: 'Onlinebetalingen: 2,50% per transactie.' },
    kassaSoftware: 0, horeca: true, winkel: true,
    kassa: { v: 'ja', t: 'SumUp Kassa (hardware € 399). Software € 0 per maand, of € 49 per maand voor POS Plus met plattegrond, boekhoudkoppeling en barcodescanner.' },
    abonnementNodig: false,
    extra: ['Boven € 10.000 omzet per maand biedt SumUp aangepaste tarieven op aanvraag.', 'SumUp noemt een omzet van minimaal € 4.645 per maand als punt waarop Betalingen Plus voordeliger is.', 'Online betalingen, buitenlandse en zakelijke passen hebben andere tarieven.'],
    bronnen: [['SumUp: prijzen', 'https://www.sumup.com/nl-nl/prijzen/'], ['SumUp: kassasysteem', 'https://www.sumup.com/nl-nl/sumup-kassa/']],
  },
  mypos: {
    naam: 'myPOS', slug: 'mypos', soort: 'pin', url: 'https://www.mypos.com/nl-nl/',
    kort: 'Goedkope pinapparaten en drie plannen, met zakelijke rekening erbij',
    wat: 'myPOS levert pinapparaten (Go 2, Flex, Ultra) met een zakelijke rekening en betaalpas. Je kiest uit drie plannen: One, Plus en Pro.',
    plannen: [
      { id: 'mypos-one', naam: 'One', maand: 0, pct: 1.49, vast: 0, tarief: '1,49% per betaling met een Nederlandse consumentenbetaalpas' },
      { id: 'mypos-plus', naam: 'Plus', maand: 19, pct: 0.99, vast: 0, tarief: '0,99% per betaling met een Nederlandse consumentenbetaalpas' },
      { id: 'mypos-pro', naam: 'Pro', maand: 39, pct: 0, vast: 0.06, tarief: '€ 0,06 per betaling met een Nederlandse bankpas' },
    ],
    hardware: [['myPOS Go 2', 39], ['myPOS Flex', 69], ['myPOS Ultra (met printer)', 179]],
    hardwareNoot: 'Excl. btw, zoals myPOS het toont. Plus geeft 25% en Pro 50% korting op je eerste Ultra.',
    online: { ja: true, t: 'Betaallinks en QR-codes. Online betalingen (kaart niet aanwezig) bij One 1,99% + € 0,20.' },
    kassaSoftware: 0,
    kassa: { v: 'deels', t: 'Kassasysteem-app voor myPOS Flex en Ultra.' },
    abonnementNodig: false,
    extra: ['Plus noemt myPOS voordelig vanaf € 4.000 per maand.', 'American Express en andere kaarten: 2,69% (One), 2,49% (Plus), 2,29% (Pro).', 'Geen contract of langetermijnverbintenis, volgens myPOS.'],
    bronnen: [['myPOS: prijzen en kosten', 'https://www.mypos.com/nl-nl/pricing-and-fees'], ['myPOS: pinapparaten', 'https://www.mypos.com/nl-nl/kopen-mobiel-pinapparaat']],
  },
  zettle: {
    naam: 'Zettle (PayPal Point of Sale)', slug: 'zettle', soort: 'pin', url: 'https://www.zettle.com/nl',
    kort: 'Eén tarief voor elke kaart, gratis kassa-app',
    wat: 'Zettle by PayPal heet nu PayPal Point of Sale. Je betaalt per transactie, zonder abonnement, en de kassa-app is gratis.',
    plannen: [
      { id: 'zettle', naam: 'Per transactie', maand: 0, pct: 1.95, vast: 0, tarief: '1,95% per kaarttransactie, ook American Express' },
    ],
    hardware: [['PayPal Reader (aanbieding voor nieuwe zakelijke gebruikers; extra lezers € 79)', 29], ['PayPal Terminal', 199]],
    hardwareNoot: 'Excl. btw, plus bezorgkosten, zoals PayPal het toont.',
    online: { ja: null, t: '' },
    kassaSoftware: 0,
    kassa: { v: 'ja', t: 'PayPal Point of Sale-kassasoftware zonder extra kosten: producten, voorraad, cadeaubonnen en omzetrapporten.' },
    abonnementNodig: false,
    extra: ['Tap to Pay op je telefoon zonder extra hardware.', 'Aangepaste tarieven zijn beschikbaar, volgens PayPal.'],
    bronnen: [['PayPal Point of Sale (Zettle): prijsstelling', 'https://www.zettle.com/nl/prijsstelling']],
  },
  mollie: {
    naam: 'Mollie', slug: 'mollie', soort: 'pin', url: 'https://www.mollie.com/nl',
    kort: 'Pinnen en online betalen bij één Nederlandse partij',
    wat: 'Mollie is bekend van online betalingen en heeft ook betaalterminals en Tap to Pay. Je kiest tussen Pay as you go en Pro.',
    plannen: [
      { id: 'mollie-0', naam: 'Pay as you go', maand: 0, pct: 1.8, vast: 0, tarief: '1,80% per betaling met "andere consumentenkaarten" (Maestro en V PAY 1,50%)' },
      { id: 'mollie-pro', naam: 'Pro', maand: 20, pct: 1.5, vast: 0.1, tarief: '€ 0,10 + 1,50% per betaling met "andere consumentenkaarten" (Maestro en V PAY € 0,06 + 0,20%)' },
    ],
    hardware: [['Tap-terminal', 95], ['Mobiele POS-terminal', 350], ['Vaste POS-terminal', 350]],
    hardwareNoot: 'Normale prijzen zoals Mollie ze toont. Op 19 oktober 2026 gaf Mollie 50% korting op de Tap-terminal en de mobiele terminal.',
    online: { ja: true, t: 'Online betalingen, betaallinks en iDEAL | Wero (€ 0,32 per betaling).' },
    kassa: { v: 'nee', t: 'Mollie levert terminals en betalingen; een eigen kassasoftware noemt Mollie niet op de prijspagina.' },
    abonnementNodig: false,
    extra: ['Pay as you go: maximaal 1 terminal. Pro: € 20 per maand per extra terminal.', 'Pro noemt Mollie de beste keuze vanaf € 2.000 per maand.', 'Mollie noemt Debit Mastercard en Visa Debit niet apart. We rekenen daarom met het tarief voor "andere consumentenkaarten".'],
    bronnen: [['Mollie: tarieven', 'https://www.mollie.com/nl/pricing'], ['Mollie: betalingen in de winkel', 'https://www.mollie.com/nl/products/pos-payments']],
  },
  ccv: {
    naam: 'CCV', slug: 'ccv', soort: 'pin', url: 'https://www.ccv.eu/nl/',
    kort: 'Vast laag bedrag per pinbetaling, Nederlandse aanbieder',
    wat: 'CCV levert betaalautomaten (onder meer Clover) en transactieverwerking. Je betaalt een vast bedrag per pinbetaling in plaats van een percentage.',
    plannen: [
      { id: 'ccv', naam: 'CCV-transactieverwerking', maand: 4.25, pct: 0, vast: 0.068, tarief: '€ 0,068 per betaling met een Nederlandse consumentenbetaalpas' },
    ],
    hardware: null,
    hardwareNoot: 'De prijs van de betaalautomaat staat niet op de tarievenpagina. Onbekend.',
    online: { ja: null, t: '' },
    kassa: { v: null, t: '' },
    abonnementNodig: true,
    extra: ['€ 4,25 per maand per betaalautomaat.', 'Opties: retourpinnen € 4,25 per maand, variabele boekingsperiode € 2,95, fooi € 1,95. Chargeback € 25.', 'Creditcards: 1,3% (consument, EER), zakelijke kaarten 2,3%, AMEX vanaf 1,5%.'],
    bronnen: [['CCV: tarieven transactieverwerking', 'https://www.ccv.eu/nl/betaaloplossingen/transactieverwerking/tarieven']],
  },
  lightspeed: {
    naam: 'Lightspeed', slug: 'lightspeed', soort: 'kassa', url: 'https://www.lightspeedhq.nl/',
    kort: 'Uitgebreid kassasysteem voor winkel of horeca',
    wat: 'Lightspeed is een kassasysteem met vestiging in Amsterdam, met aparte pakketten voor retail en horeca. Betalingen zitten erin, voorraadbeheer en rapporten ook.',
    pakketten: [
      ['Retail Basis', '€ 99 per maand', 'Voor zelfstandige winkeliers; 1 kassa inbegrepen, ingebouwde eCom (Venture)'],
      ['Retail Essentieel', '€ 149 per maand', '1 kassa inbegrepen, ingebouwde eCom (Business)'],
      ['Retail Plus', '€ 229 per maand', 'Pakket op maat met uitgebreide opties voor personalisatie en schaalvergroting'],
      ['Horeca Basic', '€ 89 per maand', '1 licentie, tablet-kassa; extra licentie € 49'],
      ['Horeca Core', '€ 159 per maand', '2 licenties, QR-bestellen, voorraadbeheer'],
      ['Horeca Pro', '€ 249 per maand', '3 licenties, multilocatiebeheer'],
    ],
    vanaf: 89, vanafTekst: 'vanaf € 89 per maand (horeca) en € 99 (retail)',
    hardware: null, hardwareNoot: 'Hardwareprijzen staan niet op de prijspagina. Onbekend.',
    transactie: 'Verwerkingskosten: "standaard" bij Basic, "aangepast" bij Core en Pro. Bedragen staan niet op de prijspagina.',
    online: { ja: true, t: 'Retail-pakketten hebben Lightspeed eCom ingebouwd.' },
    horeca: true, winkel: true,
    extra: ['Lightspeed: "Prijzen kunnen variëren en extra servicekosten kunnen van toepassing zijn, afhankelijk van het soort onderneming en de bedrijfssector."', 'Veel functies voor horeca zijn add-ons met extra kosten.'],
    bronnen: [['Lightspeed: prijzen retail', 'https://www.lightspeedhq.nl/kassasysteem/retail/prijzen/'], ['Lightspeed: prijzen horeca', 'https://www.lightspeedhq.nl/kassasysteem/restaurant/prijzen/']],
  },
  shopify: {
    naam: 'Shopify POS', slug: 'shopify-pos', soort: 'kassa', url: 'https://www.shopify.com/nl/pos',
    kort: 'Kassa voor wie ook een Shopify-webshop heeft',
    wat: 'Shopify POS is de kassa van Shopify: winkel en webshop delen producten, voorraad en klanten. Je hebt een Shopify-abonnement nodig.',
    pakketten: [
      ['Basic', 'US$ 39 per maand', 'Voor solo-ondernemers'],
      ['Grow', 'US$ 105 per maand', 'Voor kleine teams'],
      ['Advanced', 'US$ 399 per maand', 'Voor wereldwijd bereik'],
      ['POS Pro (optie)', '+ US$ 89 per maand per locatie', 'Per winkel die POS Pro gebruikt'],
    ],
    vanaf: null, vanafTekst: 'vanaf US$ 39 per maand (alleen in dollars getoond)',
    hardware: null, hardwareNoot: 'Hardwareprijzen in euro: onbekend.',
    transactie: 'De prijspagina toont ons kaarttarieven alleen in US$. Welke tarieven in Nederland gelden, staat daar niet in euro.',
    usd: true,
    online: { ja: true, t: 'Webshop en kassa in één systeem.' },
    horeca: false, winkel: true,
    extra: ['De Nederlandse prijspagina stuurde ons door naar de internationale pagina met prijzen in US$. De europrijs hangt af van je land en zie je pas bij aanmelden.', 'Shopify bood op 19 oktober 2026 een proefperiode: 3 dagen gratis, daarna 3 maanden $ 1 per maand.'],
    bronnen: [['Shopify: POS-prijzen', 'https://www.shopify.com/nl/pos/prijzen']],
  },
  untill: {
    naam: 'unTill', slug: 'untill', soort: 'kassa', url: 'https://untill.com/',
    kort: 'Horecakassa, van eenvoudig (Air) tot maatwerk',
    wat: 'unTill maakt kassasystemen voor horeca. unTill Air is de eenvoudige cloudkassa die je zelf instelt; het volledige unTill-systeem loopt via een lokale partner.',
    pakketten: [
      ['unTill Air', 'vanaf € 19 per maand', 'Maandelijks opzegbaar, eigen Apple- of Android-hardware'],
      ['unTill (volledig)', 'op offerte', '"Custom pricing, matched to your setup", via een unTill-partner'],
    ],
    vanaf: 19, vanafTekst: 'unTill Air vanaf € 19 per maand; volledig systeem op offerte',
    hardware: null, hardwareNoot: 'unTill Air werkt op je eigen hardware. Hardware voor het volledige systeem: op offerte.',
    transactie: 'unTill Payments: tarieven staan niet op de site.',
    online: { ja: null, t: '' },
    horeca: true, winkel: false,
    extra: ['De site van unTill is in het Engels.'],
    bronnen: [['unTill: site en unTill Air', 'https://untill.com/']],
  },
  mplus: {
    naam: 'MplusKASSA', slug: 'mpluskassa', soort: 'kassa', url: 'https://www.mpluskassa.nl/',
    kort: 'Kassasysteem op offerte, met advies van een leverancier',
    wat: 'MplusKASSA is een kassasysteem voor horeca en retail. Je stelt je oplossing samen en krijgt een vrijblijvend prijsoverzicht op maat. De verkoop loopt via gecertificeerde kassadealers.',
    pakketten: [['MplusKASSA', 'op offerte', 'Geen bedragen op de site; je krijgt een vrijblijvend prijsoverzicht op maat']],
    vanaf: null, vanafTekst: 'op offerte (geen prijzen op de site)',
    hardware: null, hardwareNoot: 'Op offerte.',
    transactie: 'Niet vermeld.',
    online: { ja: null, t: '' },
    horeca: true, winkel: true,
    extra: ['Prijzen alleen via offerte of demo.', 'Hulp en installatie via een netwerk van MplusKASSA-leveranciers.'],
    bronnen: [['MplusKASSA: site', 'https://www.mpluskassa.nl/']],
  },
};

export const IDS = Object.keys(AANBIEDERS);
export const PIN_IDS = IDS.filter((id) => AANBIEDERS[id].soort === 'pin');
export const KASSA_IDS = IDS.filter((id) => AANBIEDERS[id].soort === 'kassa');
/** Goedkoopste los te kopen pinapparaat (excl. btw) of null als onbekend. */
export const goedkoopsteHardware = (id) => { const h = AANBIEDERS[id].hardware; return h ? Math.min(...h.map(([, p]) => p)) : null; };
