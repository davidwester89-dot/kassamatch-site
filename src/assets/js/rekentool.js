// KassaMatch: kostenrekentool op /pinautomaat-vergelijken/. Rekent met ./lib/kosten.js, niets verlaat de browser.
import { vergelijkPin, fmtEur } from './lib/kosten.js';
import { AANBIEDERS } from './lib/aanbieders.js';

const BASE = document.body.dataset.base || '';
const form = document.getElementById('form');
const out = document.getElementById('k-out');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const getal = (el, min, max) => { const n = Number(String(el.value).replace(',', '.')); return Number.isFinite(n) && n >= min && n <= max ? n : null; };

function reken() {
  const aantal = getal(form.aantal, 1, 100000); const bedrag = getal(form.bedrag, 1, 10000);
  if (aantal == null || bedrag == null) { out.innerHTML = '<p class="alert">Vul een aantal (1 tot 100.000) en een bedrag (€ 1 tot € 10.000) in.</p>'; return; }
  const rows = vergelijkPin(Math.round(aantal), bedrag, { geenAbonnement: form.geenabo.checked });
  out.innerHTML = `<div class="table-wrap"><table class="data stack"><caption class="sr-only">Kosten per maand bij ${Math.round(aantal)} pinbetalingen</caption><thead><tr><th scope="col">Aanbieder en plan</th><th scope="col">Vast per maand</th><th scope="col">Transactiekosten</th><th scope="col">Totaal per maand</th><th scope="col">Pinapparaat</th></tr></thead><tbody>${rows.map((r, i) => {
    const p = AANBIEDERS[r.id]; const hw = p.hardware ? `vanaf € ${Math.min(...p.hardware.map((h) => h[1]))} excl. btw` : 'onbekend (niet gepubliceerd)';
    return `<tr><th scope="row">${i + 1}. <a href="${BASE}/aanbieders/${p.slug}/">${esc(p.naam.split(' (')[0])}</a><span class="fnote">${esc(r.plan.naam)}</span></th><td class="n" data-l="Vast per maand">${fmtEur(r.maand)}</td><td class="n" data-l="Transactiekosten">${fmtEur(r.transactie)}</td><td class="n" data-l="Totaal per maand"><strong>${fmtEur(r.totaal)}</strong></td><td data-l="Pinapparaat">${hw}</td></tr>`;
  }).join('')}</tbody></table></div>${form.geenabo.checked && rows.length < 5 ? '<p class="sub">CCV valt weg: die rekent € 4,25 per maand per betaalautomaat.</p>' : ''}`;
}
form.addEventListener('input', reken);
form.addEventListener('change', reken);
form.addEventListener('submit', (e) => { e.preventDefault(); reken(); });
