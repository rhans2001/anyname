document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', href);
        }
      }
    });
  });

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Contact form
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  function setStatus(message, type = '') {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('success', 'error');
    if (type) status.classList.add(type);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      if (!data.name || !data.email || !data.message) {
        setStatus('Please fill out all fields.', 'error');
        return;
      }

      try {
        setStatus('Sending…');
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = body?.error || 'Failed to send message.';
          setStatus(msg, 'error');
          return;
        }
        setStatus(body.delivered ? 'Message sent! I will get back to you soon.' : 'Message received! (Email delivery disabled in this environment.)', 'success');
        form.reset();
      } catch (err) {
        setStatus('Network error. Please try again.', 'error');
      }
    });
  }
});