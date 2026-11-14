function getCustomGoalsCount() {
  return state.tasks.filter(t => t.custom).length;
}

function addCustomTask(event) {
  event.preventDefault();
  const customCount = getCustomGoalsCount();

  if (!state.isPremium && customCount >= MAX_FREE_CUSTOM_GOALS) {
    SoundEngine.playSoftClick();
    openPremiumModal();
    return;
  }

  const input = document.getElementById('custom-task-title');
  const select = document.getElementById('custom-task-category');
  const title = input.value.trim();
  if (!title) return;

  const category = select.value;
  const icons = { body: '🌿', mind: '📚', joy: '🍵' };

  state.tasks.unshift({
    id: 'custom_' + Date.now(),
    title,
    category,
    icon: icons[category] || '✨',
    xp: 20,
    boost: 15,
    custom: true,
    completedToday: false
  });

  input.value = '';
  SoundEngine.playSoftClick();
  showToast('Added personal leisure goal!', 'success');
  saveState();
  updateUI();
}

function deleteCustomTask(taskId) {
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  SoundEngine.playSoftClick();
  saveState();
  updateUI();
}

function openPremiumModal() {
  SoundEngine.playSoftClick();
  document.getElementById('premium-modal').classList.remove('hidden');
}

function closePremiumModal() {
  document.getElementById('premium-modal').classList.add('hidden');
}

function selectPlan(plan) {
  selectedPremiumPlan = plan;
  SoundEngine.playSoftClick();
  const mBtn = document.getElementById('plan-monthly');
  const lBtn = document.getElementById('plan-lifetime');
  if (plan === 'monthly') {
    mBtn.classList.add('border-[#D98A6C]', 'bg-[#D98A6C]/10');
    mBtn.classList.remove('border-black/10', 'bg-black/[0.02]');
    lBtn.classList.remove('border-[#D98A6C]', 'bg-[#D98A6C]/10');
    lBtn.classList.add('border-black/10', 'bg-black/[0.02]');
  } else {
    lBtn.classList.add('border-[#D98A6C]', 'bg-[#D98A6C]/10');
    lBtn.classList.remove('border-black/10', 'bg-black/[0.02]');
    mBtn.classList.remove('border-[#D98A6C]', 'bg-[#D98A6C]/10');
    mBtn.classList.add('border-black/10', 'bg-black/[0.02]');
  }
}

function activatePremium() {
  state.isPremium = true;
  state.dewdrops += 50;
  SoundEngine.playLevelUp();
  closePremiumModal();
  spawnParticle('👑');
  setDialogue(`"Thank you for supporting our sanctuary, ${state.userName}! Unlimited leisure goals & +50 💧 Dewdrops unlocked!"`);
  showToast(`Welcome to ${PREMIUM_NAME}! Unlimited goals unlocked ✨`, 'level');
  saveState();
  updateUI();
}
