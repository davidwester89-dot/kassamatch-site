// Siteconfig voor scripts/l7check.mjs (L7-datumcheck, naamgrep, repo-root-404). Wijzigingen in exempt/BEKEND_* alleen met SC-OK.
import { execSync, execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// B1: een gewijzigd aanbieders.js telt alleen als de quiz (alle antwoordcombinaties) of de calculator echt anders wordt.
const dektAanbieders = /(?:^|\/)js\/lib\/aanbieders\.js$/;
export function quizEnCalculator(outDir) {
  const lib = (f) => pathToFileURL(join(outDir, 'js/lib', f)).href;
  const code = `
import { score, VRAGEN, REKEN } from ${JSON.stringify(lib('match.js'))};
import { vergelijkPin } from ${JSON.stringify(lib('kosten.js'))};
import { AANBIEDERS } from ${JSON.stringify(lib('aanbieders.js'))};
// Elk nieuw veld in NIET_IN_QUIZ_OF_CALC heeft SC-OK nodig (zelfde regel als exempt/BEKEND_*).
const NIET_IN_QUIZ_OF_CALC = new Set(['transactie', 'bronnen', 'checked', 'updated', 'domeinen']);
const data = JSON.stringify(Object.fromEntries(Object.entries(AANBIEDERS).map(([id, p]) => [id, Object.fromEntries(Object.entries(p).filter(([k]) => !NIET_IN_QUIZ_OF_CALC.has(k)))])));
const vals = VRAGEN.map((v) => v.opties.map((o) => o[0]));
const combos = vals.reduce((acc, opt) => acc.flatMap((a) => opt.map((o) => a.concat(o))), [[]]);
const quiz = combos.map((c) => {
  const a = Object.fromEntries(VRAGEN.map((v, i) => [v.id, c[i]]));
  return score(a).slice(0, 3).map((r) => {
    const p = AANBIEDERS[r.id];
    return [r.id, r.fit, r.kosten, r.pinkosten, r.plan && r.plan.naam, (r.waarom || []).join('/'), p.vanafTekst || '', (p.extra && p.extra[0]) || '', p.hardwareNoot || ''].join('\\t');
  }).join('|');
});
const calc = [];
for (const n of [...new Set([...Object.values(REKEN.aantal), 300])]) for (const b of Object.values(REKEN.bedrag)) for (const g of [false, true]) {
  calc.push(n + 'x' + b + (g ? 'z' : '') + '=' + vergelijkPin(n, b, { geenAbonnement: g }).map((r) => r.id + ':' + r.totaal + ':' + r.plan.naam).join(','));
}
console.log(['data', data, 'quiz', combos.length, ...quiz, 'calc', ...calc].join('\\n'));
`;
  return execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', maxBuffer: 8 << 20 });
}
const clientOutput = { covers: dektAanbieders, run: quizEnCalculator };

export const CFG = {
  build: (dir, env) => { execSync('node build.mjs', { cwd: dir, env, stdio: 'ignore' }); return join(dir, 'dist'); },
  hubs: [{ hub: '/gidsen/', children: /^\/[^/]+\/$/ }],
  // Alleen ONTBREKENDE velden die de template van deze pagina niet heeft. Een aanwezig veld moet altijd kloppen.
  exempt: {},
  clientOutput: { '/kassa-match/': clientOutput, '/pinautomaat-vergelijken/': clientOutput },
};
export const ALLOW_NAME = [];
export const BEKEND_ORPHAN = [];
// Hub-audit: bestaande bevindingen op origin/main (30-10). Haal een regel weg zodra de hub is gefixt; dan bewaakt de test hem.
export const BEKEND_HUB = [];
