const https = require('https');
const querystring = require('querystring');

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'sistian@foxmail.com';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@mediescortchina.com';
const SUCCESS_URL = process.env.SUCCESS_URL || 'https://www.mediescortchina.com/thank-you.html';
const REPLY_TO_FIELD = process.env.REPLY_TO_FIELD || 'email';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim()).filter(Boolean);

function getOrigin(req) {
  const requestOrigin = req.headers.origin || req.headers.referer || '';
  if (ALLOWED_ORIGINS.includes('*')) return '*';
  if (ALLOWED_ORIGINS.includes(requestOrigin)) return requestOrigin;
  return ALLOWED_ORIGINS[0] || '*';
}

function setCorsHeaders(res, req) {
  res.setHeader('Access-Control-Allow-Origin', getOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatLabel(key) {
  // Convert snake_case and camelCase to readable labels
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getSubmitterName(data) {
  const first = data.first_name || data.firstName || data.firstname || '';
  const last = data.last_name || data.lastName || data.lastname || '';
  if (first.trim() || last.trim()) return `${first} ${last}`.trim();
  return data.name || '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

const serviceLabels = {
  'health-checkup': 'Health Checkup',
  'health-checkup-vip': 'VIP Health Checkup',
  'dental': 'Dental Treatment',
  'tcm': 'TCM Wellness',
  'acupuncture': 'Acupuncture',
  'fertility': 'Fertility / IVF',
  'aesthetic': 'Aesthetic Medicine',
  'womens-health': "Women's Health",
  'cardiac': 'Cardiac Care',
  'orthopedic': 'Orthopedic Care',
  'oncology': 'Oncology / Cancer Treatment',
  'cancer-screening': 'Cancer Screening',
  'surgery': 'Surgery',
  'surgical-robot': 'Surgical Robot Procedure',
  'car-t': 'CAR-T Therapy',
  'other': 'Other Service'
};

function buildSubject(data) {
  if (data._subject && String(data._subject).trim()) {
    return String(data._subject).trim();
  }
  let label = '';
  if (data.booking_type && String(data.booking_type).trim()) {
    label = String(data.booking_type).trim();
  } else if (data.service && String(data.service).trim()) {
    label = serviceLabels[data.service] || data.service;
  }
  const name = getSubmitterName(data);
  const parts = [];
  if (label) parts.push(label);
  if (name) parts.push(`from ${name}`);
  if (parts.length === 0) return 'New MediEscortChina Submission';
  return `${parts.join(' ')} - MediEscortChina`;
}

function buildEmail(data) {
  const hidden = new Set(['_next', '_subject', '_template', '_captcha', '_replyto', '_cc', 'website', '_honey']);
  const entries = Object.entries(data).filter(([k, v]) => {
    if (hidden.has(k)) return false;
    if (v === undefined || v === null) return false;
    if (Array.isArray(v)) return true;
    if (typeof v === 'string' && v.trim() === '') return false;
    return true;
  });

  const rows = entries.map(([k, v]) => {
    const label = formatLabel(k);
    const value = Array.isArray(v) ? v.join(', ') : String(v);
    return `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`;
  }).join('');

  const html = `<h2>New MediEscortChina Submission</h2><table border="1" cellpadding="6" style="border-collapse:collapse">${rows}</table>`;
  const plain = entries.map(([k, v]) => {
    const label = formatLabel(k);
    const value = Array.isArray(v) ? v.join(', ') : String(v);
    return `${label}: ${value}`;
  }).join('\n');
  return { html, plain };
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, req);
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    setCorsHeaders(res, req);
    res.statusCode = 405;
    return res.end('Method Not Allowed');
  }

  const body = await getBody(req);

  // Body size limit (100 KB)
  if (body.length > 100 * 1024) {
    setCorsHeaders(res, req);
    res.statusCode = 413;
    return res.end('Payload too large');
  }

  const data = querystring.parse(body);

  // Honeypot: silently succeed if a bot filled the hidden field
  if ((data.website && String(data.website).trim()) || (data._honey && String(data._honey).trim())) {
    setCorsHeaders(res, req);
    res.writeHead(302, { Location: SUCCESS_URL });
    return res.end();
  }

  if (!data.email || String(data.email).trim() === '') {
    setCorsHeaders(res, req);
    res.statusCode = 400;
    return res.end('Email is required');
  }

  if (!isValidEmail(data.email)) {
    setCorsHeaders(res, req);
    res.statusCode = 400;
    return res.end('Invalid email address');
  }

  if (!SENDGRID_API_KEY) {
    setCorsHeaders(res, req);
    res.statusCode = 503;
    return res.end('Email service is not configured. Set SENDGRID_API_KEY in the Vercel dashboard.');
  }

  const subject = buildSubject(data);
  const { html, plain } = buildEmail(data);

  const payload = {
    personalizations: [{ to: [{ email: RECIPIENT_EMAIL }] }],
    from: { email: SENDGRID_FROM_EMAIL },
    subject,
    content: [
      { type: 'text/plain', value: plain },
      { type: 'text/html', value: html }
    ]
  };

  const replyTo = data[REPLY_TO_FIELD] && String(data[REPLY_TO_FIELD]).trim();
  if (replyTo) {
    payload.reply_to = { email: replyTo };
  }

  const postData = JSON.stringify(payload);
  const request = https.request({
    hostname: 'api.sendgrid.com',
    port: 443,
    path: '/v3/mail/send',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + SENDGRID_API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (response) => {
    let responseBody = '';
    response.on('data', chunk => responseBody += chunk);
    response.on('end', () => {
      setCorsHeaders(res, req);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        res.writeHead(302, { Location: SUCCESS_URL });
        return res.end();
      }
      res.statusCode = 502;
      res.end('SendGrid error: ' + responseBody);
    });
  });
  request.on('error', (err) => {
    setCorsHeaders(res, req);
    res.statusCode = 502;
    res.end('Request failed: ' + err.message);
  });
  request.write(postData);
  request.end();
};
