const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.site-nav');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.getElementById('year')?.append(new Date().getFullYear());

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const STORAGE_KEY = 'mi_pro_cookie_consent_v1';
const cookieBanner = document.getElementById('cookieBanner');
const cookieModal = document.getElementById('cookieModal');
const analyticsInput = document.getElementById('analyticsConsent');
const marketingInput = document.getElementById('marketingConsent');

const defaultConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  date: null
};

function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultConsent, ...JSON.parse(raw) } : null;
  } catch (e) {
    return null;
  }
}

function saveConsent(consent) {
  const payload = { ...defaultConsent, ...consent, necessary: true, date: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  applyConsent(payload);
  hideCookieUI();
}

function applyConsent(consent) {
  document.documentElement.dataset.cookieAnalytics = String(!!consent.analytics);
  document.documentElement.dataset.cookieMarketing = String(!!consent.marketing);
}

function showCookieBanner() {
  cookieBanner?.removeAttribute('hidden');
}
function hideCookieBanner() {
  cookieBanner?.setAttribute('hidden', 'hidden');
}
function openCookieModal() {
  const consent = getConsent() || defaultConsent;
  if (analyticsInput) analyticsInput.checked = !!consent.analytics;
  if (marketingInput) marketingInput.checked = !!consent.marketing;
  cookieModal?.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}
function closeCookieModal() {
  cookieModal?.setAttribute('hidden', 'hidden');
  document.body.style.overflow = '';
}
function hideCookieUI() {
  hideCookieBanner();
  closeCookieModal();
}

const existingConsent = getConsent();
if (existingConsent) {
  applyConsent(existingConsent);
} else {
  showCookieBanner();
}

document.querySelectorAll('.js-cookie-accept').forEach(btn => btn.addEventListener('click', () => {
  saveConsent({ analytics: true, marketing: true });
}));

document.querySelectorAll('.js-cookie-reject').forEach(btn => btn.addEventListener('click', () => {
  saveConsent({ analytics: false, marketing: false });
}));

document.querySelectorAll('.js-cookie-settings, .js-open-cookie-settings').forEach(btn => btn.addEventListener('click', openCookieModal));
document.querySelectorAll('.js-close-cookie-modal').forEach(btn => btn.addEventListener('click', closeCookieModal));

document.querySelectorAll('.js-cookie-save').forEach(btn => btn.addEventListener('click', () => {
  saveConsent({
    analytics: !!analyticsInput?.checked,
    marketing: !!marketingInput?.checked,
  });
}));

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCookieModal();
});
