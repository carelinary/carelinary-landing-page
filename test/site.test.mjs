import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

test('launch page has one form before FAQ and the five concept videos', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.filter(id => id === 'interest-form').length, 1);
  assert.ok(ids.indexOf('waiting-list') < ids.indexOf('faq'));
  assert.ok(html.includes('id="privacy-dialog"'));
  assert.ok(html.includes('id="thankyou-dialog"'));
  assert.ok(html.includes('href="favicon.png"'));
  assert.ok(!html.includes('Ini adalah demo yang belum mengirim'));
  assert.deepEqual(ids.filter((id, index) => ids.indexOf(id) !== index), []);
  const assets = await readdir(new URL('../assets/', import.meta.url));
  assert.equal(assets.filter(file => /^scene-0[1-5].*\.mp4$/.test(file)).length, 5);
  assert.ok(html.includes('Nutrisi yang tepat,<br>diracik dengan <em>cita rasa.</em>'));
  assert.ok(html.indexOf('class="hero-actions"') < html.indexOf('class="hero-proof"'));
  assert.ok(html.includes('class="hero-stars"'));
  assert.ok(html.includes('4,5<span>/5</span>'));
  assert.ok(html.includes('100 responden menunjukkan kepuasan terhadap menu, rasa, dan kesesuaian kebutuhan'));
  assert.ok(html.includes('Simulasi survei kepuasan'));
  assert.ok(!html.includes('Data simulasi tugas RevoU'));
  assert.ok(!html.includes('Data ilustratif, bukan hasil survei nyata.'));
  assert.equal((html.match(/class="macro-grid"/g) || []).length, 3);
  assert.equal(ids.filter(id => id === 'tentang').length, 1);
  assert.equal(ids.filter(id => id === 'program').length, 1);
  assert.ok(!ids.includes('tantangan'));
  assert.ok(!ids.includes('kondisi'));
  for (const label of ['GERD Care', 'Diabetes / gula darah', 'Hipertensi / tekanan darah', 'Kolesterol tinggi']) {
    assert.ok(html.includes(label));
  }
  assert.ok(html.includes('Bagaimana satu menu dipertimbangkan?'));
  assert.ok(html.includes('kebutuhan karbohidrat, informasi tentang alergi, obat, aktivitas'));
  assert.ok(!html.includes('CONTOH PROSES PENILAIAN MENU'));
  assert.ok(!html.includes('Ini contoh alur penilaian yang direncanakan'));
  for (const field of ['name', 'email', 'phone', 'address', 'program', 'duration', 'meals']) {
    assert.ok(html.includes(`name="${field}"`));
  }
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+|(?:styles|enhancements)\.css|(?:script)\.js|favicon\.png|privacy\.html)"/g)) {
    await access(new URL(`../${match[1]}`, import.meta.url));
  }
});
