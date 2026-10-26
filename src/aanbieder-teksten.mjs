// Extra uitleg en FAQ per aanbiederpagina (los van aanbieders.js, zodat de browser-JS klein blijft).
// Velden (allemaal optioneel): title, description, h1, voor: [[h2, html]] (na de intro), na: [[h2, html]] (na de vaste blokken), faq: [[vraag, antwoord-html]].
// ALLEEN feiten van de bronnen in aanbieders.js (bronnen), gecontroleerd op de datum in `checked`. Geen namen, reviews of scores.
import { AANBIEDERS as A, goedkoopsteHardware } from './lib/aanbieders.js';
import { eur } from './parts.mjs';

const tabel = (kop, rijen) => `<div class="table-wrap"><table class="data stack"><thead><tr>${kop.map((k) => `<th scope="col">${k}</th>`).join('')}</tr></thead><tbody>${rijen.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td data-l="${kop[i]}">${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
const pct = (n) => n.toLocaleString('nl-NL') + '%';

export const TEKSTEN = {
  ccv: {
    title: 'CCV tarieven 2026: pinautomaat huren of kopen en pinkosten',
    description: 'CCV tarieven 2026: € 0,068 per pinbetaling, pinautomaat huren vanaf € 25 per maand of kopen vanaf € 399. Alle kosten van ccv.eu, met rekenvoorbeeld.',
    h1: 'CCV pinautomaat: tarieven, huur en kosten',
    voor: [['Wat kost CCV per maand?', `<p>Dat hangt af van hoe je aan je pinautomaat komt. Huur je bij CCV, dan betaal je vanaf € 25 per maand voor een Clover Flex Pocket. De kosten voor transactieverwerking zitten dan in je huurprijs. Koop je, dan betaal je eenmalig vanaf € 399 plus maandelijkse kosten vanaf € 16.</p>
<p>Per betaling met een Nederlandse consumentenbetaalpas rekent CCV € 0,068. Voor de transactieverwerking zelf noemt CCV op de tarievenpagina € 4,25 per maand per betaalautomaat; bij huur zit dat in de huurprijs. De bedragen op de tarievenpagina zijn exclusief btw.</p>`]],
    na: [
      ['CCV transactiekosten per kaartsoort', `<p>CCV heeft twee tabellen: één voor de Clover-automaten en één voor de andere CCV-automaten. Voor de meeste Nederlandse klanten is het tarief gelijk: € 0,068 per betaling met een Nederlandse consumentenbetaalpas. Dat is een vast bedrag, dus een betaling van € 5 kost evenveel als een betaling van € 500. Alle bedragen zijn exclusief btw.</p>
<h3>Clover-automaten (Flex Pocket, Flex, Compact en Mini)</h3><ul><li>Debetkaart wereldwijd: 0,9%</li><li>Consumentencreditcard wereldwijd: 1,3%</li><li>Zakelijke creditcard wereldwijd: 2,3%</li></ul>
<h3>Andere CCV-automaten (A77, A960, Duo Base)</h3><ul><li>Bancontact (België): € 0,080</li><li>Consumentendebetkaart uit de rest van Europa (EER): 0,9%</li><li>Consumentencreditcard uit Europa (EER): 1,3%</li><li>Kaarten van buiten Europa en zakelijke kaarten: 2,3%</li><li>American Express: vanaf 1,5%</li></ul>
<p>Extra opties kosten per automaat per maand: retourpinnen € 4,25 (plus € 0,068 per retour), een variabele boekingsperiode € 2,95 en fooi toevoegen € 1,95. Een chargeback kost € 25. Retourpinnen en fooi kun je volgens CCV niet samen gebruiken.</p>
<h3>Wat zit er in de transactiekosten?</h3>
<p>De interchange, de vergoeding die naar de bank van je klant gaat, zit volgens CCV al in deze tarieven. Daarnaast betaal je € 4,25 per maand per betaalautomaat voor de CCV-transactieverwerking. Huur je je automaat, dan zit dat bedrag in je huurprijs.</p>
<h3>Rekenvoorbeeld: CCV transactiekosten per maand</h3>
<p>Stel, je doet 500 pinbetalingen per maand met een Nederlandse betaalpas en je hebt een gekochte automaat. Dan betaal je 500 × € 0,068 = € 34 aan betalingen, plus € 4,25 voor de transactieverwerking: € 38,25 per maand, exclusief btw. De maandelijkse koopkosten van je automaat komen daar los bij. Betaalt een klant € 50 met een consumentencreditcard, dan kost dat 1,3%: € 0,65.</p>
<p>Wil je dit naast een aanbieder met een percentage per betaling leggen? Reken het uit in <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a>.</p>`],
      ['Pinautomaat huren of kopen bij CCV', `<h3>Huren: prijs per maand</h3>
${tabel(['Model', 'Huur per maand'], [['Clover Flex Pocket', '€ 25'], ['Clover Flex', '€ 28'], ['Clover Mini', '€ 30'], ['Compact A77', '€ 38'], ['Plus Mobile A960', '€ 49'], ['Duo Base A80-A35', '€ 41']])}
<p>Voor de A77, A960 en Duo Base rekent CCV eenmalig een stabiliteitstoeslag van € 27,50 per automaat. Bij de Clover-automaten niet.</p>
<h3>Kopen: eenmalig plus maandelijks</h3>
${tabel(['Model', 'Eenmalig', 'Per maand'], [['Clover Flex Pocket', '€ 399', 'vanaf € 16'], ['Clover Flex', '€ 499', 'vanaf € 16'], ['Clover Mini', '€ 599', 'vanaf € 16'], ['Compact A77', '€ 442 (met pakketkorting, anders € 542)', '€ 28,96'], ['Plus Mobile A960', '€ 662 (met pakketkorting, anders € 762)', '€ 35,14'], ['Duo Base A80-A35', '€ 800 (met pakketkorting, anders € 900)', '€ 25,60']])}
<p>Ook bij koop geldt de stabiliteitstoeslag van € 27,50 voor de A77, A960 en Duo Base. Bij koop betaal je maandelijks voor je transacties en, afhankelijk van je keuze, voor service zoals updates en ondersteuning. Op de huur- en koopsite staat niet bij of deze bedragen inclusief of exclusief btw zijn.</p>
<p>Wat goedkoper is, hangt af van hoe lang je de automaat gebruikt. Leg de maandbedragen voor jouw termijn naast elkaar, en vergelijk de kosten per betaling met andere aanbieders in <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.</p>
<p>Tot en met 31 december 2026 heeft CCV een actie voor nieuwe Clover-overeenkomsten. Kies je een contract van 1, 2 of 3 jaar, dan betaal je de eerste 3, 6 of 9 maanden een actietarief van € 1 per maand. Dat geldt voor de automaat (alleen bij huur), Payment Plus, Clover-transactieverwerking en Clover Service. De kosten per betaling vallen erbuiten.</p>`],
      ['CCV Tap to Pay: pinnen met je Android-telefoon', `<p>Met de gratis CCV-app (Tap to Pay) maak je van een Android-smartphone een betaalautomaat, zonder extra hardware. CCV noemt alleen Android.</p>
