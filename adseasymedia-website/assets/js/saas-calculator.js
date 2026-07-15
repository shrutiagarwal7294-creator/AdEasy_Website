/* AdsEasy Media — SaaS: Cost per Lead Calculator
 * Self-contained script scoped to the #cpl-calculator widget on
 * saas-marketing.html. Deliberately independent from
 * assets/js/calculators.js (tools.html), assets/js/re-calculator.js
 * (real estate) and assets/js/edu-calculator.js (education) so none
 * of these pages can affect each other.
 */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id, fb) { var v = parseFloat($(id) && $(id).value); return isFinite(v) ? v : (fb || 0); };
  var fmt = function (n, d) { return isFinite(n) ? Number(n.toFixed(d === undefined ? 0 : d)).toLocaleString() : '—'; };
  var money = function (n, d) { return '₹' + fmt(n, d); };

  var WHATSAPP_NUMBER = '917022948105';

  function calc() {
    var valEl = $('cpl-val');
    if (!valEl) return; // calculator markup not present on this page

    var spend = num('cpl-spend', 300000);
    var leads = Math.max(num('cpl-leads', 150), 0);
    var cpl = leads ? spend / leads : 0;

    valEl.textContent = leads ? money(cpl, 2) : '—';
    $('cpl-spend-out').textContent = money(spend);
    $('cpl-leads-out').textContent = fmt(leads);
  }

  ['cpl-spend', 'cpl-leads'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('input', calc);
  });

  function waLines(fields) {
    var spend = num('cpl-spend', 300000);
    var leads = Math.max(num('cpl-leads', 150), 0);
    var cpl = leads ? spend / leads : 0;
    var lines = [
      'Hi AdsEasy Media! I used the Cost per Lead calculator on your SaaS Industry page.',
      ''
    ];
    if (fields) lines.push('Name: ' + fields.name, 'Email: ' + fields.email, 'Phone: ' + fields.phone, '');
    lines.push(
      'Monthly spend: ' + money(spend),
      'Trial/demo signups generated: ' + fmt(leads),
      'My Cost per Lead: ' + (leads ? money(cpl, 2) : 'N/A'),
      '',
      "I'd like to know how to bring this down."
    );
    return lines;
  }

  function waUrl(fields) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waLines(fields).join('\n'));
  }

  var waBtn = $('cpl-whatsapp-btn');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      window.open(waUrl(), '_blank', 'noopener');
    });
  }

  calc();

  /* ---------- Lead gate: blur results until visitor submits their details ---------- */
  var LEAD_KEY = 'aem_lead_unlocked';

  function isUnlocked() {
    try { return localStorage.getItem(LEAD_KEY) === '1'; } catch (e) { return false; }
  }

  function applyLockState() {
    var unlocked = isUnlocked();
    var results = document.querySelector('.calc-results');
    if (results) results.classList.toggle('locked', !unlocked);
  }

  var modalOverlay = $('lead-modal');
  var leadForm = $('cpl-lead-form');

  document.querySelectorAll('.lead-gate-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (modalOverlay) modalOverlay.classList.add('show');
      var firstField = $('lead-name');
      if (firstField) firstField.focus();
    });
  });

  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = leadForm.querySelector('.hp-field input');
      if (hp && hp.value) return; // honeypot: silently drop bot submissions

      var ok = true;
      leadForm.querySelectorAll('[required]').forEach(function (inp) {
        var field = inp.closest('.field');
        var valid = inp.value.trim() !== '';
        if (valid && inp.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
        if (valid && inp.type === 'tel') valid = /^[+\d][\d\s\-()]{6,}$/.test(inp.value);
        if (field) field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;

      var fields = {
        name: $('lead-name').value.trim(),
        email: $('lead-email').value.trim(),
        phone: $('lead-phone').value.trim()
      };

      try { localStorage.setItem(LEAD_KEY, '1'); } catch (e) {}
      applyLockState();
      if (modalOverlay) modalOverlay.classList.remove('show');

      window.open(waUrl(fields), '_blank', 'noopener');

      leadForm.reset();
    });

    leadForm.querySelectorAll('[required]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var f = inp.closest('.field'); if (f) f.classList.remove('invalid');
      });
    });
  }

  applyLockState();
})();
