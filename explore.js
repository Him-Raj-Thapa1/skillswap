/**
 * SkillSwap — Explore page (search & filter)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderUsers(USERS);
  initSearch();
  initFilters();
});

let currentFilter = 'all';
let searchQuery = '';

function renderUsers(users) {
  const grid = document.getElementById('users-grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('results-count');
  if (!grid) return;

  if (users.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    count.textContent = '0 members found';
    return;
  }

  empty.style.display = 'none';
  count.textContent = `${users.length} member${users.length !== 1 ? 's' : ''} found`;
  grid.innerHTML = users.map(u => renderUserCard(u)).join('');
  initScrollAnimations();
}

function filterUsers() {
  let filtered = [...USERS];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q) ||
      u.teach.some(s => s.toLowerCase().includes(q)) ||
      u.learn.some(s => s.toLowerCase().includes(q))
    );
  }

  if (currentFilter === 'teach') {
    filtered.sort((a, b) => b.teach.length - a.teach.length);
  } else if (currentFilter === 'learn') {
    filtered.sort((a, b) => b.learn.length - a.learn.length);
  }

  renderUsers(filtered);
}

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = input.value.trim();
      filterUsers();
    }, 250);
  });
}

function initFilters() {
  const chips = document.getElementById('filter-chips');
  if (!chips) return;

  chips.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    chips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.dataset.filter;
    filterUsers();
  });
}
