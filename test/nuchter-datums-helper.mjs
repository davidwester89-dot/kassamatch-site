// Onafhankelijke verwachting voor de stijlrelease van 13 november 2026.
export const STIJL_PADEN = new Set([
  "/aanbieders/",
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
  "/pinautomaat-vergelijken/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-13' : vorige;
