// Deploy this version after the site preview has been checked.
// Script Properties: SPREADSHEET_ID, SHARED_SECRET, NOTIFICATION_EMAIL.
// Existing WaitingList records are preserved. New leads go to "Leads Brief".
const SHEET_NAME = 'Leads Brief';
const HEADERS = ['submission_id', 'submitted_at_utc', 'name', 'instagram_username', 'submitted_at_wib'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INSTAGRAM = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9_.]{1,30}$/;

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function safeCell(value) {
  var text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function formatWib(utcTimestamp) {
  return Utilities.formatDate(new Date(utcTimestamp), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
}
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (typeof raw !== 'string' || raw.length > 2000) return reply({ ok: false, error: 'invalid_request' });
    var body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ ok: false, error: 'invalid_request' });
    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty('SHARED_SECRET');
    var sheetId = properties.getProperty('SPREADSHEET_ID');
    if (!secret || !sheetId || body.secret !== secret) return reply({ ok: false, error: 'unauthorized' });

    var name = typeof body.name === 'string' ? body.name.trim() : '';
    var instagramUsername = typeof body.instagram_username === 'string' ? body.instagram_username.trim().replace(/^@/, '') : '';
    if (!UUID.test(body.submission_id || '') || name.length < 2 || name.length > 100 ||
        !INSTAGRAM.test(instagramUsername) ||
        typeof body.submitted_at_utc !== 'string' || isNaN(Date.parse(body.submitted_at_utc))) {
      return reply({ ok: false, error: 'invalid_fields' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var spreadsheet = SpreadsheetApp.openById(sheetId);
      var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
      var headers = sheet.getRange(1, 1, 1, 4).getDisplayValues()[0];
      for (var i = 0; i < 4; i++) {
        if (headers[i] !== HEADERS[i]) return reply({ ok: false, error: 'headers_mismatch' });
      }
      var wibHeader = sheet.getRange(1, 5).getDisplayValue();
      if (wibHeader && wibHeader !== HEADERS[4]) return reply({ ok: false, error: 'headers_mismatch' });
      if (!wibHeader) sheet.getRange(1, 5).setValue(HEADERS[4]);
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var existing = sheet.getRange(2, 1, lastRow - 1, 1)
          .createTextFinder(body.submission_id).matchEntireCell(true).findNext();
        if (existing) return reply({ ok: true, submission_id: body.submission_id, duplicate: true });
      }
      sheet.appendRow([body.submission_id, body.submitted_at_utc, safeCell(name), safeCell(instagramUsername), formatWib(body.submitted_at_utc)]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    var notified = false;
    try {
      MailApp.sendEmail({
        to: properties.getProperty('NOTIFICATION_EMAIL') || 'carelinaryfoodcatering@gmail.com',
        subject: 'Pendaftar waiting list Carelinary',
        body: 'Pendaftar pra-peluncuran baru telah disimpan di Google Sheet privat.\n\n' +
          'Nama: ' + name + '\nInstagram: @' + instagramUsername +
          '\nReferensi: ' + body.submission_id
      });
      notified = true;
    } catch (ignored) { /* Sheet write remains authoritative. */ }
    return reply({ ok: true, submission_id: body.submission_id, notified: notified });
  } catch (ignored) {
    return reply({ ok: false, error: 'write_failed' });
  }
}
