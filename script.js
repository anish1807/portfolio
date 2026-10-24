// Nav: add scrolled class for border
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinksList = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinksList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Animated stat counters (runs once when About section enters viewport)
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  if (prefersReducedMotion) { el.textContent = target; return; }
  const duration = 1200;
  const step = Math.ceil(duration / target);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + 1, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, step);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) statsObserver.observe(aboutSection);

// Fade-in on scroll for cards and timeline items
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const fadeTargets = document.querySelectorAll(
  '.skill-category, .project-card, .timeline-item, .contact-card, .stat-card'
);

// Stagger within each section, so items further down the page don't wait longer
fadeTargets.forEach((el) => {
  if (prefersReducedMotion) return;
  const siblings = el.closest('section').querySelectorAll(
    '.skill-category, .project-card, .timeline-item, .contact-card, .stat-card'
  );
  const i = Array.prototype.indexOf.call(siblings, el);
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  fadeObserver.observe(el);
});

// Active nav link highlight based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeLinkObserver.observe(s));