<p>Je betaalt alleen per betaling: € 0,25 met een Nederlandse consumentenbetaalpas en 2,5% voor andere debetkaarten, creditcards en zakelijke kaarten. Doe je geen betalingen, dan betaal je € 0. Boven € 50 voert je klant een pincode in.</p>
<p>Per betaling is Tap to Pay dus duurder dan een CCV-automaat (€ 0,068). Het past vooral als je af en toe pint, bijvoorbeeld op een markt of braderie.</p>`],
      ['Contract en opzeggen', `<p>Een huurovereenkomst bij CCV loopt 12 maanden. Opzeggen kan tot uiterlijk drie maanden voor het einde. Doe je dat niet, dan loopt de overeenkomst door voor onbepaalde tijd, met opnieuw een opzegtermijn van drie maanden.</p>
<p>Twijfel je tussen CCV en een aanbieder zonder vaste kosten? Bekijk <a href="/aanbieders/sumup/">SumUp</a>, lees <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a> of <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a>. Liever direct advies? <a href="/kassa-match/">Doe de match</a>.</p>`],
    ],
    faq: [
      ['Wat kost een pinautomaat van CCV?', 'Huren kan vanaf € 25 per maand (Clover Flex Pocket), met transactieverwerking in de huurprijs. Kopen kan vanaf € 399 eenmalig plus maandelijkse kosten vanaf € 16. Per betaling met een Nederlandse betaalpas betaal je € 0,068.'],
      ['Wat kost een pintransactie bij CCV?', '€ 0,068 per betaling met een Nederlandse consumentenbetaalpas, exclusief btw. Een consumentencreditcard kost 1,3% en een zakelijke kaart 2,3%. Met CCV Tap to Pay op je telefoon is het € 0,25 per betaling met een Nederlandse pas.'],
      ['Kan ik een CCV-pinautomaat huren?', 'Ja. CCV verhuurt de Clover Flex Pocket (€ 25), Clover Flex (€ 28) en Clover Mini (€ 30) per maand, en daarnaast de Compact A77, Plus Mobile A960 en Duo Base. De huurovereenkomst loopt 12 maanden.'],
      ['Hoe zeg ik mijn CCV-pinautomaat op?', 'Volgens de huurpagina van CCV zeg je op tot uiterlijk drie maanden voor het einde van de 12 maanden. Doe je dat niet, dan loopt de huur door voor onbepaalde tijd, met een opzegtermijn van drie maanden.'],
    ],
  },

  lightspeed: {
    title: 'Wat kost Lightspeed per maand? Kassasysteem prijzen 2026',
    description: 'Lightspeed kassasysteem: horeca vanaf € 89 en retail vanaf € 99 per maand, retail met ingebouwde webshop. Wat elk abonnement bevat en wat erbij komt.',
    h1: 'Lightspeed kassasysteem: prijzen per maand en voor wie het past',
    voor: [['Wat kost Lightspeed per maand?', `<p>Lightspeed heeft aparte pakketten voor winkels en voor horeca. Horeca begint bij € 89 per maand (Basic), retail bij € 99 per maand (Basis). Hardware en de kosten per betaling komen erbij. Die bedragen staan niet op de prijspagina's.</p>
<p>Lightspeed zegt er zelf bij dat prijzen kunnen variëren en dat extra servicekosten kunnen gelden, afhankelijk van het soort onderneming en de branche.</p>`]],
    na: [
      ['Lightspeed Retail: Basis, Essentieel en Plus', `<p>Alle drie de retailpakketten hebben 1 kassa inbegrepen, geïntegreerde betalingen en de Mobiele Scanner-app. Met die app tel je voorraad en handel je bestellingen af op een iOS- of Android-apparaat. Het verschil zit vooral in de webshop en de extra opties:</p>
<ul><li><strong>Basis (€ 99 per maand):</strong> volgens Lightspeed voor de dagelijkse taken van zelfstandige winkeliers, met ingebouwde Lightspeed eCom in de variant Venture.</li><li><strong>Essentieel (€ 149 per maand):</strong> voor winkels die willen groeien, met eCom Business.</li><li><strong>Plus (€ 229 per maand):</strong> een pakket op maat met uitgebreide opties voor personalisatie en schaalvergroting, ook met eCom Business.</li></ul>`],
      ['Lightspeed Restaurant (horeca): Basic, Core en Pro', `<p>Voor horeca krijg je per pakket een aantal licenties: Basic (€ 89 per maand) heeft er 1, Core (€ 159) 2 en Pro (€ 249) 3. Een extra licentie kost € 49. Een licentie is een tabletkassa; bij Core en Pro kun je ook kiezen voor de mobiele kassa (Lightspeed Tableside) of een keukenscherm.</p>
<h3>Wat is standaard en wat is add-on</h3>
<p>Bij Basic zijn veel horecafuncties een add-on: Tableside, QR-code bestellen en betalen, reserveringen, voorraadbeheer en cadeaubonnen met loyaliteit. In Core zitten QR-bestellen, voorraadbeheer en cadeaubonnen met loyaliteit standaard. Een bestelkiosk en Lightspeed Reservations zijn bij alle drie een add-on. Voor add-ons schrijft Lightspeed: "extra kosten kunnen van toepassing zijn".</p>
<p>De verwerkingskosten voor betalingen noemt Lightspeed "Standaard" bij Basic en "Aangepast" bij Core en Pro. Bedragen staan er niet bij.</p>`],
      ['Hardware en Lightspeed Payments', `<p>Volgens Lightspeed bestaat de basisopstelling voor horeca uit een iPad met een standaard, keuken- en bonprinters, een betaalterminal en een kassalade. Prijzen voor die hardware staan niet op de prijspagina.</p>
<p>Betalingen lopen via de ingebouwde betaaloplossing van Lightspeed. Ook de tarieven per betaling staan niet op de prijspagina.</p>`],
      ['Lightspeed of Shopify POS?', `<p>Heb je al een Shopify-webshop, dan ligt <a href="/aanbieders/shopify-pos/">Shopify POS</a> voor de hand: winkel en webshop delen producten en voorraad. Lightspeed heeft eCom ingebouwd in de retailpakketten, aparte pakketten voor horeca en prijzen in euro. Shopify toont zijn prijzen in US$ en heeft op de prijspagina geen eigen horecapakket.</p>`],
      ['Voor wie past Lightspeed (en voor wie niet)', `<p>Lightspeed past bij een winkel of horecazaak die meer wil dan afrekenen: voorraad, rapporten en bij retail een webshop in hetzelfde systeem. Werk je met bediening aan tafel of een keukenscherm, dan zijn Core en Pro daarvoor gemaakt.</p>
