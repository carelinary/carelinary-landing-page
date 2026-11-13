import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

test('review page has its media, two-field form, and privacy dialog', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids.filter((id, index) => ids.indexOf(id) !== index), []);
  assert.equal(ids.filter(id => id === 'interest-form').length, 1);
  assert.ok(ids.indexOf('waiting-list') < ids.indexOf('faq'));
  assert.ok(html.includes('id="privacy-dialog"'));
  assert.ok(html.includes('id="thankyou-dialog"'));
  assert.ok(html.includes('name="name"'));
  assert.ok(html.includes('name="instagram_username"'));
  assert.ok(!html.includes('name="email"'));
  const assets = await readdir(new URL('../assets/', import.meta.url));
  assert.equal(assets.filter(file => /^scene-0[1-5].*\.mp4$/.test(file)).length, 5);
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+|(?:styles|enhancements)\.css|(?:script)\.js|favicon\.png|privacy\.html)"/g)) {
    await access(new URL(`../${match[1]}`, import.meta.url));
  }
});
