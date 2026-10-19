// KassaMatch: pure matchlogica (ook in de browser gebruikt). Partnerlinks spelen hier geen rol.
// Volgorde: eerst wat past (vaste regels hieronder), dan de kosten (pinnen) of de bekende vanaf-prijs (kassa).
import { AANBIEDERS, PIN_IDS } from './aanbieders.js';
import { besteplan } from './kosten.js';

export const VRAGEN = [
  { id: 'type', vraag: 'Wat voor zaak heb je?', opties: [['winkel', 'Een winkel'], ['horeca', 'Horeca: café, restaurant, lunchroom'], ['onderweg', 'Markt, foodtruck of verkoop aan huis'], ['afspraak', 'Diensten op afspraak, zoals kapper of salon']] },
  { id: 'nodig', vraag: 'Wat heb je nodig?', opties: [['pin', 'Alleen een pinapparaat'], ['kassa', 'Een kassasysteem met producten en omzetoverzicht']] },
  { id: 'online', vraag: 'Wil je ook online betalingen of een webshop?', opties: [['nee', 'Nee, alleen betalen ter plekke'], ['ja', 'Ja, ook online']] },
  { id: 'aantal', vraag: 'Hoeveel pinbetalingen verwacht je per maand?', opties: [['30', 'Tot 50'], ['150', '50 tot 300'], ['600', '300 tot 1.000'], ['1500', 'Meer dan 1.000']] },
  { id: 'bedrag', vraag: 'Wat is een gemiddeld bedrag per betaling?', opties: [['10', 'Tot € 15'], ['25', '€ 15 tot € 40'], ['60', 'Meer dan € 40']] },
  { id: 'budget', vraag: 'Hoe kijk je naar vaste kosten?', opties: [['laag', 'Liefst geen abonnement'], ['mid', 'Een abonnement mag, als het goedkoper uitpakt'], ['hoog', 'Ik wil een compleet systeem, ook als dat meer kost']] },
];
export const compleet = (a) => VRAGEN.every((v) => a[v.id]);
/** Waarmee de match rekent per antwoord (staat ook in de uitleg op de site). */
export const REKEN = { aantal: { 30: 30, 150: 150, 600: 600, 1500: 1500 }, bedrag: { 10: 10, 25: 25, 60: 60 } };

const ONLINE = (id) => AANBIEDERS[id].online.ja === true;

function pinKandidaat(id, a, aantal, bedrag) {
  const p = AANBIEDERS[id]; let fit = 0; const waarom = [];
  const geenAbo = a.budget === 'laag';
  let best = besteplan(id, aantal, bedrag, { geenAbonnement: geenAbo });
  if (!best) { best = besteplan(id, aantal, bedrag); fit -= 15; }
  else if (geenAbo) waarom.push('Geen vaste maandkosten');
  if (a.online === 'ja') { if (ONLINE(id)) { fit += 10; waarom.push('Ook online betalingen'); } }
  if (a.nodig === 'kassa') {
    if (p.kassa.v === 'ja') { fit += 15; waarom.push('Kassasoftware erbij'); }
    else if (p.kassa.v === 'deels') { fit += 5; waarom.push('Kassa-app voor de eigen apparaten'); }
    else fit -= 20;
  }
  if (id === 'ccv') waarom.push('Vast bedrag per pinbetaling, geen percentage');
  // Bij een kassa vergelijken we op de kassasoftware per maand (zoals bij de kassasystemen), anders op de pinkosten.
  const kosten = a.nodig === 'kassa' ? (p.kassaSoftware ?? Infinity) : best.totaal;
  return { id, fit, kosten, pinkosten: best.totaal, plan: best.plan, waarom };
}

function kassaKandidaat(id, a) {
  const p = AANBIEDERS[id]; let fit = 0; const waarom = [];
  if (a.nodig === 'pin') fit -= 100; // je zoekt alleen een pinapparaat: kassasystemen komen achteraan
  if (a.type === 'horeca') { if (p.horeca) { fit += 20; waarom.push('Pakketten voor horeca'); } else fit -= 20; }
  if (a.type === 'winkel') { if (p.winkel) { fit += 20; waarom.push('Gemaakt voor winkels'); } else fit -= 20; }
  if (a.type === 'onderweg' || a.type === 'afspraak') fit -= 10;
  if (a.online === 'ja') {
    if (id === 'shopify') { fit += 20; waarom.push('Webshop en kassa in één systeem'); }
    else if (id === 'lightspeed' && a.type !== 'horeca') { fit += 10; waarom.push('Webshop (eCom) zit in de retailpakketten'); }
  }
  if (a.budget === 'laag') { if (id === 'untill') { fit -= 5; } else fit -= 25; }
  if (a.budget === 'mid' && id === 'untill' && a.type === 'horeca') { fit += 5; waarom.push('unTill Air vanaf € 19 per maand'); }
  if (a.budget === 'hoog') { fit += 15; if (id === 'lightspeed') waarom.push('Uitgebreid: voorraad, rapporten, meerdere kassa\'s'); }
  // unTill Air (€ 19) is de eenvoudige versie; wie een compleet systeem wil, krijgt het volledige unTill op offerte.
  const offerte = p.vanaf == null || (id === 'untill' && a.budget === 'hoog');
  if (offerte) waarom.push(p.usd ? 'Prijzen alleen in dollars bekend' : 'Prijs op offerte');
  return { id, fit, kosten: offerte ? Infinity : p.vanaf, plan: null, waarom };
}

/** Alle aanbieders, beste match eerst: fit (hoog naar laag), dan kosten (laag naar hoog), dan naam. */
export function score(a) {
  const aantal = REKEN.aantal[a.aantal] ?? 150;
  const bedrag = REKEN.bedrag[a.bedrag] ?? 25;
  const out = [];
  for (const id of Object.keys(AANBIEDERS)) {
    const r = PIN_IDS.includes(id) ? pinKandidaat(id, a, aantal, bedrag) : kassaKandidaat(id, a);
    // Bij "kassa": pinaanbieders zonder kassasoftware komen na de kassasystemen; bij "pin": kassasystemen achteraan.
    out.push({ ...r, waarom: r.waarom.slice(0, 3) });
  }
  return out.sort((x, y) => y.fit - x.fit || x.kosten - y.kosten || x.id.localeCompare(y.id));
}
