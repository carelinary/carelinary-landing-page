import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../api/interest.mjs';

const valid = {
  submission_id: '89d4ec16-21ab-47c8-bf0e-a32661b8a69c',
  name: 'Test Person', email: 'test@example.com', phone: '081234567890',
  address: 'BSD, Tangerang Selatan', program: 'gerd', duration: '5', meals: '1',
  consent: true, website: ''
};
function request(data = valid, origin = 'https://www.carelinary.my.id') {
  return new Request(`${origin}/api/interest`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify(data)
  });
}
function config() {
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/example/exec';
  process.env.APPS_SCRIPT_SHARED_SECRET = 'test-secret';
  process.env.REGISTRATION_ENABLED = 'true';
  process.env.PRIVACY_APPROVED = 'true';
}

test('registration remains disabled until all release gates are set', async () => {
  delete process.env.REGISTRATION_ENABLED;
  delete process.env.PRIVACY_APPROVED;
  assert.equal((await GET().json()).enabled, false);
});

test('rejects invalid input without calling Apps Script', async () => {
  config();
  const oldFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('should not be called'); };
  try {
    const response = await POST(request({ ...valid, consent: false }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'Mohon periksa kembali data formulir.');
  } finally { globalThis.fetch = oldFetch; }
});

test('shows success only after Apps Script confirms the same submission', async () => {
  config();
  const oldFetch = globalThis.fetch;
  let forwarded;
  globalThis.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return new Response(JSON.stringify({ ok: true, submission_id: forwarded.submission_id }), { status: 200 });
  };
  try {
    const response = await POST(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.equal(forwarded.email, 'test@example.com');
    assert.equal(forwarded.consent_text_version, 'waiting-list-v1');
  } finally { globalThis.fetch = oldFetch; }
});

test('does not show success when storage confirmation fails', async () => {
  config();
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: false }), { status: 200 });
  try {
    const response = await POST(request());
    assert.equal(response.status, 502);
  } finally { globalThis.fetch = oldFetch; }
});
