/**
 * SkillSwap — Shared UI utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCookieBanner();
  initScrollAnimations();
  initHeaderScroll();
});

/** Navigation & mobile menu */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/** Cookie consent banner */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  if (localStorage.getItem('skillswap-cookies') === 'accepted') return;

  setTimeout(() => banner.classList.add('show'), 1500);

  banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('skillswap-cookies', 'accepted');
    banner.classList.remove('show');
  });
}

/** Intersection observer for fade-in animations */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/** Header background on scroll */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/** Show toast notification */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => toast.classList.remove('show'), 3000);
}

/** Open/close modal */
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/** Setup modal close handlers */
function initModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modalId));
  overlay.querySelector('.modal-cancel')?.addEventListener('click', () => closeModal(modalId));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(modalId);
  });
}

/** Render skill tags HTML */
function renderSkillTags(skills, type = '') {
  const cls = type ? `skill-tag ${type}` : 'skill-tag';
  return skills.map(s => `<span class="${cls}">${s}</span>`).join('');
}

/** Render a match card */
function renderMatchCard(match, options = {}) {
  const { user, score, youLearn, youTeach } = match;
  const showActions = options.showActions !== false;
  const compact = options.compact || false;

  return `
    <article class="glass-card match-card fade-in" data-user-id="${user.id}">
      <div class="match-card-header">
        <img class="avatar" src="${user.avatar}" alt="${user.name}" loading="lazy">
        <div>
          <div class="match-card-name">${user.name}</div>
          <div class="match-card-location">${user.location}</div>
        </div>
      </div>
      ${youLearn.length ? `
        <div class="match-card-section">
          <h4>You can learn from ${user.name.split(' ')[0]}:</h4>
          <div class="skill-tags">${renderSkillTags(youLearn, 'learn')}</div>
        </div>
      ` : ''}
      ${youTeach.length ? `
        <div class="match-card-section">
          <h4>You can teach ${user.name.split(' ')[0]}:</h4>
          <div class="skill-tags">${renderSkillTags(youTeach, 'teach')}</div>
        </div>
      ` : ''}
      <div class="match-level">
        <span class="match-level-value">${score}%</span>
        <span class="match-level-label">match level</span>
      </div>
      ${showActions ? `
        <div class="match-card-actions">
          <a href="profile.html?id=${user.id}" class="btn btn-outline btn-sm">Go to profile</a>
          <button class="btn btn-primary btn-sm swap-request-btn" data-user-id="${user.id}" data-user-name="${user.name}">Start chat</button>
        </div>
      ` : ''}
    </article>
  `;
}

/** Render user card for explore grid */
function renderUserCard(user) {
  return `
    <article class="glass-card user-card fade-in" data-user-id="${user.id}" onclick="window.location.href='profile.html?id=${user.id}'">
      <div class="user-card-top">
        <img class="avatar" src="${user.avatar}" alt="${user.name}" loading="lazy">
        <div>
          <div class="match-card-name">${user.name}</div>
          <div class="match-card-location">${user.location}</div>
        </div>
      </div>
      <p class="user-card-bio">${user.bio}</p>
      <div class="user-card-skills">
        <h5>Can teach</h5>
        <div class="skill-tags">${renderSkillTags(user.teach.slice(0, 3), 'teach')}</div>
      </div>
      <div class="user-card-skills">
        <h5>Wants to learn</h5>
        <div class="skill-tags">${renderSkillTags(user.learn.slice(0, 3), 'learn')}</div>
      </div>
    </article>
  `;
}

/** Init swap request buttons */
function initSwapRequestButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.swap-request-btn');
    if (!btn) return;

    const userName = btn.dataset.userName;
    const modal = document.getElementById('swap-modal');
    if (modal) {
      modal.querySelector('.modal-user-name').textContent = userName;
      openModal('swap-modal');
    } else {
      showToast(`Swap request sent to ${userName}!`);
    }
  });
}

document.addEventListener('DOMContentLoaded', initSwapRequestButtons);

/** SVG logo icon */
const LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="8" r="3" fill="#3B82F6"/>
  <circle cx="8" cy="20" r="3" fill="#3B82F6" opacity="0.7"/>
  <circle cx="24" cy="20" r="3" fill="#3B82F6" opacity="0.7"/>
  <circle cx="16" cy="24" r="2.5" fill="#3B82F6" opacity="0.5"/>
  <line x1="16" y1="11" x2="8" y2="17" stroke="#3B82F6" stroke-width="1.5" opacity="0.4"/>
  <line x1="16" y1="11" x2="24" y2="17" stroke="#3B82F6" stroke-width="1.5" opacity="0.4"/>
  <line x1="8" y1="20" x2="16" y2="24" stroke="#3B82F6" stroke-width="1.5" opacity="0.3"/>
  <line x1="24" y1="20" x2="16" y2="24" stroke="#3B82F6" stroke-width="1.5" opacity="0.3"/>
</svg>`;