<p>Minder handig is het als je vooral een pinapparaat zoekt. Je betaalt dan vaste kosten vanaf € 89 per maand, die je bij een pinaanbieder zonder abonnement niet hebt. Zoek je een eenvoudige horecakassa, kijk dan ook naar <a href="/aanbieders/untill/">unTill Air</a>. Alle kassa's naast elkaar staan in <a href="/kassasysteem-vergelijken/">kassasysteem vergelijken</a>, en hulp bij kiezen vind je in <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>.</p>`],
    ],
    faq: [
      ['Wat kost Lightspeed per maand?', 'Retail: Basis € 99, Essentieel € 149 en Plus € 229 per maand, steeds met 1 kassa. Horeca: Basic € 89, Core € 159 en Pro € 249 per maand. Hardware en de kosten per betaling komen erbij.'],
      ['Wat kost een Lightspeed-kassa voor horeca?', 'Vanaf € 89 per maand voor Basic met 1 licentie. Core kost € 159 (2 licenties) en Pro € 249 (3 licenties). Een extra licentie kost € 49. Veel functies zijn bij Basic een add-on met extra kosten.'],
      ['Wat zijn de transactiekosten van Lightspeed Payments?', 'Die staan niet op de prijspagina\'s van Lightspeed. Bij horeca noemt Lightspeed de verwerkingskosten alleen "Standaard" (Basic) of "Aangepast" (Core en Pro).'],
      ['Lightspeed of Shopify?', 'Heb je een Shopify-webshop, dan deelt <a href="/aanbieders/shopify-pos/">Shopify POS</a> producten en voorraad met die webshop. Lightspeed heeft een eigen webshop (eCom) in de retailpakketten en aparte horecapakketten, met prijzen in euro.'],
    ],
  },

  mplus: {
    title: 'MplusKASSA: kosten, werkwijze en voor wie | KassaMatch',
    description: 'Wat kost MplusKASSA? Geen prijzen op de site: je stelt modules en hardware samen en krijgt een prijsoverzicht op maat. Zo werkt het, met bronnen.',
    h1: 'MplusKASSA: kosten en voor wie het past',
    voor: [['Wat kost MplusKASSA?', `<p>MplusKASSA zet geen prijzen op de site. Je stelt je kassa zelf samen uit modules en hardware, en krijgt dan een vrijblijvend prijsoverzicht op maat.</p>
<p>Het prijsmodel is anders dan bij de meeste kassa-apps. MplusKASSA schrijft: "Bij MplusKASSA betaal je eenmalig voor de hardware en software die je nodig hebt. Daarna is de kassa van jou." Voor aanvullende service en online diensten kunnen maandelijkse kosten gelden.</p>`]],
    na: [
      ['Zo koop je MplusKASSA: samenstellen, demo, dealer', `<ol><li><strong>Samenstellen.</strong> Op de site kies je modules, zoals de basiskassa MplusKASSA Pro, tafelregistratie voor horeca of handheld-software, en hardware zoals een kassalade of bonprinter.</li><li><strong>Demo.</strong> Je kunt een vrijblijvende (online) demo aanvragen. MplusKASSA biedt ook aan het systeem 30 dagen gratis te proberen.</li><li><strong>Dealer.</strong> MplusKASSA wordt verkocht via gecertificeerde dealers. Zij helpen je met advies, installatie, training en ondersteuning.</li></ol>
<p>Hulp is er volgens MplusKASSA 24/7, via het netwerk van MplusKASSA-leveranciers.</p>`],
      ['Branches: horeca, retail en meer', `<p>MplusKASSA noemt zich een kassasysteem voor horeca en retail, met aparte pagina's voor onder meer bakkerijen. Voor horeca zijn er modules als tafelregistratie (boeken op tafel, splitsen en overboeken via een plattegrond) en handheld-software voor bestellen aan tafel.</p>
<p>Over zichzelf zegt MplusKASSA: een familiebedrijf sinds 1985, met 6.000+ klanten en 150+ koppelingen. Dat zijn claims van MplusKASSA zelf.</p>`],
      ['Koppelingen: webshop, boekhouding en pin', `<ul><li><strong>Webshop:</strong> koppelingen met onder meer WooCommerce en Magento. Die bouwen en onderhouden partners van MplusKASSA.</li><li><strong>Boekhouding:</strong> onder meer Exact Online, Twinfield, e-Boekhouden.nl en SnelStart.</li><li><strong>Pinnen:</strong> pinkoppelingen met Pay., CCV en Worldline, en een eigen betaalplatform: MplusKASSA Pay. Tarieven daarvan staan niet op de site.</li></ul>
<p>Pin je via CCV, dan vind je de tarieven per betaling op onze <a href="/aanbieders/ccv/">CCV-pagina</a>.</p>`],
      ['Hardware samenstellen', `<p>Ook de hardware stel je samen. Op de samenstelpagina staan onder meer kassa's als de Sunmi P3 en BasicPOS, een kassalade, een bonprinter, een weegschaal, cashverwerkers en de Sunmi L3-handheld. Prijzen staan er niet bij; die krijg je in je prijsoverzicht.</p>`],
      ['Voor wie past MplusKASSA (en voor wie minder)', `<p>MplusKASSA past bij een zaak die een kassa op maat wil, met persoonlijke hulp van een dealer en koppelingen met webshop en boekhouding. Betaal je liever eenmalig dan elke maand een vast bedrag, dan is het model het bekijken waard.</p>
<p>Minder handig is het als je zelf snel wilt beginnen en vooraf een prijs wilt zien. Kassasystemen met prijzen op de site zijn bijvoorbeeld <a href="/aanbieders/lightspeed/">Lightspeed</a> en <a href="/aanbieders/untill/">unTill Air</a>. Alles naast elkaar staat in <a href="/kassasysteem-vergelijken/">kassasysteem vergelijken</a>, en uitleg in <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>. Liever direct advies? <a href="/kassa-match/">Doe de match</a>.</p>`],
    ],
    faq: [
      ['Wat kost MplusKASSA?', 'MplusKASSA publiceert geen prijzen. Je stelt je kassa samen en krijgt een vrijblijvend prijsoverzicht op maat. Je betaalt eenmalig voor hardware en software; voor service en online diensten kunnen maandelijkse kosten gelden.'],
      ['Wat is MplusKASSA?', 'Een kassasysteem voor horeca en retail dat je samenstelt uit modules en hardware. Verkoop, installatie en ondersteuning lopen via gecertificeerde dealers.'],
      ['Kan MplusKASSA koppelen met een webshop?', 'Ja. MplusKASSA noemt webshopkoppelingen met onder meer WooCommerce en Magento, gemaakt door partners. Je artikelen synchroniseren dan met je webshop.'],
      ['Waar vind ik een MplusKASSA-dealer?', 'Op de dealerpagina van MplusKASSA staan alle dealers op een kaart. Daar vind je een specialist bij jou in de buurt.'],
    ],
  },

  shopify: {
    title: 'Shopify POS: kosten en POS Pro in Nederland | KassaMatch',
    description: 'Wat kost Shopify POS in Nederland? Abonnement vanaf US$ 39, POS Pro + US$ 89 per locatie, kaarttarieven en hardware. Wat Shopify wel en niet in euro toont.',
    h1: 'Shopify POS: kosten en voor wie het past',
    voor: [['Wat kost Shopify POS?', `<p>Shopify POS kost je op vier manieren: een Shopify-abonnement, eventueel POS Pro per winkel, een tarief per kaartbetaling en hardware. Shopify toont de bedragen ook op de Nederlandse pagina in US$. Een europrijs staat er niet bij, en wij rekenen dollars niet om.</p>
<p>Het abonnement begint bij US$ 39 per maand (Basic). POS Pro komt daar per locatie bij, voor US$ 89 per maand. Shopify brengt dat jaarlijks in rekening.</p>`]],
    na: [
      ['Abonnementen: Basic, Grow en Advanced', `<p>Elk betaald abonnement heeft standaardfuncties voor verkopen in de winkel. Volgens de prijspagina zijn dat onder meer een beperkt aantal medewerkers met toegang tot POS, eenvoudige klantprofielen en retouren op de oorspronkelijke aankooplocatie.</p>
<ul><li><strong>Basic:</strong> US$ 39 per maand</li><li><strong>Grow:</strong> US$ 105 per maand</li><li><strong>Advanced:</strong> US$ 399 per maand</li></ul>
<p>Op 20 oktober 2026 bood Shopify een proefperiode: 3 dagen gratis, daarna 3 maanden US$ 1 per maand.</p>`],
      ['POS Pro: wanneer heb je het nodig?', `<p>POS Pro is een toeslag van US$ 89 per maand per locatie, jaarlijks gefactureerd. Je krijgt onder meer een onbeperkt aantal medewerkers met toegang tot POS, rollen en toestemmingen, uitgebreide klantprofielen, retouren en ruilingen op elke locatie, voorraadbeheer en professionele retailrapporten.</p>
<p>Shopify raadt POS Pro aan voor winkels met veel aanloop, verschillende personeelsniveaus of een grote productcatalogus. Sta je alleen of met een klein team in één winkel, kijk dan eerst of de standaardfuncties genoeg zijn.</p>`],
      ['Kaarttarieven en Shopify Payments in Nederland', `<p>Voor betalingen in de winkel noemt Shopify deze tarieven, ook in US$: 2,6% + 10¢ bij Basic, 2,5% + 10¢ bij Grow en 2,4% + 10¢ bij Advanced. Gebruik je een betaalprovider van derden, dan rekent Shopify 2% (Basic), 1% (Grow) of 0,6% (Advanced).</p>
<p>Welke tarieven in Nederland gelden, staat niet in euro op die pagina. Nederland staat wel in de lijst van landen waar Shopify Payments beschikbaar is. Shopify POS werkt volgens Shopify in bijna elk land, maar Shopify Payments en de geïntegreerde POS-hardware zijn alleen in bepaalde regio's beschikbaar.</p>`],
      ['POS-hardware', `<p>Shopify noemt opties van afrekenen zonder hardware tot een volledig uitgeruste kassa. Je kunt onder meer een iPad-standaard van Shopify, barcodescanners, kassalades en bonprinters gebruiken. Eigen accessoires kunnen ook, als ze compatibel zijn. Hardwareprijzen in euro: onbekend.</p>`],
      ['Shopify POS of Lightspeed?', `<p>Shopify POS past vooral als je al een Shopify-webshop hebt: winkel en webshop delen producten, voorraad en klanten. <a href="/aanbieders/lightspeed/">Lightspeed</a> heeft eCom in de retailpakketten, aparte horecapakketten en prijzen in euro. Zoek je alleen een simpel pinapparaat zonder abonnement, kijk dan naar <a href="/aanbieders/zettle/">Zettle</a>. Hulp bij kiezen vind je in <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>, en alles naast elkaar in <a href="/kassasysteem-vergelijken/">kassasysteem vergelijken</a>.</p>`],
    ],
    faq: [
      ['Wat kost Shopify POS?', 'Een Shopify-abonnement vanaf US$ 39 per maand (Basic), eventueel POS Pro voor US$ 89 per maand per locatie (jaarlijks gefactureerd), plus kaarttarieven en hardware. Shopify toont de prijzen in US$.'],
      ['Werkt Shopify POS in Nederland?', 'Ja. Volgens Shopify kun je POS in bijna elk land gebruiken, en Nederland staat in de lijst van landen met Shopify Payments. De tarieven toont Shopify wel in US$.'],
      ['Wat is Shopify POS Pro?', 'Een uitbreiding per winkel voor US$ 89 per maand, jaarlijks gefactureerd. Je krijgt onder meer onbeperkt medewerkers met toegang, rollen en toestemmingen, voorraadbeheer en uitgebreidere rapporten.'],
      ['Welke hardware heb je nodig voor Shopify POS?', 'Dat hangt af van je winkel. Shopify noemt opties van afrekenen zonder hardware tot een volledig uitgeruste kassa, met onder meer een iPad-standaard, barcodescanner, kassalade en bonprinter. Eigen accessoires kunnen ook, als ze compatibel zijn.'],
    ],
  },

  untill: {
    title: 'unTill kassa: prijzen unTill Air en Prime | KassaMatch',
    description: 'Wat kost unTill? unTill Air vanaf € 19 per maand (jaarabonnement, excl. btw), unTill Prime op offerte via een partner. Wat erin zit en voor wie.',
    h1: 'unTill: prijzen en voor wie het past',
    voor: [['Wat kost unTill?', `<p>unTill heeft twee producten. unTill Air is een kassa-app die je zelf instelt. Die kost vanaf € 19 per maand bij een jaarabonnement, of € 21,85 per maand bij een maandabonnement. Beide bedragen zijn exclusief btw.</p>
<p>unTill Prime is het volledige kassasysteem. Daarvoor krijg je een offerte op maat, inclusief hardware, installatie, training en service.</p>`]],
    na: [
      ['unTill Air: de app-kassa', `<p>unTill Air draait op Apple en Android, op je eigen smartphone of tablet. Volgens unTill stel je het zelf in en kun je dezelfde dag live. Je kunt het 14 dagen gratis proberen, zonder betaalmethode.</p>
<h3>Basis, Standaard en Horeca</h3>
${tabel(['Pakket', 'Jaarabonnement', 'Maandabonnement', 'Wat erin zit'], [['Basis', '€ 19 per maand', '€ 21,85 per maand', 'Bestellingen aanslaan, zelf artikelen en prijzen beheren, directe verkoop, rapportages'], ['Standaard', '€ 29 per maand', '€ 33,85 per maand', 'Alles van Basis, plus rekeningen en keuken- of barbonnen printen'], ['Horeca', '€ 39 per maand', '€ 44,85 per maand', 'Alles van Standaard, plus tafelplan, tafels beheren, gangen en menu\'s']])}
<p>Alle bedragen zijn exclusief btw. Op untill.nl staan alleen Basic en Horeca; Standaard staat op untillair.nl.</p>
<h3>Jaar- of maandabonnement</h3>
<p>Het jaarabonnement heeft maandfacturering: je betaalt per maand, voor een abonnement van een jaar. Het maandabonnement kost per maand meer. Een abonnement geldt standaard voor 1 apparaat; extra apparaten, zoals een handheld, kosten een meerprijs. Hardware zit er niet in.</p>`],
      ['unTill Prime: maatwerk via een partner', `<p>unTill Prime is bedoeld voor zaken die meer nodig hebben: uitgebreide workflows, veel maatwerk en een inrichting rond jouw manier van werken. unTill noemt meer dan 125 koppelingen met horecasoftware. Functies als draadloos bestellen en reserveren kies je zelf.</p>
<p>Een unTill-partner denkt mee en richt het systeem voor je in. In de partnerlijst op untill.com staat ook Nederland. De offerte is inclusief hardware, installatie, training en service.</p>`],
      ['unTill Payments', `<p>Met unTill Payments gaat het bedrag van de kassa direct naar de betaalterminal, zodat niemand het hoeft over te typen. unTill noemt geen vaste contracten: je betaalt per transactie. Het geld staat binnen twee werkdagen op je rekening.</p>
<p>Je kunt pinnen met Tap to Pay op een telefoon, met een 2-in-1-klantendisplay op de toonbank of met een mobiele terminal aan tafel. De tarieven per transactie staan niet op de site.</p>`],
      ['Hardware bij Air en Prime', `<p>unTill Air werkt op je eigen apparaat. Wil je er een pinterminal of klantendisplay bij, dan bestel je die via de webshop van een reseller van unTill. Bij unTill Prime zit de hardware in de offerte.</p>`],
      ['Voor wie past unTill', `<p>unTill richt zich op horeca. Air past volgens unTill bij kleinere zaken die eenvoud en een lage instapprijs willen, zoals cafés, bars, foodtrucks en seizoenszaken. Prime past bij een zaak die maatwerk en veel koppelingen nodig heeft, met een partner die het inricht.</p>
<p>Wil je vaste pakketten met meer functies voor horeca, vergelijk dan met <a href="/aanbieders/lightspeed/">Lightspeed</a>. Wil je persoonlijke hulp van een leverancier, kijk dan ook naar <a href="/aanbieders/mpluskassa/">MplusKASSA</a>, dat ook via dealers werkt. Alles naast elkaar staat in <a href="/kassasysteem-vergelijken/">kassasysteem vergelijken</a>, en uitleg in <a href="/kassasysteem-kiezen/">kassasysteem kiezen</a>. Liever direct advies? <a href="/kassa-match/">Doe de match</a>.</p>`],
    ],
    faq: [
      ['Wat kost unTill Air?', 'Basis € 19, Standaard € 29 en Horeca € 39 per maand bij een jaarabonnement. Met een maandabonnement is dat € 21,85, € 33,85 en € 44,85. Alles exclusief btw en exclusief hardware.'],
      ['Wat is het verschil tussen unTill Air en unTill Prime?', 'Air is een kassa-app die je zelf instelt op je eigen Apple- of Android-apparaat, met vaste maandprijzen. Prime is een volledig systeem op maat, met meer dan 125 koppelingen, dat een unTill-partner voor je inricht. Daarvoor krijg je een offerte.'],
      ['Hoe werkt unTill Payments?', 'De kassa stuurt het bedrag direct naar de terminal. Je betaalt per transactie, zonder vast contract, en het geld staat binnen twee werkdagen op je rekening. De tarieven staan niet op de site.'],
      ['Heb ik speciale hardware nodig voor unTill Air?', 'Nee. unTill Air draait op je eigen smartphone of tablet, Apple of Android. Een pinterminal of klantendisplay kun je los bestellen via de webshop van een reseller.'],
    ],
  },

  zettle: {
    title: 'Zettle kosten 2026: tarief, Reader en Terminal | KassaMatch',
    description: 'Wat kost Zettle (PayPal Point of Sale)? 1,95% per kaartbetaling, geen abonnement, Reader vanaf € 29 en Terminal € 199 excl. btw. Met rekenvoorbeeld.',
    voor: [['Wat kost Zettle?', `<p>Bij Zettle, dat nu PayPal Point of Sale heet, betaal je 1,95% per kaartbetaling. Er is geen abonnement: PayPal noemt geen contracten of terugkerende kosten. Daarnaast koop je eenmalig een pinapparaat, of je pint met je telefoon.</p>
<p>De PayPal Reader kost € 29 voor nieuwe zakelijke gebruikers (één per gebruiker), een extra Reader € 79. De PayPal Terminal kost € 199. Alle bedragen zijn exclusief btw, plus bezorgkosten.</p>`]],
    na: [
      ['1,95% per kaartbetaling: wanneer is dat voordelig?', () => `<p>Zettle rekent hetzelfde tarief voor de belangrijkste kaarten en mobiele wallets, ook voor American Express. Dat is anders dan bij veel andere aanbieders, waar creditcards en zakelijke kaarten duurder zijn dan een gewone betaalpas.</p>
<p>Voor betalingen met een Nederlandse betaalpas is 1,95% juist relatief hoog. <a href="/aanbieders/sumup/">SumUp</a> rekent zonder abonnement ${pct(A.sumup.plannen[0].pct)}, en <a href="/aanbieders/ccv/">CCV</a> een vast bedrag van ${eur(A.ccv.plannen[0].vast)}. Betalen veel van je klanten met een creditcard, of pin je weinig, dan kan het ene tarief van Zettle toch goed uitkomen. Reken het na voor jouw aantallen in <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a> of <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.</p>`],
      ['Pinapparaten: Reader, Terminal of Tap to Pay', `<ul><li><strong>PayPal Reader:</strong> een kaartlezer die via Bluetooth verbinding maakt met je telefoon of tablet. € 29 voor nieuwe zakelijke gebruikers, extra lezers € 79. Een baliedock kan tegen een meerprijs.</li><li><strong>PayPal Terminal:</strong> € 199, zonder barcodescanner.</li><li><strong>Tap to Pay:</strong> je accepteert contactloze kaarten en wallets met de PayPal Point of Sale-app op je telefoon. Geen extra hardware en geen extra kosten; je betaalt ook dan 1,95%.</li></ul>
<p>De levertijd van de apparaten is volgens PayPal ongeveer 1 tot 2 werkdagen.</p>`],
      ['Kassa-app en uitbetaling', `<p>De kassasoftware van PayPal Point of Sale kost niets extra. Je beheert er producten en voorraad mee, maakt cadeaubonnen en wisselt ze in, bekijkt realtime omzetrapporten en volgt de prestaties van je personeel.</p>
<p>Je geld staat volgens PayPal doorgaans binnen enkele minuten op je zakelijke PayPal-rekening. Van daaruit stel je automatische overschrijvingen naar je bank in, zonder extra kosten.</p>`],
      ['Zettle of SumUp?', () => `<p>Per betaling met een Nederlandse pas is SumUp zonder abonnement goedkoper (${pct(A.sumup.plannen[0].pct)} tegen ${pct(A.zettle.plannen[0].pct)}). Het goedkoopste apparaat is bij Zettle goedkoper: ${eur(goedkoopsteHardware('zettle'))} voor de Reader tegen ${eur(goedkoopsteHardware('sumup'))} voor de goedkoopste SumUp (beide excl. btw). Alles naast elkaar staat in <a href="/sumup-vs-zettle/">SumUp of Zettle</a>.</p>
<p>Zoek je het goedkoopste pinapparaat bij jouw aantallen? Lees <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a>.</p>`],
    ],
    faq: [
      ['Wat kost Zettle per transactie?', '1,95% per kaartbetaling, voor de belangrijkste kaarten en mobiele wallets, ook American Express. Er zijn geen vaste maandkosten. PayPal noemt ook aangepaste tarieven.'],
      ['Hoe werkt Zettle?', 'Je meldt je aan voor PayPal Point of Sale, installeert de app en koppelt een PayPal Reader aan je telefoon of tablet. Of je pint met Tap to Pay op je telefoon. Je betaalt per transactie, en het geld staat doorgaans binnen enkele minuten op je zakelijke PayPal-rekening.'],
      ['Is Zettle nu PayPal?', 'Ja. Zettle by PayPal heet nu PayPal Point of Sale. Ook de producten kregen nieuwe namen, zoals de PayPal Point of Sale-app, de PayPal Reader en de PayPal Terminal.'],
      ['Kan ik met Zettle pinnen op mijn telefoon?', 'Ja. Met Tap to Pay in de PayPal Point of Sale-app accepteer je contactloze kaarten en wallets op je telefoon. Je hebt geen extra hardware nodig en het kost niets extra: je betaalt 1,95% per betaling.'],
    ],
  },

  sumup: {
    title: 'SumUp kosten 2026: tarieven en pinapparaten | KassaMatch',
    description: 'Wat kost SumUp? 1,49% per pinbetaling zonder abonnement, 0,99% met Betalingen Plus (€ 19 per maand). Solo Lite vanaf € 34, Terminal € 169 excl. btw.',
    h1: 'SumUp: kosten, tarieven en pinapparaten',
    voor: [['Wat kost SumUp?', `<p>Bij SumUp betaal je een keer voor je pinapparaat en daarna een percentage per betaling. Zonder abonnement (Betaal naar gebruik) is dat 1,49% per betaling met een betaalpas, ook voor American Express en premium passen. Er zijn geen vaste maandkosten, geen installatiekosten en geen huur voor het apparaat.</p>
<p>Met het abonnement Betalingen Plus betaal je € 19 per maand en dan 0,99% per fysieke betaling. Voor American Express, premium passen en passen van buiten de EU blijft het 1,49%. Volgens SumUp loont Plus vanaf een omzet van € 4.645 per maand. Je kunt Plus 7 dagen gratis proberen en opzeggen wanneer je wilt.</p>`]],
    na: [
      ['Pinapparaten van SumUp', `${tabel(['Apparaat', 'Prijs excl. btw', 'Wat het is'], [['Tap to Pay', '€ 0', 'Contactloos betalen op je eigen telefoon, met de SumUp Business-app'], ['Solo Lite', '€ 34 (met oplaadstation € 44)', 'Klein pinapparaat dat je aan je telefoon koppelt'], ['Solo', '€ 79 (met vaste of mobiele printer € 109)', 'Zelfstandig pinapparaat, zonder telefoon'], ['Terminal', '€ 169', 'Draagbaar betaal- en bestelapparaat met touchscreen en ingebouwde bonnenprinter'], ['SumUp Kassa', '€ 399 (€ 482,79 incl. btw)', 'Kassasysteem met een scherm van 13,3 inch voor jou en 8 inch voor de klant']])}
<p>SumUp toont de prijzen exclusief btw. Elk apparaat kun je volgens SumUp 30 dagen vrijblijvend proberen, en op alle hardware zit 1 jaar garantie. In onze rekentool rekenen we met de losse Solo Lite (€ 34).</p>`],
      ['Rekenvoorbeeld: zonder abonnement of Betalingen Plus', `<p>Stel: je pint € 5.000 per maand met gewone betaalpassen.</p>
<ul><li><strong>Betaal naar gebruik:</strong> 1,49% van € 5.000 = € 74,50 per maand.</li><li><strong>Betalingen Plus:</strong> € 19 + 0,99% van € 5.000 (€ 49,50) = € 68,50 per maand.</li></ul>
<p>Bij € 2.000 per maand is het andersom: zonder abonnement € 29,80, met Plus € 19 + € 19,80 = € 38,80. Pin je weinig of wisselt je omzet sterk per seizoen, dan past Betaal naar gebruik beter. Boven € 10.000 per maand biedt SumUp tarieven op maat. Reken je eigen aantallen uit in <a href="/transactiekosten-vergelijken/">transactiekosten vergelijken</a>.</p>`],
      ['Uitbetaling en andere kosten', `<p>Je geld staat volgens SumUp de volgende dag om 7.00 uur op je rekening, ook in het weekend en op feestdagen, zonder extra kosten. Een afgewezen betaling kost niets: je betaalt alleen voor geslaagde betalingen. Contante betalingen registreer je in de SumUp Business-app, zonder transactiekosten.</p>
<p>Online betalingen kosten 2,50% per transactie, bij beide plannen.</p>`],
      ['SumUp Kassa en POS Plus', `<p>SumUp Kassa is een kassasysteem voor op de balie, met een scherm voor jou en een voor je klant. De kassasoftware kost € 0 per maand. Met het abonnement POS Plus (€ 49 per maand) krijg je volgens SumUp onder meer plattegrondbeheer, een koppeling met boekhoudsoftware en een barcodescanner, en kun je bestellingen aan tafel opnemen en naar de keuken sturen.</p>
<p>SumUp noemt de Kassa geschikt voor kleine en middelgrote zaken: cafés, restaurants, bakkerijen, winkels en beautysalons. Printers, kassalades en een kiosk kun je erbij aansluiten.</p>`],
      ['SumUp of een andere aanbieder?', () => `<p>Vergeleken met <a href="/aanbieders/zettle/">Zettle</a> (${pct(A.zettle.plannen[0].pct)}) is SumUp zonder abonnement goedkoper per betaling met een Nederlandse pas. Bij <a href="/aanbieders/mypos/">myPOS</a> zijn de tarieven van One en Plus gelijk aan die van SumUp, maar krijg je er een zakelijke rekening bij. Pin je veel, kijk dan ook naar aanbieders met een vast bedrag per betaling, zoals <a href="/aanbieders/ccv/">CCV</a> (${eur(A.ccv.plannen[0].vast)}). Alles naast elkaar: <a href="/sumup-vs-zettle/">SumUp of Zettle</a> en <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a>.</p>`],
    ],
    faq: [
      ['Wat kost SumUp per transactie?', 'Zonder abonnement 1,49% per betaling met een betaalpas, ook American Express. Met Betalingen Plus (€ 19 per maand) 0,99% per fysieke betaling; American Express, premium passen en passen van buiten de EU blijven 1,49%. Online betalingen kosten 2,50%.'],
      ['Heeft SumUp vaste maandkosten?', 'Niet bij Betaal naar gebruik: je betaalt alleen het apparaat en een percentage per betaling. Betalingen Plus kost € 19 per maand. Voor de kassasoftware betaal je € 0, of € 49 per maand voor POS Plus.'],
      ['Wat is het goedkoopste pinapparaat van SumUp?', 'Tap to Pay op je telefoon kost € 0. Het goedkoopste losse apparaat is de Solo Lite voor € 34 excl. btw (met oplaadstation € 44). Die koppel je aan je telefoon. De zelfstandige Solo kost € 79.'],
      ['Wanneer staat mijn geld op mijn rekening?', 'Volgens SumUp de volgende dag om 7.00 uur, ook in het weekend en op feestdagen, zonder extra kosten.'],
    ],
  },

  mypos: {
    title: 'myPOS kosten 2026: plannen en pinapparaten | KassaMatch',
    description: 'Wat kost myPOS? One € 0, Plus € 19 en Pro € 39 per maand, vanaf € 0,06 per pinbetaling. Go 2 € 39, Flex € 69, Ultra € 179 excl. btw. Met rekenvoorbeeld.',
    h1: 'myPOS: kosten, plannen en pinapparaten',
    voor: [['Wat kost myPOS?', `<p>myPOS heeft drie accountplannen. Bij One betaal je niets per maand en 1,49% per betaling met een Nederlandse consumentenbetaalpas. Plus kost € 19 per maand, met 0,99%. Pro kost € 39 per maand, met een vast bedrag van € 0,06 per betaling met zo'n pas. Volgens myPOS is Plus voordelig vanaf € 4.000 per maand.</p>
<p>Er is geen contract en geen minimale looptijd: je kunt elke maand wisselen of opzeggen. Daarnaast koop je eenmalig een pinapparaat, of je pint met je telefoon (myPOS Glass).</p>`]],
    na: [
      ['Tarieven per kaartsoort', `${tabel(['Kaart (in de winkel)', 'One', 'Plus', 'Pro'], [['Nederlandse consumentenbetaalpas', '1,49%', '0,99%', '€ 0,06'], ['Nederlandse consumentencreditcard en betaalpassen uit de EER', '1,49%', '0,99%', '0,89%'], ['Alle andere kaarten, ook American Express', '2,69%', '2,49%', '2,29%']])}
<p>Online (kaart niet aanwezig) is het bij One 1,99% + € 0,20 voor een Nederlandse betaalpas, bij Plus 1,49% + € 0,15 en bij Pro 0,50% + € 0,10. Betaallinks, QR-codes en Tap to Pay zitten in alle drie de plannen.</p>`],
      ['Rekenvoorbeeld: welk plan past?', `<p>Stel: je doet 200 betalingen van € 25 per maand (€ 5.000), allemaal met een Nederlandse betaalpas.</p>
<ul><li><strong>One:</strong> 1,49% van € 5.000 = € 74,50.</li><li><strong>Plus:</strong> € 19 + 0,99% van € 5.000 (€ 49,50) = € 68,50.</li><li><strong>Pro:</strong> € 39 + 200 × € 0,06 (€ 12) = € 51.</li></ul>
<p>Bij Pro telt het aantal betalingen, niet het bedrag. Bij grote bedragen per betaling is Pro dus sneller voordelig; bij weinig betalingen is One het goedkoopst. Je eigen aantallen reken je uit in <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.</p>`],
      ['Pinapparaten van myPOS', `${tabel(['Apparaat', 'Prijs excl. btw', 'Wat het is'], [['myPOS Glass', 'geen apparaat nodig', 'Tap to Pay: contactloos betalen op je telefoon'], ['myPOS Go 2', '€ 39', 'Zelfstandig mobiel pinapparaat met 4G en wifi'], ['myPOS Flex', '€ 69', 'Compact pinapparaat voor onderweg of op de balie'], ['myPOS Ultra', '€ 179', 'Androidterminal met ingebouwde bonnenprinter'], ['myPOS Sigma', '€ 499', 'Kaartlezer voor automaten, kiosken en parkeren']])}
<p>Met Plus krijg je 25% korting op je eerste myPOS Ultra, met Pro 50%. Voor de Flex en Ultra is er een kassasysteem-app.</p>`],
      ['Zakelijke rekening en uitbetaling', `<p>Bij myPOS krijg je een zakelijke rekening met een eigen IBAN en een betaalpas. Een aparte bankrekening is volgens myPOS niet nodig. Het geld van een verkoop staat binnen enkele seconden op je myPOS-rekening, 24/7, ook in het weekend.</p>
<p>Let op de kosten van die rekening. Een uitgaande SEPA-overschrijving kost bij One € 1. Plus heeft 15 gratis overschrijvingen per maand (daarna € 0,50), Pro 50 (daarna € 0,25). Verwerk je 10 maanden geen betalingen, dan kan myPOS € 20 inactiviteitskosten rekenen, na een kennisgeving van twee maanden vooraf. Een terugboeking (chargeback) kost € 15.</p>`],
      ['myPOS of SumUp?', `<p>De tarieven van myPOS One en Plus zijn gelijk aan die van <a href="/aanbieders/sumup/">SumUp</a>: 1,49% zonder abonnement en 0,99% voor € 19 per maand. Het verschil zit in de rest. myPOS heeft met Pro een plan met een vast bedrag per betaling, en een zakelijke rekening met directe uitbetaling. SumUp betaalt de volgende ochtend uit op je eigen bankrekening. Twijfel je? <a href="/kassa-match/">Doe de match</a> of lees <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a>.</p>`],
    ],
    faq: [
      ['Wat kost myPOS per maand?', 'One € 0, Plus € 19 en Pro € 39 per maand. Er is geen contract of minimale looptijd; je kunt op elk moment wisselen of opzeggen. De eerste maandkosten rekent myPOS 10 dagen na de verificatie van je account.'],
      ['Wat kost een pinbetaling bij myPOS?', 'Met een Nederlandse consumentenbetaalpas 1,49% (One), 0,99% (Plus) of € 0,06 (Pro). American Express en andere kaarten kosten 2,69%, 2,49% of 2,29%.'],
      ['Welk myPOS-apparaat is het goedkoopst?', 'De myPOS Go 2 voor € 39 excl. btw. Je kunt ook zonder apparaat contactloos pinnen op je telefoon met myPOS Glass (Tap to Pay).'],
      ['Heb ik een bankrekening nodig voor myPOS?', 'Nee. Je krijgt bij myPOS een zakelijke rekening met eigen IBAN. Betalingen staan daar binnen enkele seconden op.'],
    ],
  },

  mollie: {
    title: 'Mollie pinautomaat: kosten en terminals 2026 | KassaMatch',
    description: 'Wat kost Mollie in de winkel? Pay as you go zonder maandkosten of Pro voor € 20 per maand. Tap-terminal € 95, mobiele terminal € 350. Met rekenvoorbeeld.',
    h1: 'Mollie in de winkel: kosten, tarieven en terminals',
    voor: [['Wat kost Mollie in de winkel?', `<p>Voor betalingen in de winkel heeft Mollie twee plannen. Bij Pay as you go betaal je geen vaste maandkosten, alleen een percentage per betaling, en gebruik je maximaal 1 terminal. Pro kost € 20 per maand per terminal, met lagere percentages plus een vast bedrag per betaling. Mollie noemt Pro de beste keuze vanaf € 2.000 per maand. Verwerk je meer dan € 100.000 per maand, dan biedt Mollie volumeprijzen op aanvraag. Je betaalt alleen voor geslaagde betalingen en kunt op elk moment opzeggen.</p>`]],
    na: [
      ['Tarieven: Pay as you go en Pro', `${tabel(['Kaart', 'Pay as you go (€ 0 per maand)', 'Pro (€ 20 per maand)'], [['Maestro en V PAY', '1,50%', '€ 0,06 + 0,20%'], ['Andere consumentenkaarten', '1,80%', '€ 0,10 + 1,50%'], ['American Express', '2,10%', '€ 0,10 + 1,80%'], ['Zakelijke kaarten', '2,90%', '€ 0,10 + 2,50%']])}
<p>Mollie noemt Debit Mastercard en Visa Debit niet apart. Die vallen bij ons onder "andere consumentenkaarten". In onze rekentool rekenen we daarom met 1,80% (Pay as you go) en € 0,10 + 1,50% (Pro).</p>`],
      ['Rekenvoorbeeld: wanneer loont Pro?', `<p>Stel: je doet 80 betalingen van € 25 per maand (€ 2.000).</p>
<ul><li><strong>Met andere consumentenkaarten:</strong> Pay as you go 1,80% = € 36. Pro: € 20 + 80 × € 0,10 + 1,50% van € 2.000 = € 20 + € 8 + € 30 = € 58.</li><li><strong>Met Maestro of V PAY:</strong> Pay as you go 1,50% = € 30. Pro: € 20 + 80 × € 0,06 + 0,20% van € 2.000 = € 20 + € 4,80 + € 4 = € 28,80.</li></ul>
<p>Of Pro loont, hangt dus sterk af van welke passen je klanten gebruiken. Met vooral Debit Mastercard en Visa Debit blijft Pay as you go in dit voorbeeld goedkoper. Reken het na voor jouw aantallen in <a href="/pinautomaat-vergelijken/">pinautomaat vergelijken</a>.</p>`],
      ['Welke terminal past bij welk plan?', `${tabel(['Terminal', 'Normale prijs', 'Wat het is', 'Wat Mollie bij het plan zegt'], [['Tap-terminal', '€ 95', 'Alleen contactloze kaarten en wallets, NFC aan de voorkant, 4G en wifi, digitale bon via QR of e-mail', 'Bij de terminal geen maandbedrag vermeld'], ['Mobiele POS-terminal', '€ 350', 'Licht en draagbaar, voor de winkel en onderweg', 'Vanaf € 20 per maand per actieve terminal'], ['Vaste POS-terminal', '€ 350', 'Ethernet, eenvoudig te monteren en vandalismebestendig, voor kiosken en onbemande betaalpunten', 'Vanaf € 20 per maand per actieve terminal'], ['Tap to Pay (iPhone en Android)', 'geen terminal nodig', 'Contactloos betalen op je eigen telefoon met de Mollie Tap-app', 'Onbeperkt bij beide plannen']])}
<p>Bij de mobiele en de vaste terminal noemt Mollie dus een maandbedrag van € 20 per actieve terminal: reken die bij je kosten. Bij Pay as you go schrijft Mollie "maximaal 1 terminal (PAX niet ondersteund)". Wil je zonder maandkosten pinnen, kijk dan naar de Tap-terminal of Tap to Pay, en vraag Mollie welke terminal bij Pay as you go werkt. Op 23 oktober 2026 gaf Mollie 50% korting: de Tap-terminal kostte € 47,50 en de mobiele terminal € 175.</p>`],
      ['Online en in de winkel bij één partij', `<p>Mollie is bekend van online betalen. Heb je ook een webshop, dan lopen je online betalingen en je pinbetalingen via hetzelfde dashboard. Online kost iDEAL | Wero € 0,32 per betaling en een consumentencreditcard uit de EER 1,80% + € 0,25. Betaallinks, facturen en terugkerende betalingen zitten er zonder extra kosten bij.</p>
`],
      ['Wanneer staat je geld op je rekening?', `<p>Je kiest zelf hoe vaak Mollie uitbetaalt: dagelijks op elke werkdag, wekelijks op een werkdag naar keuze of maandelijks op de eerste werkdag. Tot 5 uitbetalingen per maand zijn gratis, daarna € 0,25 per extra uitbetaling (als je minder dan € 500.000 per jaar verwerkt).</p>
<p>Met de zakelijke rekening van Mollie (€ 9 per maand, de eerste 12 maanden gratis) staan pinbetalingen volgens Mollie binnen 24 uur op je rekening, ook in het weekend. Je krijgt tot 5 rekeningen met een Nederlandse IBAN en 100 gratis overschrijvingen per maand; daarna € 0,20 per overboeking.</p>`],
      ['Koppelen aan je kassasysteem', `<p>Mollie levert betalingen en terminals, geen eigen kassasoftware op de prijspagina. Wil je kassa en pin aan elkaar koppelen, kijk dan op de integratiepagina van Mollie: daar staat een aparte categorie POS (Point of Sale). Vraag bij je kassaleverancier na of die Mollie-terminals ondersteunt voordat je een terminal bestelt. Welke kassa's er zijn, zie je in <a href="/kassasysteem-vergelijken/">kassasysteem vergelijken</a>.</p>`],
      ['Voor wie past Mollie?', () => `<p>Mollie past vooral als je al online verkoopt via Mollie, of als je winkel en webshop bij één partij wilt. Een eigen kassasoftware noemt Mollie niet op de prijspagina; daarvoor heb je een koppeling met een kassasysteem nodig. Zoek je alleen een goedkoop pinapparaat, vergelijk dan met <a href="/aanbieders/sumup/">SumUp</a> (${pct(A.sumup.plannen[0].pct)} zonder abonnement) of <a href="/aanbieders/ccv/">CCV</a> (${eur(A.ccv.plannen[0].vast)} per betaling). Meer in <a href="/goedkoopste-pinautomaat/">de goedkoopste pinautomaat</a>.</p>`],
    ],
    faq: [
      ['Hoe snel krijg ik mijn geld bij Mollie?', 'Je kiest zelf: dagelijks, wekelijks of maandelijks. Met de zakelijke rekening van Mollie staan pinbetalingen volgens Mollie binnen 24 uur op je rekening.'],
      ['Wat kost een pinautomaat van Mollie?', 'De Tap-terminal kost normaal € 95, de mobiele en de vaste POS-terminal € 350, plus volgens Mollie vanaf € 20 per maand per actieve terminal. Op 23 oktober 2026 gaf Mollie 50% korting op de Tap-terminal en de mobiele terminal. Met Tap to Pay op je iPhone of Android-telefoon heb je geen terminal nodig.'],
      ['Wanneer is Mollie Pro voordeliger?', 'Mollie noemt Pro de beste keuze vanaf € 2.000 per maand. Of dat voor jou klopt, hangt af van de passen van je klanten: met Maestro en V PAY loont Pro sneller dan met andere consumentenkaarten, zoals Debit Mastercard en Visa Debit.'],
    ],
  },
};
