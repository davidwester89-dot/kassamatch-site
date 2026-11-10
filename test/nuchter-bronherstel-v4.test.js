import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('SC-v4: myPOS en Shopify zijn expliciet de bron van de drie claims', () => {
  assert.ok(readFileSync('dist/mypos-vs-sumup/index.html','utf8').includes('myPOS levert een rekening met IBAN mee'));
  const h=readFileSync('dist/aanbieders/shopify-pos/index.html','utf8');
  assert.ok(h.includes('Op de prijspagina noemt Shopify onder meer een beperkt aantal medewerkers met toegang tot POS'));
  assert.ok(h.includes('Shopify zegt dat POS in bijna elk land werkt'));
});
