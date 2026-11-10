// L7 11-11 (SEO+SC review 52ee166 B2): hub /aanbieders/ tilt niet mee op een gewijzigd kind (notHub).
// Bewaakt: geen sitemap-lastmod achteruit t.o.v. de parent-build, en een lastmod omhoog alleen bij eigen bodywijziging.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { materialize, readSitemap, walk, fileToPath, bodyFingerprint, hubAudit } from '../scripts/l7check.mjs';
import { CFG } from '../scripts/l7.config.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASIS = 'd669522969a9f8fac1233b506c6a36f95c5a9c72';
const D = '2026-11-11';
const env = { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', BUILD_DATE: D, PUSH_DATE: D };

test('notHub: /aanbieders/ staat erin, /gidsen/ blijft een bewaakte hub', () => {
  assert.deepEqual(CFG.notHub, ['/aanbieders/']);
  assert.ok(CFG.hubs.some((h) => h.hub === '/gidsen/'));
});

test('lastmod >= parent-build en alleen omhoog bij eigen bodywijziging; /aanbieders/ blijft 2026-11-10', () => {
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
      else if (lm !== oud && bodyFingerprint(bP.get(path), CFG) === bodyFingerprint(tP.get(path), CFG)) fout.push(`${path}: ${oud} → ${lm} zonder bodywijziging`);
    }
    assert.deepEqual(fout, []);
    assert.equal(tSm.get('/aanbieders/'), '2026-11-10');
    assert.match(readFileSync(join(tOut, 'aanbieders/index.html'), 'utf8'), /bijgewerkt <time datetime="2026-11-10">/);
    for (const p of ['/mypos-vs-sumup/', '/gidsen/', '/aanbieders/mypos/', '/aanbieders/sumup/']) assert.equal(tSm.get(p), D, p);
    // Zelftest: zonder notHub zou de audit /aanbieders/ als te oud melden; met notHub niet.
    assert.ok(hubAudit(tOut, { ...CFG, notHub: [] }).some((h) => h.startsWith('/aanbieders/:')));
    assert.deepEqual(hubAudit(tOut, CFG), []);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
