// Language Switcher - Fixed Version
function switchLang(lang) {
  // Update body class
  document.body.classList.toggle('lang-zh', lang === 'zh');
  
  // Update nav links active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    const isZh = a.hasAttribute('data-lang');
    if (isZh) {
      a.classList.toggle('active', lang === 'zh');
    } else {
      a.classList.toggle('active', lang === 'en');
    }
  });
  
  // Update lang buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langBtn === lang);
  });
  
  // Update html lang
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  
  // Store preference
  localStorage.setItem('mediEscortLang', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('mediEscortLang') || 'en';
  switchLang(savedLang);

  // WhatsApp tooltip
  const waTooltip = document.getElementById('waTooltip');
  if (waTooltip) {
    setTimeout(() => waTooltip.classList.add('show'), 3000);
    setTimeout(() => waTooltip.classList.remove('show'), 8000);
  }
});

// WhatsApp QR Modal
function openWhatsAppQR(e) {
  e.preventDefault();
  let overlay = document.getElementById('whatsappQROverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'whatsappQROverlay';
    overlay.className = 'whatsapp-qr-overlay';
    // Determine correct image path based on current directory depth
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const isInCities = pathParts.includes('cities');
    const imgPrefix = isInCities ? '../' : '';
    // Build DOM safely without innerHTML
    const modal = document.createElement('div');
    modal.className = 'whatsapp-qr-modal';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'whatsapp-qr-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7'; // &times;
    closeBtn.addEventListener('click', closeWhatsAppQR);
    const h3 = document.createElement('h3');
    h3.textContent = 'Scan to Chat on WhatsApp';
    const p = document.createElement('p');
    p.textContent = 'Open WhatsApp and scan the QR code to start a conversation';
    const img = document.createElement('img');
    img.src = imgPrefix + 'images/whatsapp-qr.png';
    img.alt = 'WhatsApp QR Code';
    modal.appendChild(closeBtn);
    modal.appendChild(h3);
    modal.appendChild(p);
    modal.appendChild(img);
    overlay.appendChild(modal);
    overlay.addEventListener('click', function(ev) {
      if (ev.target === overlay) closeWhatsAppQR();
    });
    document.body.appendChild(overlay);
  }
  // Force reflow
  void overlay.offsetWidth;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWhatsAppQR() {
  const overlay = document.getElementById('whatsappQROverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close QR modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeWhatsAppQR();
});

// Mobile Menu
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('active');
}

// FAQ Toggle
function toggleFaq(element) {
  const item = element.parentElement;
  const wasActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  if (!wasActive) item.classList.add('active');
}

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const currentScroll = window.pageYOffset;
  navbar.style.boxShadow = currentScroll > 100 
    ? '0 4px 20px rgba(0,0,0,0.1)' 
    : '0 1px 3px rgba(0,0,0,0.08)';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Form validation
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', (e) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--danger)';
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) {
      e.preventDefault();
      const msg = document.body.classList.contains('lang-zh') 
        ? '请填写所有必填字段。' 
        : 'Please fill in all required fields.';
      alert(msg);
    }
  });
});

// ============================================================
// Global event delegation for data-action attributes
// Replaces inline onclick handlers (CSP compliance)
// ============================================================
document.addEventListener('click', function(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  
  const action = target.dataset.action;
  
  switch (action) {
    case 'toggle-menu':
      e.preventDefault();
      toggleMenu();
      break;
    case 'toggle-faq':
      e.preventDefault();
      toggleFaq(target);
      break;
    case 'open-qr':
      e.preventDefault();
      const qrType = target.dataset.qrType;
      if (typeof openQRModal === 'function') openQRModal(qrType);
      break;
    case 'close-qr':
      e.preventDefault();
      if (typeof closeQRModal === 'function') closeQRModal();
      break;
    case 'close-modal':
      e.preventDefault();
      if (typeof closeModal === 'function') closeModal();
      break;
    case 'close-payment':
      e.preventDefault();
      if (typeof closePaymentModal === 'function') closePaymentModal();
      break;
    case 'show-payment':
      e.preventDefault();
      const paymentType = target.dataset.payment;
      if (typeof showPaymentModal === 'function') showPaymentModal(paymentType);
      break;
    case 'switch-payment':
      e.preventDefault();
      const tab = target.dataset.tab;
      if (typeof switchPaymentTab === 'function') switchPaymentTab(tab);
      break;
    case 'confirm-payment':
      e.preventDefault();
      if (typeof confirmPayment === 'function') confirmPayment();
      break;
    case 'select-escort':
      e.preventDefault();
      const tier = target.dataset.tier;
      if (typeof selectEscort === 'function') selectEscort(tier, target);
      break;
    case 'stop-propagation':
      e.stopPropagation();
      break;
    case 'send-email':
      e.preventDefault();
      // Mailto links are handled by the href attribute
      window.location.href = target.href;
      break;
    case 'send-whatsapp':
      e.preventDefault();
      const formName = target.dataset.form;
      const msg = target.dataset.msg;
      if (typeof sendViaWhatsApp === 'function') sendViaWhatsApp(formName, msg);
      break;
    case 'filter-blog':
      e.preventDefault();
      const category = target.dataset.category;
      if (typeof filterBlog === 'function') filterBlog(category, target);
      break;
    case 'open-article':
      e.preventDefault();
      const articleId = target.dataset.articleId;
      if (typeof openArticle === 'function') openArticle(articleId);
      break;
    case 'close-article':
      e.preventDefault();
      if (typeof closeArticle === 'function') closeArticle(e);
      break;
  }
});

// ===== QR Modal (Legacy pages) =====
function openQRModal(type) {
  const modal = document.getElementById('qrModal');
  if (!modal) return;

  const img = document.getElementById('qrImage');
  const msg = document.getElementById('qrMessage');
  const link = document.getElementById('qrLink');

  if (img && msg && link) {
    msg.textContent = '';

    if (type === 'whatsapp') {
      img.src = 'images/whatsapp-qr.png';
      link.href = 'https://wa.me/8615527771775';
      link.textContent = 'Open WhatsApp Chat';

      msg.appendChild(document.createTextNode('\u{1F4F1} Scan this QR code with WhatsApp to add us.'));
      msg.appendChild(document.createElement('br'));
      msg.appendChild(document.createElement('br'));
      msg.appendChild(document.createTextNode('Or add us directly: '));
      const strong = document.createElement('strong');
      strong.textContent = '+86-155-2777-1775';
      msg.appendChild(strong);
      msg.appendChild(document.createTextNode('. After adding, feel free to send your inquiry anytime!'));
    } else if (type === 'wechat') {
      img.src = 'images/wechat-qr.png';
      link.href = 'weixin://';
      link.textContent = 'Open WeChat';

      msg.appendChild(document.createTextNode('\u{1F5E8} Scan this QR code with WeChat to add us.'));
      msg.appendChild(document.createElement('br'));
      msg.appendChild(document.createElement('br'));
      msg.appendChild(document.createTextNode('After adding, feel free to send your inquiry anytime!'));
    }
  }

  modal.style.display = 'flex';
}

function closeQRModal() {
  const modal = document.getElementById('qrModal');
  if (modal) modal.style.display = 'none';
}
