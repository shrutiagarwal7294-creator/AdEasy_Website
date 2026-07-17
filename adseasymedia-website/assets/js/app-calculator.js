/* AdsEasy Media — Mobile App Development: Cost & Timeline Estimator
 * Self-contained script scoped to the #app-calculator widget on
 * mobile-app-development.html. Deliberately independent from the other
 * calculator scripts so this page can't affect them, or vice versa.
 *
 * NOTE: the per-feature/per-platform rate below is a placeholder for an
 * illustrative "instant estimate" only — have a qualified team member
 * calibrate it against real project data before this goes live.
 */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id, fb) { var v = parseFloat($(id) && $(id).value); return isFinite(v) ? v : (fb || 0); };
  var fmt = function (n, d) { return isFinite(n) ? Number(n.toFixed(d === undefined ? 0 : d)).toLocaleString() : '—'; };
  var money = function (n) { return '₹' + fmt(n); };

  var WHATSAPP_NUMBER = '917022948105';
  var RATE_PER_FEATURE_PER_PLATFORM = 35000; // placeholder — verify before launch

  function calc() {
    var valEl = $('app-cost-val');
    if (!valEl) return; // calculator markup not present on this page

    var features = Math.max(num('app-features', 15), 1);
    var platforms = Math.max(num('app-platforms', 2), 1);
    var base = features * platforms * RATE_PER_FEATURE_PER_PLATFORM;
    var low = base * 0.8;
    var high = base * 1.3;
    var weeks = Math.round(4 + features * 0.4 + (platforms - 1) * 3);

    valEl.textContent = money(low) + ' – ' + money(high);
    $('app-features-out').textContent = fmt(features);
    $('app-platforms-out').textContent = fmt(platforms);
    $('app-timeline-out').textContent = weeks + (weeks === 1 ? ' week' : ' weeks');
  }

  ['app-features', 'app-platforms'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('input', calc);
  });

  function waLines(fields) {
    var features = Math.max(num('app-features', 15), 1);
    var platforms = Math.max(num('app-platforms', 2), 1);
    var base = features * platforms * RATE_PER_FEATURE_PER_PLATFORM;
    var low = base * 0.8, high = base * 1.3;
    var weeks = Math.round(4 + features * 0.4 + (platforms - 1) * 3);
    var lines = [
      'Hi AdsEasy Media! I used the App Development Cost Estimator on your Mobile App Development page.',
      ''
    ];
    if (fields) lines.push('Name: ' + fields.name, 'Email: ' + fields.email, 'Phone: ' + fields.phone, '');
    lines.push(
      'Core features/screens: ' + fmt(features),
      'Platforms: ' + fmt(platforms),
      'Estimated cost: ' + money(low) + ' – ' + money(high),
      'Estimated timeline: ' + weeks + (weeks === 1 ? ' week' : ' weeks'),
      '',
      "I'd like a proper scoped quote."
    );
    return lines;
  }

  function waUrl(fields) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waLines(fields).join('\n'));
  }

  var waBtn = $('app-whatsapp-btn');
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
