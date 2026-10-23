// ============================================
// CLICKJACKING PROTECTION (FRAME BUSTER)
// ============================================
// GitHub Pages cannot send X-Frame-Options / frame-ancestors headers,
// so break out of any hostile framing at the script level instead.
if (window.top !== window.self) {
  try {
    window.top.location = window.self.location;
  } catch (e) {
    document.documentElement.style.display = 'none';
  }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

// ============================================
// ACCESSIBILITY UTILITIES
// ============================================
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'visually-hidden';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// ============================================
// IN-PAGE LINKS WITH FOCUS MANAGEMENT
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });

    setTimeout(() => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.pushState(null, '', targetId);
    }, prefersReducedMotion ? 0 : 600);
  });
});

// ============================================
// HEADER: SOLID BAR ONCE THE HERO SCROLLS AWAY
// ============================================
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================
// MENU (PHONE AND TABLET)
// ============================================
const menuToggle = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('main-nav');

if (menuToggle && navLinks) {
  const setMenu = (open) => {
    navLinks.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Close' : 'Menu';
  };

  menuToggle.addEventListener('click', () => {
    const open = !navLinks.classList.contains('active');
    setMenu(open);
    if (open) {
      const firstLink = navLinks.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 50);
    }
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
}

// ============================================
// HERO: SLOW CROSSFADE OF THE LARGE PRINT
// ============================================
(function () {
  const frame = document.querySelector('[data-crossfade]');
  if (!frame || prefersReducedMotion) return;
  const pics = Array.from(frame.querySelectorAll('img'));
  if (pics.length < 2) return;

  // One full cycle, then it rests on the first print (autoplay must not run on indefinitely).
  let index = 0;
  let steps = 0;
  let timer = null;

  function step() {
    pics[index].classList.remove('is-active');
    index = (index + 1) % pics.length;
    pics[index].classList.add('is-active');
    if (++steps >= pics.length) stop();
  }
  function start() { if (!timer && steps < pics.length) timer = setInterval(step, 5500); }
  function stop() { clearInterval(timer); timer = null; }

  const hero = frame.closest('.hero');
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
})();

// ============================================
// WORK INDEX: THE ACTIVE NAME LIGHTS ITS SCREEN
// ============================================
(function () {
  const items = Array.from(document.querySelectorAll('#work-index .work-item'));
  const pics = Array.from(document.querySelectorAll('.work-frame-pics img'));
  const caption = document.getElementById('work-caption');
  const captionMeta = document.getElementById('work-caption-meta');
  if (!items.length) return;

  function activate(i) {
    items.forEach((item, n) => item.classList.toggle('is-active', n === i));
    pics.forEach((pic, n) => pic.classList.toggle('is-active', n === i));
    const desc = items[i].querySelector('.work-desc');
    const meta = items[i].querySelector('.work-meta');
    if (caption && desc) caption.textContent = desc.textContent;
    if (captionMeta && meta) captionMeta.textContent = meta.textContent;
  }

  items.forEach((item, i) => {
    const link = item.querySelector('.work-link');
    item.addEventListener('mouseenter', () => activate(i));
    if (link) link.addEventListener('focus', () => activate(i));
  });
})();

// ============================================
// AI LIST: ONE OPEN ROW, ITS TERMINAL ON SCREEN
// ============================================
(function () {
  const items = Array.from(document.querySelectorAll('#ai-list .ai-item'));
  const terms = Array.from(document.querySelectorAll('.term-body'));
  if (!items.length) return;

  function activate(i) {
    items.forEach((item, n) => {
      const on = n === i;
      item.classList.toggle('is-active', on);
      item.querySelector('.ai-toggle').setAttribute('aria-expanded', String(on));
    });
    terms.forEach((term, n) => term.classList.toggle('is-active', n === i));
  }

  items.forEach((item, i) => {
    const toggle = item.querySelector('.ai-toggle');
    toggle.addEventListener('click', () => activate(i));
    toggle.addEventListener('focus', () => activate(i));
    item.addEventListener('mouseenter', () => { if (finePointer.matches) activate(i); });
  });
})();

// ============================================
// EMAILJS + CAPTCHA
// ============================================
// Guarded so CDN blockers cannot kill the page script.
if (typeof emailjs !== 'undefined') {
  emailjs.init("Ix1CdmtwL6WK8WfAF");
}

function loadCaptcha() {
  if (window.grecaptcha) {
    // Site keys are public by design; the secret key must only live in the
    // EmailJS template settings (server-side CAPTCHA validation).
    grecaptcha.render('captcha-container', {
      'sitekey': '6Lel-CErAAAAAA41QSfwuAB2pjHCusfi5nq126qm',
      'theme': 'dark'
    });
  }
}
window.loadCaptcha = loadCaptcha;

if (document.getElementById('captcha-container')) {
  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/api.js?onload=loadCaptcha&render=explicit';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

// ============================================
// TOASTS
// ============================================
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const inputs = contactForm.querySelectorAll('input, textarea');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.textContent;

  const errorText = {
    name: 'Enter your name.',
    phone: 'Enter a phone number.',
    email: 'Enter an email address like ana@company.com.',
    message: 'Write a few lines about the project.',
    consent: 'Tick the consent box so I can store your message.'
  };

  function errorFor(field) {
    const id = `${field.id}-error`;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('p');
      el.id = id;
      el.className = 'field-error';
      const anchor = field.type === 'checkbox' ? field.closest('.consent-group') : field;
      anchor.insertAdjacentElement('afterend', el);
      field.setAttribute('aria-describedby', id);
    }
    return el;
  }

  function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('error', !isValid);
    field.setAttribute('aria-invalid', String(!isValid));
    if (!isValid) {
      errorFor(field).textContent = (field.validity.typeMismatch && errorText.email) || errorText[field.name] || field.validationMessage;
    } else {
      const el = document.getElementById(`${field.id}-error`);
      if (el) el.textContent = '';
    }
    return isValid;
  }

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) isFormValid = false;
    });

    if (!isFormValid) {
      showToast('Some fields are missing or invalid. Check the highlighted fields and try again.', 'error');
      const firstError = contactForm.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    const captchaResponse = window.grecaptcha ? grecaptcha.getResponse() : '';
    if (!captchaResponse) {
      showToast('Tick the CAPTCHA box above the button, then send again.', 'error');
      return;
    }

    const formData = new FormData(contactForm);
    const sanitize = str => (str || '').replace(/[<>"'%;()&+]/g, '');
    const data = {
      from_name: sanitize(formData.get('name')),
      from_email: sanitize(formData.get('email')),
      from_phone: sanitize(formData.get('phone')),
      message: sanitize(formData.get('message'))
    };

    try {
      submitButton.textContent = 'Sending…';
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');

      await emailjs.send('AlejandroPiPortfolio', 'template_vnt432a', data);

      if (typeof window.trackPortfolioEvent === 'function') {
        window.trackPortfolioEvent('contact_submit', { status: 'success' });
      }

      showToast('Thank you for your message! I will get back to you soon.', 'success');
      contactForm.reset();
      if (window.grecaptcha) grecaptcha.reset();
      inputs.forEach(input => {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
      });
      contactForm.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('The message could not be sent. Try again, or write to alejandro.pi87@gmail.com.', 'error');
    } finally {
      submitButton.textContent = submitLabel;
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });
}

// ============================================
// FOOTER YEAR
// ============================================
const yearSpan = document.getElementById('current-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ============================================
// ENTRANCES: EACH PART OF A SECTION, STAGGERED
// ============================================
(function () {
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!revealElements.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Siblings that enter together are staggered by 80ms.
  const groups = new Map();
  revealElements.forEach(el => {
    const parent = el.closest('section, article, footer') || document.body;
    const n = groups.get(parent) || 0;
    el.style.setProperty('--delay', `${Math.min(n, 6) * 80}ms`);
    groups.set(parent, n + 1);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));
})();
