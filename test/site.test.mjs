import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

test('launch page has a two-field form in the hero and five concept videos', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.filter(id => id === 'interest-form').length, 1);
  assert.ok(ids.indexOf('waiting-list') < ids.indexOf('tentang'));
  assert.ok(html.includes('id="privacy-dialog"'));
  assert.ok(html.includes('id="thankyou-dialog"'));
  assert.ok(html.includes('href="favicon.png"'));
  assert.ok(!html.includes('Ini adalah demo yang belum mengirim'));
  assert.deepEqual(ids.filter((id, index) => ids.indexOf(id) !== index), []);
  const assets = await readdir(new URL('../assets/', import.meta.url));
  assert.equal(assets.filter(file => /^scene-0[1-5].*\.mp4$/.test(file)).length, 5);
  assert.ok(html.includes('Nutrisi yang tepat,<br>diracik dengan <em>cita rasa.</em>'));
  assert.ok(!html.includes('hero-proof'));
  assert.ok(!html.includes('4,5<span>/5</span>'));
  assert.ok(!html.includes('Simulasi survei kepuasan'));
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
  assert.ok(!html.includes('Bagaimana satu menu dipertimbangkan?'));
  assert.ok(html.includes('Harus menjaga pola makan karena kondisi kesehatan'));
  assert.ok(html.includes('Carelinary menghadirkan <em>2 fokus program.</em>'));
  assert.ok(html.includes("What we've created for you."));
  assert.ok(html.includes('Why Carelinary?'));
  assert.ok(html.includes('100 pendaftar pertama dapat voucher makanan Rp100.000!'));
  assert.ok(!html.includes('id="film-toggle"'));
  assert.ok(!html.includes('Jeda video'));
  assert.ok(!html.includes('pra-peluncuran'));
  assert.ok(!html.includes('Demo website untuk pengembangan'));
  assert.ok(html.includes('<option value="3">Breakfast + Lunch + Dinner</option>'));
  for (const question of [
    'Apa itu Carelinary?', 'Kapan Carelinary dibuka?',
    'Kapan dihubungi ketika sudah mendaftar?',
    'Saya memiliki alergi, apakah aman untuk mengonsumsi menu Carelinary?',
    'Bagaimana cara pemesanan dan membership?', 'Berapa harga Carelinary?'
  ]) assert.ok(html.includes(question));
  assert.ok(!html.includes('CONTOH PROSES PENILAIAN MENU'));
  assert.ok(!html.includes('Ini contoh alur penilaian yang direncanakan'));
  for (const field of ['name', 'instagram_username']) {
    assert.ok(html.includes(`name="${field}"`));
  }
  assert.equal((html.match(/<input\b[^>]*name="[^"]+"/g) || []).length, 2);
  assert.ok(html.indexOf('data-open-privacy>Kebijakan Privasi') > html.indexOf('</form>'));
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+|(?:styles|enhancements)\.css|(?:script)\.js|favicon\.png|privacy\.html)"/g)) {
    await access(new URL(`../${match[1]}`, import.meta.url));
  }
});
