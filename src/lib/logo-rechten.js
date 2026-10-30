// Gebruiksrecht van de logo's (nagekeken 30-10-2026 op de merkrichtlijn of perskit van de maker; SC 30-10).
// ZONDER_LOGO: de maker staat logogebruik alleen toe met toestemming, licentie of partnerovereenkomst.
// Die merken krijgen geen logo in de tabelcellen: de naam blijft gewoon staan, net als bij elk ander merk zonder logo.
// 'Geen gepubliceerde beperking gevonden' is geen toestemming: MM beslist; bij een bezwaar gaat het logo eruit.
export const ZONDER_LOGO = new Set(['lightspeed', 'shopify', 'zettle']);
export const LOGO_RECHTEN = {
  'ccv': { richtlijn: 'https://www.ccv.eu/nl/over-ccv/nieuws/pers-en-media', status: 'logo: pers- en mediapagina; logo heet nu "CCV from Fiserv"' },
  'lightspeed': { richtlijn: 'https://www.lightspeedhq.com/legal/lightspeed-trademark-and-copyright-guidelines/', status: 'GEEN LOGO: logogebruik alleen met specifieke licentie of toestemming' },
  'mollie': { richtlijn: 'https://www.mollie.com/resources', status: 'logo: logo-downloads met richtlijnen openbaar (ongewijzigd)' },
  'mplus': { richtlijn: 'https://developers.mpluskassa.nl/wp-content/uploads/2019/05/HuisstijlMplusKASSA.pdf', status: 'logo: huisstijl voor externe partijen openbaar' },
  'mypos': { richtlijn: 'https://www.mypos.com/en-gb/newsroom/assets', status: 'logo: media assets openbaar; ongewijzigd, gelijkwaardig naast andere aanbieders' },
  'shopify': { richtlijn: 'https://www.shopify.com/legal/trademarks', status: 'GEEN LOGO: alleen met uitdrukkelijke schriftelijke toestemming (wij zijn affiliate: merkmateriaal kan via het programma worden aangevraagd)' },
  'sumup': { richtlijn: 'https://www.sumup.com/en-gb/press/', status: 'logo: logokit voor redactioneel gebruik; ander gebruik met toestemming (press@sumup.com). MM laten bevestigen' },
  'untill': { richtlijn: 'geen merkrichtlijn gevonden (untill.com, 30-10)', status: 'logo: geen gepubliceerde beperking gevonden' },
  'zettle': { richtlijn: 'https://www.paypal.com/us/cshelp/article/paypal-zettle-rebrand-to-paypal-point-of-sale-help1235', status: 'GEEN LOGO: PayPal-merk, logo alleen volgens PayPal-licentie; Zettle heet nu PayPal Point of Sale' },
};
