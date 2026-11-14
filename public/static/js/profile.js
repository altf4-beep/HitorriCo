function populateBirthdayDays() {
  const daySelect = document.getElementById('input-bday-day');
  if (daySelect.options.length > 0) return;
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }
}

function openProfileModal(isFirstLaunch = false) {
  populateBirthdayDays();
  if (!isFirstLaunch) SoundEngine.playSoftClick();

  document.getElementById('input-user-name').value = state.profileCompleted ? state.userName : '';
  document.getElementById('input-bday-month').value = state.birthdayMonth || 11;
  document.getElementById('input-bday-day').value = state.birthdayDay || 14;
  document.getElementById('onboarding-pet-name').value = state.petName;
  document.getElementById('onboarding-pet-species').value = state.species;
  document.getElementById('select-holiday-override').value = state.celebrationOverride || 'auto';

  document.getElementById('btn-close-profile').classList.toggle('hidden', isFirstLaunch);
  document.getElementById('onboarding-pet-section').classList.toggle('hidden', !isFirstLaunch);

  document.getElementById('profile-modal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profile-modal').classList.add('hidden');
}

function applyCelebrationOverride(val) {
  state.celebrationOverride = val;
  const celeb = getActiveCelebration();
  if (celeb.greeting) {
    setDialogue(celeb.greeting);
  }
  saveState();
  updateUI();
}

function saveUserProfile(event) {
  event.preventDefault();
  const nameInput = document.getElementById('input-user-name').value.trim();
  if (!nameInput) return;

  const wasFirst = !state.profileCompleted;
  state.userName = nameInput;
  state.birthdayMonth = Number(document.getElementById('input-bday-month').value);
  state.birthdayDay = Number(document.getElementById('input-bday-day').value);
  state.celebrationOverride = document.getElementById('select-holiday-override').value;

  if (wasFirst) {
    const pName = document.getElementById('onboarding-pet-name').value.trim();
    if (pName) state.petName = pName;
    state.species = document.getElementById('onboarding-pet-species').value;
  }

  state.profileCompleted = true;
  closeProfileModal();

  const celeb = getActiveCelebration();
  if (celeb.type === 'birthday') {
    SoundEngine.playBirthdayTune();
    setDialogue(celeb.greeting);
  } else if (celeb.greeting) {
    SoundEngine.playComplete();
    setDialogue(celeb.greeting);
  } else {
    SoundEngine.playComplete();
    setDialogue(`"Nice to meet you, ${state.userName}! I saved your birthday (${getMonthName(state.birthdayMonth)} ${state.birthdayDay}) so we can celebrate together!"`);
  }

  saveState();
  updateUI();
}

function getMonthName(m) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] || 'Jan';
}
