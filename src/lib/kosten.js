// KassaMatch: kosten van pinnen per maand. Puur en getest. Leest nooit partnerlinks.
// Formule per plan: vaste maandkosten + aantal betalingen × (vast bedrag + percentage × gemiddeld bedrag).
// Alleen betalingen met een Nederlandse consumentenbetaalpas; creditcards, AMEX en online betalingen hebben andere tarieven.
import { AANBIEDERS, PIN_IDS } from './aanbieders.js';

const r2 = (n) => Math.round(n * 100) / 100;

/** Kosten van één plan per maand. */
export function planKosten(plan, aantal, bedrag) {
  const trans = aantal * (plan.vast + (plan.pct / 100) * bedrag);
  return { maand: plan.maand, transactie: r2(trans), totaal: r2(plan.maand + trans) };
}

/** Goedkoopste plan van een aanbieder bij dit volume. Bij gelijke kosten: het plan zonder of met de laagste vaste kosten. */
export function besteplan(id, aantal, bedrag, { geenAbonnement = false } = {}) {
  const plannen = AANBIEDERS[id].plannen.filter((p) => !geenAbonnement || p.maand === 0);
  if (!plannen.length) return null;
  return plannen.map((p) => ({ plan: p, ...planKosten(p, aantal, bedrag) })).sort((a, b) => a.totaal - b.totaal || a.maand - b.maand)[0];
}

/** Alle pinaanbieders, goedkoopste eerst (alleen op kosten; partnerlinks spelen geen rol). */
export function vergelijkPin(aantal, bedrag, opts = {}) {
  return PIN_IDS.map((id) => ({ id, ...besteplan(id, aantal, bedrag, opts) })).filter((r) => r.plan).sort((a, b) => a.totaal - b.totaal || a.id.localeCompare(b.id));
}

export const fmtEur = (n) => '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
