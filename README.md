# KassaMatch.nl
Statische site (Node, geen frameworks), zelfde opbouw en huisstijl als BoekhoudMatch en ShopMatch (Inter, tokens, header met menu, footer met "Ook van ons"); eigen accent pruim `#8a2d6b`. `npm test`, `npm run build`, `npm run images` (og-afbeeldingen en favicons).

- Aanbieders: `src/lib/aanbieders.js`. ALLEEN feiten van de eigen site van de aanbieder, met bron-URL; `CHECKED` = controledatum. Onbekend = `null` (CCV-hardware, Shopify in euro, Mplus-prijzen). Nooit "prijs op aanvraag" bij Lightspeed: die prijzen zijn openbaar (site geeft curl een 403; lezen via WebFetch/browser).
- Pinkosten: `src/lib/kosten.js` (puur, getest): vaste kosten + aantal × (vast + % × bedrag), Nederlandse consumentenbetaalpas, goedkoopste plan per aanbieder.
- Match: `src/lib/match.js` (puur, getest). Volgorde: fit (vaste regels), dan kosten, dan alfabet. Antwoorden mogen in de URL (`/kassa-match/?type=winkel&nodig=pin&online=nee&aantal=150&bedrag=25&budget=mid`).
- Partnerlinks: `src/lib/partnerlinks.js`, LEEG tot een programma voor kassamatch.nl is goedgekeurd. Shopify (impact 7989613) is goedgekeurd voor shopmatch.nl, niet voor kassamatch.nl: pas invullen als kassamatch.nl in impact als property is goedgekeurd. Altijd `rel="sponsored nofollow noopener"` + één partnerzin per blok (partnerNoten); nooit invloed op match of kosten (test).
- Analytics: `src/analytics.config.mjs` (leeg = geen cookies en geen cookiemelding). Met ID: consent eerst; events `vendor_click` (vendor, page, position, cta_type), `match_cta` (page, cta_type), `calculator_use`, `quiz_complete` (zaak, nodig).
- Netwerkfooter: `src/network.mjs`. IndexNow-sleutel: `src/root/<sleutel>.txt`. Search Console-verificatiebestand ook in `src/root/`.

## Preview en livegang
- Preview: push naar main → Actions → https://davidwester89-dot.github.io/kassamatch-site/ (noindex, robots Disallow, geen CNAME).
- Live (pas na akkoord Dave): in `.github/workflows/pages.yml` `BASE: ''` en `GO_LIVE: '1'`; custom domain kassamatch.nl weghalen bij repo `kassamatch` (placeholder) en zetten op deze repo. DNS (A/AAAA apex + CNAME www → davidwester89-dot.github.io) staat al op GitHub Pages.

## Schrijfregels
Bylines "Redactie KassaMatch". Geen namen of foto's van personen, geen verzonnen experts, reviews of sterren. Bron = kale naam + link, alles ook op /bronnen/. Geen disclaimerzinnen ("geraadpleegd op", "check altijd"). Nooit batterijmatch.nl, geen Goodfellas-links, geen Reddit. Acceptatieplicht contant geld nooit met vaste datum noemen.
