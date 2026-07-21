/* AdsEasy Media — shared behaviour */
(function () {
  'use strict';

  /* Sticky nav */
  var nav = document.querySelector('.nav');
  var backTop = document.querySelector('.back-top');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile burger */
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    /* mobile submenu toggle */
    links.querySelectorAll('li').forEach(function (li) {
      var a = li.querySelector(':scope > a');
      var mega = li.querySelector(':scope > .mega');
      if (a && mega) {
        a.addEventListener('click', function (e) {
          if (window.innerWidth < 1024) { e.preventDefault(); li.classList.toggle('open-sub'); }
        });
      }
    });
  }

  /* Reveal on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* Counters */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
      var dec = (String(el.dataset.count).split('.')[1] || '').length;
      var t0 = null, dur = 1600;
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* Accordions */
  document.querySelectorAll('.accordion').forEach(function (acc) {
    acc.querySelectorAll('.acc-item').forEach(function (item) {
      var btn = item.querySelector('.acc-btn'), body = item.querySelector('.acc-body');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');
        acc.querySelectorAll('.acc-item.active').forEach(function (o) {
          o.classList.remove('active');
          o.querySelector('.acc-body').style.maxHeight = null;
          o.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* Generic slider engine — powers the testimonial slider and any other
     .tslider (e.g. the SEO page case-study carousel). Autoplay is on by
     default; add data-autoplay="false" on the .tslider element to make it
     manual-only (dots + optional .cs-arrow prev/next buttons). */
  document.querySelectorAll('.tslider').forEach(function (slider) {
    var track = slider.querySelector('.tslider-track');
    var slides = track.children.length;
    var dotsBox = slider.parentElement.querySelector('.tnav');
    var prevBtn = slider.parentElement.querySelector('.cs-arrow.prev');
    var nextBtn = slider.parentElement.querySelector('.cs-arrow.next');
    var autoplay = slider.getAttribute('data-autoplay') !== 'false';
    var i = 0, timer;
    function go(n) {
      i = (n + slides) % slides;
      track.style.transform = 'translateX(-' + i * 100 + '%)';
      if (dotsBox) [].forEach.call(dotsBox.children, function (d, k) { d.classList.toggle('active', k === i); });
    }
    if (dotsBox) {
      for (var k = 0; k < slides; k++) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Slide ' + (k + 1));
        (function (k) { b.addEventListener('click', function () { go(k); restart(); }); })(k);
        dotsBox.appendChild(b);
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { go(i - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(i + 1); restart(); });
    function restart() {
      clearInterval(timer);
      if (autoplay) timer = setInterval(function () { go(i + 1); }, 6000);
    }
    go(0); restart();
  });

  /* 3-visible case-study carousel (.cs3-slider) — shows 3 cards per frame
     (2 on tablet, 1 on mobile) and steps one card at a time. Bounded, not
     looping: arrows disable at the ends since this browses a short list. */
  document.querySelectorAll('.cs3-slider').forEach(function (slider) {
    var track = slider.querySelector('.cs3-track');
    var cards = track.children;
    var n = cards.length;
    var dotsBox = slider.parentElement.querySelector('.tnav');
    var prevBtn = slider.parentElement.querySelector('.cs-arrow.prev');
    var nextBtn = slider.parentElement.querySelector('.cs-arrow.next');
    var i = 0;

    function visible() {
      var w = slider.clientWidth;
      return w < 640 ? 1 : (w < 980 ? 2 : 3);
    }
    function maxIndex() { return Math.max(0, n - visible()); }
    function go(idx) {
      i = Math.min(Math.max(idx, 0), maxIndex());
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var step = cards[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(-' + (i * step) + 'px)';
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.disabled = i >= maxIndex();
      if (dotsBox) [].forEach.call(dotsBox.children, function (d, k) { d.classList.toggle('active', k === i); });
    }
    if (dotsBox) {
      for (var k = 0; k <= maxIndex(); k++) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Slide ' + (k + 1));
        (function (k) { b.addEventListener('click', function () { go(k); }); })(k);
        dotsBox.appendChild(b);
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { go(i - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(i + 1); });
    window.addEventListener('resize', function () { go(Math.min(i, maxIndex())); });
    go(0);
  });

  /* Form validation + success animation */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* Spam protection placeholder: honeypot */
      var hp = form.querySelector('.hp-field input');
      if (hp && hp.value) return;
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var field = inp.closest('.field');
        var valid = inp.value.trim() !== '';
        if (valid && inp.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
        if (valid && inp.type === 'tel') valid = /^[+\d][\d\s\-()]{6,}$/.test(inp.value);
        if (field) field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      /* Email integration placeholder:
         POST form data to your email/CRM endpoint here. */
      var body = form.querySelector('.form-body'), succ = form.querySelector('.form-success');
      if (body && succ) { body.style.display = 'none'; succ.style.display = 'block'; }
      form.dispatchEvent(new CustomEvent('aem:submitted'));
    });
    form.querySelectorAll('[required]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var f = inp.closest('.field'); if (f) f.classList.remove('invalid');
      });
    });
  });

  /* Range slider fill */
  document.querySelectorAll('input[type=range]').forEach(function (r) {
    function fill() {
      var p = ((r.value - r.min) / (r.max - r.min)) * 100;
      r.style.setProperty('--fill', p + '%');
      var out = document.getElementById(r.id + '-out');
      if (out) out.textContent = (r.dataset.prefix || '') + Number(r.value).toLocaleString() + (r.dataset.suffixOut || '');
    }
    r.addEventListener('input', fill); fill();
  });

  /* Form tab switcher (contact page) */
  document.querySelectorAll('[data-formtabs]').forEach(function (wrap) {
    var tabs = wrap.querySelectorAll('.form-tabs button');
    var panels = wrap.querySelectorAll('[data-formpanel]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        panels.forEach(function (p) { p.style.display = p.dataset.formpanel === t.dataset.formtab ? '' : 'none'; });
      });
    });
  });

  /* Blog search filter */
  var bs = document.getElementById('blog-search');
  if (bs) {
    bs.addEventListener('input', function () {
      var q = bs.value.toLowerCase();
      document.querySelectorAll('[data-blog-card]').forEach(function (c) {
        c.style.display = c.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
      });
    });
  }
})();
