(function () {
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('theme');
  const isLight = savedTheme ? savedTheme === 'light' : prefersLight;
  if (isLight) document.documentElement.classList.add('light');
  document.documentElement.classList.remove('no-js');

  const defaultContent = {
    profile: {
      name: 'Your Name',
      role: 'Software Engineer',
      location: 'City, Country',
      summary:
        'I build reliable, accessible, and user-focused products. I enjoy working across the stack, mentoring teams, and shipping delightful features.',
      avatarUrl: 'https://picsum.photos/seed/profile/480/480',
      socials: [
        { name: 'GitHub', url: 'https://github.com/yourname' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/yourname' },
        { name: 'X', url: 'https://x.com/yourname' }
      ],
      topTechnologies: ['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'AWS']
    },
    experience: [
      {
        company: 'Acme Corp',
        role: 'Senior Software Engineer',
        period: '2022 — Present',
        location: 'Remote',
        achievements: [
          'Led migration to a modern React/TypeScript stack; improved performance by 35%.',
          'Built CI pipeline reducing deployment time from 20 minutes to 5 minutes.',
          'Mentored 5 engineers and established code quality guidelines.'
        ],
        technologies: ['TypeScript', 'React', 'Node.js', 'GraphQL', 'AWS']
      },
      {
        company: 'Globex',
        role: 'Software Engineer',
        period: '2019 — 2022',
        location: 'On-site',
        achievements: [
          'Delivered a multi-tenant platform serving 100k+ monthly users.',
          'Designed database schemas and improved query performance by 50%.'
        ],
        technologies: ['JavaScript', 'Express', 'PostgreSQL', 'Redis']
      }
    ],
    projects: [
      {
        name: 'Project One',
        description: 'A web app that helps users track and visualize habits with beautiful charts.',
        technologies: ['React', 'D3.js', 'Firebase'],
        link: 'https://example.com',
        source: 'https://github.com/yourname/project-one',
        image: 'https://picsum.photos/seed/project1/600/400'
      },
      {
        name: 'Project Two',
        description: 'CLI tool that automates project scaffolding and best practices.',
        technologies: ['Node.js', 'TypeScript'],
        link: 'https://example.com',
        source: 'https://github.com/yourname/project-two',
        image: 'https://picsum.photos/seed/project2/600/400'
      },
      {
        name: 'Project Three',
        description: 'Mobile app for personal finance tracking and budgeting.',
        technologies: ['React Native'],
        link: 'https://example.com',
        source: 'https://github.com/yourname/project-three',
        image: 'https://picsum.photos/seed/project3/600/400'
      }
    ],
    education: [
      {
        institution: 'State University',
        degree: 'B.S. in Computer Science',
        period: '2015 — 2019',
        details: 'Graduated with honors. Coursework in algorithms, databases, distributed systems.'
      }
    ],
    contact: {
      email: 'you@example.com',
      formEndpoint: ''
    }
  };

  async function loadContent() {
    try {
      const res = await fetch('data/content.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch content.json');
      return await res.json();
    } catch (err) {
      return defaultContent;
    }
  }

  function setText(el, text) { if (el) el.textContent = text; }
  function createEl(tag, opts = {}) { const el = document.createElement(tag); Object.assign(el, opts); return el; }

  function renderProfile(profile) {
    setText(document.getElementById('profile-name'), profile.name);
    setText(document.getElementById('footer-name'), profile.name);
    setText(document.getElementById('profile-role'), profile.role + (profile.location ? ' · ' + profile.location : ''));
    setText(document.getElementById('contact-email'), profile.email || content.contact.email);
    const emailLink = document.getElementById('contact-email');
    if (emailLink) emailLink.href = `mailto:${content.contact.email || profile.email}`;

    const avatar = document.getElementById('profile-avatar');
    if (avatar) avatar.src = profile.avatarUrl || avatar.src;

    setText(document.getElementById('profile-summary'), profile.summary);

    const socials = document.getElementById('profile-socials');
    if (socials) {
      socials.innerHTML = '';
      (profile.socials || []).forEach((s) => {
        const a = createEl('a', { href: s.url, target: '_blank', rel: 'noreferrer noopener' });
        a.textContent = s.name;
        socials.appendChild(a);
      });
    }

    const techList = document.getElementById('about-tech');
    if (techList) {
      techList.innerHTML = '';
      (profile.topTechnologies || []).forEach((t) => {
        const li = createEl('li');
        li.textContent = t;
        techList.appendChild(li);
      });
    }
  }

  function renderExperience(items) {
    const list = document.getElementById('experience-list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((item) => {
      const li = createEl('li');
      const card = createEl('div');
      card.className = 'card';
      const h3 = createEl('h3');
      h3.textContent = `${item.role} · ${item.company}`;
      const meta = createEl('div');
      meta.className = 'muted';
      meta.textContent = `${item.period}${item.location ? ' · ' + item.location : ''}`;
      const ul = createEl('ul');
      (item.achievements || []).forEach((a) => { const liA = createEl('li'); liA.textContent = a; ul.appendChild(liA); });
      const tags = createEl('div');
      tags.className = 'tags';
      (item.technologies || []).forEach((t) => { const tag = createEl('span'); tag.className = 'tag'; tag.textContent = t; tags.appendChild(tag); });
      card.append(h3, meta, ul, tags);
      li.appendChild(card);
      list.appendChild(li);
    });
  }

  function renderProjects(items) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((p) => {
      const card = createEl('article');
      card.className = 'card project';
      const thumb = createEl('div'); thumb.className = 'thumb';
      const img = createEl('img'); img.src = p.image; img.alt = `${p.name} screenshot`;
      thumb.appendChild(img);
      const h3 = createEl('h3'); h3.textContent = p.name;
      const desc = createEl('p'); desc.className = 'muted'; desc.textContent = p.description;
      const tags = createEl('div'); tags.className = 'tags';
      (p.technologies || []).forEach((t) => { const tag = createEl('span'); tag.className = 'tag'; tag.textContent = t; tags.appendChild(tag); });
      const links = createEl('div'); links.className = 'links';
      if (p.link) { const live = createEl('a', { href: p.link, target: '_blank', rel: 'noreferrer noopener' }); live.className = 'btn'; live.textContent = 'Live'; links.appendChild(live); }
      if (p.source) { const src = createEl('a', { href: p.source, target: '_blank', rel: 'noreferrer noopener' }); src.className = 'btn'; src.textContent = 'Source'; links.appendChild(src); }
      card.append(thumb, h3, desc, tags, links);
      grid.appendChild(card);
    });
  }

  function renderEducation(items) {
    const list = document.getElementById('education-list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((e) => {
      const li = createEl('li');
      const card = createEl('div'); card.className = 'card';
      const h3 = createEl('h3'); h3.textContent = `${e.degree} · ${e.institution}`;
      const meta = createEl('div'); meta.className = 'muted'; meta.textContent = e.period;
      const p = createEl('p'); p.textContent = e.details;
      card.append(h3, meta, p);
      li.appendChild(card);
      list.appendChild(li);
    });
  }

  function validateForm(form) {
    let valid = true;
    const setErr = (name, msg) => {
      const el = form.querySelector(`[data-error-for="${name}"]`);
      if (el) el.textContent = msg || '';
    };
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    setErr('name'); setErr('email'); setErr('message');
    if (!name) { setErr('name', 'Please enter your name'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('email', 'Please enter a valid email'); valid = false; }
    if (message.length < 10) { setErr('message', 'Message should be at least 10 characters'); valid = false; }
    return valid;
  }

  async function submitForm(form, endpoint, fallbackEmail) {
    const status = document.getElementById('form-status');
    const payload = { name: form.name.value, email: form.email.value, message: form.message.value };
    if (!endpoint) {
      const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
      const body = encodeURIComponent(`${payload.message}\n\nFrom: ${payload.name} <${payload.email}>`);
      window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
      if (status) status.textContent = 'Opening your email client...';
      return;
    }
    try {
      if (status) status.textContent = 'Sending...';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed');
      if (status) status.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    } catch (e) {
      if (status) status.textContent = 'Something went wrong. Please try again later or email me directly.';
    }
  }

  function setupNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
      const isLightNow = document.documentElement.classList.contains('light');
      localStorage.setItem('theme', isLightNow ? 'light' : 'dark');
    });
  }

  let content = defaultContent;
  document.addEventListener('DOMContentLoaded', async () => {
    setupNav();
    setupThemeToggle();
    content = await loadContent();

    renderProfile(content.profile || {});
    renderExperience(content.experience || []);
    renderProjects(content.projects || []);
    renderEducation(content.education || []);

    const aboutText = document.getElementById('about-text');
    if (aboutText && content.profile && content.profile.summary) aboutText.textContent = content.profile.summary;

    const year = document.getElementById('year'); if (year) year.textContent = String(new Date().getFullYear());

    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(form)) return;
        await submitForm(form, content.contact && content.contact.formEndpoint, content.contact && content.contact.email);
      });
    }
  });
})();