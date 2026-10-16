/* ══════════════════════════════════════════════════════════════
   PORTFOLIO WEBSITE — script.js
   Alex Carter | Web Developer
══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations after load
    document.querySelector('.hero-content')?.classList.add('loaded');
  }, 800);
});

/* ─── DARK / LIGHT MODE ──────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const htmlEl      = document.documentElement;

// Persist theme across refreshes
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ─── STICKY NAVBAR ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  updateActiveNavLink();
  handleScrollTop();
}, { passive: true });

/* ─── HAMBURGER MENU ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
});

// Close menu on nav link click (mobile)
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar?.contains(e.target)) {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  }
});

/* ─── ACTIVE NAV LINK ON SCROLL ──────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add('active');
    }
  });
}

/* ─── TYPEWRITER EFFECT ──────────────────────────────────────── */
const typedEl = document.getElementById('typed-text');
const roles   = [
  'Frontend Developer',
  'React Developer',
  'TypeScript Engineer',
  'UI/UX Enthusiast',
  'Open Source Builder',
  'JavaScript Developer'
];

let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
let typeTimeout;

function typeWriter() {
  const current = roles[roleIndex];
  const speed   = isDeleting ? 60 : 110;

  if (typedEl) {
    typedEl.textContent = current.substring(0, charIndex);
  }

  if (!isDeleting && charIndex === current.length) {
    // Pause at end of word
    typeTimeout = setTimeout(() => {
      isDeleting = true;
      typeWriter();
    }, 1800);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    roleIndex   = (roleIndex + 1) % roles.length;
    typeTimeout = setTimeout(typeWriter, 400);
    return;
  }

  charIndex += isDeleting ? -1 : 1;
  typeTimeout = setTimeout(typeWriter, speed);
}

setTimeout(typeWriter, 1200);

/* ─── SCROLL REVEAL ANIMATION ────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
      let delay = 0;
      if (siblings && siblings.length > 1) {
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 100;
        });
      }
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ─── SKILL PROGRESS BARS ────────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const width  = target.getAttribute('data-width') || '0';
      setTimeout(() => {
        target.style.width = width + '%';
      }, 200);
      barObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ─── ANIMATED COUNTERS ──────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

/* ─── PROJECT FILTER ─────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.includes(filter);

      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      if (show) {
        card.classList.remove('hidden');
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

/* ─── CONTACT FORM VALIDATION ────────────────────────────────── */
const form        = document.getElementById('contact-form');
const nameInput   = document.getElementById('input-name');
const emailInput  = document.getElementById('input-email');
const subjectInput = document.getElementById('input-subject');
const msgInput    = document.getElementById('input-message');
const sendBtn     = document.getElementById('btn-send-message');
const successMsg  = document.getElementById('form-success');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Show loading state
  const btnText    = sendBtn.querySelector('.btn-text');
  const btnLoading = sendBtn.querySelector('.btn-loading');
  btnText.style.display    = 'none';
  btnLoading.style.display = 'flex';
  sendBtn.disabled = true;

  // Simulate form submission (replace with actual API call)
  await new Promise(res => setTimeout(res, 1800));

  // Reset
  btnText.style.display    = 'inline-flex';
  btnLoading.style.display = 'none';
  sendBtn.disabled = false;

  // Show success
  form.reset();
  clearErrors();
  successMsg.style.display = 'flex';
  setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
});

function validateForm() {
  let valid = true;
  clearErrors();

  const name    = nameInput?.value.trim();
  const email   = emailInput?.value.trim();
  const subject = subjectInput?.value.trim();
  const message = msgInput?.value.trim();

  if (!name || name.length < 2) {
    setError('input-name', 'error-name', 'Please enter your full name (min. 2 characters).');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    setError('input-email', 'error-email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!subject || subject.length < 3) {
    setError('input-subject', 'error-subject', 'Please enter a subject (min. 3 characters).');
    valid = false;
  }

  if (!message || message.length < 10) {
    setError('input-message', 'error-message', 'Please write a message (min. 10 characters).');
    valid = false;
  }

  return valid;
}

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input?.classList.add('error');
  if (error) error.textContent = message;
}

function clearErrors() {
  ['input-name','input-email','input-subject','input-message'].forEach(id => {
    document.getElementById(id)?.classList.remove('error');
  });
  ['error-name','error-email','error-subject','error-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// Live validation: clear error on input
[nameInput, emailInput, subjectInput, msgInput].forEach(input => {
  input?.addEventListener('input', () => {
    input.classList.remove('error');
    const errorId = 'error-' + input.name;
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = '';
  });
});

/* ─── SCROLL TO TOP ──────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scroll-top');

function handleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn?.classList.add('visible');
  } else {
    scrollTopBtn?.classList.remove('visible');
  }
}

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── HERO PARTICLES ─────────────────────────────────────────── */
(function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#a78bfa'];
  const count  = 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size     = Math.random() * 4 + 1;
    const left     = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay    = Math.random() * 10;
    const color    = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${left}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay:    ${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ─── SKILL CARD HOVER TILT ──────────────────────────────────── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const midX   = rect.width / 2;
    const midY   = rect.height / 2;
    const rotX   = ((y - midY) / midY) * -8;
    const rotY   = ((x - midX) / midX) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── PROJECT CARD HOVER TILT ────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotX = ((y - midY) / midY) * -4;
    const rotY = ((x - midX) / midX) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── RESUME DOWNLOAD NOTIFICATION ──────────────────────────── */
const downloadBtn = document.getElementById('btn-download-resume');
downloadBtn?.addEventListener('click', (e) => {
  // Show toast notification
  showToast('📄 Resume download started!', 'success');
});

/* ─── TOAST NOTIFICATION ─────────────────────────────────────── */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 30px;
    background: var(--clr-surface);
    border: 1px solid var(--clr-border);
    color: var(--clr-text);
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 9998;
    transform: translateX(200%);
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    font-family: var(--font-main);
    border-left: 4px solid var(--clr-accent);
  `;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
  });

  // Animate out
  setTimeout(() => {
    toast.style.transform = 'translateX(200%)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ─── INIT SCROLL POSITION ───────────────────────────────────── */
// Trigger on initial load
updateActiveNavLink();
handleScrollTop();
