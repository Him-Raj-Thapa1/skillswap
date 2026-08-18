/**
 * SkillSwap — Profile page
 */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id') || 'maya-chen';
  const user = getUserById(userId);

  if (!user) {
    document.getElementById('profile-container').style.display = 'none';
    document.getElementById('profile-not-found').style.display = 'block';
    return;
  }

  renderProfile(user);
  initSwapModal(user.name);
});

function renderProfile(user) {
  const match = calculateMatchScore(CURRENT_USER, user);
  const container = document.getElementById('profile-container');

  container.innerHTML = `
    <aside class="glass-card profile-sidebar fade-in">
      <img class="avatar avatar-lg" src="${user.avatar}" alt="${user.name}">
      <h1 class="profile-name">${user.name}</h1>
      <p class="profile-meta">${user.location} · Member since ${user.memberSince}</p>
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-value">${user.sessions}</div>
          <div class="profile-stat-label">Sessions</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${user.rating}</div>
          <div class="profile-stat-label">Rating</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${match.score}%</div>
          <div class="profile-stat-label">Match</div>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn btn-primary swap-request-btn" data-user-id="${user.id}" data-user-name="${user.name}">Request skill swap</button>
        <button class="btn btn-outline" id="share-profile">Share profile</button>
      </div>
    </aside>

    <div class="profile-main">
      <section class="glass-card profile-section fade-in">
        <h3><span class="icon">👤</span> About</h3>
        <p class="profile-bio">${user.bio}</p>
      </section>

      <section class="glass-card profile-section fade-in">
        <h3><span class="icon">🎓</span> Skills I can teach</h3>
        <div class="skill-tags" style="margin-top: 4px;">
          ${renderSkillTags(user.teach, 'teach')}
        </div>
      </section>

      <section class="glass-card profile-section fade-in">
        <h3><span class="icon">📚</span> Skills I want to learn</h3>
        <div class="skill-tags" style="margin-top: 4px;">
          ${renderSkillTags(user.learn, 'learn')}
        </div>
      </section>

      ${match.youLearn.length || match.youTeach.length ? `
        <section class="glass-card profile-section fade-in">
          <h3><span class="icon">🤝</span> Your match with ${user.name.split(' ')[0]}</h3>
          ${match.youLearn.length ? `
            <div class="match-card-section">
              <h4>You can learn from ${user.name.split(' ')[0]}:</h4>
              <div class="skill-tags">${renderSkillTags(match.youLearn, 'learn')}</div>
            </div>
          ` : ''}
          ${match.youTeach.length ? `
            <div class="match-card-section">
              <h4>You can teach ${user.name.split(' ')[0]}:</h4>
              <div class="skill-tags">${renderSkillTags(match.youTeach, 'teach')}</div>
            </div>
          ` : ''}
          <div class="match-level">
            <span class="match-level-value">${match.score}%</span>
            <span class="match-level-label">compatibility</span>
          </div>
        </section>
      ` : ''}

      <section class="fade-in">
        <h3 style="margin-bottom: 16px; font-size: 1.125rem;">Browse other members</h3>
        <div class="cards-grid" id="related-users"></div>
      </section>
    </div>
  `;

  document.title = `${user.name} — SkillSwap`;

  const related = USERS.filter(u => u.id !== user.id).slice(0, 3);
  document.getElementById('related-users').innerHTML = related.map(u => renderUserCard(u)).join('');

  document.getElementById('share-profile')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Profile link copied!');
  });

  initScrollAnimations();
}

function initSwapModal(userName) {
  initModal('swap-modal');

  document.getElementById('confirm-swap')?.addEventListener('click', () => {
    closeModal('swap-modal');
    showToast(`Swap request sent to ${userName}!`);
  });
}
