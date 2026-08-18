/**
 * SkillSwap — Home page
 */

document.addEventListener('DOMContentLoaded', () => {
  renderHeroBackgroundCards();
  renderHomeMatches();
  initSwapModal();
});

function renderHeroBackgroundCards() {
  const container = document.getElementById('hero-bg-cards');
  if (!container) return;

  const featured = [
    { user: getUserById('william-foster'), match: getMatchesForUser(CURRENT_USER).find(m => m.user.id === 'william-foster') },
    { user: getUserById('robert-kim'), match: getMatchesForUser(CURRENT_USER).find(m => m.user.id === 'robert-kim') },
    { user: getUserById('sarah-johnson'), match: getMatchesForUser(CURRENT_USER).find(m => m.user.id === 'sarah-johnson') },
    { user: getUserById('james-rivera'), match: getMatchesForUser(CURRENT_USER).find(m => m.user.id === 'james-rivera') },
    { user: getUserById('elena-vasquez'), match: getMatchesForUser(CURRENT_USER).find(m => m.user.id === 'elena-vasquez') }
  ].filter(f => f.user && f.match);

  container.innerHTML = featured.map(({ user, match }) => `
    <div class="glass-card hero-bg-card">
      <div class="match-card-header">
        <img class="avatar" src="${user.avatar}" alt="${user.name}">
        <div>
          <div class="match-card-name">${user.name.split(' ')[0]}</div>
        </div>
      </div>
      ${match.youLearn.length ? `
        <div class="match-card-section">
          <h4>Learn:</h4>
          <div class="skill-tags">${renderSkillTags(match.youLearn.slice(0, 2), 'learn')}</div>
        </div>
      ` : ''}
      ${match.youTeach.length ? `
        <div class="match-card-section">
          <h4>Teach:</h4>
          <div class="skill-tags">${renderSkillTags(match.youTeach.slice(0, 2), 'teach')}</div>
        </div>
      ` : ''}
      <div class="match-level">
        <span class="match-level-value">${match.score}%</span>
      </div>
    </div>
  `).join('');
}

function renderHomeMatches() {
  const container = document.getElementById('home-matches');
  if (!container) return;

  const topMatches = DEMO_MATCHES.slice(0, 4);
  container.innerHTML = topMatches.map(m => renderMatchCard(m)).join('');
  initScrollAnimations();
}

function initSwapModal() {
  initModal('swap-modal');

  document.getElementById('confirm-swap')?.addEventListener('click', () => {
    const name = document.querySelector('.modal-user-name')?.textContent;
    closeModal('swap-modal');
    showToast(`Swap request sent to ${name}!`);
  });
}
