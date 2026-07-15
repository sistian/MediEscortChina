/**
 * ============================================================
 * MediEscortChina 全站前端安全防护脚本 v2.0
 * 适配纯静态HTML网站（非Next.js）
 * 基于 MediEscortChina 全站安全防护完整代码包 增强
 * ============================================================
 */

(function() {
  'use strict';

  // ============================================================
  // 1. 初始化安全日志
  // ============================================================
  const SECURITY_VERSION = '2.0';
  const LOG_PREFIX = '[MediEscortChina Security]';

  function securityLog(event, details = {}) {
    const payload = {
      event,
      url: location.href,
      ua: navigator.userAgent,
      ip: 'client', // 前端无法获取真实IP
      timestamp: new Date().toISOString(),
      ...details
    };
    // 生产环境关闭详细日志，避免控制台泄露信息
    if (location.hostname === 'localhost' || location.hostname.includes('127.0.0.1')) {
      console.warn(LOG_PREFIX, JSON.stringify(payload));
    }
  }

  // ============================================================
  // 2. 恶意爬虫 & 扫描器检测（增强版）
  // ============================================================
  const MALICIOUS_UA_PATTERNS = [
    /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
    /gobuster/i, /dirbuster/i, /wfuzz/i, /burpsuite/i,
    /metasploit/i, /openvas/i, /nessus/i, /acunetix/i,
    /netsparker/i, /appscan/i, /w3af/i, /arachni/i,
    /skipfish/i, /wapiti/i, /vega/i, /zap/i, /owasp/i,
    /crawler/i, /spider/i, /scraper/i, /bot\/test/i,
    /headlesschrome/i, /phantomjs/i, /selenium/i,
    / puppeteer/i, /playwright/i
  ];

  const MALICIOUS_REFERER_PATTERNS = [
    /semrush/i, /ahrefs/i, /moz/i, /majestic/i,
    /spyfu/i, /serpstat/i, /ubersuggest/i
  ];

  function detectMaliciousBot() {
    const ua = navigator.userAgent || '';
    const referer = document.referrer || '';

    for (const pattern of MALICIOUS_UA_PATTERNS) {
      if (pattern.test(ua)) {
        securityLog('MALICIOUS_BOT_BLOCKED', { pattern: pattern.toString(), ua: ua.substring(0, 100) });
        const h1 = document.createElement('h1');
        h1.textContent = '403 Forbidden';
        const p = document.createElement('p');
        p.textContent = 'Access denied.';
        document.body.replaceChildren(h1, p);
        throw new Error('Access denied: malicious bot detected');
      }
    }

    for (const pattern of MALICIOUS_REFERER_PATTERNS) {
      if (pattern.test(referer)) {
        securityLog('SEO_CRAWLER_REFERER', { pattern: pattern.toString(), referer });
      }
    }
  }

  // ============================================================
  // 3. URL 参数 XSS 清洗（防止反射型XSS）
  // ============================================================
  function sanitizeUrlParams() {
    const url = new URL(window.location.href);
    let hasXSS = false;

    for (const [key, value] of url.searchParams) {
      const sanitized = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');

      if (sanitized !== value) {
        hasXSS = true;
        url.searchParams.set(key, sanitized);
        securityLog('URL_PARAM_XSS_SANITIZED', { key, original: value.substring(0, 50) });
      }
    }

    if (hasXSS) {
      window.history.replaceState({}, '', url.toString());
    }
  }

  // ============================================================
  // 4. 敏感路径访问拦截（前端层）
  // ============================================================
  const FORBIDDEN_PATHS = [
    '/admin', '/test', '/backup', '/config', '/debug',
    '/api/', '/backend', '/wp-admin', '/wp-login',
    '/phpmyadmin', '/cgi-bin', '/shell', '/cmd',
    '/console', '/manage', '/dashboard'
  ];

  function checkForbiddenPath() {
    const path = window.location.pathname.toLowerCase();
    for (const fp of FORBIDDEN_PATHS) {
      if (path.startsWith(fp)) {
        securityLog('FORBIDDEN_PATH_ACCESS', { path });
        const h1 = document.createElement('h1');
        h1.textContent = '404 Not Found';
        document.body.replaceChildren(h1);
        throw new Error('Access denied: forbidden path');
      }
    }
  }

  // ============================================================
  // 5. 输入清洗函数（XSS过滤）
  // ============================================================
  window.sanitizeInput = function(raw) {
    if (!raw || typeof raw !== 'string') return '';
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#47;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .trim();
  };

  // ============================================================
  // 6. 表单安全拦截（全局事件委托）
  // ============================================================
  function initFormProtection() {
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form.tagName !== 'FORM') return;

      // 6.1 蜜罐字段检测（防机器人）
      const honeypot = form.querySelector('input[name="website"], input[name="url"], input[name="company_website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        securityLog('HONEYPOT_BOT_DETECTED', { form: form.action || location.href });
        e.preventDefault();
        alert('Security check failed. Please try again.');
        return false;
      }

      // 6.2 输入长度校验
      const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
      for (const input of inputs) {
        const val = input.value;
        if (val.length > 5000) {
          securityLog('FORM_INPUT_TOO_LONG', { name: input.name, length: val.length });
          e.preventDefault();
          alert('Input too long. Please limit your message to 5000 characters.');
          return false;
        }
      }

      // 6.3 XSS 清洗
      for (const input of inputs) {
        input.value = window.sanitizeInput(input.value);
      }

      // 6.4 邮件格式校验
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          e.preventDefault();
          alert('Please enter a valid email address.');
          return false;
        }
      }

      // 6.5 提交频率限制（内存级，防暴力刷表单）
      const lastSubmit = sessionStorage.getItem('lastFormSubmit');
      const now = Date.now();
      if (lastSubmit && (now - parseInt(lastSubmit)) < 5000) {
        securityLog('FORM_SUBMIT_TOO_FAST', { form: form.action || location.href });
        e.preventDefault();
        alert('Please wait a few seconds before submitting again.');
        return false;
      }
      sessionStorage.setItem('lastFormSubmit', now.toString());

      securityLog('FORM_SUBMIT_ALLOWED', { form: form.action || location.href });
    }, true);
  }

  // ============================================================
  // 7. 防键盘记录器（检测异常 keydown 监听器数量）
  // ============================================================
  let keydownListenerCount = 0;
  const originalAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'keydown' || type === 'keypress' || type === 'keyup') {
      keydownListenerCount++;
      if (keydownListenerCount > 15) {
        securityLog('SUSPICIOUS_KEYLOGGER', { count: keydownListenerCount, url: location.href });
      }
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // ============================================================
  // 8. 防 iframe 点击劫持
  // ============================================================
  if (window.top !== window.self) {
    securityLog('IFRAME_CLICKJACK_ATTEMPT', { referer: document.referrer });
    window.top.location = window.self.location;
  }

  // ============================================================
  // 9. 禁用右键/F12/开发者工具（生产环境）
  // ============================================================
  if (location.hostname === 'www.MediEscortChina.com' || location.hostname === 'MediEscortChina.com') {
    document.addEventListener('contextmenu', function(e) {
      if (e.target.tagName === 'IMG' || e.target.closest('.price-table')) {
        e.preventDefault();
      }
    });

    document.addEventListener('keydown', function(e) {
      // F12, Ctrl+Shift+I/J/C
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) {
        securityLog('DEVTOOL_BLOCKED', { key: e.key });
        e.preventDefault();
      }
    });
  }

  // ============================================================
  // 10. HTTPS 强制检测
  // ============================================================
  if (location.protocol === 'http:' && location.hostname !== 'localhost') {
    securityLog('HTTP_ACCESS_BLOCKED', { url: location.href });
    location.href = location.href.replace('http:', 'https:');
  }

  // ============================================================
  // 11. 控制台信息防泄露（生产环境隐藏详细错误）
  // ============================================================
  if (location.hostname === 'www.MediEscortChina.com' || location.hostname === 'MediEscortChina.com') {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      // 过滤掉敏感信息泄露
      const msg = args.join(' ');
      if (msg.includes('password') || msg.includes('secret') || msg.includes('token') || msg.includes('key')) {
        originalConsoleError.call(console, '[Filtered] Sensitive error logged');
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // 覆盖 console.warn 防止安全日志泄露到生产环境
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      if (args[0] === LOG_PREFIX) return; // 阻止安全日志输出
      originalConsoleWarn.apply(console, args);
    };
  }

  // ============================================================
  // 12. 防止密码/信用卡信息被第三方脚本读取
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    // 检测页面中是否存在可疑的外部脚本
    const scripts = document.querySelectorAll('script[src]');
    const allowedDomains = [
      'MediEscortChina.com',
      'cdnjs.cloudflare.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'unpkg.com',
      'formsubmit.co'
    ];

    for (const script of scripts) {
      const src = script.src;
      if (!src) continue;
      const isAllowed = allowedDomains.some(d => src.includes(d));
      if (!isAllowed) {
        securityLog('SUSPICIOUS_SCRIPT_DETECTED', { src: src.substring(0, 100) });
        script.remove();
      }
    }
  });

  // ============================================================
  // 13. 页面加载时执行所有检测
  // ============================================================
  (function initSecurity() {
    detectMaliciousBot();
    checkForbiddenPath();
    sanitizeUrlParams();
    initFormProtection();

    // 标记安全脚本已加载
    window.__MediEscortChinaSecurity = {
      version: SECURITY_VERSION,
      loadedAt: new Date().toISOString()
    };
  })();

})();
