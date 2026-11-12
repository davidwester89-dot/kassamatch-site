// 19-11: SumUp, CCV en Lightspeed hebben geen goedgekeurde betaalde route → gewone bronlink, sitewide (statisch + quiz-knop()).
// myPOS en Shopify POS blijven betaalde knoppen. Matchbasisregel: 0 onbetaalde CTA's in de top 3, bij elke antwoordcombinatie.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const NIEUW = {
  sumup: { href: 'https://www.sumup.com/nl-nl/', tekst: 'Bron: SumUp', domein: /^https?:\/\/(?:[\w-]+\.)*sumup\.com(?:[/?#]|$)/i },
  ccv: { href: 'https://www.ccv.eu/nl/', tekst: 'Bron: CCV', domein: /^https?:\/\/(?:[\w-]+\.)*ccv\.eu(?:[/?#]|$)/i },
  lightspeed: { href: 'https://www.lightspeedhq.nl/', tekst: 'Bron: Lightspeed', domein: /^https?:\/\/(?:[\w-]+\.)*lightspeedhq\.(?:nl|com)(?:[/?#]|$)/i },
};
const ONBETAALD = ['mollie', 'zettle', 'mplus', 'untill', 'sumup', 'ccv', 'lightspeed'];
const BETAALD = ['mypos', 'shopify'];
const CTA = /class="[^"]*\bbtn\b|data-cta|data-vendor|data-partner-slot|target="_blank"/i;
const FOUT = /sponsored|[?&]ref=|utm_/i;

let built = false;
const build = () => { if (!built) { execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' }, stdio: 'ignore' }); built = true; } };
// Runtime: precies de modules die de browser laadt (dist/js/lib), niet src.
const lib = async (f) => import(pathToFileURL(resolve('dist/js/lib', f)).href);

test('NEUTRAAL: exact zeven onbetaalde merken; myPOS en Shopify POS blijven betaald', async () => {
  build();
  for (const [naam, m] of [['src', await import('../src/lib/partnerlinks.js')], ['dist', await lib('partnerlinks.js')]]) {
    assert.deepEqual([...m.NEUTRAAL], ONBETAALD, naam);
    for (const id of ONBETAALD) assert.ok(!(id in m.PARTNERLINKS), `${naam}: ${id} mag geen partnerlink hebben zolang het neutraal is`);
    for (const [id, v] of Object.entries(NIEUW)) {
      const html = `<a href="${v.href}" rel="noopener">${v.tekst}</a>`;
      assert.equal(m.bronlink(id), html, `${naam}: ${id}`);
      for (const cls of ['btn', 'btn sm', 'btn ghost sm']) assert.equal(m.knop(id, 'match_1', cls), html, `${naam}: ${id} ${cls}`);
    }
    for (const id of BETAALD) {
      const k = m.knop(id, 'match_1');
      assert.match(k, /class="btn"/, `${naam}: ${id}`);
      assert.match(k, /rel="sponsored nofollow noopener"/, `${naam}: ${id}`);
      assert.match(k, new RegExp(`data-vendor="${id}"`), `${naam}: ${id}`);
    }
  }
});

test('statisch sitewide: geen CTA, sponsored, ref of utm op een link naar SumUp, CCV of Lightspeed', () => {
  build();
  const bestanden = walk('dist').filter((f) => /\.(html|js)$/.test(f) && !/\/google[0-9a-f]+\.html$/.test(f));
  let bron = 0;
  for (const f of bestanden) {
    const s = readFileSync(f, 'utf8');
    assert.doesNotMatch(s, /data-vendor="(sumup|ccv|lightspeed)"/, f);
    assert.doesNotMatch(s, />Naar (SumUp|CCV|Lightspeed)</, f);
    for (const a of s.matchAll(/<a\b[^>]*>/g)) {
      const tag = a[0];
      const href = (tag.match(/\shref="([^"]*)"/) || [])[1] || '';
      for (const [id, v] of Object.entries(NIEUW)) {
        if (!v.domein.test(href)) continue;
        assert.doesNotMatch(tag, CTA, `${f}: ${id}: ${tag}`);
        assert.doesNotMatch(tag, FOUT, `${f}: ${id}: ${tag}`);
        assert.match(tag, /\srel="noopener"/, `${f}: ${id}: ${tag}`);
      }
    }
    for (const v of Object.values(NIEUW)) bron += s.split(`<a href="${v.href}" rel="noopener">${v.tekst}</a>`).length - 1;
  }
  // Hubkaart (1×) + aanbiederpagina boven en onder (2×) per merk.
  assert.equal(bron, 9);
  for (const [pad, id] of [['aanbieders/sumup', 'sumup'], ['aanbieders/ccv', 'ccv'], ['aanbieders/lightspeed', 'lightspeed']]) {
    const h = readFileSync(`dist/${pad}/index.html`, 'utf8');
    assert.equal(h.split(`<a href="${NIEUW[id].href}" rel="noopener">${NIEUW[id].tekst}</a>`).length - 1, 2, pad);
  }
  // /mypos-vs-sumup/: SumUp alleen als bronlink; de myPOS-knop blijft betaald.
  const vs = readFileSync('dist/mypos-vs-sumup/index.html', 'utf8');
  assert.match(vs, /data-vendor="mypos"[^>]*>Naar myPOS</);
  assert.match(vs, /href="https:\/\/mypos\.sjv\.io\/[^"]+" rel="sponsored nofollow noopener"/);
});

test('matchbasis: 0 onbetaalde CTA\'s in de top 3 bij alle antwoordcombinaties (runtime knop())', async () => {
  build();
  const { score, VRAGEN } = await lib('match.js');
  const { knop } = await lib('partnerlinks.js');
  const vals = VRAGEN.map((v) => v.opties.map((o) => o[0]));
  const combos = vals.reduce((acc, opt) => acc.flatMap((a) => opt.map((o) => a.concat(o))), [[]]);
  assert.equal(combos.length, 576);
  let onbetaald = 0, betaald = 0, bronnen = 0;
  for (const c of combos) {
    const a = Object.fromEntries(VRAGEN.map((v, i) => [v.id, c[i]]));
    const top = score(a).slice(0, 3);
    assert.equal(top.length, 3);
    top.forEach((r, i) => {
      // Zelfde aanroepen als quiz.js: plek 1 'btn', plek 2 en 3 'btn ghost sm'.
      const k = knop(r.id, 'match_' + (i + 1), i === 0 ? 'btn' : 'btn ghost sm');
      const cta = CTA.test(k);
      if (cta && !/rel="sponsored nofollow noopener"/.test(k)) onbetaald++;
      else if (cta) betaald++;
      else bronnen++;
      if (ONBETAALD.includes(r.id)) assert.ok(!cta, `${c.join('|')}: ${r.id}`);
    });
  }
  assert.equal(onbetaald, 0);
  assert.ok(betaald > 0 && bronnen > 0);
});

test('ranking los van partnerlinks: match.js en aanbieders.js importeren partnerlinks niet', () => {
  for (const f of ['src/lib/match.js', 'src/lib/aanbieders.js', 'src/lib/kosten.js']) {
    assert.doesNotMatch(readFileSync(f, 'utf8'), /\bimport\b[^;]*partnerlinks|import\(\s*['"][^'"]*partnerlinks/, f);
  }
});
