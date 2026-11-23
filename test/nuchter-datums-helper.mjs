// Onafhankelijke verwachting voor de stijlrelease van 18 november 2026.
export const STIJL_PADEN = new Set([
  "/aanbieders/ccv/",
  "/aanbieders/lightspeed/",
  "/aanbieders/mollie/",
  "/aanbieders/mpluskassa/",
  "/aanbieders/mypos/",
  "/aanbieders/shopify-pos/",
  "/aanbieders/sumup/",
  "/aanbieders/untill/",
  "/aanbieders/zettle/",
  "/gidsen/",
  "/kassa-match/",
  "/kassasysteem-horeca/",
  "/kassasysteem-kiezen/",
  "/mypos-vs-sumup/",
  "/pinautomaat-vergelijken/"
]);
// 24-11 (bronlinks SumUp/CCV/Lightspeed): eigen body- of clientwijziging; latere datum wint van de stijlrelease.
export const BRONLINK2_PADEN = new Set(['/aanbieders/', '/aanbieders/sumup/', '/aanbieders/ccv/', '/aanbieders/lightspeed/', '/kassa-match/']);
// 25-11 (nieuwe gids pinautomaat huren of kopen): /gidsen/ (kaart + verwijzing), /bronnen/ (nieuwe bron) en /goedkoopste-pinautomaat/ (inlink) hebben een eigen bodywijziging.
export const HUREN_KOPEN_PADEN = new Set(['/gidsen/', '/bronnen/', '/goedkoopste-pinautomaat/']);
// 26-11: CCV-koopprijs op home en /pinautomaat-vergelijken/. /gidsen/ blijft 25-11 (geen eigen bodywijziging).
export const CCV_KOOP_PADEN = new Set(['/', '/pinautomaat-vergelijken/']);
// 27-11 (nieuwe gids kassasysteem winkel): /gidsen/ (nieuwe kaart) en /kassasysteem-horeca/ (inlink) hebben een eigen bodywijziging.
export const WINKEL_PADEN = new Set(['/gidsen/', '/kassasysteem-horeca/']);
export const revisieDatum = (pad, vorige) => WINKEL_PADEN.has(pad) ? '2026-11-27' : CCV_KOOP_PADEN.has(pad) ? '2026-11-26' : HUREN_KOPEN_PADEN.has(pad) ? '2026-11-25' : BRONLINK2_PADEN.has(pad) ? '2026-11-24' : STIJL_PADEN.has(pad) ? '2026-11-18' : vorige;
