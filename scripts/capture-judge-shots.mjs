// Capture steady-state Home screenshots for design-judge review. Development only.
import { mkdirSync, writeFileSync } from 'node:fs';
import { openPreview, root } from './browser.mjs';

const outDir = root + '.local/qa/shots/';
mkdirSync(outDir, { recursive: true });
const { browser, baseURL, close } = await openPreview();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const ready = () => page.waitForFunction(() => window.ShoreQA && ShoreQA.ready(), null, { timeout: 15000 });
await page.goto(baseURL + '/');
await ready();
await page.waitForTimeout(400);
const shots = [
  ['home-dock-soft', { bg: 'photo', layout: 'dock', focus: 'glass', material: 'soft', controls: 'both' }],
  ['home-dock-frost', { bg: 'photo', layout: 'dock', focus: 'glass', material: 'frost', controls: 'icons' }],
  ['home-list-tint', { bg: 'photo', layout: 'list', focus: 'glass', material: 'tint', controls: 'text' }],
  ['home-dark', { bg: 'dark', layout: 'dock', focus: 'glass', material: 'soft', controls: 'both' }]
];
for (const [name, look] of shots) {
  await page.evaluate(l => ShoreQA.look(l), look);
  await ready();
  await page.waitForTimeout(500);
  writeFileSync(outDir + name + '.png', await page.screenshot());
  console.log('captured ' + name);
}
await close();
console.log('done');
