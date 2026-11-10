// 16-11: Mollie, Zettle, MplusKASSA en unTill hebben geen CTA-knop of sponsored-link (geen betaalde route).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { knop, bronlink, PARTNERLINKS, NEUTRAAL } from '../src/lib/partnerlinks.js';
import { AANBIEDERS } from '../src/lib/aanbieders.js';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

const VERWACHT = {
  mollie: { href: 'https://www.mollie.com/nl', tekst: 'Bron: Mollie' },
  zettle: { href: 'https://www.zettle.com/nl', tekst: 'Bron: Zettle' },
  mplus: { href: 'https://www.mpluskassa.nl/', tekst: 'Bron: MplusKASSA' },
  untill: { href: 'https://untill.com/', tekst: 'Bron: unTill' },
};

test('NEUTRAAL: vier merken, niet in PARTNERLINKS, knop() is exact de bronlink', () => {
  assert.deepEqual([...NEUTRAAL], ['mollie', 'zettle', 'mplus', 'untill']);
  for (const id of NEUTRAAL) {
    assert.ok(!(id in PARTNERLINKS), id);
    const html = bronlink(id);
    assert.equal(html, `<a href="${VERWACHT[id].href}" rel="noopener">${VERWACHT[id].tekst}</a>`);
    assert.equal(knop(id, 'hub', 'btn sm'), html);
    assert.doesNotMatch(html, /class="[^"]*\bbtn\b|data-cta|data-vendor|data-partner-slot|sponsored|utm_|[?&]ref=/i);
  }
});

test('sitewide: deze vier merken krijgen nergens een CTA of sponsored-link', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' }, stdio: 'ignore' });
  const verbodenAttr = /data-vendor="(mollie|zettle|mplus|untill)"/;
  const verbodenTekst = />Naar (Mollie|Zettle|MplusKASSA|unTill)</;
  const bestanden = walk('dist').filter((f) => /\.(html|js)$/.test(f) && !/\/google[0-9a-f]+\.html$/.test(f));
  for (const f of bestanden) {
    const s = readFileSync(f, 'utf8');
    assert.doesNotMatch(s, verbodenAttr, f);
    assert.doesNotMatch(s, verbodenTekst, f);
    for (const a of s.matchAll(/<a\b[^>]*>/g)) {
      const tag = a[0];
      const href = (tag.match(/\shref="([^"]*)"/) || [])[1] || '';
      for (const { href: u } of Object.values(VERWACHT)) {
        if (href.split(/[?#]/)[0] === u || href.startsWith(u + '?') || href.startsWith(u + '#')) {
          assert.doesNotMatch(tag, /class="[^"]*\bbtn\b|data-cta|data-vendor|data-partner-slot|sponsored|[?&]ref=|utm_/i, `${f}: ${tag}`);
          assert.match(tag, /rel="noopener"/, `${f}: ${tag}`);
        }
      }
    }
  }
  const hub = readFileSync('dist/aanbieders/index.html', 'utf8');
  for (const { href, tekst } of Object.values(VERWACHT)) {
    assert.ok(hub.includes(`<a href="${href}" rel="noopener">${tekst}</a>`), tekst);
  }
  // Andere merken: knoppen blijven (sanity).
  assert.match(hub, /data-vendor="ccv"[^>]*>Naar CCV</);
  assert.match(hub, /data-vendor="sumup"[^>]*>Naar SumUp</);
  assert.match(hub, /data-vendor="mypos"/);
  assert.match(hub, /href="https:\/\/mypos\.sjv\.io\/[^"]+"[^>]*rel="sponsored nofollow noopener"/);
});
