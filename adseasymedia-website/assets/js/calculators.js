/* AdsEasy Media — Free Marketing Tools (8 calculators) */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id, fb) { var v = parseFloat($(id) && $(id).value); return isFinite(v) ? v : (fb || 0); };
  var fmt = function (n, d) { return isFinite(n) ? Number(n.toFixed(d === undefined ? 0 : d)).toLocaleString() : '—'; };
  var money = function (n, d) { return '₹' + fmt(n, d); };
  var charts = {};

  function drawChart(id, cfg) {
    if (typeof Chart === 'undefined') return;
    if (charts[id]) { charts[id].data = cfg.data; charts[id].update(); return; }
    var el = $(id); if (!el) return;
    Chart.defaults.color = 'rgba(255,255,255,.7)';
    Chart.defaults.borderColor = 'rgba(255,255,255,.1)';
    charts[id] = new Chart(el, cfg);
  }

  /* ---------- Tab switching ---------- */
  var navBtns = document.querySelectorAll('.calc-nav button');
  var panels = document.querySelectorAll('.calc-panel');
  function activate(key, push) {
    navBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.calc === key); });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === 'calc-' + key); });
    if (push && history.replaceState) history.replaceState(null, '', '#' + key);
    var fn = calcs[key]; if (fn) fn();
  }
  navBtns.forEach(function (b) {
    b.addEventListener('click', function () { activate(b.dataset.calc, true); });
  });

  /* ---------- Calculators ---------- */
  var calcs = {};

  /* 1 · Google Ads Cost */
  calcs.gads = function () {
    var spend = num('ga-spend', 4000), cpc = Math.max(num('ga-cpc', 1), .01),
        conv = num('ga-conv', 20) / 100, qual = num('ga-qual', 50) / 100,
        close = num('ga-close', 30) / 100, rev = num('ga-rev', 500), fee = num('ga-fee', 500);
    var clicks = spend / cpc, inquiries = clicks * conv, cpi = inquiries ? spend / inquiries : 0;
    var qualified = inquiries * qual, sales = qualified * close;
    var revenue = sales * rev, total = spend + fee;
    var cpa = sales ? total / sales : 0, roas = total ? revenue / total : 0;
    var profit = revenue - total, roi = total ? profit / total * 100 : 0;
    $('ga-roas').textContent = fmt(roas, 2) + 'x';
    $('ga-clicks').textContent = fmt(clicks);
    $('ga-inq').textContent = fmt(inquiries);
    $('ga-cpi').textContent = money(cpi, 2);
    $('ga-sales').textContent = fmt(sales, 1);
    $('ga-revenue').textContent = money(revenue);
    $('ga-cpa').textContent = money(cpa, 2);
    $('ga-profit').textContent = money(profit);
    $('ga-roi').textContent = fmt(roi, 1) + '%';
    drawChart('ga-chart', { type: 'bar', data: { labels: ['Ad spend', 'Agency fee', 'Revenue', 'Profit'], datasets: [{ data: [spend, fee, revenue, profit], backgroundColor: ['#7DB8FF', '#4A6FA5', '#4FE3E5', '#2ECC8F'], borderRadius: 8 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,.08)' } }, x: { grid: { display: false } } } } });
  };

  /* 2 · Growth Rate */
  calcs.growth = function () {
    var a = num('gr-initial', 2000), b = num('gr-final', 10000), p = Math.max(num('gr-period', 3), 0.01);
    var gain = b - a, rate = a ? gain / a * 100 : 0;
    var cagr = (a > 0 && b > 0) ? (Math.pow(b / a, 1 / p) - 1) * 100 : 0;
    $('gr-rate').textContent = fmt(rate, 1) + '%';
    $('gr-gain').textContent = money(gain);
    $('gr-cagr').textContent = fmt(cagr, 2) + '%';
    $('gr-monthly').textContent = fmt((Math.pow(1 + rate / 100, 1 / (p * 12)) - 1) * 100, 2) + '%';
    var labels = [], data = [];
    for (var i = 0; i <= p; i++) { labels.push('Yr ' + i); data.push(a * Math.pow(b / a, i / p)); }
    drawChart('gr-chart', { type: 'line', data: { labels: labels, datasets: [{ label: 'Value', data: data, borderColor: '#4FE3E5', backgroundColor: 'rgba(79,227,229,.15)', fill: true, tension: .35, pointRadius: 3 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,.08)' } }, x: { grid: { display: false } } } } });
  };

  /* 3 · ROI */
  calcs.roi = function () {
    var inv = Math.max(num('roi-inv', 50000), 1), ret = num('roi-ret', 80000), yrs = Math.max(num('roi-yrs', 5), 0.01);
    var gain = ret - inv, roi = gain / inv * 100;
    var ann = (ret > 0) ? (Math.pow(ret / inv, 1 / yrs) - 1) * 100 : 0;
    $('roi-gain').textContent = money(gain);
    $('roi-pct').textContent = fmt(roi, 1) + '%';
    $('roi-ann').textContent = fmt(ann, 2) + '%';
    drawChart('roi-chart', { type: 'doughnut', data: { labels: ['Amount invested', 'Investment gain'], datasets: [{ data: [inv, Math.max(gain, 0)], backgroundColor: ['#7DB8FF', '#4FE3E5'], borderWidth: 0 }] }, options: { cutout: '68%', plugins: { legend: { position: 'bottom' } } } });
  };

  /* 4 · LTV / CAC */
  calcs.ltvcac = function () {
    var ltv = num('lc-ltv', 1200), cac = Math.max(num('lc-cac', 300), 1),
        mrev = Math.max(num('lc-mrev', 49), .01), margin = num('lc-margin', 80) / 100;
    var grossLtv = ltv * margin, ratio = grossLtv / cac, revRatio = ltv / cac;
    var payback = cac / (mrev * margin), net = grossLtv - cac;
    var verdict = ratio >= 3 ? 'Excellent' : ratio >= 2 ? 'Good' : ratio >= 1 ? 'At risk' : 'Unprofitable';
    $('lc-ratio').textContent = fmt(ratio, 1) + ':1';
    $('lc-verdict').textContent = verdict + ' — gross LTV:CAC (target: 3:1+)';
    $('lc-revratio').textContent = fmt(revRatio, 1) + ':1';
    $('lc-gross').textContent = money(grossLtv);
    $('lc-payback').textContent = fmt(payback, 1) + ' mo';
    $('lc-net').textContent = money(net);
    drawChart('lc-chart', { type: 'bar', data: { labels: ['CAC', 'Gross LTV'], datasets: [{ data: [cac, grossLtv], backgroundColor: ['#7DB8FF', '#4FE3E5'], borderRadius: 8 }] }, options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,.08)' } }, y: { grid: { display: false } } } } });
  };

  /* 5 · SaaS Churn Estimator */
  calcs.churn = function () {
    var cust = num('ch-cust', 1800), newc = num('ch-new', 127),
        churn = num('ch-rate', 6) / 100, arpu = num('ch-arpu', 49);
    var lossMo = cust * churn;
    var annual = (1 - Math.pow(1 - churn, 12)) * 100;
    var cur = cust, red = cust, curArr = [], redArr = [], lostRev = 0;
    for (var m = 0; m < 12; m++) {
      lostRev += cur * churn * arpu;
      cur = cur * (1 - churn) + newc;
      red = red * (1 - churn / 2) + newc;
      curArr.push(Math.round(cur)); redArr.push(Math.round(red));
    }
    $('ch-loss').textContent = fmt(lossMo) + ' customers/mo';
    $('ch-annual').textContent = fmt(annual, 1) + '%';
    $('ch-rev').textContent = money(lostRev);
    $('ch-diff').textContent = '+' + fmt(redArr[11] - curArr[11]) + ' customers';
    var labels = curArr.map(function (_, i) { return 'M' + (i + 1); });
    drawChart('ch-chart', { type: 'line', data: { labels: labels, datasets: [{ label: 'Current churn', data: curArr, borderColor: '#F6883B', tension: .3, pointRadius: 0 }, { label: 'Churn halved', data: redArr, borderColor: '#4FE3E5', tension: .3, pointRadius: 0 }] }, options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { grid: { color: 'rgba(255,255,255,.08)' } }, x: { grid: { display: false } } } } });
  };

  /* 6 · CAC */
  calcs.cac = function () {
    var s = num('cac-sales', 8000), m = num('cac-mkt', 20000), n = Math.max(num('cac-cust', 80), 1);
    var cac = (s + m) / n;
    $('cac-val').textContent = money(cac, 2);
    $('cac-total').textContent = money(s + m);
    $('cac-per').textContent = fmt(n);
    drawChart('cac-chart', { type: 'doughnut', data: { labels: ['Cost of marketing', 'Cost of sales'], datasets: [{ data: [m, s], backgroundColor: ['#7DB8FF', '#4FE3E5'], borderWidth: 0 }] }, options: { cutout: '68%', plugins: { legend: { position: 'bottom' } } } });
  };

  /* 7 · MRR */
  calcs.mrr = function () {
    var p1 = num('mrr-p1', 29), c1 = num('mrr-c1', 100), p2 = num('mrr-p2', 79), c2 = num('mrr-c2', 40);
    var newc = num('mrr-new', 15), val = num('mrr-val', 49), churn = num('mrr-churn', 3) / 100, exp = num('mrr-exp', 500);
    var mrr = p1 * c1 + p2 * c2;
    var arr = [], cur = mrr;
    for (var m = 0; m < 12; m++) { cur = cur * (1 - churn) + newc * val + exp; arr.push(Math.round(cur)); }
    $('mrr-val-out').textContent = money(mrr);
    $('mrr-arr').textContent = money(mrr * 12);
    $('mrr-arpu').textContent = money(mrr / Math.max(c1 + c2, 1), 2);
    $('mrr-12').textContent = money(arr[11]);
    drawChart('mrr-chart', { type: 'line', data: { labels: arr.map(function (_, i) { return 'M' + (i + 1); }), datasets: [{ label: 'MRR forecast', data: arr, borderColor: '#4FE3E5', backgroundColor: 'rgba(79,227,229,.15)', fill: true, tension: .35, pointRadius: 0 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,.08)' } }, x: { grid: { display: false } } } } });
  };

  /* 8 · CRC */
  calcs.crc = function () {
    var cost = num('crc-cost', 5000), n = Math.max(num('crc-cust', 100), 1);
    $('crc-val').textContent = money(cost / n, 2);
    $('crc-total').textContent = money(cost);
    $('crc-n').textContent = fmt(n);
  };

  /* ---------- Wiring ---------- */
  document.querySelectorAll('.calc-panel').forEach(function (panel) {
    var key = panel.id.replace('calc-', '');
    panel.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('input', function () { if (calcs[key]) calcs[key](); });
    });
  });

  /* Download report */
  document.querySelectorAll('[data-download]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.calc-panel');
      var title = panel.querySelector('h3').textContent;
      var lines = ['AdsEasy Media — ' + title, 'Generated: ' + new Date().toLocaleString(), ''];
      panel.querySelectorAll('.num-field, .slider-field').forEach(function (f) {
        var l = f.querySelector('label'), i = f.querySelector('input');
        if (l && i) lines.push('INPUT,' + l.textContent.trim() + ',' + i.value);
      });
      panel.querySelectorAll('.res-hero, .res-grid div').forEach(function (r) {
        var b = r.querySelector('b,.v'), s = r.querySelector('small,.l');
        if (b && s) lines.push('RESULT,' + s.textContent.trim() + ',' + b.textContent.trim());
      });
      var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-report.csv';
      a.click(); URL.revokeObjectURL(a.href);
    });
  });

  /* Share report */
  document.querySelectorAll('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.calc-panel');
      var url = location.origin + location.pathname + '#' + panel.id.replace('calc-', '');
      var title = 'AdsEasy Media — ' + panel.querySelector('h3').textContent;
      if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); }
      else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          btn.textContent = 'Link copied ✓';
          setTimeout(function () { btn.textContent = 'Share report'; }, 2000);
        });
      }
    });
  });

  /* Init: hash or first */
  var initial = (location.hash || '').replace('#', '');
  if (!document.getElementById('calc-' + initial)) initial = 'gads';
  activate(initial, false);
  Object.keys(calcs).forEach(function (k) { calcs[k](); });

  /* ---------- Lead gate: blur results until visitor submits their details ---------- */
  var LEAD_KEY = 'aem_lead_unlocked';
  var WHATSAPP_NUMBER = '917022948105';

  function isUnlocked() {
    try { return localStorage.getItem(LEAD_KEY) === '1'; } catch (e) { return false; }
  }

  function applyLockState() {
    var unlocked = isUnlocked();
    document.querySelectorAll('.calc-results').forEach(function (el) {
      el.classList.toggle('locked', !unlocked);
    });
  }

  function buildWhatsAppLink(panel, fields) {
    var h3 = panel.querySelector('h3');
    var title = h3 ? h3.textContent.trim() : 'Calculator';
    var lines = [
      "Hi AdsEasy Media! I just used the " + title + " on your site.",
      '', 'Name: ' + fields.name, 'Email: ' + fields.email, 'Phone: ' + fields.phone,
      '', 'My results:'
    ];
    panel.querySelectorAll('.res-hero, .res-grid div').forEach(function (r) {
      var b = r.querySelector('b,.v'), s = r.querySelector('small,.l');
      if (b && s) lines.push('- ' + s.textContent.trim() + ': ' + b.textContent.trim());
    });
    lines.push('', "I'd like to know more.");
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  var pendingPanel = null;
  var modalOverlay = $('lead-modal');
  var leadForm = $('lead-form');

  document.querySelectorAll('.lead-gate-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      pendingPanel = btn.closest('.calc-panel');
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

      var panel = pendingPanel || document.querySelector('.calc-panel.active');
      if (panel) window.open(buildWhatsAppLink(panel, fields), '_blank', 'noopener');

      leadForm.reset();
      pendingPanel = null;
    });

    leadForm.querySelectorAll('[required]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var f = inp.closest('.field'); if (f) f.classList.remove('invalid');
      });
    });
  }

  applyLockState();
})();
