import { revisieDatum } from './nuchter-datums-helper.mjs';
// L7: hub /aanbieders/ tilt niet mee op een gewijzigd kind (notHub). Eigen bodywijziging wél (16-11: bronlinks).
// Bewaakt: geen sitemap-lastmod achteruit t.o.v. de parent-build, en een lastmod omhoog alleen bij eigen
// bodywijziging of relevante client-JS (quiz-knop op /kassa-match/).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { materialize, readSitemap, walk, fileToPath, bodyFingerprint, hubAudit, scriptDeps, jsFingerprint, DEFAULT_JS_IGNORE } from '../scripts/l7check.mjs';
import { CFG } from '../scripts/l7.config.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASIS = 'c5a602dd7a13293cfe25e4a7b7fd487bfc473784';
const D = '2026-11-18';
const env = { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: D, PUSH_DATE: D };

const jsChanged = (bOut, tOut, f) => {
  const a = existsSync(join(bOut, f)) ? jsFingerprint(readFileSync(join(bOut, f), 'utf8')) : null;
  const b = existsSync(join(tOut, f)) ? jsFingerprint(readFileSync(join(tOut, f), 'utf8')) : null;
  return a !== b;
};

test('notHub: /aanbieders/ staat erin; /gidsen/ blijft hub, zonder /aanbieders/ of /kassa-match/ als kind', () => {
  assert.deepEqual(CFG.notHub, ['/aanbieders/']);
  const g = CFG.hubs.find((h) => h.hub === '/gidsen/');
  assert.ok(g);
  assert.ok(g.children.test('/mypos-vs-sumup/'));
  assert.ok(g.children.test('/goedkoopste-pinautomaat/'));
  assert.ok(!g.children.test('/aanbieders/'));
  assert.ok(!g.children.test('/kassa-match/'));
});

test('lastmod >= parent-build en alleen omhoog bij eigen body- of clientwijziging', () => {
  execSync('node build.mjs', { cwd: ROOT, env, stdio: 'ignore' });
  const tmp = mkdtempSync(join(tmpdir(), 'km-hub-'));
  try {
    const dir = join(tmp, 'base');
    materialize(ROOT, BASIS, dir);
    const bOut = CFG.build(dir, env), tOut = join(ROOT, 'dist');
    const bSm = readSitemap(bOut), tSm = readSitemap(tOut);
    const pages = (out) => new Map(walk(out).filter((f) => f.endsWith('.html')).map((f) => [fileToPath(f), readFileSync(join(out, f), 'utf8')]));
    const bP = pages(bOut), tP = pages(tOut);
    const fout = [];
    for (const [path, lm] of tSm) {
      const oud = bSm.get(path);
      if (!oud) continue;
      if (lm < oud) fout.push(`${path}: achteruit ${oud} → ${lm}`);
      else if (lm !== oud) {
        const tf = path.endsWith('/') ? path.slice(1) + 'index.html' : path.slice(1);
        const body = bodyFingerprint(bP.get(path), CFG) !== bodyFingerprint(tP.get(path), CFG);
        const deps = scriptDeps(tOut, tP.get(path), tf).filter((d) => /\.(m?js|cjs|json)$/.test(d) && !DEFAULT_JS_IGNORE.test(d));
        const client = deps.some((d) => jsChanged(bOut, tOut, d));
        if (!body && !client) fout.push(`${path}: ${oud} → ${lm} zonder body- of clientwijziging`);
      }
    }
    assert.deepEqual(fout, []);
    assert.equal(tSm.get('/aanbieders/'), D);
    assert.match(readFileSync(join(tOut, 'aanbieders/index.html'), 'utf8'), /bijgewerkt <time datetime="2026-11-18">/);
    for (const p of ['/aanbieders/mollie/', '/aanbieders/zettle/', '/aanbieders/mpluskassa/', '/aanbieders/untill/', '/kassa-match/']) {
      assert.equal(tSm.get(p), D, p);
    }
    // Ongewijzigde myPOS-vs-SumUp-keten en /gidsen/ blijven 11-11.
    for (const p of ['/mypos-vs-sumup/', '/gidsen/', '/aanbieders/mypos/', '/aanbieders/sumup/']) assert.equal(tSm.get(p), revisieDatum(p, '2026-11-11'), p);
    assert.deepEqual(hubAudit(tOut, CFG), []);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
