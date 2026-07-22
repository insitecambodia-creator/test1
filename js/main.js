(function () {
  // n8n Webhook URL for the quote form.
  var QUOTE_FORM_WEBHOOK_URL = 'https://n8n.srv873866.hstgr.cloud/webhook/quote-request';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  var dropdowns = document.querySelectorAll('.nav-dropdown');

  function closeDropdowns() {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('is-open');
      var trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!isOpen) closeDropdowns();
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        closeDropdowns();
      });
    });
  }

  // Nav dropdowns (desktop hover + click, mobile tap-to-expand)
  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove('is-open');
          var otherTrigger = other.querySelector('.nav-dropdown-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
  document.addEventListener('click', closeDropdowns);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdowns();
  });

  // Quote form tabs (visual only)
  var tabs = document.querySelectorAll('.quote-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  // Live phone formatting: strips anything but digits and a leading "+",
  // then groups digits with spaces as the person types (e.g. +855 12 345 678).
  // The +855 default for numbers typed without a "+" is applied once at
  // submit time (see formatPhoneForSubmit below) rather than live on every
  // keystroke, since re-deriving the country code on each keystroke breaks
  // as soon as the field already starts with "+" (which it does after the
  // very first character) — edits and corrections would then either wipe
  // the number or duplicate the "855" prefix.
  var phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var hasPlus = phoneInput.value.trim().charAt(0) === '+';
      var digits = phoneInput.value.replace(/\D/g, '');
      var groups = digits.match(/.{1,3}/g) || [];
      phoneInput.value = (hasPlus ? '+' : '') + groups.join(' ');
    });
  }

  // Applied once at submit time: guarantees the phone number that reaches
  // n8n/email/Sheets always has an international "+countrycode" prefix.
  // Numbers without an explicit "+" are treated as local Cambodian mobiles
  // (leading 0 dropped) and prefixed with +855; an explicit "+countrycode"
  // typed by the person (e.g. an expat's +33...) is preserved as-is.
  function formatPhoneForSubmit(raw) {
    var hasPlus = raw.trim().charAt(0) === '+';
    var digits = raw.replace(/\D/g, '');
    if (!hasPlus) {
      if (digits.length > 1 && digits.charAt(0) === '0') digits = digits.slice(1);
      digits = '855' + digits;
    }
    var groups = digits.match(/.{1,3}/g) || [];
    return digits ? '+' + groups.join(' ') : '';
  }

  // Quote form submit — posts to an n8n Webhook
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    // Honeypot field: invisible to people, tempting to bots. Injected via JS
    // so it doesn't need to be hand-added to every page's form markup.
    var honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'company_website';
    honeypot.autocomplete = 'off';
    honeypot.tabIndex = -1;
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.cssText = 'position:absolute; left:-9999px; width:1px; height:1px; opacity:0;';
    form.appendChild(honeypot);

    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Bot caught the honeypot — pretend success, submit nothing.
      if (honeypot.value) {
        status.textContent = 'Thanks! A broker will contact you within 24 hours.';
        status.className = 'form-status success';
        form.reset();
        return;
      }

      var activeTab = document.querySelector('.quote-tab.is-active');

      var payload = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: formatPhoneForSubmit(form.phone.value),
        message: form.message.value,
        insuranceType: activeTab ? activeTab.textContent.trim() : '',
        pageUrl: window.location.href,
        language: document.documentElement.lang || 'en',
        submittedAt: new Date().toISOString()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending&hellip;';
      }
      status.textContent = '';
      status.className = 'form-status';

      fetch(QUOTE_FORM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);

          // Health Insurance is always the first tab (language-independent —
          // labels differ between EN/FR, position doesn't). For that lead,
          // forward straight into the detailed health questionnaire instead
          // of showing the inline "thanks" message, carrying the contact
          // details over via the URL so the person doesn't retype them.
          if (activeTab === tabs[0]) {
            var params = new URLSearchParams({
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              phone: payload.phone
            });
            window.location.href = '/health-insurance-cambodia/long-term-insurance-cambodia-for-expats/form/index.html?' + params.toString();
            return;
          }

          status.textContent = 'Thanks! A broker will contact you within 24 hours.';
          status.className = 'form-status success';
          form.reset();
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please call us or message us on Telegram instead.';
          status.className = 'form-status error';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitLabel;
          }
        });
    });
  }
})();
