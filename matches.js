/**
 * SkillSwap — Matches page
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = getActiveUser();
  showProfileBanner(user);
  allMatches = getMatchesForUser(user);
  renderMatches(allMatches);
  initMatchFilters();
  initSwapModal();
});

function getActiveUser() {
  const saved = localStorage.getItem('skillswap-profile');
  if (saved) {
    try {
      const p = JSON.parse(saved);
      return {
        id: 'custom-user',
        name: `${p.firstName} ${p.lastName}`,
        location: p.location,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.firstName}`,
        bio: p.bio,
        teach: p.teach,
        learn: p.learn
      };
    } catch { /* fall through */ }
  }
  return CURRENT_USER;
}

function showProfileBanner(user) {
  const banner = document.getElementById('user-profile-banner');
  if (!banner) return;

  banner.style.display = 'block';
  document.getElementById('banner-name').textContent = user.name;
  document.getElementById('banner-teach').innerHTML = renderSkillTags(user.teach, 'teach');
  document.getElementById('banner-learn').innerHTML = renderSkillTags(user.learn, 'learn');
}

let allMatches = [];

function renderMatches(matches) {
  const grid = document.getElementById('matches-grid');
  const empty = document.getElementById('matches-empty');
  if (!grid) return;

  if (matches.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = matches.map(m => renderMatchCard(m)).join('');
  initScrollAnimations();
}

function initMatchFilters() {
  const searchInput = document.getElementById('match-search');
  const sortSelect = document.getElementById('match-sort');

  function applyFilters() {
    let filtered = [...allMatches];
    const q = searchInput?.value.trim().toLowerCase();

    if (q) {
      filtered = filtered.filter(m =>
        m.user.name.toLowerCase().includes(q) ||
        m.user.location.toLowerCase().includes(q) ||
        m.youLearn.some(s => s.toLowerCase().includes(q)) ||
        m.youTeach.some(s => s.toLowerCase().includes(q))
      );
    }

    const sort = sortSelect?.value || 'score';
    if (sort === 'name') {
      filtered.sort((a, b) => a.user.name.localeCompare(b.user.name));
    } else if (sort === 'sessions') {
      filtered.sort((a, b) => b.user.sessions - a.user.sessions);
    } else {
      filtered.sort((a, b) => b.score - a.score);
    }

    renderMatches(filtered);
  }

  let debounce;
  searchInput?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(applyFilters, 250);
  });

  sortSelect?.addEventListener('change', applyFilters);
}

function initSwapModal() {
  initModal('swap-modal');

  document.getElementById('confirm-swap')?.addEventListener('click', () => {
    const name = document.querySelector('.modal-user-name')?.textContent;
    closeModal('swap-modal');
    showToast(`Swap request sent to ${name}!`);
  });
}
