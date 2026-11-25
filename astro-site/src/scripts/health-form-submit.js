// Sends the long-term health insurance questionnaire (EN + FR) to n8n,
// which appends one row per submission to the "AG Insurance – Health form
// submissions" Google Sheet.
//
// The payload keys are exactly the sheet's column headers, so the n8n
// Google Sheets node can map each column to the field of the same name.
// It is sent as application/x-www-form-urlencoded with mode "no-cors": a
// "simple" request needs no CORS preflight, and n8n parses it into $json.body.

export const HEALTH_FORM_WEBHOOK_URL =
  'https://n8n.srv873866.hstgr.cloud/webhook/bbf6bb42-9b7e-4bed-b537-a66d77798666';

// Radio/checkbox values are the same codes on the EN and FR pages; write
// them to the sheet in English so every row reads the same way.
const LABELS = {
  who: {
    myself: 'Just myself',
    spouse: 'Myself + spouse',
    family: 'Family',
    children: 'Children only',
  },
  timing: {
    immediately: 'Immediately',
    '30days': 'Within 30 days',
    '1to3months': 'In 1–3 months',
    comparing: 'Just comparing options',
  },
  hasCurrentInsurance: { yes: 'Yes', no: 'No' },
  coverageArea: {
    cambodia: 'Cambodia only',
    sea: 'Southeast Asia',
    'worldwide-ex-usa': 'Worldwide excluding USA',
    'worldwide-inc-usa': 'Worldwide including USA',
  },
  benefitsTier: {
    hospitalisation: 'Hospitalisation',
    'hosp-outpatient': 'Hospitalisation + Outpatient',
    'hosp-outpatient-maternity': 'Hospitalisation + Outpatient + Maternity',
    'hosp-outpatient-maternity-dental-vision':
      'Hospitalisation + Outpatient + Maternity + Dental + Vision',
  },
  medical: {
    diabetes: 'Diabetes',
    heart: 'Heart disease',
    cancer: 'Cancer',
    bloodpressure: 'High blood pressure',
    asthma: 'Asthma',
    none: 'None of the above',
    'prefer-not-to-say': 'Prefer not to say',
  },
};

function label(group, value) {
  if (!value) return '';
  return (LABELS[group] && LABELS[group][value]) || value;
}

function text(form, name) {
  const el = form.elements.namedItem(name);
  return el && 'value' in el ? String(el.value).trim() : '';
}

function checked(form, name) {
  const el = form.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : '';
}

// Family members are added dynamically as familyName1/familyDob1/
// familyRelationship1, … ; rows can be removed, so numbers may have gaps.
function familyMembers(form) {
  const rows = [];
  form.querySelectorAll('.family-member').forEach(function (row) {
    const parts = ['familyName', 'familyDob', 'familyRelationship'].map(function (prefix) {
      const input = row.querySelector('input[name^="' + prefix + '"]');
      return input ? input.value.trim() : '';
    }).filter(Boolean);
    if (parts.length) rows.push(parts.join(', '));
  });
  return rows.join('; ');
}

export function buildHealthFormPayload(form, lang) {
  const who = checked(form, 'who');
  const hasInsurance = checked(form, 'hasCurrentInsurance');
  const medical = Array.prototype.map.call(
    form.querySelectorAll('input[name="medical"]:checked'),
    function (el) { return label('medical', el.value); }
  ).join(', ');

  return {
    'Submitted at': new Date().toISOString(),
    'Language': lang === 'fr' ? 'FR' : 'EN',
    'Source page': window.location.origin + window.location.pathname,
    'First name': text(form, 'firstName'),
    'Last name': text(form, 'lastName'),
    'Email': text(form, 'email'),
    'Phone': text(form, 'phone'),
    'Nationality': text(form, 'nationality'),
    'Country of residence': text(form, 'residence'),
    'City': text(form, 'city'),
    'Date of birth / age': text(form, 'dob'),
    'Who needs cover': label('who', who),
    'Spouse date of birth / age': who === 'spouse' ? text(form, 'spouseDob') : '',
    'Family members': who === 'family' ? familyMembers(form) : '',
    'When needed': label('timing', checked(form, 'timing')),
    'Has current insurance': label('hasCurrentInsurance', hasInsurance),
    'Current insurer': hasInsurance === 'yes' ? text(form, 'currentInsurer') : '',
    'Renewal date': hasInsurance === 'yes' ? text(form, 'renewalDate') : '',
    'Coverage area': label('coverageArea', checked(form, 'coverageArea')),
    'Benefits level': label('benefitsTier', checked(form, 'benefitsTier')),
    'Medical conditions (past 5 years)': medical,
    'How they heard about us': text(form, 'source'),
  };
}

// Resolves when the request has left the browser; rejects on a network
// failure (offline, DNS, blocked). With no-cors the response is opaque, so
// an n8n-side error can't be seen here; check n8n's Executions list.
export function submitHealthForm(form, lang) {
  const body = new URLSearchParams(buildHealthFormPayload(form, lang));
  return fetch(HEALTH_FORM_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body,
  });
}
