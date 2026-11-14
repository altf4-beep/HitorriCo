function patPet() {
  SoundEngine.playPat();
  const avatar = document.getElementById('pet-avatar-wrapper');
  avatar.classList.remove('animate-happy-bounce');
  void avatar.offsetWidth;
  avatar.classList.add('animate-happy-bounce');

  spawnParticle('❤️');
  state.joy = Math.min(100, state.joy + 2);
  gainXP(3);

  const rawQuote = EMPATHETIC_QUOTES.pat[Math.floor(Math.random() * EMPATHETIC_QUOTES.pat.length)];
  setDialogue(`"${formatQuote(rawQuote)}"`);

  saveState();
  updateUI();
}

function spawnParticle(emoji) {
  const layer = document.getElementById('particles-layer');
  const el = document.createElement('span');
  el.textContent = emoji;
  el.className = 'absolute text-xl animate-float-up select-none';
  el.style.left = `${40 + Math.random() * 20}%`;
  el.style.top = `${30 + Math.random() * 20}%`;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function completeTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  SoundEngine.playComplete();

  if (state.lastCategory === task.category) {
    state.consecutiveCategoryCount += 1;
  } else {
    state.lastCategory = task.category;
    state.consecutiveCategoryCount = 1;
  }

  const penalty = state.consecutiveCategoryCount >= 2 ? 9 : 5;

  if (task.category === 'body') {
    state.vitality = Math.min(100, state.vitality + task.boost);
    state.mind = Math.max(15, state.mind - penalty);
    state.joy = Math.max(15, state.joy - penalty);
  } else if (task.category === 'mind') {
    state.mind = Math.min(100, state.mind + task.boost);
    state.vitality = Math.max(15, state.vitality - penalty);
    state.joy = Math.max(15, state.joy - penalty);
  } else if (task.category === 'joy') {
    state.joy = Math.min(100, state.joy + task.boost);
    state.vitality = Math.max(15, state.vitality - penalty);
    state.mind = Math.max(15, state.mind - penalty);
  }

  task.completedToday = true;

  const avatar = document.getElementById('pet-avatar-wrapper');
  avatar.classList.remove('animate-happy-bounce');
  void avatar.offsetWidth;
  avatar.classList.add('animate-happy-bounce');

  spawnParticle(task.icon);
  setTimeout(() => spawnParticle('✨'), 180);

  const imbalanceMsg = checkCategoryImbalance();
  if (imbalanceMsg && state.consecutiveCategoryCount >= 2) {
    setDialogue(`"${imbalanceMsg}"`);
  } else {
    const categoryQuotes = EMPATHETIC_QUOTES[task.category];
    const rawMsg = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    setDialogue(`"${formatQuote(rawMsg)}"`);
  }

  gainXP(task.xp);
  showToast(`Completed: ${task.title}`, 'success');

  saveState();
  updateUI();
}

function completeBirthdayTask(bTaskId) {
  const bTask = state.birthdayTasks.find(t => t.id === bTaskId);
  if (!bTask) return;

  SoundEngine.playBirthdayTune();
  bTask.completed = true;
  state.vitality = Math.min(100, state.vitality + 12);
  state.mind = Math.min(100, state.mind + 12);
  state.joy = Math.min(100, state.joy + 18);
  state.dewdrops += bTask.dewdrops;

  spawnParticle('🎂');
  setTimeout(() => spawnParticle('🎉'), 180);
  setDialogue(`"Yay!! Happy Birthday, ${state.userName}! That earned +${bTask.dewdrops} 💧 Dewdrops!"`);
  gainXP(bTask.xp);
  showToast(`Birthday Special! +${bTask.dewdrops} 💧 Dewdrops`, 'level');

  saveState();
  updateUI();
}

function checkCategoryImbalance() {
  const stats = [
    { key: 'body', name: 'Body (Movement & Hydration)', val: state.vitality },
    { key: 'mind', name: 'Mind (Reading & Reflection)', val: state.mind },
    { key: 'joy',  name: 'Joy (Movies & Restful Leisure)', val: state.joy }
  ];
  stats.sort((a, b) => a.val - b.val);
  const lowest = stats[0];
  const highest = stats[2];
  const uName = state.userName || 'Friend';

  if (highest.val - lowest.val >= 22 || lowest.val < 45) {
    return `Hey ${uName}, we've focused a lot on ${highest.name.split(' ')[0]} lately! Could we add a gentle ${lowest.name} activity next so all three bars stay balanced?`;
  }
  return null;
}

function gainXP(amount) {
  state.xp += amount;
  const xpNeeded = state.level * 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    state.dewdrops += 35;
    SoundEngine.playLevelUp();
    spawnParticle('🌟');
    showToast(`Bond Level ${state.level}! +35 💧 Dewdrops`, 'level');
  }
}

function logMood(moodKey) {
  SoundEngine.playSoftClick();
  state.currentMood = moodKey;
  state.mind = Math.min(100, state.mind + 3);
  gainXP(5);

  const response = formatQuote(EMPATHETIC_QUOTES.moods[moodKey]);
  setDialogue(`"${response}"`);
  spawnParticle('💛');

  saveState();
  updateUI();
}

function setDialogue(text) {
  const el = document.getElementById('pet-dialogue');
  el.style.opacity = '0.3';
  setTimeout(() => {
    el.textContent = text;
    el.style.opacity = '1';
  }, 150);
}

function formatQuote(str) {
  return str.replace(/\{user\}/g, state.userName || 'Friend');
}
