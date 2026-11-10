// Paste into Extensions > Apps Script of a PRIVATE Google Sheet.
// Script Properties: SPREADSHEET_ID, SHARED_SECRET, NOTIFICATION_EMAIL.
const HEADERS = [
  'submission_id', 'submitted_at_utc', 'name', 'email', 'phone', 'delivery_area_or_address',
  'interested_program', 'interested_duration', 'meals_per_day', 'consent_to_contact', 'consent_text_version', 'source'
];
const PROGRAMS = ['gerd', 'cardiometabolic', 'other'];
const MEALS = ['1', '2', '3', 'consult'];
const DURATIONS = ['5', '10', 'consult'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function safeCell(value) {
  var text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (typeof raw !== 'string' || raw.length > 7000) return reply({ ok: false, error: 'invalid_request' });
    var body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ ok: false, error: 'invalid_request' });
    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty('SHARED_SECRET');
    var sheetId = properties.getProperty('SPREADSHEET_ID');
    if (!secret || !sheetId || body.secret !== secret) return reply({ ok: false, error: 'unauthorized' });

    var name = typeof body.name === 'string' ? body.name.trim() : '';
    var email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    var phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    var address = typeof body.address === 'string' ? body.address.trim() : '';
    var digits = phone.replace(/\D/g, '');
    if (!UUID.test(body.submission_id || '') ||
        name.length < 2 || name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        digits.length < 8 || digits.length > 15 || phone.length > 24 || !/^[+0-9()\s-]+$/.test(phone) ||
        address.length < 5 || address.length > 400 ||
        PROGRAMS.indexOf(body.program) < 0 || DURATIONS.indexOf(body.duration) < 0 || MEALS.indexOf(body.meals) < 0 ||
        body.consent !== true || body.consent_text_version !== 'waiting-list-v1' ||
        typeof body.submitted_at_utc !== 'string' || isNaN(Date.parse(body.submitted_at_utc))) {
      return reply({ ok: false, error: 'invalid_fields' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('WaitingList');
      if (!sheet) return reply({ ok: false, error: 'sheet_missing' });
      var headers = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
      for (var i = 0; i < HEADERS.length; i++) {
        if (headers[i] !== HEADERS[i]) return reply({ ok: false, error: 'headers_mismatch' });
      }
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var existing = sheet.getRange(2, 1, lastRow - 1, 1)
          .createTextFinder(body.submission_id).matchEntireCell(true).findNext();
        if (existing) return reply({ ok: true, submission_id: body.submission_id, duplicate: true });
      }
      sheet.appendRow([
        body.submission_id, body.submitted_at_utc, safeCell(name), safeCell(email),
        safeCell(phone), safeCell(address), body.program, body.duration, body.meals, 'yes',
        body.consent_text_version, 'carelinary.my.id'
      ]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    // Sheet write is authoritative. Email failure does not erase the registration.
    var notifyTo = properties.getProperty('NOTIFICATION_EMAIL') || 'carelinaryfoodcatering@gmail.com';
    var notified = false;
    try {
      MailApp.sendEmail({
        to: notifyTo,
        subject: 'Pendaftar waiting list Carelinary',
        body: 'Pendaftar baru telah disimpan di Google Sheet privat.\n\n' +
          'Nama: ' + name + '\nEmail: ' + email + '\nTelepon: ' + phone +
          '\nArea/alamat: ' + address + '\nProgram: ' + body.program +
          '\nDurasi: ' + body.duration +
          '\nPilihan makan: ' + body.meals + '\nReferensi: ' + body.submission_id
      });
      notified = true;
    } catch (ignored) { /* Check Sheet even if email quota or authorization fails. */ }
    return reply({ ok: true, submission_id: body.submission_id, notified: notified });
  } catch (ignored) {
    // Never log names, health interests, addresses, or secrets.
    return reply({ ok: false, error: 'write_failed' });
  }
}
