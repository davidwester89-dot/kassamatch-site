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
export const revisieDatum = (pad, vorige) => BRONLINK2_PADEN.has(pad) ? '2026-11-24' : STIJL_PADEN.has(pad) ? '2026-11-18' : vorige;
