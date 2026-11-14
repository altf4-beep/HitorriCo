function updateUI() {
  const now = new Date();
  document.getElementById('real-date-pill').textContent = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  document.getElementById('header-user-name').textContent = state.userName || 'Friend';
  document.getElementById('header-bday-label').textContent = `${getMonthName(state.birthdayMonth)} ${state.birthdayDay}`;

  document.getElementById('currency-balance').textContent = state.dewdrops;
  document.getElementById('premium-header-badge').classList.toggle('hidden', !state.isPremium);

  const customCount = getCustomGoalsCount();
  const limitBadge = document.getElementById('goal-limit-badge');
  const upgradeBtn = document.getElementById('btn-open-premium');
  if (state.isPremium) {
    limitBadge.textContent = `Custom Goals: ${customCount} (Unlimited ✨)`;
    limitBadge.classList.add('bg-[#E6B86A]/20', 'text-amber-800', 'dark:text-amber-200');
    upgradeBtn.classList.add('hidden');
  } else {
    limitBadge.textContent = `Custom Goals: ${customCount} / ${MAX_FREE_CUSTOM_GOALS} Free`;
    upgradeBtn.classList.remove('hidden');
  }

  document.getElementById('pet-display-name').textContent = state.petName;
  const speciesNames = { sprout: 'Sprout Spirit', cloud: 'Cloud Cat', fox: 'Pebble Fox' };
  document.getElementById('pet-species-label').textContent = speciesNames[state.species] || 'Companion';

  const xpNeeded = state.level * 100;
  document.getElementById('pet-level').textContent = state.level;
  document.getElementById('xp-current').textContent = state.xp;
  document.getElementById('xp-next').textContent = xpNeeded;
  document.getElementById('bar-xp').style.width = `${Math.min(100, Math.round((state.xp / xpNeeded) * 100))}%`;

  document.getElementById('val-vitality').textContent = `${state.vitality}%`;
  document.getElementById('bar-vitality').style.width = `${state.vitality}%`;

  document.getElementById('val-mind').textContent = `${state.mind}%`;
  document.getElementById('bar-mind').style.width = `${state.mind}%`;

  document.getElementById('val-joy').textContent = `${state.joy}%`;
  document.getElementById('bar-joy').style.width = `${state.joy}%`;

  const imbalanceMsg = checkCategoryImbalance();
  const imbalanceBanner = document.getElementById('imbalance-banner');
  if (imbalanceMsg) {
    imbalanceBanner.classList.remove('hidden');
    document.getElementById('imbalance-text').textContent = imbalanceMsg;
  } else {
    imbalanceBanner.classList.add('hidden');
  }

  document.getElementById('card-stat-body').classList.toggle('ring-2', state.vitality < 45);
  document.getElementById('card-stat-body').classList.toggle('ring-amber-400', state.vitality < 45);
  document.getElementById('card-stat-mind').classList.toggle('ring-2', state.mind < 45);
  document.getElementById('card-stat-mind').classList.toggle('ring-amber-400', state.mind < 45);
  document.getElementById('card-stat-joy').classList.toggle('ring-2', state.joy < 45);
  document.getElementById('card-stat-joy').classList.toggle('ring-amber-400', state.joy < 45);

  const celebration = getActiveCelebration();
  renderCelebrationDecor(celebration);

  const avg = (state.vitality + state.mind + state.joy) / 3;
  const moodBadge = document.getElementById('pet-mood-badge');
  if (celebration.type === 'birthday') {
    moodBadge.innerHTML = '<span>🎂</span><span>Party!</span>';
  } else if (avg >= 78) {
    moodBadge.innerHTML = '<span>✨</span><span>Radiant</span>';
  } else if (avg >= 58) {
    moodBadge.innerHTML = '<span>🌿</span><span>Serene</span>';
  } else {
    moodBadge.innerHTML = '<span>⚖️</span><span>Off-Balance</span>';
  }

  document.querySelectorAll('.mood-choice').forEach(btn => {
    if (btn.dataset.mood === state.currentMood) {
      btn.classList.add('ring-2', 'ring-[#88A88E]', 'bg-[#88A88E]/10');
    } else {
      btn.classList.remove('ring-2', 'ring-[#88A88E]', 'bg-[#88A88E]/10');
    }
  });

  document.getElementById('pet-dialogue').textContent = state.dialogue;

  renderPetSVG();
  renderTasks();
  renderDeepQuests();
  renderBoutique();
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bgClass = type === 'level'
    ? 'bg-[#D98A6C] text-white'
    : 'bg-[#3D3834] text-[#FAF7F2]';

  toast.className = `${bgClass} px-4 py-3 rounded-2xl shadow-lg text-xs font-semibold flex items-center gap-2.5 transform transition-all duration-300 translate-y-0 opacity-100`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'level' ? 'fa-star text-amber-200' : 'fa-leaf text-[#88A88E]'}"></i>
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
