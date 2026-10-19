// KassaMatch: leest de antwoorden, rekent met ./lib/match.js en toont de top 3. Niets verlaat de browser.
import { score, compleet, VRAGEN, REKEN } from './lib/match.js';
import { AANBIEDERS } from './lib/aanbieders.js';
import { fmtEur } from './lib/kosten.js';
import { knop } from './lib/partnerlinks.js';
import { track } from './consent.js';

const BASE = document.body.dataset.base || '';
const form = document.getElementById('form');
// Statistieken (alleen na toestemming, zie consent.js): quiz_start = eerste eigen antwoord, één keer per paginaweergave.
let qStart = false;
form.addEventListener('change', (e) => { if (e.isTrusted && !qStart) { qStart = true; track('quiz_start', {}); } });
const out = document.getElementById('result');
const prog = document.getElementById('q-prog');
const bar = document.getElementById('q-bar');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kort = (id) => AANBIEDERS[id].naam.split(' (')[0];
const WACHT = out.innerHTML;
let gemeld = '';

function antwoorden() {
  const fd = new FormData(form); const a = {};
  for (const v of VRAGEN) if (fd.get(v.id)) a[v.id] = fd.get(v.id);
  return a;
}

/** Korte prijsregel per uitkomst. */
function prijs(r, a) {
  const p = AANBIEDERS[r.id];
  const n = REKEN.aantal[a.aantal]; const b = REKEN.bedrag[a.bedrag];
  if (p.soort === 'pin') {
    let hw = 'prijs pinapparaat onbekend';
    if (p.hardware && p.hardware.length) {
      // Bij kassa-vraag: toon kassaprijs (niet het goedkoopste pinapparaat).
      const kassa = a.nodig === 'kassa' ? p.hardware.find((h) => /kassa/i.test(h[0])) : null;
      const gekozen = kassa || p.hardware.reduce((m, h) => (h[1] < m[1] ? h : m));
      const label = kassa ? 'kassa' : 'pinapparaat vanaf';
      hw = `${label} € ${gekozen[1]} excl. btw`;
    }
    return `<strong>${fmtEur(r.pinkosten)} per maand</strong> aan pinkosten (${esc(r.plan.naam)}, bij ${n.toLocaleString('nl-NL')} betalingen van € ${b}) · ${hw}`;
  }
  return `<strong>${esc(p.vanafTekst)}</strong>`;
}

function toon(a, scroll) {
  const top = score(a).slice(0, 3);
  const b = top[0]; const pb = AANBIEDERS[b.id];
  out.innerHTML = `<h2>Jouw beste match</h2><p class="big">${esc(pb.naam)}</p><p class="pc-price">${prijs(b, a)}</p>`
    + `<div class="match-cta">${knop(b.id, 'match_1', 'btn')}<a class="vlink" href="${BASE}/aanbieders/${pb.slug}/">Lees alles over ${esc(kort(b.id))} →</a></div>`
    + `<h3>Top 3</h3><ol class="mtop">${top.map((r, i) => {
      const p = AANBIEDERS[r.id];
      return `<li${i === 0 ? ' class="first"' : ''}>${i === 0 ? '<span class="badge">Beste match</span> ' : ''}<span class="tag best">${p.soort === 'pin' ? 'Pinautomaat' : 'Kassasysteem'}</span><div class="mhead"><h3>${i + 1}. ${esc(p.naam)}</h3></div><p class="pc-price">${prijs(r, a)}</p>`
        + (r.waarom.length ? `<p class="lbl ok" style="margin:8px 0 0">Waarom het past</p><ul class="why">${r.waarom.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '')
        + (p.extra && p.extra[0] ? `<p class="lbl warn" style="margin:8px 0 0">Goed om te weten</p><ul class="why"><li>${esc(r.id === 'ccv' ? p.hardwareNoot : p.extra[0])}</li></ul>` : '')
        + (i > 0 ? `<div class="mini-cta">${knop(r.id, 'match_' + (i + 1), 'btn ghost sm')}<a href="${BASE}/aanbieders/${p.slug}/">Alles over ${esc(kort(r.id))}</a></div>` : '') + '</li>';
    }).join('')}</ol>`
    + `<div class="match-next"><a class="btn ghost" href="${BASE}/${a.nodig === 'kassa' ? 'kassasysteem-vergelijken' : 'pinautomaat-vergelijken'}/">Vergelijk alle ${a.nodig === 'kassa' ? 'kassasystemen' : 'pinautomaten'}</a></div>`
    + `<p class="mlinks"><button type="button" class="linkbtn" id="m-reset">Opnieuw beginnen</button><button type="button" class="linkbtn" id="m-share">Deel of bewaar: kopieer de link</button></p>`
    + `<p class="sub">Volgorde: eerst wat past, dan de kosten. Partnerlinks tellen niet mee.</p>`;
  const q = new URLSearchParams(a).toString();
  history.replaceState(null, '', `${location.pathname}?${q}`);
  document.getElementById('m-reset').addEventListener('click', () => { form.reset(); history.replaceState(null, '', location.pathname); update(); out.innerHTML = WACHT; form.querySelector('input').focus(); });
  document.getElementById('m-share').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Link gekopieerd'; } catch { e.target.textContent = location.href; } });
  if (q !== gemeld) { gemeld = q; document.dispatchEvent(new CustomEvent('km:quiz', { detail: { type: a.type, nodig: a.nodig } })); }
  if (scroll && matchMedia('(max-width: 899px)').matches) out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function update() {
  const a = antwoorden(); const n = Object.keys(a).length;
  prog.textContent = `${n} van ${VRAGEN.length} vragen beantwoord`;
  bar.style.width = `${(n / VRAGEN.length) * 100}%`;
  return a;
}

// Antwoorden uit de link (homepage of gedeelde link) terugzetten.
const params = new URLSearchParams(location.search);
for (const v of VRAGEN) { const val = params.get(v.id); const el = val && form.querySelector(`input[name="${v.id}"][value="${CSS.escape(val)}"]`); if (el) el.checked = true; }
const start = update();
if (compleet(start)) toon(start, false);

form.addEventListener('change', () => { const a = update(); if (compleet(a)) toon(a, false); });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const a = update();
  if (!compleet(a)) {
    const open = VRAGEN.find((v) => !a[v.id]);
    const el = form.querySelector(`input[name="${open.id}"]`);
    if (el) el.focus();
    out.innerHTML = `<h2>Jouw beste match</h2><p class="alert">Beantwoord nog: ${esc(open.vraag)}</p>`;
    return;
  }
  toon(a, true);
});
