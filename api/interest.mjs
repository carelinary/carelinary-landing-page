const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const instagram = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9_.]{1,30}$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
function enabled() {
  return Boolean(process.env.GOOGLE_APPS_SCRIPT_URL &&
    process.env.APPS_SCRIPT_SHARED_SECRET &&
    process.env.REGISTRATION_ENABLED === 'true' &&
    process.env.PRIVACY_APPROVED === 'true');
}
export function GET() { return json({ enabled: enabled() }); }

export async function POST(request) {
  if (!enabled()) return json({ error: 'Pendaftaran belum dibuka.' }, 503);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Permintaan ditolak.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Format data tidak sesuai.' }, 415);

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 1500) return json({ error: 'Data terlalu panjang.' }, 413);
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid JSON');
  } catch { return json({ error: 'Data tidak dapat dibaca.' }, 400); }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const instagramUsername = typeof body.instagram_username === 'string'
    ? body.instagram_username.trim().replace(/^@/, '') : '';
  if (!uuid.test(body.submission_id || '') || name.length < 2 || name.length > 100 ||
      !instagram.test(instagramUsername)) {
    return json({ error: 'Mohon periksa kembali nama dan username Instagram.' }, 400);
  }

  const payload = {
    secret: process.env.APPS_SCRIPT_SHARED_SECRET,
    submission_id: body.submission_id,
    submitted_at_utc: new Date().toISOString(),
    name,
    instagram_username: instagramUsername
  };
  try {
    const upstream = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload), redirect: 'follow', signal: AbortSignal.timeout(25000)
    });
    if (!upstream.ok) return json({ error: 'Pendaftaran belum dapat disimpan. Coba lagi nanti.' }, 502);
    const result = await upstream.json();
    if (result.ok !== true || result.submission_id !== body.submission_id) {
      return json({ error: 'Penyimpanan belum terkonfirmasi. Coba lagi nanti.' }, 502);
    }
    return json({ ok: true, submission_id: body.submission_id });
  } catch {
    return json({ error: 'Pendaftaran belum dapat disimpan. Coba lagi nanti.' }, 502);
  }
}
