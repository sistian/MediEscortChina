/**
 * MediEscortChina — GA4 analytics (MediescortChina property, G-DFPP1CWFTN)
 *
 * PRIVACY RULES (medical-tourism site — deliberate):
 *  - Never send form field values (name / email / phone / nationality / age /
 *    hospital / dates). No form auto-collection, no enhanced measurement.
 *  - No persistent user identifiers beyond GA4's own cookie.
 *  - Respects Do Not Track.
 *  - Auto-collection of PII in the GA4 stream UI is OFF for this stream.
 */
(function () {
  'use strict';

  var GA_ID = 'G-DFPP1CWFTN';
  var GA_DOMAIN = 'www.mediescortchina.com';

  function dnt() {
    var w = window, n = navigator;
    return (n.doNotTrack === '1' || n.doNotTrack === 'yes' ||
      w.doNotTrack === '1' || w.doNotTrack === 'yes' ||
      n.msDoNotTrack === '1');
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: true,
    cookie_flags: { SameSite: 'Lax' },
    transport_type: 'beacon'
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  var h = document.getElementsByTagName('head')[0];
  h.appendChild(s);

  if (dnt()) { gtag('consent', 'update', { analytics_storage: 'denied' }); return; }

  var PII = /name|email|phone|tel|mobile|nationality|age|idcard|passport|address|hospital|patient|price|usd|date/i;
  function safeText(el) {
    var t = (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('title'))) || (el.textContent || '').trim();
    t = t.replace(/\s+/g, ' ').slice(0, 60);
    if (!t || PII.test(t)) return '';
    return t;
  }

  // outbound links
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    var host = '';
    try { host = new URL(href, location.href).hostname; } catch (err) { return; }
    if (host && host !== location.hostname) {
      gtag('event', 'outbound_click', { event_category: 'outbound', event_label: host });
    }
  }, { passive: true });

  // CTA / button clicks (label only, never values)
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('a,button') : null;
    if (!b) return;
    var t = safeText(b);
    if (!t) return;
    if (!/book|quote|contact|price|consult|apply|reserve|appointment|telegram|whatsapp/i.test(t)) return;
    gtag('event', 'cta_click', { event_category: 'cta', event_label: t });
  }, { passive: true });

  // scroll depth
  var marks = [25, 50, 75, 90], done = {};
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var p = Math.round((window.scrollY / h) * 100);
    marks.forEach(function (m) {
      if (p >= m && !done[m]) { done[m] = 1; gtag('event', 'scroll_depth', { event_category: 'engagement', event_label: m + '%' }); }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
