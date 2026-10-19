# og:image (1200x630) per pagina en favicons. HTML -> PNG met headless Chrome. Geen foto's, geen personen.
import subprocess, os, tempfile, json
from PIL import Image
B='#8a2d6b';D='#161b2e';S='#f4ecf1';BG='#fbf8fa';G='#3d2346';P='#e2c6d7'
LOGO='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#8a2d6b"/><rect x="12" y="8" width="16" height="25" rx="3" fill="#fff"/><rect x="15" y="11" width="10" height="7" rx="1.5" fill="#8a2d6b"/><path d="m15.5 25 3 3 6-6" fill="none" stroke="#8a2d6b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="8" r="4" fill="#e7a33e"/></svg>'
cards={
 'home':('Welke pinautomaat of kassa past bij jou?','SumUp · myPOS · Zettle · Mollie · CCV · Lightspeed · Shopify POS · unTill · Mplus'),
 'match':('Doe de KassaMatch','6 vragen, je top 3 met kosten'),
 'pin':('Pinautomaat vergelijken','Kosten per maand bij jouw aantal betalingen'),
 'kassa':('Kassasysteem vergelijken','Prijzen voor winkel en horeca'),
 'aanbieders':('Alle aanbieders','Pinautomaten en kassasystemen met bron'),
 'gidsen':('Gidsen over pinnen en kassa\'s','Rekenvoorbeelden en regels'),
 'a-sumup':('SumUp','Kosten, tarieven en pinapparaten'),
 'a-mypos':('myPOS','Kosten, tarieven en pinapparaten'),
 'a-zettle':('Zettle (PayPal)','Kosten, tarieven en pinapparaten'),
 'a-mollie':('Mollie','Kosten, tarieven en terminals'),
 'a-ccv':('CCV','Kosten en tarieven'),
 'a-lightspeed':('Lightspeed','Prijzen retail en horeca'),
 'a-shopify':('Shopify POS','Prijzen en voor wie het past'),
 'a-untill':('unTill','Prijzen en voor wie het past'),
 'a-mplus':('MplusKASSA','Op offerte: wat je wel weet'),
 'vs-sumup-zettle':('SumUp of Zettle?','Wat is goedkoper voor jou'),
 'goedkoopste':('Goedkoopste pinautomaat 2026','Wat kost pinnen echt?'),
 'kiezen':('Kassasysteem kiezen','Wat heb je nodig?'),
 'transactie':('Transactiekosten vergelijken','Percentage of vast bedrag?'),
}
art=f'<svg viewBox="0 0 300 300" width="300" height="300"><rect x="70" y="30" width="150" height="240" rx="22" fill="#fff" stroke="{D}" stroke-width="6"/><rect x="92" y="54" width="106" height="70" rx="8" fill="{B}"/>'+''.join(f'<rect x="{92+c*38}" y="{142+r*30}" width="30" height="22" rx="5" fill="{P if (r+c)%2 else "#ecdde6"}"/>' for r in range(3) for c in range(3))+f'<circle cx="236" cy="58" r="28" fill="{G}"/><path d="m223 59 9 9 18-18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
tmp=tempfile.mkdtemp()
def shot(html,out,w,h):
    f=os.path.join(tmp,'p.html');open(f,'w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--window-size={w},{h}',f'--screenshot={out}','file://'+f],capture_output=True,check=True)
os.makedirs('src/assets/og',exist_ok=True);os.makedirs('src/assets/icons',exist_ok=True)
import sys
only=set(sys.argv[1:])  # optioneel: alleen deze kaarten maken, bv. python3 scripts/images.py blog
for k,(t,sub) in cards.items():
    if only and k not in only: continue
    html=f'''<html><body style="margin:0;width:1200px;height:630px;background:{BG};font-family:'DejaVu Sans',sans-serif;overflow:hidden">
<div style="position:absolute;left:0;top:0;width:1200px;height:18px;background:{B}"></div>
<div style="position:absolute;left:72px;top:70px;display:flex;align-items:center;gap:16px;font-size:40px;font-weight:700;color:{D}"><div style="width:64px;height:64px">{LOGO}</div><span>Kassa<span style="color:{B}">Match</span>.nl</span></div>
<div style="position:absolute;left:72px;top:190px;width:700px;font-size:{64 if len(t)<28 else 54}px;line-height:1.12;font-weight:800;color:{D}">{t}</div>
<div style="position:absolute;left:72px;bottom:80px;width:720px;font-size:30px;color:{G};font-weight:700">{sub}</div>
<div style="position:absolute;right:70px;top:170px;background:{S};border-radius:28px;padding:20px">{art}</div></body></html>'''
    shot(html,f'src/assets/og/{k}.png',1200,630)
if not only: open('src/assets/icons/favicon.svg','w').write(LOGO)
for size,name in (() if only else ((32,'favicon-32.png'),(180,'apple-touch-icon.png'))):
    shot(f'<html><body style="margin:0;width:{size}px;height:{size}px">{LOGO.replace("<svg ",f"<svg width=\"{size}\" height=\"{size}\" ")}</body></html>',f'src/assets/icons/{name}',size,size)
print('ok',len(cards))
