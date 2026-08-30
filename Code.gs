/**
 * RanchAssist™ Cattle Profit Calculator
 * Google Apps Script server functions.
 * Tool ID: cattle-profit-calculator
 * Tool version: 1.0.0
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Cattle Profit Calculator | RanchAssist™')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/**
 * Sends a user-requested financial summary by email.
 * No project state is persisted server-side.
 */
function sendProfitSummaryEmail(payload) {
  payload = payload || {};
  var recipient = String(payload.recipient || '').trim();
  var subject = cleanText_(payload.subject || 'RanchAssist Cattle Profit Calculator Summary', 180);
  var projectName = cleanText_(payload.projectName || 'Cattle Profit Model', 160);
  var summary = cleanText_(payload.summary || '', 12000);
  var mode = cleanText_(payload.mode || '', 100);
  var generatedAt = cleanText_(payload.generatedAt || '', 80);

  if (!isValidEmail_(recipient)) {
    throw new Error('Enter a valid email address.');
  }
  if (!summary) {
    throw new Error('The calculation summary is empty.');
  }

  var htmlBody = [
    '<div style="font-family:Arial,sans-serif;color:#171715;line-height:1.55;max-width:720px;margin:0 auto">',
      '<div style="border-bottom:1px solid #DEDED8;padding:18px 0;margin-bottom:24px">',
        '<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#666660">RanchAssist™</div>',
        '<h1 style="font-size:24px;margin:6px 0 0">Cattle Profit Calculator</h1>',
      '</div>',
      '<p style="font-size:16px"><strong>', escapeHtml_(projectName), '</strong></p>',
      '<p style="font-size:13px;color:#666660">', escapeHtml_(mode), generatedAt ? ' · ' + escapeHtml_(generatedAt) : '', '</p>',
      '<div style="white-space:pre-wrap;background:#F7F7F4;border:1px solid #DEDED8;border-radius:10px;padding:18px;margin:20px 0">', escapeHtml_(summary), '</div>',
      '<p style="font-size:12px;color:#666660;border-top:1px solid #DEDED8;padding-top:16px">Planning estimate only. Results depend on the assumptions entered and are not financial advice or a market forecast.</p>',
    '</div>'
  ].join('');

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody,
    body: summary,
    name: 'RanchAssist™'
  });

  return { ok: true, message: 'Email sent.' };
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function cleanText_(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, maxLength || 5000);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
