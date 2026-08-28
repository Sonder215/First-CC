/* ============================================================
   MAIN.JS — Shared Utilities, Navigation, Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initScrollAnimations();
  initReadingProgress();
  initSkillBars();
  initWorkflowLinks();
});

/* ============================================================
   NAVIGATION
   ============================================================ */

function initNavigation() {
  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Highlight active page in nav
  const currentPage = getCurrentPage();
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
}

function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  if (filename === '' || filename === 'index.html') return 'home';
  if (filename === 'about.html') return 'about';
  if (filename === 'thoughts.html') return 'thoughts';
  if (filename === 'post.html') return 'thoughts'; // highlight Thoughts nav on post pages
  return '';
}

/* ============================================================
   SCROLL EFFECTS
   ============================================================ */

function initScrollEffects() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================================
   INTERSECTION OBSERVER — Fade-up animations
   ============================================================ */

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — elements can re-animate on re-scroll
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   READING PROGRESS BAR (Post page only)
   ============================================================ */

function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress .bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

/* ============================================================
   SKILL BARS ANIMATION (About page)
   ============================================================ */

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar .fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   WORKFLOW STEP LINKS — guaranteed navigation
   ============================================================ */

function initWorkflowLinks() {
  // Force plain left-clicks on workflow step links to navigate, even if
  // another handler stops propagation or suppresses the default action.
  document.addEventListener('click', (event) => {
    const target = event.target && event.target.closest
      ? event.target.closest('a.wf-step')
      : null;
    if (!target) return;

    // Keep modified / middle clicks on their default (new tab etc.) behavior.
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    window.location.href = target.href;
  }, true);
}
