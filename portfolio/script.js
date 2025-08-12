const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const themeToggle = document.getElementById('themeToggle');
const yearEl = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Optional: Set this to your Formspree/EmailJS or custom endpoint
const CONTACT_ENDPOINT = '';

function setYear() {
  const now = new Date();
  if (yearEl) yearEl.textContent = String(now.getFullYear());
}

function setupNavToggle() {
  if (!navToggle || !nav) return;
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close menu on link click (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function setupThemeToggle() {
  if (!themeToggle) return;
  const stored = localStorage.getItem('theme') || 'dark';
  document.documentElement.dataset.theme = stored;
  themeToggle.textContent = stored === 'dark' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function validateForm(data) {
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  const message = data.get('message')?.toString().trim();
  const consent = data.get('consent');
  if (!name || !email || !message) return 'Please complete all required fields.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (!consent) return 'Please provide consent to submit the form.';
  return '';
}

async function handleContactSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;
  formStatus.textContent = '';

  const formData = new FormData(contactForm);
  const error = validateForm(formData);
  if (error) {
    formStatus.textContent = error;
    return;
  }

  const payload = Object.fromEntries(formData.entries());

  try {
    if (CONTACT_ENDPOINT) {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      formStatus.textContent = 'Thanks! Your message has been sent.';
      contactForm.reset();
      return;
    }

    // Fallback: open mail client
    const subject = encodeURIComponent(payload.subject ? String(payload.subject) : 'Portfolio Inquiry');
    const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
    formStatus.textContent = 'Opening your email client...';
  } catch (err) {
    formStatus.textContent = 'Something went wrong. Please try again later.';
  }
}

function init() {
  setYear();
  setupNavToggle();
  setupThemeToggle();
  setupSmoothScroll();
  if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
}

document.addEventListener('DOMContentLoaded', init);