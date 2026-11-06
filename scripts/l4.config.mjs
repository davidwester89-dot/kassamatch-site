// Siteconfig voor scripts/l4-promocheck.mjs (L4: actie/korting met prijs en einddatum).
// KassaMatch heeft geen platforms.js: het actie-veld hoort op de aanbieder in src/lib/aanbieders.js.
// Er is nu geen veld `actie`. Een veld dat erbij komt is leeg/null, of bevat een parseerbare einddatum.
// BEKEND_L4: { pad, reden, tot?: 'JJJJ-MM-DD', alleen?: RegExp op de hele melding }.
// Met 'tot' vervalt de uitzondering ná die kalenderdag (Europe/Amsterdam; L4_VANDAAG alleen voor tests).
// Geen stille content-delete: een open hercheck blijft hier staan tot de dag, daarna is de melding weer rood.
//
// Deze site heeft geen Hostinger- of Anker-Black-Friday-kopie. BEKEND_L4 blijft daarom leeg.
// Alleen een echte, gedateerde open vangst hoort hier, niet een false positive zoals 'actieve terminal'.
import { execSync } from 'node:child_process';
import { join } from 'node:path';

export const CFG = {
  build: (dir, env) => { execSync('node build.mjs', { cwd: dir, env, stdio: 'ignore' }); return join(dir, 'dist'); },
  // Data-modules met een veld `actie` (regel C). Ontbreekt een bestand, dan slaat de check het over.
  actieModules: ['src/lib/aanbieders.js'],
};

export const BEKEND_L4 = [];
