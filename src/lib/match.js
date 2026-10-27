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

/**
 * Vanaf-prijs in euro, zodat de valuta de volgorde nooit bepaalt.
 * valuta 'EUR' (of leeg): het bedrag zelf. valuta 'USD': bedrag / koers.usdPerEur (ECB-referentiekoers op koers.datum,
 * bron ecb.europa.eu), opnieuw vast te leggen bij elke prijscheck. Geen of ongeldige koers: null (niet te vergelijken).
 */
export function prijsInEuro(p) {
  if (p.vanaf == null) return null;
  if (!p.valuta || p.valuta === 'EUR') return p.vanaf;
  if (p.valuta === 'USD' && p.koers && p.koers.usdPerEur > 0 && /^\d{4}-\d{2}-\d{2}$/.test(p.koers.datum || '')) return Math.round((p.vanaf / p.koers.usdPerEur) * 100) / 100;
  return null;
}

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

function kassaKandidaat(id, a, p = AANBIEDERS[id]) {
  let fit = 0; const waarom = [];
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
  // Prijs per type zaak (bijv. Lightspeed retail of horeca), anders de vanaf-prijs. Altijd in euro.
  const pt = p.prijsPerType && p.prijsPerType[a.type];
  let eur = prijsInEuro(pt ? { vanaf: pt.bedrag, valuta: pt.valuta, koers: pt.koers } : p);
  // Compleet systeem (budget hoog): een optie die daarvoor nodig is telt mee (Shopify: POS Pro).
  const opt = a.budget === 'hoog' ? p.optieBijHoog : null;
  if (eur != null && opt) {
    const extra = prijsInEuro({ vanaf: opt.bedrag, valuta: opt.valuta, koers: opt.koers });
    eur = extra == null ? null : Math.round((eur + extra) * 100) / 100;
    if (eur != null) waarom.push(opt.reden);
  }
  const offerte = eur == null || (id === 'untill' && a.budget === 'hoog');
  if (offerte) waarom.push('Prijs op offerte');
  return { id, fit, kosten: offerte ? Infinity : eur, plan: null, waarom };
}

/** Alle aanbieders, beste match eerst: fit (hoog naar laag), dan kosten in euro (laag naar hoog), dan naam. Partnerlinks/commissie spelen geen rol. */
export function score(a, lijst = AANBIEDERS) {
  const aantal = REKEN.aantal[a.aantal] ?? 150;
  const bedrag = REKEN.bedrag[a.bedrag] ?? 25;
  const out = [];
  for (const id of Object.keys(lijst)) {
    const r = PIN_IDS.includes(id) ? pinKandidaat(id, a, aantal, bedrag) : kassaKandidaat(id, a, lijst[id]);
    // Bij "kassa": pinaanbieders zonder kassasoftware komen na de kassasystemen; bij "pin": kassasystemen achteraan.
    out.push({ ...r, waarom: r.waarom.slice(0, 3) });
  }
  return out.sort((x, y) => y.fit - x.fit || x.kosten - y.kosten || x.id.localeCompare(y.id));
}
